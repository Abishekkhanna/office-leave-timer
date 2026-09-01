import React, { useState } from 'react';
import { Apple, PlusCircle, Share2, Smartphone, Zap, Download, CheckCircle2, Copy, Check } from 'lucide-react';

export const IosGuideCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="ios-guide-card" className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em]">
            <Apple className="w-3.5 h-3.5" />
            <span>Apple iOS 16 / 17 / 18+ Home Screen</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            Add 1-Tap Office Leave Widget to iPhone
          </h2>
          <p className="text-sm text-white/50 max-w-xl leading-relaxed">
            iPhone (iOS) does not use .apk files. You can install the instant standalone 1-tap Home Screen widget directly via Safari or use Apple Shortcuts / native SwiftUI WidgetKit.
          </p>
        </div>

        <button
          id="copy-iphone-url-btn"
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2.5 px-6 py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white" />
              <span>Copy Link for iPhone Safari</span>
            </>
          )}
        </button>
      </div>

      {/* 3 Step Install Guide for iOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        {/* Step 1 */}
        <div className="bg-[#131316] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Step 1: Open Safari</span>
            </div>
            <h3 className="text-sm font-semibold text-white">Open in iPhone Safari</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Open this link on your iPhone using <strong>Safari</strong> (Apple requires Safari for Home Screen widgets/apps).
            </p>
          </div>
          <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero install / No App Store required</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#131316] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Step 2: Tap Share</span>
            </div>
            <h3 className="text-sm font-semibold text-white">Tap Share &rarr; Add to Home</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Tap the <strong>Share button</strong> (the square with an up arrow at the bottom), scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.
            </p>
          </div>
          <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center gap-2 text-[11px] text-blue-400 font-medium">
            <Share2 className="w-3.5 h-3.5" />
            <span>Places 1-tap widget icon on Home</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#131316] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Step 3: 1-Tap Daily</span>
            </div>
            <h3 className="text-sm font-semibold text-white">Tap &amp; Calculate</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Tap the icon on your iPhone Home Screen. Tap <strong>START</strong> when entering office — your 9h leave time calculates instantly with haptic feedback.
            </p>
          </div>
          <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center gap-2 text-[11px] text-amber-400 font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>Standalone full-screen &amp; offline</span>
          </div>
        </div>
      </div>

      {/* Alternative Options: Apple Shortcuts */}
      <div className="mt-6 p-5 rounded-2xl bg-[#131316] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-white flex items-center gap-2">
            <Apple className="w-4 h-4 text-blue-400" />
            <span>Alternative: Apple Shortcuts App (Interactive iOS Widget &amp; Action Button)</span>
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            You can also create a 1-tap shortcut in the Apple Shortcuts app: <em>Current Date &rarr; Adjust Date (+9 Hours) &rarr; Show Notification</em> and place it directly on your iOS Lock Screen or Action Button.
          </p>
        </div>
      </div>
    </div>
  );
};
