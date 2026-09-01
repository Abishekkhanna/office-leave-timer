import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Clock, Sparkles, CheckCircle2, Apple, Smartphone, Zap } from 'lucide-react';
import { TimeTestPreset, WidgetState, PlatformMode } from '../types';

const TEST_PRESETS: TimeTestPreset[] = [
  { label: 'Prompt Example 1', startTimeStr: '9:00 AM', expectedLeaveTimeStr: '6:00 PM', hour: 9, minute: 0 },
  { label: 'Prompt Example 2', startTimeStr: '9:15 AM', expectedLeaveTimeStr: '6:15 PM', hour: 9, minute: 15 },
  { label: 'Prompt Example 3', startTimeStr: '9:42 AM', expectedLeaveTimeStr: '6:42 PM', hour: 9, minute: 42 },
  { label: 'Prompt Example 4', startTimeStr: '10:05 AM', expectedLeaveTimeStr: '7:05 PM', hour: 10, minute: 5 },
];

interface WidgetSimulatorProps {
  platform: PlatformMode;
  onPlatformChange?: (platform: PlatformMode) => void;
}

export const WidgetSimulator: React.FC<WidgetSimulatorProps> = ({ platform, onPlatformChange }) => {
  const [widgetState, setWidgetState] = useState<WidgetState>(() => {
    try {
      const saved = localStorage.getItem('office_leave_widget_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return { isActive: false, startTime: null, leaveTime: null };
  });

  const [simulatedCurrentTime, setSimulatedCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSimulatedCurrentTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = (customDate?: Date) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(20); } catch { /* ignore */ }
    }
    const start = customDate || new Date();
    const leave = new Date(start.getTime() + 9 * 60 * 60 * 1000);
    const newState: WidgetState = {
      isActive: true,
      startTime: start.getTime(),
      leaveTime: leave.getTime(),
    };
    setWidgetState(newState);
    localStorage.setItem('office_leave_widget_state', JSON.stringify(newState));
  };

  const handleReset = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([10, 30, 10]); } catch { /* ignore */ }
    }
    const newState: WidgetState = {
      isActive: false,
      startTime: null,
      leaveTime: null,
    };
    setWidgetState(newState);
    localStorage.removeItem('office_leave_widget_state');
  };

  const handlePresetClick = (preset: TimeTestPreset) => {
    const date = new Date();
    date.setHours(preset.hour, preset.minute, 0, 0);
    handleStart(date);
  };

  const formatTimeParts = (millis: number | null) => {
    if (!millis) return { time: '', period: '' };
    const d = new Date(millis);
    const formatted = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const parts = formatted.split(' ');
    return { time: parts[0] || formatted, period: parts[1] || '' };
  };

  const timeDisplay = formatTimeParts(widgetState.leaveTime);

  return (
    <div id="widget-simulator-section" className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e]" />
            <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white">
              {platform === 'ios' ? 'Apple iOS WidgetKit Simulator' : 'Android 15 AppWidget Simulator'}
            </h2>
          </div>
          <p className="text-xs text-white/40 mt-1">
            {platform === 'ios'
              ? 'Interactive simulation of native iOS 17/18+ WidgetKit AppIntent button behavior on iPhone.'
              : 'Interactive simulation of native Android 15 & Realme UI RemoteViews widget behavior.'}
          </p>
        </div>

        {/* Device Switcher & Time */}
        <div className="flex items-center gap-3">
          {onPlatformChange && (
            <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                id="toggle-ios-btn"
                onClick={() => onPlatformChange('ios')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  platform === 'ios'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iOS (iPhone)</span>
              </button>
              <button
                id="toggle-android-btn"
                onClick={() => onPlatformChange('android')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  platform === 'android'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android 15</span>
              </button>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono text-white/60">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Time: {simulatedCurrentTime || '--:--'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Phone Visualization */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-[320px]">
            {/* Phone Chassis */}
            <div className="relative w-full h-[590px] bg-[#0c0c0d] rounded-[52px] border-[7px] border-[#222225] shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col p-4 select-none">
              
              {/* iOS Dynamic Island vs Android Punch-Hole */}
              {platform === 'ios' ? (
                <div className="w-full flex justify-between items-center px-4 mt-0.5">
                  <span className="text-[11px] font-semibold text-white tracking-tight">
                    {simulatedCurrentTime ? simulatedCurrentTime.replace(/:\d\d\s/, ' ') : '9:15 AM'}
                  </span>
                  {/* Dynamic Island */}
                  <div className="w-24 h-6 bg-black rounded-full flex items-center justify-between px-2 shadow-inner border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-[#1c1c1e]"></div>
                  </div>
                  <div className="flex gap-1.5 items-center text-[10px] text-white/70">
                    <span>5G</span>
                    <div className="w-4 h-2 border border-white/60 rounded-xs flex items-center p-0.5">
                      <div className="w-full h-full bg-white rounded-2xs"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-6 w-full flex justify-between items-center px-4 mt-1">
                  <span className="text-[10px] font-medium text-white/60">
                    {simulatedCurrentTime ? simulatedCurrentTime.replace(/:\d\d\s/, ' ') : '9:15 AM'}
                  </span>
                  {/* Android Punch Hole */}
                  <div className="w-3 h-3 bg-black rounded-full border border-white/10"></div>
                  <div className="flex gap-1.5 items-center">
                    <span className="text-[9px] text-white/40 font-mono">5G</span>
                    <div className="w-3 h-2 border border-white/30 rounded-sm"></div>
                  </div>
                </div>
              )}

              {/* Home Screen Search Bar */}
              <div className="w-full h-8 bg-white/5 border border-white/5 rounded-full my-3 flex items-center px-3 gap-2">
                <div className="w-2.5 h-2.5 bg-white/10 rounded-full"></div>
                <div className="w-16 h-1.5 bg-white/5 rounded-full"></div>
              </div>

              {/* THE WIDGET */}
              <div
                id="native-home-screen-widget"
                className={`w-full ${
                  platform === 'ios'
                    ? 'bg-[#1c1c1e]/95 backdrop-blur-xl border border-white/15 rounded-[30px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
                    : 'bg-[#1e1e22]/95 backdrop-blur-md border border-white/10 rounded-[28px] p-5 shadow-2xl'
                } relative overflow-hidden text-left transition-all`}
              >
                {/* Accent top subtle glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

                <div className="flex flex-col gap-3">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {platform === 'ios' ? (
                        <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
                          <Zap className="w-2.5 h-2.5 fill-current" />
                        </div>
                      ) : null}
                      <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">
                        Office Leave
                      </span>
                    </div>
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        widgetState.isActive
                          ? 'bg-green-500 shadow-[0_0_8px_#22c55e]'
                          : 'bg-white/20'
                      }`}
                    ></div>
                  </div>

                  {/* Widget Body State Display */}
                  <div className="min-h-[76px] flex flex-col justify-center py-1">
                    {!widgetState.isActive ? (
                      <div className="py-2">
                        <div className="text-[12px] text-white/40 font-medium mb-1">Status</div>
                        <div className="text-[26px] leading-tight font-light tracking-tight text-white/70">
                          Tap START
                        </div>
                      </div>
                    ) : (
                      <div className="py-0.5 animate-fadeIn">
                        <div className="text-[12px] text-white/40 font-medium mb-0.5">Leave at</div>
                        <div className="text-[44px] leading-tight font-light tracking-tighter text-white flex items-baseline gap-1">
                          {timeDisplay.time}
                          {timeDisplay.period && (
                            <span className="text-xl text-white/30 font-normal ml-0.5">
                              {timeDisplay.period}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Widget Direct Action Buttons */}
                  <div className="flex gap-2 mt-1">
                    <button
                      id="widget-btn-start"
                      onClick={() => handleStart()}
                      className="flex-1 bg-white/10 hover:bg-white/15 active:scale-95 border border-white/10 py-3 rounded-2xl text-[11px] font-bold tracking-widest text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      START
                    </button>

                    <button
                      id="widget-btn-reset"
                      onClick={handleReset}
                      className="flex-1 bg-white/5 hover:bg-white/10 hover:text-white active:scale-95 border border-white/5 py-3 rounded-2xl text-[11px] font-bold tracking-widest text-white/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      RESET
                    </button>
                  </div>
                </div>
              </div>

              {/* Ghost app icons grid */}
              <div className="grid grid-cols-4 gap-3 mt-6 opacity-10 px-1">
                <div className="aspect-square bg-white rounded-2xl"></div>
                <div className="aspect-square bg-white rounded-2xl"></div>
                <div className="aspect-square bg-white rounded-2xl"></div>
                <div className="aspect-square bg-white rounded-2xl"></div>
              </div>

              {/* Ghost Dock */}
              <div className="mt-auto flex justify-between px-2 pb-2 opacity-20">
                <div className="w-10 h-10 bg-white rounded-2xl"></div>
                <div className="w-10 h-10 bg-white rounded-2xl"></div>
                <div className="w-10 h-10 bg-white rounded-2xl"></div>
                <div className="w-10 h-10 bg-white rounded-2xl"></div>
              </div>

              {/* iOS Home Bar indicator */}
              <div className="w-24 h-1 bg-white/30 rounded-full self-center mb-1"></div>
            </div>
          </div>
        </div>

        {/* Test Matrix & Rules */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#131316] border border-white/5 p-6 rounded-3xl space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Prompt Calculation Verification Matrix
              </h3>
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Exact Formula</span>
            </div>
            
            <p className="text-xs text-white/50 leading-relaxed">
              Test each example given in the requirements by clicking below to simulate direct local timestamp inputs:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {TEST_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  id={`preset-btn-${idx}`}
                  onClick={() => handlePresetClick(preset)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-blue-500/40 border border-white/5 text-left transition-all group cursor-pointer"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-medium">{preset.label}</div>
                    <div className="text-xs font-semibold text-white mt-0.5">
                      {preset.startTimeStr} <span className="text-blue-400 font-normal">→</span> {preset.expectedLeaveTimeStr}
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 font-mono font-bold group-hover:bg-blue-500/20">
                    +9h
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#131316] border border-white/5 p-6 rounded-3xl space-y-3 text-xs text-white/60">
            <div className="font-semibold text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              {platform === 'ios' ? 'iOS WidgetKit Execution Guarantees:' : 'Android AppWidget Execution Guarantees:'}
            </div>
            <ul className="space-y-2 text-white/50 list-disc list-inside leading-relaxed">
              <li><strong className="text-white/80">START Action:</strong> Saves timestamp to local storage (UserDefaults on iOS / SharedPreferences on Android), adds exactly 9 hours, and refreshes the widget.</li>
              <li><strong className="text-white/80">Precision Display:</strong> Shows calculated departure time (e.g. &quot;6:42 PM&quot;) without opening extra tabs.</li>
              <li><strong className="text-white/80">RESET Action:</strong> Clears saved timestamp and returns display to &quot;Tap START&quot;.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

