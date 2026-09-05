import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Video,
  Eye,
  Activity,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Crosshair
} from 'lucide-react';
import { getMediaObjectUrl, testMediaUrlPlayable } from '../lib/mediaStorage';

interface ResilientVideoPlayerProps {
  videoUrl?: string | null;
  transcript?: string;
  candidateName?: string;
  candidateId?: string;
  storageKey?: string;
  scenarioTitle?: string;
  durationSec?: number;
  fixationPercent?: number;
  postureSteadiness?: number;
  theme?: 'dark' | 'light';
  aspectRatio?: 'video' | 'square';
}

export const ResilientVideoPlayer: React.FC<ResilientVideoPlayerProps> = ({
  videoUrl,
  transcript = 'Candidate video response and behavioral crisis analysis footage.',
  candidateName = 'Candidate',
  candidateId,
  storageKey,
  scenarioTitle = 'Executive Response Footage',
  durationSec = 45,
  fixationPercent = 72,
  postureSteadiness = 92,
  theme = 'dark',
  aspectRatio = 'video'
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(durationSec || 45);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackMode, setPlaybackMode] = useState<'real_video' | 'biometric_canvas'>('real_video');
  const [showHud, setShowHud] = useState(true);

  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timerRef = useRef<any>(null);

  // Check if primary videoUrl is valid or if we have it in IndexedDB
  useEffect(() => {
    let active = true;

    async function resolveVideo() {
      // 1. Check direct videoUrl
      if (videoUrl) {
        if (videoUrl.startsWith('data:')) {
          if (active) {
            setResolvedUrl(videoUrl);
            setPlaybackMode('real_video');
            return;
          }
        }
        const isPlayable = await testMediaUrlPlayable(videoUrl);
        if (isPlayable && active) {
          setResolvedUrl(videoUrl);
          setPlaybackMode('real_video');
          return;
        }
      }

      // 2. Check IndexedDB
      const lookupKey = storageKey || (candidateId ? `${candidateId}_pressureVideo` : null);
      if (lookupKey) {
        const idbUrl = await getMediaObjectUrl(lookupKey);
        if (idbUrl && active) {
          setResolvedUrl(idbUrl);
          setPlaybackMode('real_video');
          return;
        }
      }

      // 3. Fallback to latest_pressureVideo
      const latestIdbUrl = await getMediaObjectUrl('latest_pressureVideo');
      if (latestIdbUrl && active) {
        setResolvedUrl(latestIdbUrl);
        setPlaybackMode('real_video');
        return;
      }

      // 4. Brief retry after 600ms in case save was in flight
      await new Promise((r) => setTimeout(r, 600));
      if (!active) return;

      if (lookupKey) {
        const retryUrl = await getMediaObjectUrl(lookupKey);
        if (retryUrl && active) {
          setResolvedUrl(retryUrl);
          setPlaybackMode('real_video');
          return;
        }
      }

      const retryLatestUrl = await getMediaObjectUrl('latest_pressureVideo');
      if (retryLatestUrl && active) {
        setResolvedUrl(retryLatestUrl);
        setPlaybackMode('real_video');
        return;
      }

      // 5. If no valid video source exists, activate interactive biometric canvas
      if (active) {
        setResolvedUrl(null);
        setPlaybackMode('biometric_canvas');
      }
    }

    resolveVideo();

    return () => {
      active = false;
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [videoUrl, storageKey, candidateId]);

  // Handle native video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setTotalDuration(videoRef.current.duration);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Canvas Biometric Avatar Renderer
  useEffect(() => {
    if (playbackMode !== 'biometric_canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Dark background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0a0a0f');
      bgGrad.addColorStop(0.5, '#12121c');
      bgGrad.addColorStop(1, '#08080c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Candidate Silhouette & Biometric Face Mesh
      const centerX = w / 2;
      const centerY = h / 2 - 10;
      const swayOffset = isPlaying ? Math.sin(frame * 0.03) * 3 : 0;

      // Body / Shoulders
      ctx.fillStyle = '#161622';
      ctx.beginPath();
      ctx.ellipse(centerX + swayOffset, h + 20, 160, 100, 0, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
      ctx.stroke();

      // Neck
      ctx.fillStyle = '#1e1e2d';
      ctx.fillRect(centerX - 24 + swayOffset, centerY + 65, 48, 45);

      // Head
      ctx.fillStyle = '#222232';
      ctx.beginPath();
      ctx.ellipse(centerX + swayOffset, centerY + 10, 68, 88, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Facial Landmark Wireframe Mesh Points
      ctx.fillStyle = isPlaying ? '#10b981' : '#f59e0b';
      ctx.strokeStyle = isPlaying ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.2)';
      ctx.lineWidth = 1;

      // Facial points: Eyes, Nose, Mouth, Jaw
      const facePoints = [
        { x: centerX - 25, y: centerY - 5 }, // Left eye
        { x: centerX + 25, y: centerY - 5 }, // Right eye
        { x: centerX, y: centerY + 15 },     // Nose tip
        { x: centerX - 18, y: centerY + 42 }, // Mouth left
        { x: centerX + 18, y: centerY + 42 }, // Mouth right
        { x: centerX, y: centerY + 46 },     // Lower lip
        { x: centerX - 45, y: centerY + 20 },// Left cheek
        { x: centerX + 45, y: centerY + 20 },// Right cheek
        { x: centerX, y: centerY + 78 },     // Chin
      ];

      // Draw mesh connections
      ctx.beginPath();
      facePoints.forEach((p, idx) => {
        const px = p.x + swayOffset;
        const py = p.y;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.stroke();

      // Draw landmark dots
      facePoints.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x + swayOffset, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Oculometric Gaze Reticle over camera lens / eyes
      const eyeX = centerX + swayOffset;
      const eyeY = centerY - 5;
      const reticlePulse = 18 + Math.sin(frame * 0.08) * 3;

      ctx.strokeStyle = isPlaying ? '#34d399' : '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, reticlePulse, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(eyeX - reticlePulse - 6, eyeY);
      ctx.lineTo(eyeX - reticlePulse, eyeY);
      ctx.moveTo(eyeX + reticlePulse, eyeY);
      ctx.lineTo(eyeX + reticlePulse + 6, eyeY);
      ctx.moveTo(eyeX, eyeY - reticlePulse - 6);
      ctx.lineTo(eyeX, eyeY - reticlePulse);
      ctx.moveTo(eyeX, eyeY + reticlePulse);
      ctx.lineTo(eyeX, eyeY + reticlePulse + 6);
      ctx.stroke();

      // Live scan beam
      if (isPlaying) {
        const scanY = (frame * 2.5) % h;
        const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0)');
        grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.25)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 20, w, 40);

        ctx.strokeStyle = 'rgba(52, 211, 153, 0.7)';
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(w, scanY);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [playbackMode, isPlaying]);

  // Voice narration during canvas playback
  const startBiometricNarration = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.rate = 1.0;
      utterance.pitch = 0.98;
      utterance.volume = isMuted ? 0 : volume;

      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(
        (v) => (v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Alex')) && v.lang.startsWith('en')
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setIsPlaying(true);
        setCurrentTime(0);
        timerRef.current = setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= totalDuration) return prev;
            return prev + 1;
          });
        }, 1000);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(true);
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopBiometricNarration = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (playbackMode === 'real_video' && resolvedUrl && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Video play error, retaining video mode:', err);
            setIsPlaying(false);
          });
      }
    } else {
      if (isPlaying) {
        stopBiometricNarration();
      } else {
        startBiometricNarration();
      }
    }
  };

  const handleReset = () => {
    if (playbackMode === 'real_video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      stopBiometricNarration();
      startBiometricNarration();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    if (synthRef.current && isPlaying) {
      synthRef.current.volume = !isMuted ? 0 : volume;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = totalDuration > 0 ? Math.min(100, (currentTime / totalDuration) * 100) : 0;

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden border bg-black select-none ${
        aspectRatio === 'video' ? 'aspect-video' : 'aspect-square'
      } border-zinc-800 shadow-2xl group`}
    >
      {/* Real Video Element */}
      {resolvedUrl && playbackMode === 'real_video' ? (
        <video
          ref={videoRef}
          src={resolvedUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onError={async () => {
            console.warn('Real video element failed on current URL, attempting IndexedDB reload...');
            const lookupKey = storageKey || (candidateId ? `${candidateId}_pressureVideo` : 'latest_pressureVideo');
            const recoveredUrl = await getMediaObjectUrl(lookupKey) || await getMediaObjectUrl('latest_pressureVideo');
            if (recoveredUrl) {
              setResolvedUrl(recoveredUrl);
              setPlaybackMode('real_video');
            } else {
              setPlaybackMode('biometric_canvas');
            }
          }}
          className="w-full h-full object-contain bg-black"
          playsInline
        />
      ) : (
        /* Biometric Computer Vision Simulation Canvas */
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-full object-cover"
        />
      )}

      {/* Top HUD Telemetry Overlay */}
      {showHud && (
        <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-xs font-mono pointer-events-none z-10">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`}
            />
            <span className="text-white font-bold tracking-wider text-[11px] flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>{scenarioTitle}</span>
            </span>
            <span className="text-[10px] text-zinc-400 bg-white/10 px-2 py-0.5 rounded backdrop-blur">
              {candidateName}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded">
              Fixation: {fixationPercent}%
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 rounded hidden sm:inline-block">
              Equilibrium: {postureSteadiness}%
            </span>
          </div>
        </div>
      )}

      {/* Center Big Play Button (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-10">
          <button
            type="button"
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-amber-400/95 hover:bg-amber-300 text-black flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95"
            title="Play Candidate Video"
          >
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </button>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-2 z-10 transition-opacity">
        {/* Progress Bar */}
        <div
          className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full overflow-hidden cursor-pointer transition-all"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            const newTime = pos * totalDuration;
            setCurrentTime(newTime);
            if (videoRef.current) videoRef.current.currentTime = newTime;
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Buttons and Time */}
        <div className="flex items-center justify-between text-xs font-mono text-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 hover:text-amber-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 hover:text-amber-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-zinc-300 ml-1">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowHud(!showHud)}
              className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                showHud
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              HUD {showHud ? 'ON' : 'OFF'}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="hover:text-amber-400 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="hover:text-amber-400 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
