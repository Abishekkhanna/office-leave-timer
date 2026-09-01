import React, { useState } from 'react';
import { Clock, Shield, Sparkles, Smartphone, CheckCircle, Apple } from 'lucide-react';
import { WidgetSimulator } from './components/WidgetSimulator';
import { ApkDownloadCard } from './components/ApkDownloadCard';
import { IosGuideCard } from './components/IosGuideCard';
import { InstallationGuide } from './components/InstallationGuide';
import { CodeInspector } from './components/CodeInspector';
import { PlatformMode } from './types';

export default function App() {
  const [platform, setPlatform] = useState<PlatformMode>('ios');

  return (
    <div className="min-h-screen bg-[#070708] text-white antialiased selection:bg-blue-500 selection:text-white font-sans">
      {/* Top Navigation / App Header */}
      <header className="border-b border-white/10 bg-[#0c0c0e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-lg shadow-black/40">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-medium text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                Office Leave
                <span className="text-[10px] uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                  {platform === 'ios' ? 'iOS Widget' : 'Android APK'}
                </span>
              </h1>
              <p className="text-xs text-white/40">Instant 9-hour office departure calculator</p>
            </div>
          </div>

          {/* Platform selector buttons */}
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              id="header-tab-ios"
              onClick={() => setPlatform('ios')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                platform === 'ios'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>Apple iOS</span>
            </button>
            <button
              id="header-tab-android"
              onClick={() => setPlatform('android')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                platform === 'android'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android 15</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Value Proposition Hero Summary */}
        <section className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
          
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em]">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>
                {platform === 'ios'
                  ? 'iOS 16 / 17 / 18+ Home Screen Widget'
                  : 'Android 15 & Realme UI Home Widget'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
              {platform === 'ios'
                ? 'Instant 9-Hour Departure Time on your iPhone'
                : 'Instant Office Departure Time on Your Android Screen'}
            </h2>
            <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-2xl">
              Tap <strong className="text-white font-medium">START</strong> upon arrival. The widget calculates an exact 9-hour shift offset (e.g. 9:42 AM &rarr; 6:42 PM) and displays your leaving time right on your mobile screen. Tap <strong className="text-white font-medium">RESET</strong> to clear.
            </p>
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/5 text-xs">
            <div className="p-4 bg-[#131316] rounded-2xl border border-white/5">
              <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">Calculation</div>
              <div className="font-light text-white text-base mt-1 tracking-tight">Start + 9 Hours</div>
            </div>
            <div className="p-4 bg-[#131316] rounded-2xl border border-white/5">
              <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">Target Platform</div>
              <div className="font-light text-white text-base mt-1 tracking-tight">
                {platform === 'ios' ? 'iOS (iPhone 16/15/14+)' : 'Android 15 & Realme UI'}
              </div>
            </div>
            <div className="p-4 bg-[#131316] rounded-2xl border border-white/5">
              <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">Storage</div>
              <div className="font-light text-white text-base mt-1 tracking-tight">
                {platform === 'ios' ? 'UserDefaults / Local' : 'SharedPreferences'}
              </div>
            </div>
            <div className="p-4 bg-[#131316] rounded-2xl border border-white/5">
              <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">Operation</div>
              <div className="font-medium text-emerald-400 text-base mt-1 tracking-tight">100% Offline &amp; Instant</div>
            </div>
          </div>
        </section>

        {/* 1. Live Interactive Widget Simulator (iOS & Android) */}
        <WidgetSimulator platform={platform} onPlatformChange={setPlatform} />

        {/* 2. Platform Specific Installation / Download Card */}
        {platform === 'ios' ? (
          <>
            <IosGuideCard />
            <div className="flex justify-center">
              <button
                onClick={() => setPlatform('android')}
                className="text-xs text-white/50 hover:text-white flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span>Switch to Android 15 &amp; Realme APK download &rarr;</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <ApkDownloadCard />
            <InstallationGuide />
            <div className="flex justify-center">
              <button
                onClick={() => setPlatform('ios')}
                className="text-xs text-white/50 hover:text-white flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all cursor-pointer"
              >
                <Apple className="w-3.5 h-3.5 text-blue-400" />
                <span>Switch to iPhone &amp; iOS 1-tap installation guide &rarr;</span>
              </button>
            </div>
          </>
        )}

        {/* 3. Native Code Inspector & Technical Verification (Swift & Java) */}
        <CodeInspector />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070708] py-8 text-center text-xs text-white/40">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-white/70 font-medium">Office Leave • iOS &amp; Android micro-utility</span>
          </div>
          <div className="text-white/40">
            Apple iOS 16 / 17 / 18+ &amp; Android 15 / Realme 11 5G • 100% Offline
          </div>
        </div>
      </footer>
    </div>
  );
}
