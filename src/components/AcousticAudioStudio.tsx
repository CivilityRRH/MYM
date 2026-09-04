import React, { useState, useEffect, useRef } from 'react';
import { AudioScanReport, SpectrogramSlice } from '../lib/audioScanner';
import {
  Volume2,
  Activity,
  Play,
  Pause,
  Sliders,
  Sparkles,
  RefreshCw,
  Download,
  Info,
  Layers,
  BarChart3,
  Waves,
  Maximize2,
  Minimize2,
  Radio,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AcousticAudioStudioProps {
  report: AudioScanReport;
  audioUrl: string;
  onReScan?: () => void;
  onEvaluateAI?: () => void;
  isEvaluatingAI?: boolean;
}

export const AcousticAudioStudio: React.FC<AcousticAudioStudioProps> = ({
  report,
  audioUrl,
  onReScan,
  onEvaluateAI,
  isEvaluatingAI = false,
}) => {
  const [activeTab, setActiveTab] = useState<'spectrogram' | 'pitch' | 'dsp' | 'filters'>('spectrogram');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'none' | 'dehum' | 'presence' | 'warmth'>('none');
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio Context for real-time Web Audio API filtering & spectrum visualization during playback
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const biquadFilterRef = useRef<BiquadFilterNode | null>(null);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Initialize Web Audio graph if not yet attached
      initAudioGraph();
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  // Initialize Web Audio Graph for Live DSP filtering during playback
  const initAudioGraph = () => {
    if (audioContextRef.current || !audioRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;

      const filter = ctx.createBiquadFilter();
      biquadFilterRef.current = filter;
      filter.type = 'allpass';

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyserNodeRef.current = analyser;

      source.connect(filter);
      filter.connect(analyser);
      analyser.connect(ctx.destination);
    } catch (e) {
      console.warn('Web Audio Graph initialization note:', e);
    }
  };

  // Apply real-time DSP filter change
  useEffect(() => {
    if (!biquadFilterRef.current || !audioContextRef.current) return;
    const filter = biquadFilterRef.current;
    if (activeFilter === 'dehum') {
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(80, audioContextRef.current.currentTime);
      filter.Q.setValueAtTime(0.7, audioContextRef.current.currentTime);
    } else if (activeFilter === 'presence') {
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(2500, audioContextRef.current.currentTime);
      filter.gain.setValueAtTime(4.5, audioContextRef.current.currentTime);
      filter.Q.setValueAtTime(1.2, audioContextRef.current.currentTime);
    } else if (activeFilter === 'warmth') {
      filter.type = 'lowshelf';
      filter.frequency.setValueAtTime(250, audioContextRef.current.currentTime);
      filter.gain.setValueAtTime(3.0, audioContextRef.current.currentTime);
    } else {
      filter.type = 'allpass';
    }
  }, [activeFilter]);

  // Sync audio progress
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    const render = () => {
      if (!isMounted || !canvas || !ctx) return;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (activeTab === 'spectrogram') {
        // Render 2D Spectrogram Heatmap
        const matrix = report.spectrogramMatrix || [];
        if (matrix.length > 0) {
          const sliceWidth = width / matrix.length;
          const numFreqs = matrix[0].frequencies.length;
          const bandHeight = height / numFreqs;

          for (let s = 0; s < matrix.length; s++) {
            const slice = matrix[s];
            for (let f = 0; f < numFreqs; f++) {
              const intensity = slice.frequencies[f] || 0;
              // Visual colormap: deep blue -> emerald -> amber -> radiant magenta
              const r = Math.floor(intensity * 230 + 10);
              const g = Math.floor(intensity > 0.4 ? (intensity - 0.4) * 255 : intensity * 120);
              const b = Math.floor(intensity < 0.5 ? 200 * (1 - intensity) : 30);
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0.15, intensity)})`;
              ctx.fillRect(s * sliceWidth, height - (f + 1) * bandHeight, sliceWidth + 0.5, bandHeight + 0.5);
            }
          }

          // Render playback scrub needle
          if (report.durationSec > 0) {
            const needleX = (currentTime / report.durationSec) * width;
            ctx.strokeStyle = '#10B981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(needleX, 0);
            ctx.lineTo(needleX, height);
            ctx.stroke();
          }
        }
      } else if (activeTab === 'pitch') {
        // Render Pitch Contour Curve (F0 in Hz over time)
        const contour = report.pitchContour || [];
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        // Draw frequency grid lines (100Hz, 200Hz, 300Hz, 400Hz)
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.font = '9px monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';

        [100, 200, 300, 400].forEach((hz) => {
          const y = height - (hz / 450) * height;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
          ctx.fillText(`${hz}Hz`, 6, y - 3);
        });

        // Draw pitch contour path
        if (contour.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 2.5;

          contour.forEach((pt, idx) => {
            const x = (pt.timeSec / report.durationSec) * width;
            const y = height - (Math.min(450, pt.pitchHz) / 450) * height;
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();

          // Draw active average pitch guideline
          const avgY = height - (report.pitchF0Hz / 450) * height;
          ctx.strokeStyle = '#10B981';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(0, avgY);
          ctx.lineTo(width, avgY);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#10B981';
          ctx.fillText(`Avg F0: ${report.pitchF0Hz} Hz (${report.detectedVoiceType})`, width - 170, avgY - 4);
        }
      } else if (activeTab === 'dsp') {
        // Render 50-point Waveform Envelope & RMS Power Bars
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        const env = report.waveformEnvelope || [];
        const barWidth = width / env.length;
        const halfH = height / 2;

        ctx.fillStyle = '#34D399';
        env.forEach((val, i) => {
          const barH = val * halfH * 0.9;
          const x = i * barWidth;
          ctx.fillRect(x + 1, halfH - barH, barWidth - 2, barH * 2);
        });

        // Draw center zero-crossing line
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, halfH);
        ctx.lineTo(width, halfH);
        ctx.stroke();
      }

      // If playing with live analyzer, overlay FFT frequencies
      if (isPlaying && analyserNodeRef.current) {
        const bufferLength = analyserNodeRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNodeRef.current.getByteFrequencyData(dataArray);

        ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const sliceW = width / 64;
        for (let i = 0; i < 64; i++) {
          const v = dataArray[i] / 255.0;
          const y = height - v * (height * 0.65);
          if (i === 0) ctx.moveTo(0, y);
          else ctx.lineTo(i * sliceW, y);
        }
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeTab, report, isPlaying, currentTime]);

  // Export Telemetry as JSON
  const handleExportTelemetry = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `acoustic-dsp-telemetry-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className={`bg-[#0d0d0d] border border-emerald-500/40 rounded-xl overflow-hidden transition-all shadow-2xl ${isExpanded ? 'p-6' : 'p-4'}`}>
      {/* Hidden native audio tag */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                Acoustic Signal Workstation & DSP Suite
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
                {report.sampleRate} Hz • 16-Bit PCM
              </span>
            </div>
            <p className="text-[11px] text-white/60 font-sans">
              Real-time harmonic signal decomposition, jitter, shimmer & vocal tract formant analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onReScan && (
            <button
              onClick={onReScan}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[11px] font-mono rounded border border-white/15 flex items-center gap-1.5 transition-colors"
              title="Re-run DSP DSP Feature Extractor"
            >
              <RefreshCw className="w-3 h-3" /> Re-Scan
            </button>
          )}

          <button
            onClick={handleExportTelemetry}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-cyan-300 text-[11px] font-mono rounded border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
            title="Export full acoustic JSON dataset"
          >
            <Download className="w-3 h-3" /> Export JSON
          </button>

          {onEvaluateAI && (
            <button
              onClick={onEvaluateAI}
              disabled={isEvaluatingAI}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-[11px] uppercase tracking-wider rounded flex items-center gap-1.5 transition-all shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEvaluatingAI ? 'AI Scoring...' : 'Run Auditory AI'}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-white/50 hover:text-white transition-colors"
            title={isExpanded ? 'Compact View' : 'Expand View'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="mt-4 space-y-4">
        {/* Visualizer Navigation Tabs & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center bg-black/60 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab('spectrogram')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'spectrogram' ? 'bg-emerald-500 text-black font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Spectrogram Heatmap
            </button>
            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'pitch' ? 'bg-emerald-500 text-black font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> F0 Pitch Contour
            </button>
            <button
              onClick={() => setActiveTab('dsp')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'dsp' ? 'bg-emerald-500 text-black font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              <Waves className="w-3.5 h-3.5" /> Waveform Envelope
            </button>
          </div>

          {/* DSP Filter Selector */}
          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
            <Sliders className="w-3.5 h-3.5 text-white/50" />
            <span className="text-[11px] text-white/50 uppercase">DSP Filter:</span>
            {(['none', 'dehum', 'presence', 'warmth'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2 py-0.5 text-[10px] rounded uppercase font-bold transition-all ${
                  activeFilter === filter
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {filter === 'none' ? 'Raw PCM' : filter === 'dehum' ? '80Hz Cut' : filter === 'presence' ? '2.5kHz Clarity' : 'Vocal Warmth'}
              </button>
            ))}
          </div>
        </div>

        {/* Real-Time Canvas Screen */}
        <div className="relative w-full h-44 sm:h-52 bg-black rounded-lg border border-white/15 overflow-hidden shadow-inner flex flex-col justify-end">
          <canvas
            ref={canvasRef}
            width={720}
            height={200}
            className="w-full h-full object-cover"
          />

          {/* Overlay Stats HUD */}
          <div className="absolute top-2 left-2 flex flex-wrap items-center gap-2 pointer-events-none">
            <span className="px-2 py-0.5 bg-black/80 backdrop-blur border border-white/15 rounded text-[10px] font-mono text-emerald-300">
              Fundamental F0: {report.pitchF0Hz} Hz ({report.detectedVoiceType})
            </span>
            <span className="px-2 py-0.5 bg-black/80 backdrop-blur border border-white/15 rounded text-[10px] font-mono text-cyan-300">
              Pitch Stability: {report.pitchStabilityPercent}%
            </span>
            <span className="px-2 py-0.5 bg-black/80 backdrop-blur border border-white/15 rounded text-[10px] font-mono text-amber-300">
              Jitter: {report.jitterPercent}% • Shimmer: {report.shimmerPercent}%
            </span>
          </div>

          {/* Player Controls Bar */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-3 bg-black/85 backdrop-blur px-3 py-1.5 rounded-lg border border-white/15">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-transform active:scale-95 shadow"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
              </button>
              <div className="text-[11px] font-mono text-white/80">
                <span>{currentTime.toFixed(1)}s</span> / <span className="text-white/40">{report.durationSec}s</span>
              </div>
            </div>

            {/* Scrub Slider */}
            <input
              type="range"
              min="0"
              max={report.durationSec || 1}
              step="0.1"
              value={currentTime}
              onChange={(e) => {
                const newT = parseFloat(e.target.value);
                setCurrentTime(newT);
                if (audioRef.current) {
                  audioRef.current.currentTime = newT;
                }
              }}
              className="flex-1 max-w-xs h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />

            <div className="text-[11px] font-mono text-white/50 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{report.averageDb} dB RMS ({report.peakDb} dB Peak)</span>
            </div>
          </div>
        </div>

        {/* 6-Card DSP Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Card 1: Fundamental Pitch */}
          <div className="bg-[#141414] p-3 rounded-lg border border-white/10 space-y-1">
            <div className="text-[10px] font-mono uppercase text-white/50">Pitch (F0)</div>
            <div className="text-base font-mono font-bold text-emerald-400">{report.pitchF0Hz} Hz</div>
            <div className="text-[10px] text-white/60 font-sans truncate">{report.detectedVoiceType} Register</div>
          </div>

          {/* Card 2: Jitter Perturbation */}
          <div className="bg-[#141414] p-3 rounded-lg border border-white/10 space-y-1">
            <div className="text-[10px] font-mono uppercase text-white/50">Jitter (Pitch Var)</div>
            <div className="text-base font-mono font-bold text-cyan-400">{report.jitterPercent}%</div>
            <div className="text-[10px] text-emerald-400 font-sans truncate font-medium">
              {report.jitterPercent < 1.5 ? '✓ Ultra Stable (<1.5%)' : 'Normal Dynamic'}
            </div>
          </div>

          {/* Card 3: Shimmer Perturbation */}
          <div className="bg-[#141414] p-3 rounded-lg border border-white/10 space-y-1">
            <div className="text-[10px] font-mono uppercase text-white/50">Shimmer (Amp Var)</div>
            <div className="text-base font-mono font-bold text-amber-400">{report.shimmerPercent}%</div>
            <div className="text-[10px] text-white/60 font-sans truncate">Breath Steadiness</div>
          </div>

          {/* Card 4: Harmonics to Noise (HNR) */}
          <div className="bg-[#141414] p-3 rounded-lg border border-white/10 space-y-1">
            <div className="text-[10px] font-mono uppercase text-white/50">Harmonics / Noise</div>
            <div className="text-base font-mono font-bold text-purple-400">{report.hnrDb} dB</div>
            <div className="text-[10px] text-purple-300 font-sans truncate">Vocal Clarity & Tone</div>
          </div>

          {/* Card 5: Speech Cadence */}
          <div className="bg-[#141414] p-3 rounded-lg border border-white/10 space-y-1">
            <div className="text-[10px] font-mono uppercase text-white/50">Cadence Pace</div>
            <div className="text-base font-mono font-bold text-white">{report.speechPacingWpm} WPM</div>
            <div className="text-[10px] text-white/60 font-sans truncate">Optimal: 120-150 WPM</div>
          </div>

          {/* Card 6: Vocal Formants */}
          <div className="bg-[#141414] p-3 rounded-lg border border-white/10 space-y-1">
            <div className="text-[10px] font-mono uppercase text-white/50">Formants F1 / F2</div>
            <div className="text-xs font-mono font-bold text-emerald-300">
              {report.formantF1Hz} / {report.formantF2Hz} Hz
            </div>
            <div className="text-[10px] text-white/60 font-sans truncate">Resonance Formants</div>
          </div>
        </div>

        {/* Vocal Persona Critique Banner */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-300 block">
                Acoustic Demeanor Evaluation:
              </span>
              <p className="text-xs text-zinc-200 font-sans mt-0.5">
                {report.spectralWarmthRating}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono uppercase text-white/50 block">Pause Count / Silence:</span>
            <span className="text-xs font-mono font-bold text-white">
              {report.pauseCount} pauses ({report.silenceHesitationRatioPercent}% hesitation)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
