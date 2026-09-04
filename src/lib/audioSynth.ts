/**
 * Audio Synthesis & Telemetry Utility
 * Generates lightweight, compliant PCM WAV audio buffers for voice simulation and fallback modes
 */

export function generateSpeechAudioWav(durationSeconds: number = 3.5, sampleRate: number = 22050): string {
  const numSamples = Math.floor(sampleRate * Math.max(1, Math.min(15, durationSeconds)));
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length minus RIFF identifier & file length field (36 + data size)
  view.setUint32(4, 36 + numSamples * 2, true);
  // RIFF type 'WAVE'
  writeString(view, 8, 'WAVE');
  // format chunk identifier 'fmt '
  writeString(view, 12, 'fmt ');
  // format chunk length 16
  view.setUint32(16, 16, true);
  // sample format (raw PCM = 1)
  view.setUint16(20, 1, true);
  // channel count (1 = mono)
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sampleRate * numChannels * bitsPerSample/8)
  view.setUint32(28, sampleRate * 2, true);
  // block align (numChannels * bitsPerSample/8)
  view.setUint16(32, 2, true);
  // bits per sample (16 bit)
  view.setUint16(34, 16, true);
  // data chunk identifier 'data'
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, numSamples * 2, true);

  // Generate pleasant, harmonic speech-like formant tones (140Hz fundamental with 280Hz and 420Hz harmonics + speech cadence envelope)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Cadence envelope: speech bursts and pauses
    const cadence = 0.5 + 0.5 * Math.sin(2 * Math.PI * 1.8 * t) * Math.sin(2 * Math.PI * 0.4 * t);
    const f0 = 145 + 10 * Math.sin(2 * Math.PI * 0.5 * t); // subtle pitch inflection
    const sampleVal =
      cadence *
      (0.5 * Math.sin(2 * Math.PI * f0 * t) +
        0.3 * Math.sin(2 * Math.PI * (f0 * 2) * t) +
        0.15 * Math.sin(2 * Math.PI * (f0 * 3) * t) +
        0.05 * (Math.random() * 2 - 1)); // gentle breath/air noise

    // 16-bit signed integer conversion
    const s = Math.max(-1, Math.min(1, sampleVal));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  // Convert buffer to base64 Data URL
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return `data:audio/wav;base64,${base64}`;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
