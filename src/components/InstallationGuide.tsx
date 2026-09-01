import React from 'react';
import { Smartphone, PlusCircle, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';

export const InstallationGuide: React.FC = () => {
  return (
    <div id="installation-guide-section" className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="flex items-center gap-3.5 mb-8 pb-5 border-b border-white/5">
        <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white">
            Android 15 &amp; Realme Installation Guide
          </h2>
          <p className="text-xs text-white/40 mt-0.5">
            How to install the APK on Android 15 / Realme UI and place the native interactive AppWidget on your home screen.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1 */}
        <div className="bg-[#131316] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Step 1: Install</span>
            </div>
            <h3 className="text-sm font-semibold text-white">Install on Realme / Android</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Download <strong className="text-white/80 font-mono">OfficeLeaveTimer.apk</strong>. Tap on the file and select <em>Install</em>. If prompted by Realme UI, toggle <em>&quot;Allow from this source&quot;</em>.
            </p>
          </div>
          <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Clean &amp; zero runtime permissions</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#131316] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Step 2: Add Widget</span>
            </div>
            <h3 className="text-sm font-semibold text-white">Add to Home Screen</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              On your home screen, <strong>long-press empty space</strong> (or pinch with two fingers). Tap <strong>&quot;Widgets&quot;</strong>, search <strong>&quot;Office Leave&quot;</strong>, and drag the widget onto your screen.
            </p>
          </div>
          <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center gap-2 text-[11px] text-blue-400 font-medium">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>2x2 resizable native widget</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#131316] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Step 3: Daily Use</span>
            </div>
            <h3 className="text-sm font-semibold text-white">One-Tap Daily Calculation</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              When arriving at the office, tap <strong>START</strong> directly on the home screen widget. It calculates your 9-hour leaving time instantly. Tap <strong>RESET</strong> when leaving.
            </p>
          </div>
          <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center gap-2 text-[11px] text-amber-400 font-medium">
            <Cpu className="w-3.5 h-3.5" />
            <span>Direct RemoteViews interaction</span>
          </div>
        </div>
      </div>

      {/* Android 15 & Realme 11 5G note */}
      <div className="mt-6 p-4 rounded-2xl bg-[#131316] border border-white/5 flex items-start gap-3.5">
        <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-white/50 leading-relaxed">
          <strong className="text-white/80">Android 15 &amp; Realme Compatibility:</strong> Built and signed with Target SDK 35 (Android 15) and APK Signature Scheme v2/v3. If Android 15 Package Installer shows <em>&quot;Unsafe app blocked&quot;</em> (Play Protect warning for sideloaded test APKs), tap <strong>&quot;More details&quot;</strong> &rarr; <strong>&quot;Install anyway&quot;</strong>.
        </div>
      </div>
    </div>
  );
};
