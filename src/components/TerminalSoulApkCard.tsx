import React, { useState } from 'react';
import { Download, CheckCircle, Smartphone, ShieldCheck, Terminal, Copy, Check } from 'lucide-react';

export function TerminalSoulApkCard() {
  const [copied, setCopied] = useState(false);

  const adbCommand = 'adb install -r TerminalSoul.apk';

  const handleCopy = () => {
    navigator.clipboard.writeText(adbCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0c0f17] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono text-xl font-bold shadow-lg shadow-black">
            &gt;_
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
                TerminalSoul.apk
              </h3>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.0.0 Ready
              </span>
            </div>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Package: <code className="text-indigo-300">com.terminalsoul.app</code> • Android 15 &amp; Realme 11 5G
            </p>
          </div>
        </div>

        <a
          href="/TerminalSoul.apk"
          download="TerminalSoul.apk"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-xl shadow-blue-600/30 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download APK</span>
        </a>
      </div>

      {/* Specifications list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <div className="text-white/40 text-[10px] uppercase">Message Corpus</div>
          <div className="text-white font-bold text-sm">505 Unique Jokes</div>
          <div className="text-[10px] text-emerald-400">0 Overlap with Leave V1</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <div className="text-white/40 text-[10px] uppercase">Alarm Architecture</div>
          <div className="text-white font-bold text-sm">Multi-AlarmClock</div>
          <div className="text-[10px] text-blue-400">Independent PendingIntents</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <div className="text-white/40 text-[10px] uppercase">Screen Trigger</div>
          <div className="text-white font-bold text-sm">ON &amp; OFF Guaranteed</div>
          <div className="text-[10px] text-purple-400">WakeLock + System Overlay</div>
        </div>
      </div>

      {/* Quick ADB install snippet */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-white/50">
          <span>Install directly over USB (ADB):</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="bg-[#0b0e14] p-3 rounded-xl border border-white/5 font-mono text-xs text-emerald-400 flex items-center justify-between overflow-x-auto">
          <code>{adbCommand}</code>
        </div>
      </div>
    </div>
  );
}
