import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RefreshCw, Sparkles, Radio, Award, ShieldCheck } from 'lucide-react';

export const EXECUTIVE_VOICE_LINE = "Are you tired of the grind? Fire, hire, then fire again? Then let us hire your standards.";

export function AudioVoiceBanner() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rate, setRate] = useState(0.95);
  const [pitch, setPitch] = useState(1.0);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        // Prefer an English voice with natural / executive tone
        const prefVoice = availableVoices.find(
          (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen') || v.name.includes('Alex'))
        ) || availableVoices.find((v) => v.lang.startsWith('en')) || availableVoices[0];
        
        if (prefVoice) {
          setSelectedVoice(prefVoice.name);
        }
      };

      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playVoiceMessage = () => {
    if (!speechSupported) return;

    window.speechSynthesis.cancel();

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(EXECUTIVE_VOICE_LINE);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = isMuted ? 0 : 1;

    if (selectedVoice && voices.length > 0) {
      const chosen = voices.find((v) => v.name === selectedVoice);
      if (chosen) utterance.voice = chosen;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setHasPlayedOnce(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (err) => {
      console.warn('Speech synthesis notice:', err);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopVoiceMessage = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isPlaying && utteranceRef.current) {
      // Re-trigger speech with updated mute state
      stopVoiceMessage();
      setTimeout(playVoiceMessage, 100);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-[#121212] to-[#0D1520] border border-amber-500/40 p-4 sm:p-5 my-4 relative overflow-hidden shadow-2xl rounded-sm">
      {/* Background visual glow effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
        
        {/* Left Section: Audio Controls & Main Quote */}
        <div className="flex items-start gap-4 max-w-3xl">
          {/* Big Interactive Audio Button */}
          <button
            id="btn-play-executive-audio"
            type="button"
            onClick={isPlaying ? stopVoiceMessage : playVoiceMessage}
            className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all duration-300 shadow-xl ${
              isPlaying
                ? 'bg-amber-400 text-black ring-4 ring-amber-400/30 scale-105'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 hover:scale-105'
            }`}
            title={isPlaying ? 'Pause Audio' : 'Play Audio Message'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current animate-pulse" />
            ) : (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            )}
          </button>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono px-2.5 py-0.5 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Radio className={`w-3 h-3 ${isPlaying ? 'text-amber-400 animate-ping' : 'text-amber-400'}`} />
                <span>{isPlaying ? 'Executive Voice Playing' : 'Executive Audio Motto'}</span>
              </span>

              {isPlaying && (
                <div className="flex items-center gap-1 h-3 px-2">
                  <span className="w-1 bg-amber-400 h-2 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 bg-amber-400 h-3 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 bg-amber-400 h-1 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-1 bg-amber-400 h-3 animate-bounce" style={{ animationDelay: '100ms' }} />
                </div>
              )}
            </div>

            {/* Main Motto Sentence requested by user */}
            <h2 className="font-serif italic text-lg sm:text-xl md:text-2xl text-white font-medium leading-snug">
              "{EXECUTIVE_VOICE_LINE}"
            </h2>

            {/* T.H.I.S. System Highlight */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-white/70">
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 border border-white/10">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-amber-300 font-bold">T.H.I.S. System:</span>
                <span className="text-white font-sans">Train, Hire, Impress, Sustain</span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Score all testing to the truest grade.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Audio Voice Fine-Tuning & Mute Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 self-stretch lg:self-auto border-t lg:border-t-0 border-white/10 pt-3 lg:pt-0">
          <div className="bg-[#0A0A0A] border border-white/10 p-2.5 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/50 text-[10px] uppercase">Audio Controls</span>
              <button
                type="button"
                onClick={toggleMute}
                className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                <span className="text-[10px] uppercase">{isMuted ? 'Muted' : 'Sound On'}</span>
              </button>
            </div>

            {voices.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 uppercase">Voice:</span>
                <select
                  value={selectedVoice}
                  onChange={(e) => {
                    setSelectedVoice(e.target.value);
                    if (isPlaying) {
                      stopVoiceMessage();
                      setTimeout(playVoiceMessage, 100);
                    }
                  }}
                  className="bg-[#141414] text-white border border-white/20 text-[11px] px-2 py-0.5 focus:border-amber-400 focus:outline-none max-w-[180px] truncate"
                >
                  {voices.filter((v) => v.lang.startsWith('en')).slice(0, 8).map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.replace('Google', '').replace('Microsoft', '')}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={playVoiceMessage}
            className="bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs uppercase tracking-wider px-4 py-3 flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Replay Motto</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Listen Audio Motto</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
