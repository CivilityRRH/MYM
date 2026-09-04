import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  analyzeLiveFrameDiagnostics,
  LiveFrameDiagnosticResult,
  DiagnosticTuningParams
} from '../lib/videoOpticalAnalyzer';
import {
  Camera,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
  Maximize2,
  Minimize2,
  Download,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Info,
  Sun,
  ShieldCheck,
  Layers,
  Sparkles,
  ChevronRight,
  Crosshair,
  Gauge
} from 'lucide-react';

export interface CameraDiagnosticOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream?: MediaStream | null;
  isActive?: boolean;
  onClose?: () => void;
  isRecording?: boolean;
  onTuningChange?: (tuning: DiagnosticTuningParams) => void;
  initialTuning?: Partial<DiagnosticTuningParams>;
}

export const CameraDiagnosticOverlay: React.FC<CameraDiagnosticOverlayProps> = ({
  videoRef,
  stream,
  isActive = true,
  onClose,
  isRecording = false,
  onTuningChange,
  initialTuning
}) => {
  // Active Tab: 'biometrics' | 'hardware' | 'performance' | 'calibration'
  const [activeTab, setActiveTab] = useState<'biometrics' | 'hardware' | 'performance' | 'calibration'>('biometrics');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'hud' | 'heatmap' | 'clean'>('hud');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [copiedTelemetry, setCopiedTelemetry] = useState<boolean>(false);

  // Diagnostic Tuning Parameters
  const [tuning, setTuning] = useState<DiagnosticTuningParams>({
    skinSensitivity: initialTuning?.skinSensitivity ?? 1.0,
    minFaceAreaPercent: initialTuning?.minFaceAreaPercent ?? 2.0,
    minLuminanceThreshold: initialTuning?.minLuminanceThreshold ?? 22,
    backlightMaxRatio: initialTuning?.backlightMaxRatio ?? 3.5
  });

  // Diagnostics State
  const [diagnostics, setDiagnostics] = useState<LiveFrameDiagnosticResult | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [avgFps, setAvgFps] = useState<number>(30);
  const [minFps, setMinFps] = useState<number>(30);
  const [maxFps, setMaxFps] = useState<number>(30);
  const [frameDropCount, setFrameDropCount] = useState<number>(0);
  const [frozenFrameWarning, setFrozenFrameWarning] = useState<boolean>(false);

  // Hardware Metadata State
  const [cameraMetadata, setCameraMetadata] = useState<{
    label: string;
    width: number;
    height: number;
    aspectRatio: string;
    facingMode?: string;
    frameRate?: number;
    readyState: string;
    muted: boolean;
    enabled: boolean;
    streamId?: string;
    activeTracksCount: number;
    capabilities?: MediaTrackCapabilities | null;
  } | null>(null);

  // Canvas Overlay Refs
  const canvasOverlayRef = useRef<HTMLCanvasElement | null>(null);
  const heatmapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const lastPixelSampleRef = useRef<number>(0);
  const frozenCountRef = useRef<number>(0);

  // Propagate tuning updates
  const handleTuningChange = (newTuning: Partial<DiagnosticTuningParams>) => {
    const updated = { ...tuning, ...newTuning };
    setTuning(updated);
    if (onTuningChange) {
      onTuningChange(updated);
    }
  };

  // Inspect Stream & Track Hardware Metadata
  const refreshHardwareMetadata = useCallback(() => {
    let activeStream = stream;
    if (!activeStream && videoRef.current && videoRef.current.srcObject) {
      activeStream = videoRef.current.srcObject as MediaStream;
    }

    const videoEl = videoRef.current;
    const nativeW = videoEl?.videoWidth || 0;
    const nativeH = videoEl?.videoHeight || 0;
    const aspect = nativeH > 0 ? (nativeW / nativeH).toFixed(2) : '16:9';

    if (activeStream) {
      const videoTracks = activeStream.getVideoTracks();
      const firstTrack = videoTracks[0];

      if (firstTrack) {
        const settings = firstTrack.getSettings ? firstTrack.getSettings() : {};
        const capabilities = firstTrack.getCapabilities ? firstTrack.getCapabilities() : null;

        setCameraMetadata({
          label: firstTrack.label || 'Default Camera Device',
          width: nativeW || settings.width || 1280,
          height: nativeH || settings.height || 720,
          aspectRatio: `${nativeW || 1280}x${nativeH || 720} (${aspect})`,
          facingMode: settings.facingMode,
          frameRate: settings.frameRate ? Math.round(settings.frameRate) : undefined,
          readyState: firstTrack.readyState,
          muted: firstTrack.muted,
          enabled: firstTrack.enabled,
          streamId: activeStream.id,
          activeTracksCount: activeStream.getTracks().length,
          capabilities
        });
        return;
      }
    }

    setCameraMetadata({
      label: videoEl ? 'Webcam / Synthetic Video Stream' : 'Camera Stream Not Initialized',
      width: nativeW || 1280,
      height: nativeH || 720,
      aspectRatio: `${nativeW || 1280}x${nativeH || 720} (${aspect})`,
      readyState: videoEl ? (videoEl.readyState >= 2 ? 'live' : 'loading') : 'disconnected',
      muted: videoEl?.muted ?? true,
      enabled: Boolean(videoEl),
      activeTracksCount: 1
    });
  }, [stream, videoRef]);

  // Real-time Optical Analysis Loop with Throttling & Zero-Freeze Scheduling
  const lastAnalysisTimeRef = useRef(0);
  const lastStateUpdateRef = useRef(0);
  const latestResultRef = useRef<LiveFrameDiagnosticResult | null>(null);

  useEffect(() => {
    if (!isActive) return;

    let isMounted = true;

    const runDiagnosticsLoop = () => {
      const now = performance.now();

      const videoEl = videoRef.current;
      const isVideoReady = videoEl && videoEl.readyState >= 2 && videoEl.videoWidth > 0 && !videoEl.paused && !videoEl.ended;

      // Throttle optical computer vision analysis to ~12 FPS (every 80ms) to ensure 0% CPU lock
      if (isVideoReady && (now - lastAnalysisTimeRef.current >= 80)) {
        lastAnalysisTimeRef.current = now;
        try {
          const result = analyzeLiveFrameDiagnostics(videoEl, tuning);
          latestResultRef.current = result;

          // Check for frozen video frame (sample mean luminance delta)
          if (Math.abs(result.luminance.mean - lastPixelSampleRef.current) < 0.05) {
            frozenCountRef.current++;
            if (frozenCountRef.current > 60) {
              setFrozenFrameWarning(true);
            }
          } else {
            frozenCountRef.current = 0;
            setFrozenFrameWarning(false);
          }
          lastPixelSampleRef.current = result.luminance.mean;
        } catch (diagErr) {
          console.warn('Optical diagnostic scan notice:', diagErr);
        }
      }

      // Render Visual HUD & Reticle onto Overlay Canvas
      if (latestResultRef.current && videoEl) {
        drawReticleHUD(latestResultRef.current, videoEl);
      }

      // Throttle React State Updates to ~4 FPS (every 250ms) to avoid component tree re-render thrashing
      if (now - lastStateUpdateRef.current >= 250) {
        lastStateUpdateRef.current = now;
        const delta = now - lastFrameTimeRef.current;
        lastFrameTimeRef.current = now;

        if (delta > 0) {
          const currentFps = Math.min(60, Math.max(1, Math.round(1000 / (delta / 4))));
          setFps(currentFps);

          fpsHistoryRef.current.push(currentFps);
          if (fpsHistoryRef.current.length > 20) {
            fpsHistoryRef.current.shift();
          }

          const avg = Math.round(fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length);
          const min = Math.min(...fpsHistoryRef.current);
          const max = Math.max(...fpsHistoryRef.current);
          setAvgFps(avg);
          setMinFps(min);
          setMaxFps(max);
        }

        if (latestResultRef.current && isMounted) {
          setDiagnostics(latestResultRef.current);
        }
      }

      if (isMounted) {
        animFrameIdRef.current = requestAnimationFrame(runDiagnosticsLoop);
      }
    };

    refreshHardwareMetadata();
    animFrameIdRef.current = requestAnimationFrame(runDiagnosticsLoop);

    const intervalTimer = setInterval(() => {
      refreshHardwareMetadata();
    }, 2500);

    return () => {
      isMounted = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      clearInterval(intervalTimer);
    };
  }, [isActive, videoRef, tuning, viewMode, showGrid, refreshHardwareMetadata]);

  // Draw Reticle, Bounding Box, and Landmark Mesh on Canvas Overlay
  const drawReticleHUD = (result: LiveFrameDiagnosticResult, videoEl: HTMLVideoElement) => {
    const canvas = canvasOverlayRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetW = canvas.offsetWidth || videoEl.offsetWidth || 640;
    const targetH = canvas.offsetHeight || videoEl.offsetHeight || 360;
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    const displayW = canvas.width;
    const displayH = canvas.height;
    ctx.clearRect(0, 0, displayW, displayH);

    if (viewMode === 'clean') return;

    // Scale factors from 320x240 sample space to canvas display space
    const scaleX = displayW / 320;
    const scaleY = displayH / 240;

    // 1. Optional Rule of Thirds & Alignment Grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // Vertical 1/3 lines
      ctx.beginPath();
      ctx.moveTo(displayW / 3, 0); ctx.lineTo(displayW / 3, displayH);
      ctx.moveTo((displayW / 3) * 2, 0); ctx.lineTo((displayW / 3) * 2, displayH);
      // Horizontal Eye Level Line (35% from top)
      ctx.moveTo(0, displayH * 0.35); ctx.lineTo(displayW, displayH * 0.35);
      ctx.stroke();
      ctx.setLineDash([]);

      // Eye Level Calibration Text
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillText('TARGET EYE LEVEL (35%)', 12, displayH * 0.35 - 6);
    }

    // 2. Face Bounding Box & Reticle Brackets
    if (result.faceBounds) {
      const bx = result.faceBounds.x * scaleX;
      const by = result.faceBounds.y * scaleY;
      const bw = result.faceBounds.width * scaleX;
      const bh = result.faceBounds.height * scaleY;

      const isPass = result.faceDetected;
      const reticleColor = isPass ? '#10b981' : '#f59e0b';
      const bracketLen = Math.min(24, bw * 0.22);

      ctx.strokeStyle = reticleColor;
      ctx.lineWidth = 2.5;

      // Top-Left Corner
      ctx.beginPath();
      ctx.moveTo(bx, by + bracketLen); ctx.lineTo(bx, by); ctx.lineTo(bx + bracketLen, by);
      ctx.stroke();

      // Top-Right Corner
      ctx.beginPath();
      ctx.moveTo(bx + bw - bracketLen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + bracketLen);
      ctx.stroke();

      // Bottom-Left Corner
      ctx.beginPath();
      ctx.moveTo(bx, by + bh - bracketLen); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bracketLen, by + bh);
      ctx.stroke();

      // Bottom-Right Corner
      ctx.beginPath();
      ctx.moveTo(bx + bw - bracketLen, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - bracketLen);
      ctx.stroke();

      // Subtle fill inside face box
      ctx.fillStyle = isPass ? 'rgba(16, 185, 129, 0.06)' : 'rgba(245, 158, 11, 0.08)';
      ctx.fillRect(bx, by, bw, bh);

      // Face Center Crosshair
      if (result.faceCenter) {
        const cx = result.faceCenter.x * scaleX;
        const cy = result.faceCenter.y * scaleY;

        ctx.strokeStyle = isPass ? 'rgba(16, 185, 129, 0.8)' : 'rgba(245, 158, 11, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
        ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10);
        ctx.stroke();
      }

      // Landmarks: Eyes, Nose, Mouth
      if (result.landmarks) {
        ctx.fillStyle = isPass ? '#34d399' : '#fbbf24';
        const lx = result.landmarks.leftEye.x * scaleX;
        const ly = result.landmarks.leftEye.y * scaleY;
        const rx = result.landmarks.rightEye.x * scaleX;
        const ry = result.landmarks.rightEye.y * scaleY;
        const mx = result.landmarks.mouth.x * scaleX;
        const my = result.landmarks.mouth.y * scaleY;

        ctx.beginPath(); ctx.arc(lx, ly, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(rx, ry, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(mx, my, 3.5, 0, Math.PI * 2); ctx.fill();

        // Gaze Vector Indicator from Mid-Eyes
        const midEyeX = (lx + rx) / 2;
        const midEyeY = (ly + ry) / 2;
        const gazeOffsetX = result.gaze.horizontalRatio * 40;
        const gazeOffsetY = result.gaze.verticalRatio * 30;

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(midEyeX, midEyeY);
        ctx.lineTo(midEyeX + gazeOffsetX, midEyeY + gazeOffsetY);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(midEyeX + gazeOffsetX, midEyeY + gazeOffsetY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Header Tag above Reticle
      ctx.fillStyle = isPass ? 'rgba(6, 78, 59, 0.85)' : 'rgba(120, 53, 15, 0.85)';
      ctx.strokeStyle = isPass ? '#10b981' : '#f59e0b';
      ctx.lineWidth = 1;

      const tagText = `${isPass ? 'HUMAN FACE VERIFIED' : 'UNVERIFIED CLUSTER'} [${result.confidencePercent}%]`;
      ctx.font = 'bold 10px monospace';
      const textMetrics = ctx.measureText(tagText);
      const tagW = textMetrics.width + 16;
      const tagH = 18;

      ctx.fillRect(bx, by - tagH - 4, tagW, tagH);
      ctx.strokeRect(bx, by - tagH - 4, tagW, tagH);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(tagText, bx + 8, by - tagH + 9);
    }

    // 3. Mini Top-Left HUD Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(10, 10, 240, 52);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 240, 52);

    ctx.font = '10px monospace';
    ctx.fillStyle = result.faceDetected ? '#34d399' : '#f87171';
    ctx.fillText(`STATUS: ${result.faceDetected ? '🟢 FACE TRACKED' : '🔴 NO FACE DETECTED'}`, 18, 26);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(`FPS: ${fps} | LATENCY: ${result.performance.processingTimeMs}ms`, 18, 40);
    ctx.fillText(`LUM: ${result.luminance.faceMean}Y | SKIN: ${result.chromaticity.skinRatioPercent}%`, 18, 54);
  };

  // Export Full Diagnostic Telemetry to JSON
  const handleExportTelemetryJSON = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      sessionSummary: {
        faceDetected: diagnostics?.faceDetected,
        failureCode: diagnostics?.failureCode,
        failureReason: diagnostics?.failureReason,
        confidencePercent: diagnostics?.confidencePercent
      },
      cameraHardware: cameraMetadata,
      frameDiagnostics: diagnostics,
      fpsTelemetry: {
        currentFps: fps,
        averageFps: avgFps,
        minFps: minFps,
        maxFps: maxFps,
        frameDrops: frameDropCount
      },
      activeTuning: tuning
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `camera_diagnostic_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy Summary to Clipboard
  const handleCopySummary = async () => {
    const summary = `--- CIVILITY AI OPTICAL TELEMETRY DIAGNOSTIC ---
Timestamp: ${new Date().toISOString()}
Face Detected: ${diagnostics?.faceDetected ? 'YES' : 'NO'}
Failure Code: ${diagnostics?.failureCode || 'NONE'}
Failure Reason: ${diagnostics?.failureReason || 'Optimal face alignment verified'}
Confidence: ${diagnostics?.confidencePercent}%
Camera Device: ${cameraMetadata?.label || 'Unknown'}
Resolution: ${cameraMetadata?.aspectRatio || 'Unknown'}
FPS: ${fps} (Avg: ${avgFps}) | Frame Latency: ${diagnostics?.performance.processingTimeMs}ms
Luminance: Mean=${diagnostics?.luminance.mean}Y, Face=${diagnostics?.luminance.faceMean}Y, Backlight Ratio=${diagnostics?.luminance.backlightContrastRatio}x
Skin Chromaticity Ratio: ${diagnostics?.chromaticity.skinRatioPercent}%
Checklist:
  [${diagnostics?.checklist.hasVideoData ? 'X' : ' '}] Video Data Ready
  [${diagnostics?.checklist.hasAdequateLight ? 'X' : ' '}] Adequate Illumination
  [${diagnostics?.checklist.hasNoSevereBacklight ? 'X' : ' '}] No Severe Backlight
  [${diagnostics?.checklist.hasSkinChromaCluster ? 'X' : ' '}] Skin Chromaticity Cluster
  [${diagnostics?.checklist.hasAdequateFaceScale ? 'X' : ' '}] Face Scale in Frame
  [${diagnostics?.checklist.isAlignedWithLens ? 'X' : ' '}] Lens Alignment
Recommendations: ${diagnostics?.actionableRecommendations.join(' | ')}`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedTelemetry(true);
      setTimeout(() => setCopiedTelemetry(false), 2500);
    } catch {
      console.warn('Clipboard write failed');
    }
  };

  return (
    <div
      id="camera-diagnostic-overlay-root"
      className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between overflow-hidden"
    >
      {/* 1. Transparent Canvas Overlay for Direct Visual Reticle Tracking */}
      <canvas
        ref={canvasOverlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 2. Top Header HUD Bar */}
      <div className="relative z-20 pointer-events-auto p-3 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/80 border border-white/20 rounded-md backdrop-blur-md">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-white uppercase">
              Optical Diagnostic HUD
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${
              diagnostics?.faceDetected
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
            }`}
          >
            {diagnostics?.faceDetected ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-rose-400" />
            )}
            <span>
              {diagnostics?.faceDetected
                ? `Face Locked (${diagnostics.confidencePercent}%)`
                : diagnostics?.failureCode || 'NO FACE DETECTED'}
            </span>
          </div>

          {frozenFrameWarning && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[10px] font-mono animate-pulse rounded">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>FROZEN FRAME DETECTED</span>
            </div>
          )}
        </div>

        {/* View Controls & Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowGrid((prev) => !prev)}
            className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
              showGrid
                ? 'bg-white/20 text-white border-white/40'
                : 'bg-black/60 text-white/50 border-white/10 hover:text-white'
            }`}
            title="Toggle Eye-Level & Rule of Thirds Grid"
          >
            Grid: {showGrid ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'hud' ? 'clean' : 'hud')}
            className="px-2 py-1 bg-black/60 hover:bg-black/90 text-white/70 hover:text-white border border-white/15 text-[10px] font-mono rounded transition-colors"
          >
            {viewMode === 'hud' ? 'Hide Reticle' : 'Show Reticle'}
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 bg-black/60 hover:bg-black/90 text-white/70 hover:text-white border border-white/15 rounded transition-colors"
            title={isExpanded ? 'Collapse Telemetry Matrix' : 'Expand Telemetry Matrix'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-black/60 hover:bg-rose-950 text-white/60 hover:text-rose-300 border border-white/15 hover:border-rose-500/50 rounded transition-colors"
              title="Close Diagnostic HUD"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Bottom Expandable Diagnostic Telemetry Panel */}
      {isExpanded && (
        <div className="relative z-20 pointer-events-auto m-3 max-h-[46vh] overflow-y-auto bg-black/92 border border-white/20 rounded-xl backdrop-blur-xl shadow-2xl p-3.5 space-y-3 font-mono text-white text-xs">
          {/* Diagnostic Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('biometrics')}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded transition-all ${
                  activeTab === 'biometrics'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                1. Face & Biometrics
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hardware')}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded transition-all ${
                  activeTab === 'hardware'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                2. Camera Hardware
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('performance')}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded transition-all ${
                  activeTab === 'performance'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                3. FPS & Latency
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('calibration')}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded transition-all ${
                  activeTab === 'calibration'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                4. Root Cause & Tuning
              </button>
            </div>

            {/* Quick Export & Copy Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] rounded border border-white/20 flex items-center gap-1 transition-colors"
                title="Copy telemetry summary to clipboard"
              >
                {copiedTelemetry ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTelemetry ? 'Copied' : 'Copy Log'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportTelemetryJSON}
                className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-[10px] rounded flex items-center gap-1 transition-colors"
                title="Export full diagnostic report as JSON"
              >
                <Download className="w-3 h-3" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Face Detection & Optical Biometrics */}
          {activeTab === 'biometrics' && (
            <div className="space-y-3">
              {/* Failure Reason Alert Banner if not detected */}
              {!diagnostics?.faceDetected && (
                <div className="p-2.5 bg-rose-950/70 border border-rose-500/50 rounded-lg flex items-start gap-2 text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-[11px]">
                    <div className="font-bold text-rose-300 uppercase">
                      Detection Failed: {diagnostics?.failureCode || 'UNVERIFIED'}
                    </div>
                    <p className="text-white/80 font-sans">
                      {diagnostics?.failureReason || 'Camera feed did not meet the minimal skin chromaticity or facial geometry threshold.'}
                    </p>
                  </div>
                </div>
              )}

              {/* 4-Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg space-y-1">
                  <div className="text-[10px] text-white/50 uppercase">Skin Chromaticity</div>
                  <div className="text-sm font-bold text-cyan-300">
                    {diagnostics?.chromaticity.skinRatioPercent}% Locus Match
                  </div>
                  <div className="text-[9px] text-white/40">
                    {diagnostics?.chromaticity.skinPixelCount} / {diagnostics?.chromaticity.totalSampledPixels} pixels
                  </div>
                </div>

                <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg space-y-1">
                  <div className="text-[10px] text-white/50 uppercase">Face Illumination</div>
                  <div className="text-sm font-bold text-amber-300 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5" />
                    <span>{diagnostics?.luminance.faceMean} Y (Lux)</span>
                  </div>
                  <div className="text-[9px] text-white/40">
                    Status: {diagnostics?.luminance.lightingStatus?.toUpperCase()}
                  </div>
                </div>

                <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg space-y-1">
                  <div className="text-[10px] text-white/50 uppercase">Backlight Ratio</div>
                  <div
                    className={`text-sm font-bold ${
                      (diagnostics?.luminance.backlightContrastRatio || 1) > 3.2
                        ? 'text-rose-400'
                        : 'text-emerald-300'
                    }`}
                  >
                    {diagnostics?.luminance.backlightContrastRatio}x BG Contrast
                  </div>
                  <div className="text-[9px] text-white/40">
                    BG: {diagnostics?.luminance.backgroundMean}Y vs Face: {diagnostics?.luminance.faceMean}Y
                  </div>
                </div>

                <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg space-y-1">
                  <div className="text-[10px] text-white/50 uppercase">Head Pose & Gaze</div>
                  <div className="text-sm font-bold text-emerald-300">
                    {diagnostics?.headPose.isFacingCamera ? 'Facing Camera' : 'Averted Head'}
                  </div>
                  <div className="text-[9px] text-white/40">
                    Yaw: {diagnostics?.headPose.yawApproxDeg}° | Pitch: {diagnostics?.headPose.pitchApproxDeg}°
                  </div>
                </div>
              </div>

              {/* Bounding Box & Frame Coverage Detail */}
              <div className="p-2.5 bg-black/60 border border-white/10 rounded-lg flex flex-wrap items-center justify-between gap-3 text-[11px]">
                <div>
                  <span className="text-white/50">Bounding Box: </span>
                  <span className="text-white font-bold">
                    {diagnostics?.faceBounds
                      ? `${diagnostics.faceBounds.width} x ${diagnostics.faceBounds.height} px (${diagnostics.faceBounds.areaPercent}% of frame)`
                      : 'None'}
                  </span>
                </div>

                <div>
                  <span className="text-white/50">Gaze Direction: </span>
                  <span className="text-cyan-300 font-bold uppercase">
                    {diagnostics?.gaze.direction || 'Center'}
                  </span>
                </div>

                <div>
                  <span className="text-white/50">Confidence: </span>
                  <span className="text-emerald-400 font-bold">
                    {diagnostics?.confidencePercent}%
                  </span>
                </div>
              </div>

              {/* Actionable Recommendations */}
              {diagnostics?.actionableRecommendations && diagnostics.actionableRecommendations.length > 0 && (
                <div className="p-2 bg-cyan-950/40 border border-cyan-500/30 rounded-lg space-y-1 text-[11px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Actionable Fixes to Detect Face:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-white/80 font-sans text-xs">
                    {diagnostics.actionableRecommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Camera Stream Hardware Metadata */}
          {activeTab === 'hardware' && (
            <div className="space-y-2.5 text-[11px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg space-y-1">
                  <div className="text-[10px] text-white/50 uppercase">Camera Hardware Device</div>
                  <div className="text-xs font-bold text-emerald-300 truncate">
                    {cameraMetadata?.label || 'Default Camera'}
                  </div>
                  <div className="text-[9px] text-white/40">ReadyState: {cameraMetadata?.readyState}</div>
                </div>

                <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg space-y-1">
                  <div className="text-[10px] text-white/50 uppercase">Video Resolution & Aspect</div>
                  <div className="text-xs font-bold text-cyan-300">
                    {cameraMetadata?.aspectRatio || '1280x720 (1.78)'}
                  </div>
                  <div className="text-[9px] text-white/40">
                    Facing Mode: {cameraMetadata?.facingMode || 'user (front)'}
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-black/60 border border-white/10 rounded-lg space-y-2">
                <div className="text-[10px] text-white/50 uppercase font-bold">MediaStream Technical Profile:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <span className="text-white/40">Stream ID: </span>
                    <span className="text-white truncate block">{cameraMetadata?.streamId || 'stream_internal_01'}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Active Tracks: </span>
                    <span className="text-white">{cameraMetadata?.activeTracksCount || 1}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Track Enabled: </span>
                    <span className={cameraMetadata?.enabled ? 'text-emerald-400' : 'text-rose-400'}>
                      {cameraMetadata?.enabled ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40">Muted: </span>
                    <span className={cameraMetadata?.muted ? 'text-amber-400' : 'text-emerald-400'}>
                      {cameraMetadata?.muted ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40">Ideal Target: </span>
                    <span className="text-white">1280x720 @ 30fps</span>
                  </div>
                  <div>
                    <span className="text-white/40">Display Element: </span>
                    <span className="text-white">
                      {videoRef.current?.offsetWidth}x{videoRef.current?.offsetHeight}px
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={refreshHardwareMetadata}
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Re-poll Camera Hardware Capabilities
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FPS & Optical Latency Performance */}
          {activeTab === 'performance' && (
            <div className="space-y-3 text-[11px]">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg space-y-1">
                  <div className="text-[10px] text-white/50 uppercase">Current FPS</div>
                  <div
                    className={`text-base font-bold ${
                      fps >= 24 ? 'text-emerald-400' : fps >= 15 ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {fps} FPS
                  </div>
                  <div className="text-[9px] text-white/40">Avg: {avgFps} | Min: {minFps} | Max: {maxFps}</div>
                </div>

                <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg space-y-1">
                  <div className="text-[10px] text-white/50 uppercase">Processing Latency</div>
                  <div className="text-base font-bold text-cyan-300">
                    {diagnostics?.performance.processingTimeMs || 1.8} ms
                  </div>
                  <div className="text-[9px] text-white/40">Per-Frame CV Cost</div>
                </div>

                <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg space-y-1">
                  <div className="text-[10px] text-white/50 uppercase">Dropped Frames</div>
                  <div className={`text-base font-bold ${frameDropCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {frameDropCount}
                  </div>
                  <div className="text-[9px] text-white/40">Jitter Events</div>
                </div>
              </div>

              {/* Performance Health Gauge */}
              <div className="p-2.5 bg-black/60 border border-white/10 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-white/60 uppercase">Pipeline Processing Load:</span>
                  <span className="text-emerald-400 font-bold">
                    {((diagnostics?.performance.processingTimeMs || 2) / 33.3 * 100).toFixed(1)}% of 30FPS Budget
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, ((diagnostics?.performance.processingTimeMs || 2) / 33.3) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Automated 5-Point Health Checklist & Sensitivity Tuning */}
          {activeTab === 'calibration' && (
            <div className="space-y-3 text-[11px]">
              {/* 5-Point Automated Health Checklist */}
              <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg space-y-2">
                <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                  Automated Video Diagnostic Checklist:
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">1. Video Hardware Stream Active & Non-Black:</span>
                    <span className={diagnostics?.checklist.hasVideoData ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {diagnostics?.checklist.hasVideoData ? 'PASS' : 'FAIL'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/80">2. Adequate Face Illumination (&gt;22 Y):</span>
                    <span className={diagnostics?.checklist.hasAdequateLight ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {diagnostics?.checklist.hasAdequateLight ? 'PASS' : 'FAIL'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/80">3. No Severe Backlighting (&lt;3.5x Ratio):</span>
                    <span className={diagnostics?.checklist.hasNoSevereBacklight ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {diagnostics?.checklist.hasNoSevereBacklight ? 'PASS' : 'FAIL'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/80">4. Skin Chromaticity Cluster Formed (&gt;1.8%):</span>
                    <span className={diagnostics?.checklist.hasSkinChromaCluster ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {diagnostics?.checklist.hasSkinChromaCluster ? 'PASS' : 'FAIL'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/80">5. Face Scale &amp; Lens Centering (&gt;2.0% Area):</span>
                    <span className={diagnostics?.checklist.hasAdequateFaceScale ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {diagnostics?.checklist.hasAdequateFaceScale ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Algorithm Sensitivity Sliders */}
              <div className="p-2.5 bg-black/60 border border-white/10 rounded-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" /> Real-Time Calibration &amp; Threshold Tuner:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const resetVal = {
                        skinSensitivity: 1.0,
                        minFaceAreaPercent: 2.0,
                        minLuminanceThreshold: 22,
                        backlightMaxRatio: 3.5
                      };
                      setTuning(resetVal);
                      if (onTuningChange) onTuningChange(resetVal);
                    }}
                    className="text-[10px] text-white/50 hover:text-white underline cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                </div>

                {/* Slider 1: Skin Sensitivity */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-white/70">Skin Chroma Sensitivity:</span>
                    <span className="text-cyan-300 font-bold">{tuning.skinSensitivity.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={tuning.skinSensitivity}
                    onChange={(e) => handleTuningChange({ skinSensitivity: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[8px] text-white/30">
                    <span>Strict (0.5x)</span>
                    <span>Standard (1.0x)</span>
                    <span>Broad / Shadowed (2.0x)</span>
                  </div>
                </div>

                {/* Slider 2: Min Face Area */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-white/70">Min Face Frame Area:</span>
                    <span className="text-amber-300 font-bold">{tuning.minFaceAreaPercent.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="8.0"
                    step="0.5"
                    value={tuning.minFaceAreaPercent}
                    onChange={(e) => handleTuningChange({ minFaceAreaPercent: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[8px] text-white/30">
                    <span>Far Lens (0.5%)</span>
                    <span>Standard (2.0%)</span>
                    <span>Close-up Only (8.0%)</span>
                  </div>
                </div>

                {/* Slider 3: Min Luminance Threshold */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-white/70">Min Face Luminance Threshold:</span>
                    <span className="text-emerald-300 font-bold">{tuning.minLuminanceThreshold} Y</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="1"
                    value={tuning.minLuminanceThreshold}
                    onChange={(e) => handleTuningChange({ minLuminanceThreshold: parseInt(e.target.value, 10) })}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[8px] text-white/30">
                    <span>Dim / Candlelight (10 Y)</span>
                    <span>Office Default (22 Y)</span>
                    <span>Bright Studio (50 Y)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
