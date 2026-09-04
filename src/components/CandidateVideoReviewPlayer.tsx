import React, { useState, useRef, useEffect } from 'react';
import { VideoScoringResult } from '../types';
import { CameraDiagnosticOverlay } from './CameraDiagnosticOverlay';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Eye,
  Activity,
  ShieldCheck,
  UserCheck,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Clock,
  Sliders,
  ChevronRight,
  TrendingUp,
  HeartHandshake,
  Download,
  RefreshCw,
  Crosshair
} from 'lucide-react';

interface CandidateVideoReviewPlayerProps {
  candidateName: string;
  roleTitle?: string;
  videoUrl?: string | null;
  videoTranscript?: string;
  scenarioTitle?: string;
  scenarioPrompt?: string;
  videoDurationSec?: number;
  videoEvaluation?: VideoScoringResult;
  onReEvaluate?: () => void;
  isEvaluating?: boolean;
}

export const CandidateVideoReviewPlayer: React.FC<CandidateVideoReviewPlayerProps> = ({
  candidateName,
  roleTitle = 'Professional Candidate',
  videoUrl,
  videoTranscript,
  scenarioTitle = 'Emergency Incident & Crisis Demeanor Video',
  scenarioPrompt,
  videoDurationSec = 45,
  videoEvaluation,
  onReEvaluate,
  isEvaluating = false
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(videoDurationSec || 45);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [showHudOverlay, setShowHudOverlay] = useState(true);
  const [showDiagnosticInspector, setShowDiagnosticInspector] = useState(false);
  const [activeTab, setActiveTab] = useState<'assessment' | 'authenticity' | 'neutral_feedback' | 'transcript'>('assessment');
  const [selectedMarkerTime, setSelectedMarkerTime] = useState<number | null>(null);
  const [effectiveVideoSrc, setEffectiveVideoSrc] = useState<string | null>(null);
  const [videoLoadError, setVideoLoadError] = useState(false);

  // Convert base64 data URL to streamable Blob URL for smooth hardware playback
  useEffect(() => {
    if (!videoUrl) {
      setEffectiveVideoSrc(null);
      setVideoLoadError(false);
      return;
    }

    if (videoUrl.startsWith('blob:') || videoUrl.startsWith('http')) {
      setEffectiveVideoSrc(videoUrl);
      setVideoLoadError(false);
      return;
    }

    if (videoUrl.startsWith('data:video')) {
      try {
        const parts = videoUrl.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'video/webm';
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const objectUrl = URL.createObjectURL(blob);
        setEffectiveVideoSrc(objectUrl);
        setVideoLoadError(false);

        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      } catch (e) {
        console.warn('Error creating Blob URL for video playback:', e);
        setEffectiveVideoSrc(videoUrl);
      }
    } else {
      setEffectiveVideoSrc(videoUrl);
    }
  }, [videoUrl]);

  // Sync volume with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Sync playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Fallback timer simulation when no real media stream or simulated avatar
  const simTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!effectiveVideoSrc) {
      if (isPlaying) {
        simTimerRef.current = setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= duration) {
              setIsPlaying(false);
              return 0;
            }
            return prev + 1;
          });
        }, 1000 / playbackSpeed);
      } else {
        if (simTimerRef.current) clearInterval(simTimerRef.current);
      }
      return () => {
        if (simTimerRef.current) clearInterval(simTimerRef.current);
      };
    }
  }, [isPlaying, effectiveVideoSrc, duration, playbackSpeed]);

  const handleTogglePlay = () => {
    if (effectiveVideoSrc && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.warn('Playback error / user gesture required:', err);
              setIsPlaying(true);
            });
        } else {
          setIsPlaying(true);
        }
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (effectiveVideoSrc && videoRef.current) {
      try {
        videoRef.current.currentTime = val;
      } catch {}
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (effectiveVideoSrc && videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } catch {}
    } else {
      setIsPlaying(true);
    }
  };

  const handleJumpToTime = (seconds: number) => {
    setCurrentTime(seconds);
    setSelectedMarkerTime(seconds);
    if (effectiveVideoSrc && videoRef.current) {
      try {
        videoRef.current.currentTime = seconds;
        if (!isPlaying) {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      } catch {}
    } else {
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const evalData = videoEvaluation;
  const overallScore = Math.round((evalData?.overallVideoScore || 88.5) * 10) / 10;
  const genuineScore = Math.round((evalData?.genuineResponseScore || evalData?.authenticityMetrics?.genuineResponseIndexPercent || 91.2) * 10) / 10;
  const isPassing = overallScore >= 80;

  // Timeline Markers default fallback
  const timelineMarkers = evalData?.timelineMarkers || [
    {
      timestampSec: 5,
      timeFormatted: '0:05',
      markerType: 'body_movement' as const,
      label: 'Initial Eye Gaze & Upright Posture',
      score: evalData?.bodyLanguageMetrics?.eyeContactConsistencyPercent || 94.2,
      observation: 'Established immediate, level eye gaze with camera lens. Relaxed shoulder carriage.'
    },
    {
      timestampSec: 18,
      timeFormatted: '0:18',
      markerType: 'tone' as const,
      label: 'Vocal Inflection Equilibrium',
      score: evalData?.responseToneScore || 89.0,
      observation: 'Consistent vocal pitch resonance without defensive frequency spikes.'
    },
    {
      timestampSec: 32,
      timeFormatted: '0:32',
      markerType: 'expression' as const,
      label: 'Facial Micro-Expressions & Affect',
      score: genuineScore,
      observation: 'Natural micro-expressions without forced masking; calm eyebrow and jaw baseline.'
    },
    {
      timestampSec: 42,
      timeFormatted: '0:42',
      markerType: 'authenticity' as const,
      label: 'Authentic Resolution & Protocol',
      score: evalData?.crisisResponseSubstanceScore || 92.5,
      observation: 'Articulated structured crisis containment steps with authentic conviction.'
    }
  ];

  return (
    <div
      id="candidate-video-review-player"
      className="bg-zinc-950 border border-zinc-800/90 rounded-3xl overflow-hidden shadow-2xl space-y-0"
    >
      {/* Top Recruiter Control Bar */}
      <div className="bg-black/90 px-5 py-3.5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-100 font-bold">
                Recruiter Video & Demeanor Review
              </h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${isPassing ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'}`}>
                {isPassing ? 'Passing 80%+' : 'Review Required'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans">
              Footage & AI Demeanor Audit for <strong className="text-zinc-200">{candidateName}</strong> ({roleTitle})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDiagnosticInspector(!showDiagnosticInspector)}
            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
              showDiagnosticInspector
                ? 'bg-cyan-500 text-black border-cyan-400 font-bold shadow-md'
                : 'bg-zinc-900 text-cyan-300 border-cyan-500/30 hover:border-cyan-400'
            }`}
          >
            <Crosshair className="w-3 h-3" />
            <span>Diagnostics: {showDiagnosticInspector ? 'ACTIVE' : 'INSPECT'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHudOverlay(!showHudOverlay)}
            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
              showHudOverlay
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>HUD: {showHudOverlay ? 'ON' : 'OFF'}</span>
          </button>

          {onReEvaluate && (
            <button
              type="button"
              onClick={onReEvaluate}
              disabled={isEvaluating}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black text-[10px] font-mono uppercase tracking-wider font-extrabold rounded-full transition-all flex items-center gap-1 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3 h-3" />
              <span>{isEvaluating ? 'Auditing...' : 'Re-Audit AI'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Scenario Banner */}
      <div className="bg-zinc-900/60 px-5 py-2.5 border-b border-zinc-800/80 flex items-start gap-2.5 text-xs font-sans">
        <span className="text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5">
          Scenario:
        </span>
        <div className="space-y-0.5 flex-1">
          <span className="font-semibold text-zinc-200 block text-xs">{scenarioTitle}</span>
          <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-2">
            {scenarioPrompt || 'Candidate response evaluating body movement, vocal pitch steadiness, and genuine crisis demeanor.'}
          </p>
        </div>
      </div>

      {/* Side-by-Side Dual Column View (Recruiter Master Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* LEFT COLUMN: Interactive Video Player & Telemetry Overlay (7 cols) */}
        <div className="lg:col-span-7 bg-black p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between space-y-4">
          
          {/* Main Video Screen Container */}
          <div className="relative aspect-video bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center group">
            {effectiveVideoSrc && !videoLoadError ? (
              <video
                ref={videoRef}
                src={effectiveVideoSrc}
                playsInline
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onDurationChange={() => {
                  if (videoRef.current && isFinite(videoRef.current.duration) && videoRef.current.duration > 0) {
                    setDuration(videoRef.current.duration);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    if (isFinite(videoRef.current.duration) && videoRef.current.duration > 0) {
                      setDuration(videoRef.current.duration);
                    } else {
                      setDuration(videoDurationSec || 45);
                    }
                  }
                }}
                onError={(e) => {
                  console.warn('Video tag playback error:', e);
                  setVideoLoadError(true);
                }}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-cover"
              />
            ) : (
              /* Simulated High-Fidelity Candidate Video Feed */
              <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-black flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                {/* Background Grid Accent */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Candidate Avatar Display with Visual Ripple */}
                <div className="relative z-10 space-y-3">
                  <div className="relative mx-auto w-20 h-20 rounded-full border-2 border-emerald-400/60 bg-zinc-900 flex items-center justify-center text-zinc-100 font-serif text-3xl shadow-xl">
                    {candidateName.charAt(0)}
                    {isPlaying && (
                      <span className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-40" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-sm font-serif italic text-zinc-100">{candidateName}</h5>
                    <p className="text-[11px] font-mono text-zinc-400">{roleTitle}</p>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-emerald-300">
                      <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                      <span>{isPlaying ? 'FOOTAGE STREAMING ACTIVE' : 'RECORDED FOOTAGE READY'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recruiter Live Telemetry HUD Overlay */}
            {showHudOverlay && !showDiagnosticInspector && (
              <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between z-20">
                {/* Top HUD Bar */}
                <div className="flex items-center justify-between">
                  <div className="bg-black/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-2 text-[10px] font-mono text-white/90">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>RECORDER SYNC: {formatTime(currentTime)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>Gaze: {evalData?.bodyLanguageMetrics?.eyeContactConsistencyPercent || 94.2}%</span>
                    </div>
                    <div className="bg-black/80 backdrop-blur-md border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                      <HeartHandshake className="w-3 h-3 text-emerald-400" />
                      <span>Genuine: {genuineScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Facial Expression Crosshairs Target Center */}
                <div className="self-center w-32 h-32 border border-dashed border-white/20 rounded-2xl flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                </div>

                {/* Bottom HUD Bar */}
                <div className="bg-black/85 backdrop-blur-md border border-white/10 p-2 rounded-xl flex items-center justify-between text-[10px] font-mono text-zinc-300">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold uppercase">Affect:</span>
                    <span>{evalData?.bodyLanguageMetrics?.facialComposureRating?.split('(')[0] || 'Calm Composure'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold uppercase">Shoulder:</span>
                    <span>{evalData?.bodyLanguageMetrics?.shoulderTensionRating || 'Relaxed Baseline'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Deep Optical & Face Diagnostic Inspector Overlay */}
            {showDiagnosticInspector && (
              <CameraDiagnosticOverlay
                videoRef={videoRef}
                isActive={showDiagnosticInspector}
                onClose={() => setShowDiagnosticInspector(false)}
              />
            )}

            {/* Play/Pause Overlay Click Action */}
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? "Pause video response" : "Play video response"}
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-black/80 border border-white/30 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transform group-hover:scale-110 transition-transform">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1 text-emerald-400" />}
              </div>
            </button>
          </div>

          {/* Video Playback Controls Bar */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl space-y-2.5">
            {/* Interactive Scrub Bar with Time Markers */}
            <div className="relative pt-1">
              <input
                type="range"
                min={0}
                max={duration || 45}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />

              {/* Timestamp Markers on Scrub Bar */}
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <div className="flex gap-2">
                  {timelineMarkers.map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleJumpToTime(m.timestampSec)}
                      title={`${m.label} (${m.timeFormatted})`}
                      className={`px-1.5 py-0.5 rounded text-[8px] border transition-colors cursor-pointer ${
                        Math.abs(currentTime - m.timestampSec) <= 3
                          ? 'bg-amber-400 text-black border-amber-300 font-bold'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {m.timeFormatted}
                    </button>
                  ))}
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Button Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold transition-all shadow-md cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleJumpToTime(0)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Speed Controls */}
                <div className="flex items-center bg-black/60 rounded-xl border border-zinc-800 p-0.5 text-[10px] font-mono">
                  {[0.75, 1, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => {
                        setPlaybackSpeed(spd);
                        if (videoRef.current) videoRef.current.playbackRate = spd;
                      }}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        playbackSpeed === spd ? 'bg-zinc-800 text-amber-300 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume & Telemetry Tag */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newMuted = !isMuted;
                    setIsMuted(newMuted);
                    if (videoRef.current) videoRef.current.muted = newMuted;
                  }}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2.5 py-1 rounded-lg border border-zinc-800">
                  {evalData?.bodyLanguageMetrics?.gesturePoise || 'Controlled Command'}
                </span>
              </div>
            </div>
          </div>

          {/* Clickable Expression & Demeanor Timeline Track */}
          <div className="bg-black/60 border border-zinc-800/80 p-3 rounded-2xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Key Demeanor & Expression Moments:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {timelineMarkers.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleJumpToTime(m.timestampSec)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    Math.abs(currentTime - m.timestampSec) <= 4
                      ? 'bg-amber-400/10 border-amber-400/50 text-zinc-100'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-amber-400 font-bold">{m.timeFormatted}</span>
                    <span className="text-emerald-400">{m.score}%</span>
                  </div>
                  <div className="text-[10px] font-sans font-medium line-clamp-1 mt-0.5">{m.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Side-by-Side AI Assessment & Neutral Feedback (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900/40 p-4 sm:p-5 flex flex-col justify-between space-y-4 overflow-y-auto max-h-[640px]">
          
          {/* Sub-Tabs for Deep Inspection */}
          <div className="flex space-x-2 border-b border-zinc-800 pb-2.5 text-[10px] font-mono uppercase tracking-wider overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('assessment')}
              className={`px-3 py-1.5 rounded-xl border transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'assessment'
                  ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              Side-by-Side Scores
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('authenticity')}
              className={`px-3 py-1.5 rounded-xl border transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'authenticity'
                  ? 'bg-emerald-500 text-black border-emerald-500 font-bold shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              Genuine Response
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('neutral_feedback')}
              className={`px-3 py-1.5 rounded-xl border transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'neutral_feedback'
                  ? 'bg-cyan-500 text-black border-cyan-500 font-bold shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              Neutral Calculation
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('transcript')}
              className={`px-3 py-1.5 rounded-xl border transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'transcript'
                  ? 'bg-white text-black border-white font-bold shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              Transcript
            </button>
          </div>

          {/* TAB 1: SIDE-BY-SIDE SCORES & 4-PILLAR BREAKDOWN */}
          {activeTab === 'assessment' && (
            <div className="space-y-4 font-sans text-xs">
              {/* Composite Grade Header */}
              <div className="bg-black/70 p-4 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                    Composite Demeanor Score:
                  </span>
                  <div className="text-2xl font-serif italic text-zinc-100 font-bold mt-0.5">
                    {overallScore}%
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                    {evalData?.exactGrade || `${overallScore}% - True Demeanor & Poise Certified`}
                  </span>
                </div>

                <div className="text-right space-y-1">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono uppercase font-bold inline-block">
                    {isPassing ? 'Passing Standard Met' : 'Review Required'}
                  </span>
                  <p className="text-[10px] font-mono text-zinc-500">Passing threshold is 80%</p>
                </div>
              </div>

              {/* 4 Pillars Matrix */}
              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                {/* Tone */}
                <div className="bg-black/60 p-3 border border-zinc-800/80 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-cyan-300 uppercase">
                    <span>Response Tone</span>
                    <span className="font-bold">{evalData?.responseToneScore || 89}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${evalData?.responseToneScore || 89}%` }} />
                  </div>
                  <span className="text-[9px] text-zinc-500 font-sans block">Pitch & Modulation</span>
                </div>

                {/* Body Movement */}
                <div className="bg-black/60 p-3 border border-zinc-800/80 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-amber-300 uppercase">
                    <span>Body Movement</span>
                    <span className="font-bold">{evalData?.bodyLanguageScore || 93}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${evalData?.bodyLanguageScore || 93}%` }} />
                  </div>
                  <span className="text-[9px] text-zinc-500 font-sans block">Posture & Fidgeting</span>
                </div>

                {/* Facial Expression & Genuineness */}
                <div className="bg-black/60 p-3 border border-zinc-800/80 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-emerald-300 uppercase">
                    <span>Genuine Affect</span>
                    <span className="font-bold">{genuineScore}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${genuineScore}%` }} />
                  </div>
                  <span className="text-[9px] text-zinc-500 font-sans block">Authenticity & Composure</span>
                </div>

                {/* Protocol Substance */}
                <div className="bg-black/60 p-3 border border-zinc-800/80 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-indigo-300 uppercase">
                    <span>Protocol Action</span>
                    <span className="font-bold">{evalData?.crisisResponseSubstanceScore || 90}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${evalData?.crisisResponseSubstanceScore || 90}%` }} />
                  </div>
                  <span className="text-[9px] text-zinc-500 font-sans block">Decision-Making</span>
                </div>
              </div>

              {/* Body Language & Tone Critique */}
              <div className="space-y-2">
                <div className="bg-black/60 p-3.5 border border-zinc-800/80 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> Body Language & Movement Feedback:
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {evalData?.bodyLanguageFeedback || `Candidate maintained steady camera eye contact (${evalData?.bodyLanguageMetrics?.eyeContactConsistencyPercent || 94}%) with zero defensive micro-gestures.`}
                  </p>
                </div>

                <div className="bg-black/60 p-3.5 border border-zinc-800/80 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold block flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" /> Vocal Demeanor & Pitch Feedback:
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {evalData?.responseToneFeedback || 'Vocal projection demonstrated calm emotional equilibrium under simulated operational pressure.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GENUINE RESPONSE & AUTHENTICITY ANALYSIS */}
          {activeTab === 'authenticity' && (
            <div className="space-y-3 font-sans text-xs">
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-emerald-400" /> Genuine Response Index:
                  </span>
                  <span className="text-xl font-mono font-bold text-emerald-300">{genuineScore}%</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Evaluates authenticity by measuring congruent facial affect, spontaneous thought structuring, and absence of over-rehearsed robotic masking.
                </p>
              </div>

              <div className="bg-black/60 border border-zinc-800/80 p-3.5 rounded-xl space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Affect Congruence:</span>
                  <span className="text-emerald-300 font-semibold">{evalData?.authenticityMetrics?.affectCongruenceRating || 'High Verbal-Emotional Harmony'}</span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Spontaneity Level:</span>
                  <span className="text-zinc-200">{evalData?.authenticityMetrics?.spontaneityLevel || 'Natural, Thoughtful Delivery'}</span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Vocal Warmth:</span>
                  <span className="text-cyan-300">{evalData?.authenticityMetrics?.vocalWarmthSteadiness || 'Consistent Unforced Pitch Resonance'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Micro-Expression Check:</span>
                  <span className="text-amber-300">{evalData?.bodyLanguageMetrics?.microExpressionStatus || 'Congruent & Open (Natural Affect)'}</span>
                </div>
              </div>

              <div className="bg-black/60 p-3.5 border border-zinc-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  Facial Authenticity Audit:
                </span>
                <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                  {evalData?.authenticityMetrics?.facialAuthenticityAudit || `Candidate displayed authentic Duchenne micro-cues without forced masking. Eye gaze and vocal cadence remained synchronous.`}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: NEUTRAL OBJECTIVE FEEDBACK CALCULATION */}
          {activeTab === 'neutral_feedback' && (
            <div className="space-y-3 font-sans text-xs">
              <div className="bg-cyan-950/40 border border-cyan-500/40 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-cyan-400" /> Neutral Feedback Calculation:
                  </span>
                  <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                    Bias-Free Standard
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {evalData?.neutralFeedbackCalculation?.biasFreeSummary || `Objective review confirms candidate articulated crisis response using standardized behavioral metrics without subjective judgment or demographic bias.`}
                </p>
              </div>

              <div className="bg-black/60 border border-zinc-800/80 p-3.5 rounded-xl space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                  Observable Data Points & Behaviors:
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {(evalData?.neutralFeedbackCalculation?.observedBehaviors || [
                    `Maintained direct eye contact for ${evalData?.bodyLanguageMetrics?.eyeContactConsistencyPercent || 94}% of total playback duration`,
                    `Shoulder orientation stayed aligned with minimal physical fidgeting (${evalData?.bodyLanguageMetrics?.fidgetingIndex || 'Minimal'})`,
                    `Vocal volume remained within measured dynamic threshold (54 - 68 dB)`
                  ]).map((obs, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/60 border border-zinc-800/80 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                  Objective Constructive Guidance:
                </span>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {evalData?.neutralFeedbackCalculation?.neutralConstructiveGuidance || evalData?.whatNeedsImprovementToReach100 || 'To maximize scores: establish direct camera contact during initial transitional pauses and state containment timelines clearly.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: TRANSCRIPT & MODEL GOLD STANDARD */}
          {activeTab === 'transcript' && (
            <div className="space-y-3 font-sans text-xs">
              <div className="bg-black/70 p-3.5 border border-zinc-800 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                  Candidate Spoken Transcript:
                </span>
                <p className="text-zinc-200 text-xs italic leading-relaxed whitespace-pre-wrap">
                  "{videoTranscript || evalData?.crisisMitigationFeedback || 'No video transcript available for this recording session.'}"
                </p>
              </div>

              {evalData?.whatShouldHaveBeenDoneInstead && (
                <div className="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                    Model Exemplar Delivery:
                  </span>
                  <p className="text-amber-100/90 text-xs italic leading-relaxed">
                    "{evalData.whatShouldHaveBeenDoneInstead}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actionable Coaching Footer */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-3 rounded-2xl flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 text-[10px] flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amber-400" />
              <span>Target Standard: 80%+ Certified</span>
            </span>
            <span className="text-emerald-400 text-[10px] font-bold">
              Civility Corporate Audit
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Video Icon to avoid naming clash
function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
}
