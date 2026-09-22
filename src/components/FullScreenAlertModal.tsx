import React from 'react';
import { X, Terminal, Clock, CheckCircle2 } from 'lucide-react';
import { LeaveMessage } from '../types';

interface FullScreenAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: LeaveMessage | null;
  dateSeedStr: string;
}

export const FullScreenAlertModal: React.FC<FullScreenAlertModalProps> = ({
  isOpen,
  onClose,
  message,
  dateSeedStr,
}) => {
  if (!isOpen || !message) return null;

  return (
    <div
      id="fullscreen-leave-alert-container"
      className="fixed inset-0 z-[9999] bg-[#070709] flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200 selection:bg-blue-600 selection:text-white"
    >
      {/* Top Terminal Bar */}
      <div className="w-full max-w-2xl mx-auto bg-[#121217] border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="font-mono text-xs text-white/40 ml-2">
            abishek@workstation:~/shift-v1
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            EXIT_CODE: 0
          </span>
          <button
            onClick={onClose}
            aria-label="Close alert"
            className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Alert Body */}
      <div className="w-full max-w-2xl mx-auto my-auto py-8 text-center space-y-6">
        {/* HTTP Status Code & Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
            <Terminal className="w-3.5 h-3.5" />
            <span>ALARM TRIGGERED • 9-HOUR SHIFT TERMINATED</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-amber-400 font-mono">
            🚨 HTTP 200
          </h1>
          <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-white">
            WORKDAY COMPLETED
          </h2>
        </div>

        {/* Big Developer Joke / Leave Message */}
        <div className="bg-[#101015] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/40 via-blue-500/40 to-emerald-500/40"></div>
          <div className="font-mono text-xs text-white/30 text-left mb-4 flex items-center justify-between">
            <span>MESSAGE ID: #{message.id} / 365</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED 100% OFFLINE
            </span>
          </div>

          <p className="text-lg sm:text-2xl text-white font-normal leading-relaxed tracking-normal font-sans">
            {message.message}
          </p>

          {/* Diagnostic pills */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-white/50">
            <span className="px-3 py-1 bg-white/5 rounded-xl border border-white/5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>UPTIME: 9h 00m</span>
            </span>
            <span className="px-3 py-1 bg-white/5 rounded-xl border border-white/5">
              SEED: {dateSeedStr}
            </span>
            <span className="px-3 py-1 bg-white/5 rounded-xl border border-white/5">
              TARGET: Android 15 (Realme 11 5G)
            </span>
          </div>
        </div>

        <p className="text-xs text-white/40 font-mono">
          Dismissing this alert will safely return you to your phone without reopening any apps.
        </p>
      </div>

      {/* Bottom Prominent CLOSE Button */}
      <div className="w-full max-w-2xl mx-auto pb-4">
        <button
          id="btn-alert-close-fullscreen"
          onClick={onClose}
          className="w-full h-14 sm:h-16 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-base sm:text-lg tracking-wider rounded-2xl shadow-xl shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>CLOSE</span>
        </button>
      </div>
    </div>
  );
};
