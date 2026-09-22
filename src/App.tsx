import React, { useState } from 'react';
import { Clock, Shield, Smartphone, CheckCircle, Apple, Bell, Sparkles, Terminal, Layers } from 'lucide-react';
import { WidgetSimulator } from './components/WidgetSimulator';
import { ApkDownloadCard } from './components/ApkDownloadCard';
import { IosGuideCard } from './components/IosGuideCard';
import { InstallationGuide } from './components/InstallationGuide';
import { CodeInspector } from './components/CodeInspector';
import { TerminalSoulSimulator } from './components/TerminalSoulSimulator';
import { TerminalSoulApkCard } from './components/TerminalSoulApkCard';
import { MessageExplorer } from './components/MessageExplorer';
import { ActiveAppTab, PlatformMode } from './types';

export default function App() {
  const [activeApp, setActiveApp] = useState<ActiveAppTab>('terminalsoul');
  const [platform, setPlatform] = useState<PlatformMode>('android');

  return (
    <div className="min-h-screen bg-[#070708] text-white antialiased selection:bg-blue-500 selection:text-white font-sans">
      {/* Top Navigation / App Header */}
      <header className="border-b border-white/10 bg-[#0c0c0e]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-bold shadow-lg shadow-black/40 border transition-all ${
              activeApp === 'terminalsoul'
                ? 'bg-indigo-950/60 border-indigo-500/30 text-indigo-400'
                : 'bg-blue-950/60 border-blue-500/30 text-blue-400'
            }`}>
              {activeApp === 'terminalsoul' ? '>_' : <Clock className="w-5 h-5" />}
            </div>
            <div>
              <h1 className="font-medium text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                {activeApp === 'terminalsoul' ? 'TerminalSoul' : 'Office Leave Timer V1'}
                <span className={`text-[10px] uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full font-bold border ${
                  activeApp === 'terminalsoul'
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {activeApp === 'terminalsoul' ? 'NEW APP • MULTI-SCHEDULE' : (platform === 'android' ? 'Android 15 V1' : 'iOS Widget')}
                </span>
              </h1>
              <p className="text-xs text-white/40">
                {activeApp === 'terminalsoul'
                  ? 'Configurable daily full-screen developer soul popups'
                  : 'Exact 9-hour workday calculator & full-screen leave alert'}
              </p>
            </div>
          </div>

          {/* Primary Top App Switcher */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              id="tab-terminalsoul"
              onClick={() => setActiveApp('terminalsoul')}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeApp === 'terminalsoul'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <span>TerminalSoul</span>
              <span className="hidden sm:inline text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-bold">NEW</span>
            </button>

            <button
              id="tab-officeleave"
              onClick={() => setActiveApp('officeleave')}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeApp === 'officeleave'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Office Leave V1</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {activeApp === 'terminalsoul' ? (
          <>
            {/* TerminalSoul Hero Section */}
            <section className="bg-[#0b0e16] border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>

              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>TerminalSoul — Standalone Native Android App</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight font-mono">
                  Scheduled Developer Soul Popups
                </h2>
                <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-2xl font-sans">
                  Configure multiple daily notification times directly inside the app (e.g. <strong className="text-white font-mono">09:00 AM</strong>, <strong className="text-white font-mono">01:00 PM</strong>, <strong className="text-white font-mono">06:00 PM</strong>, <strong className="text-white font-mono">09:30 PM</strong>). At each configured time, a dark elegant full-screen terminal alert pops up with a unique, hilarious developer-themed punchline and an instant <strong className="text-white font-mono">[ CLOSE ]</strong> button.
                </p>
              </div>

              {/* Quick specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/5 text-xs font-mono">
                <div className="p-4 bg-[#121622] rounded-2xl border border-white/5">
                  <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">Multiple Times</div>
                  <div className="font-bold text-white text-base mt-1 tracking-tight">Add / Edit / Toggle</div>
                </div>
                <div className="p-4 bg-[#121622] rounded-2xl border border-white/5">
                  <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">Corpus Quality</div>
                  <div className="font-bold text-indigo-400 text-base mt-1 tracking-tight flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> 505 Unique Jokes
                  </div>
                </div>
                <div className="p-4 bg-[#121622] rounded-2xl border border-white/5">
                  <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">Zero Overlap</div>
                  <div className="font-bold text-emerald-400 text-base mt-1 tracking-tight">100% Distinct from V1</div>
                </div>
                <div className="p-4 bg-[#121622] rounded-2xl border border-white/5">
                  <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">Full-Screen</div>
                  <div className="font-bold text-amber-400 text-base mt-1 tracking-tight flex items-center gap-1.5">
                    <Bell className="w-4 h-4" /> Screen ON &amp; OFF
                  </div>
                </div>
              </div>
            </section>

            {/* 1. TerminalSoul Interactive Phone Simulator */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-indigo-400" />
                    <span>Live Interactive TerminalSoul App</span>
                  </h3>
                  <p className="text-xs text-white/50">
                    Add, edit, or toggle daily alarm times. Test the full-screen terminal alert in 5 seconds.
                  </p>
                </div>
              </div>
              <TerminalSoulSimulator />
            </section>

            {/* 2. TerminalSoul APK Download Card */}
            <TerminalSoulApkCard />

            {/* 3. 505 Message Corpus Explorer */}
            <MessageExplorer />
          </>
        ) : (
          <>
            {/* Preserved Office Leave Timer V1 */}
            <section className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>
                    {platform === 'android'
                      ? 'Office Leave Timer V1 — Android 15 & Realme 11 5G'
                      : 'iOS 16 / 17 / 18+ Home Screen Widget'}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 self-start">
                  <button
                    onClick={() => setPlatform('android')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer ${
                      platform === 'android' ? 'bg-blue-600 text-white' : 'text-white/50'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Android 15</span>
                  </button>
                  <button
                    onClick={() => setPlatform('ios')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer ${
                      platform === 'ios' ? 'bg-blue-600 text-white' : 'text-white/50'
                    }`}
                  >
                    <Apple className="w-3.5 h-3.5" />
                    <span>iOS Widget</span>
                  </button>
                </div>
              </div>

              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
                {platform === 'android'
                  ? 'Office Leave Timer V1 with Full-Screen Alert'
                  : 'Instant 9-Hour Departure Time on your iPhone'}
              </h2>
              <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-2xl mt-4">
                Tap <strong className="text-white font-medium">START</strong> upon arrival. The widget calculates an exact 9-hour shift offset (e.g. 9:42 AM &rarr; 6:42 PM). At the 9-hour mark, a full-screen developer alert pops up with one of 365 daily jokes and a 1-tap CLOSE button. Tap <strong className="text-white font-medium">RESET</strong> at any time to clear.
              </p>

              {/* Quick specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/5 text-xs">
                <div className="p-4 bg-[#131316] rounded-2xl border border-white/5">
                  <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">Calculation</div>
                  <div className="font-light text-white text-base mt-1 tracking-tight">Start + 9 Hours</div>
                </div>
                <div className="p-4 bg-[#131316] rounded-2xl border border-white/5">
                  <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">New in V1</div>
                  <div className="font-medium text-amber-400 text-base mt-1 tracking-tight flex items-center gap-1.5">
                    <Bell className="w-4 h-4" /> Full-Screen Alert
                  </div>
                </div>
                <div className="p-4 bg-[#131316] rounded-2xl border border-white/5">
                  <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">Offline Content</div>
                  <div className="font-medium text-blue-400 text-base mt-1 tracking-tight flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> 365 Daily Jokes
                  </div>
                </div>
                <div className="p-4 bg-[#131316] rounded-2xl border border-white/5">
                  <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">Operation</div>
                  <div className="font-medium text-emerald-400 text-base mt-1 tracking-tight">100% Offline &amp; Local</div>
                </div>
              </div>
            </section>

            {/* 1. Live Interactive Widget Simulator (iOS & Android) */}
            <WidgetSimulator platform={platform} onPlatformChange={setPlatform} />

            {/* 2. Platform Specific Installation / Download Card */}
            {platform === 'ios' ? (
              <IosGuideCard />
            ) : (
              <>
                <ApkDownloadCard />
                <InstallationGuide />
              </>
            )}

            {/* 3. Native Code Inspector & Technical Verification (Swift & Java) */}
            <CodeInspector />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070708] py-8 text-center text-xs text-white/40">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="text-white/70 font-medium">TerminalSoul &amp; Office Leave Timer V1 • 100% Offline Android &amp; iOS</span>
          </div>
          <div className="text-white/40 font-mono">
            Target SDK 35 (Android 15) • Exact Alarms • Full-Screen Intent • Zero Overlap
          </div>
        </div>
      </footer>
    </div>
  );
}
