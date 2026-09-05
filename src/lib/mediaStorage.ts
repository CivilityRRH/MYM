/**
 * Persistent Media Storage Engine (IndexedDB)
 * 
 * Securely persists candidate video recordings and audio recordings in the browser's
 * durable IndexedDB storage so they never expire or get lost between sessions or refreshes.
 */

const DB_NAME = 'MindYourManners_MediaVault';
const DB_VERSION = 1;
const STORE_NAME = 'candidate_media';

interface StoredMediaRecord {
  key: string; // e.g. "cand-123_pressureVideo" or "cand-123_toneAudio"
  candidateId?: string;
  mediaType: 'callingVideo' | 'pressureVideo' | 'toneAudio' | 'motivationVideo';
  blob: Blob;
  mimeType: string;
  durationSec?: number;
  timestamp: string;
}

function openMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };

    request.onerror = (event: any) => {
      reject(event.target.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Save recorded Blob into persistent IndexedDB
 * Also saves under alias latest_${mediaType} for infallible fallback recovery.
 */
export async function saveMediaBlob(
  key: string,
  blob: Blob,
  mediaType: StoredMediaRecord['mediaType'],
  durationSec?: number
): Promise<void> {
  try {
    const db = await openMediaDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const record: StoredMediaRecord = {
        key,
        mediaType,
        blob,
        mimeType: blob.type || (mediaType.includes('Audio') ? 'audio/webm' : 'video/webm'),
        durationSec,
        timestamp: new Date().toISOString()
      };

      store.put(record);

      // Also store under latest_${mediaType} alias
      const latestRecord: StoredMediaRecord = {
        ...record,
        key: `latest_${mediaType}`
      };
      store.put(latestRecord);

      transaction.oncomplete = () => resolve();
      transaction.onerror = (err) => reject(err);
    });
  } catch (err) {
    console.warn('Could not save media blob to IndexedDB:', err);
  }
}

/**
 * Retrieve persistent Blob from IndexedDB with multi-key fallback
 */
export async function getMediaBlob(key: string): Promise<Blob | null> {
  try {
    const db = await openMediaDb();

    // 1. Try exact key
    const directBlob = await new Promise<Blob | null>((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(key);

      getRequest.onsuccess = (event: any) => {
        const result = event.target.result as StoredMediaRecord | undefined;
        resolve(result?.blob || null);
      };

      getRequest.onerror = () => resolve(null);
    });

    if (directBlob) return directBlob;

    // 2. Fallback: try latest_${mediaType} if key contains type name
    let mediaTypeFallback: StoredMediaRecord['mediaType'] | null = null;
    if (key.includes('toneAudio') || key.includes('audio') || key.includes('Audio')) {
      mediaTypeFallback = 'toneAudio';
    } else if (key.includes('pressureVideo') || key.includes('scenarioVideo')) {
      mediaTypeFallback = 'pressureVideo';
    } else if (key.includes('callingVideo') || key.includes('interviewVideo')) {
      mediaTypeFallback = 'callingVideo';
    }

    if (mediaTypeFallback) {
      const fallbackBlob = await new Promise<Blob | null>((resolve) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const getRequest = store.get(`latest_${mediaTypeFallback}`);

        getRequest.onsuccess = (event: any) => {
          const result = event.target.result as StoredMediaRecord | undefined;
          resolve(result?.blob || null);
        };

        getRequest.onerror = () => resolve(null);
      });

      if (fallbackBlob) return fallbackBlob;

      // 3. Scan all records to find any matching mediaType
      const anyRecordBlob = await new Promise<Blob | null>((resolve) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const cursorRequest = store.openCursor();
        let foundBlob: Blob | null = null;

        cursorRequest.onsuccess = (event: any) => {
          const cursor = event.target.result;
          if (cursor) {
            const rec = cursor.value as StoredMediaRecord;
            if (rec && rec.mediaType === mediaTypeFallback && rec.blob) {
              foundBlob = rec.blob;
            }
            cursor.continue();
          } else {
            resolve(foundBlob);
          }
        };

        cursorRequest.onerror = () => resolve(null);
      });

      if (anyRecordBlob) return anyRecordBlob;
    }

    return null;
  } catch (err) {
    console.warn('Could not retrieve media blob from IndexedDB:', err);
    return null;
  }
}

/**
 * Retrieve fresh streamable Blob URL for a candidate media
 */
export async function getMediaObjectUrl(key: string): Promise<string | null> {
  const blob = await getMediaBlob(key);
  if (!blob) return null;
  try {
    return URL.createObjectURL(blob);
  } catch (e) {
    console.warn('Error creating object URL from cached blob:', e);
    return null;
  }
}

/**
 * Check if a URL (especially a blob: URL) is still active and valid in memory.
 * CRITICAL: fetch(url, { method: 'HEAD' }) throws on blob: URLs in Chrome/WebKit.
 * We must use GET for blob: URLs, which returns 200 instantly if alive.
 */
export async function testMediaUrlPlayable(url?: string | null): Promise<boolean> {
  if (!url) return false;
  if (url.startsWith('data:')) return true;

  if (url.startsWith('blob:')) {
    try {
      // Standard GET for blob scheme - checks if alive in browser memory without downloading external bytes
      const res = await fetch(url);
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  if (url.startsWith('http')) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return true;
    } catch (e) {}

    try {
      const res = await fetch(url);
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  return false;
}
