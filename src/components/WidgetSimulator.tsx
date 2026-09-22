import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Clock, Sparkles, CheckCircle2, Apple, Smartphone, Zap, Bell, Shuffle, ChevronLeft, ChevronRight, Eye, Sliders, Timer } from 'lucide-react';
import { TimeTestPreset, WidgetState, PlatformMode, LeaveMessage } from '../types';
import { FullScreenAlertModal } from './FullScreenAlertModal';
import { getAllLeaveMessages, getLeaveMessageForDate, getTodayDateString } from '../data/messageProvider';

const BASE_PRESETS = [
  { label: 'Prompt Example 1', hour: 9, minute: 0, startTimeStr: '9:00 AM' },
  { label: 'Prompt Example 2', hour: 9, minute: 15, startTimeStr: '9:15 AM' },
  { label: 'Prompt Example 3', hour: 9, minute: 42, startTimeStr: '9:42 AM' },
  { label: 'Prompt Example 4', hour: 10, minute: 5, startTimeStr: '10:05 AM' },
];

interface WidgetSimulatorProps {
  platform: PlatformMode;
  onPlatformChange?: (platform: PlatformMode) => void;
}

export const WidgetSimulator: React.FC<WidgetSimulatorProps> = ({ platform, onPlatformChange }) => {
  // Configurable Office Hours (HH:MM)
  const [shiftHours, setShiftHours] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('office_leave_shift_hours');
      return saved !== null ? parseInt(saved, 10) : 9;
    } catch {
      return 9;
    }
  });

  const [shiftMinutes, setShiftMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('office_leave_shift_minutes');
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [inputHoursStr, setInputHoursStr] = useState<string>(() => String(shiftHours).padStart(2, '0'));
  const [inputMinutesStr, setInputMinutesStr] = useState<string>(() => String(shiftMinutes).padStart(2, '0'));

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

  // Full-Screen Alert state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<LeaveMessage>(() => getLeaveMessageForDate(new Date()));
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => getTodayDateString());

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

  // Update leave time if shift duration changes while active
  const updateShiftDuration = (newHours: number, newMins: number) => {
    const validH = Math.max(0, Math.min(23, newHours));
    const validM = Math.max(0, Math.min(59, newMins));
    const total = validH * 60 + validM > 0 ? { h: validH, m: validM } : { h: 9, m: 0 };

    setShiftHours(total.h);
    setShiftMinutes(total.m);
    setInputHoursStr(String(total.h).padStart(2, '0'));
    setInputMinutesStr(String(total.m).padStart(2, '0'));

    localStorage.setItem('office_leave_shift_hours', String(total.h));
    localStorage.setItem('office_leave_shift_minutes', String(total.m));

    // If active, recalculate leave time
    if (widgetState.isActive && widgetState.startTime) {
      const durationMillis = (total.h * 60 + total.m) * 60 * 1000;
      const newLeaveTime = widgetState.startTime + durationMillis;
      const updatedState = { ...widgetState, leaveTime: newLeaveTime };
      setWidgetState(updatedState);
      localStorage.setItem('office_leave_widget_state', JSON.stringify(updatedState));
    }
  };

  const handleStart = (customDate?: Date) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(20); } catch { /* ignore */ }
    }
    const start = customDate || new Date();
    const durationMillis = (shiftHours * 60 + shiftMinutes) * 60 * 1000;
    const leave = new Date(start.getTime() + durationMillis);
    const newState: WidgetState = {
      isActive: true,
      startTime: start.getTime(),
      leaveTime: leave.getTime(),
      durationMinutes: shiftHours * 60 + shiftMinutes,
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

  const handlePresetClick = (preset: { hour: number; minute: number }) => {
    const date = new Date();
    date.setHours(preset.hour, preset.minute, 0, 0);
    handleStart(date);
  };

  const handleDateChange = (newDateStr: string) => {
    setSelectedDateStr(newDateStr);
    const date = new Date(newDateStr + 'T12:00:00');
    if (!isNaN(date.getTime())) {
      setSelectedMessage(getLeaveMessageForDate(date));
    }
  };

  const handleShiftDay = (offsetDays: number) => {
    const current = new Date(selectedDateStr + 'T12:00:00');
    current.setDate(current.getDate() + offsetDays);
    const formatted = getTodayDateString(current);
    handleDateChange(formatted);
  };

  const handleRandomMessage = () => {
    const all = getAllLeaveMessages();
    const randomIdx = Math.floor(Math.random() * all.length);
    setSelectedMessage(all[randomIdx]);
  };

  const formatTimeParts = (millis: number | null) => {
    if (!millis) return { time: '', period: '' };
    const d = new Date(millis);
    const formatted = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const parts = formatted.split(' ');
    return { time: parts[0] || formatted, period: parts[1] || '' };
  };

  const timeDisplay = formatTimeParts(widgetState.leaveTime);

  // Helper to compute dynamic leave time string for presets
  const computePresetLeaveTimeStr = (startH: number, startM: number) => {
    const d = new Date();
    d.setHours(startH, startM, 0, 0);
    const leave = new Date(d.getTime() + (shiftHours * 60 + shiftMinutes) * 60 * 1000);
    return leave.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <>
      {/* Full-Screen Leave Alert Modal */}
      <FullScreenAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        message={selectedMessage}
        dateSeedStr={selectedDateStr}
      />

      <div id="widget-simulator-section" className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e]" />
              <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white">
                Office Leave Timer V1 — Widget &amp; Alert Simulator
              </h2>
            </div>
            <p className="text-xs text-white/40 mt-1">
              {platform === 'ios'
                ? 'Interactive simulation of native iOS 17/18+ WidgetKit AppIntent button behavior on iPhone.'
                : 'Interactive simulation of native Android 15 & Realme UI RemoteViews widget + full-screen leave alert.'}
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
                  <span>Android 15 (V1)</span>
                </button>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono text-white/60">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Time: {simulatedCurrentTime || '--:--'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
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

                {/* THE WIDGET (Maintains exact required design) */}
                <div
                  id="native-home-screen-widget"
                  className={`w-full ${
                    platform === 'ios'
                      ? 'bg-[#1c1c1e]/95 backdrop-blur-xl border border-white/15 rounded-[30px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
                      : 'bg-[#1e1e22]/95 backdrop-blur-md border border-white/10 rounded-[28px] p-5 shadow-2xl'
                  } relative overflow-hidden text-left transition-all`}
                >
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
                          OFFICE LEAVE
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
                        <div className="py-0.5">
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

                {/* Instant Alert Trigger from Phone UI */}
                <div className="mt-4 px-1">
                  <button
                    id="trigger-alert-phone-btn"
                    onClick={() => setIsAlertModalOpen(true)}
                    className="w-full py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-2xl text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>🚨 Test Full-Screen Alert (V1)</span>
                  </button>
                </div>

                {/* Ghost Dock */}
                <div className="mt-auto flex justify-between px-2 pb-2 opacity-20">
                  <div className="w-10 h-10 bg-white rounded-2xl"></div>
                  <div className="w-10 h-10 bg-white rounded-2xl"></div>
                  <div className="w-10 h-10 bg-white rounded-2xl"></div>
                  <div className="w-10 h-10 bg-white rounded-2xl"></div>
                </div>

                {/* Home Bar indicator */}
                <div className="w-24 h-1 bg-white/30 rounded-full self-center mb-1"></div>
              </div>
            </div>
          </div>

          {/* Right Column: Calculations, V1 Alert Trigger, and 365 Joke Explorer */}
          <div className="lg:col-span-6 space-y-6">
            {/* New V1 Alert Feature Box */}
            <div className="bg-[#121217] border border-amber-500/20 p-6 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Bell className="w-4 h-4" />
                  <span>Full-Screen Leave Alert (V1 Feature)</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400/70 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  HTTP 200
                </span>
              </div>

              <p className="text-xs text-white/60 leading-relaxed">
                When the 9-hour workday completes, Office Leave Timer V1 launches a dark, high-priority full-screen alert on Android 15 with one of 365 unique developer jokes.
              </p>

              <button
                id="btn-trigger-fullscreen-alert"
                onClick={() => setIsAlertModalOpen(true)}
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Full-Screen Alert Now</span>
              </button>
            </div>

            {/* 365 Unique Messages Explorer */}
            <div className="bg-[#131316] border border-white/5 p-6 rounded-3xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  365 Daily Messages Explorer
                </h3>
                <span className="text-[10px] font-mono text-white/40">100% Offline JSON</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleShiftDay(-1)}
                    aria-label="Previous day"
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <input
                    type="date"
                    value={selectedDateStr}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                  />
                  <button
                    onClick={() => handleShiftDay(1)}
                    aria-label="Next day"
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleRandomMessage}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5 text-blue-400" />
                  <span>Random</span>
                </button>
              </div>

              {/* Message Display Card */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                  <span>ID #{selectedMessage.id} / 365</span>
                  <span className="text-amber-400/90 font-semibold">Deterministic YYYY-MM-DD</span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed font-sans">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Configurable Office Workday Duration (HH:MM) */}
            <div className="bg-[#121217] border border-blue-500/30 p-6 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Timer className="w-4 h-4" />
                  <span>Total Office Hours (HH:MM)</span>
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Configurable
                </span>
              </div>

              <p className="text-xs text-white/60 leading-relaxed">
                Set your exact workday length in <span className="text-white font-semibold">HH:MM</span> format for special events, half-days, or custom schedules.
              </p>

              {/* Time display & Quick Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-black/40 border border-white/10 rounded-2xl">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-white/40">Current Workday Duration</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-mono font-bold text-blue-400 tracking-tight">
                      {String(shiftHours).padStart(2, '0')}:{String(shiftMinutes).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-white/60 font-medium">
                      ({shiftHours} hrs {String(shiftMinutes).padStart(2, '0')} mins)
                    </span>
                  </div>
                </div>

                {/* Direct HH:MM Inputs */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-2 py-1">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={inputHoursStr}
                      onChange={(e) => setInputHoursStr(e.target.value)}
                      onBlur={() => {
                        const h = parseInt(inputHoursStr, 10);
                        if (!isNaN(h)) updateShiftDuration(h, shiftMinutes);
                      }}
                      className="w-8 text-center bg-transparent text-white font-mono font-bold text-sm focus:outline-none"
                      aria-label="Hours"
                    />
                    <span className="text-white/40 font-mono text-sm">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={inputMinutesStr}
                      onChange={(e) => setInputMinutesStr(e.target.value)}
                      onBlur={() => {
                        const m = parseInt(inputMinutesStr, 10);
                        if (!isNaN(m)) updateShiftDuration(shiftHours, m);
                      }}
                      className="w-8 text-center bg-transparent text-white font-mono font-bold text-sm focus:outline-none"
                      aria-label="Minutes"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const h = parseInt(inputHoursStr, 10);
                      const m = parseInt(inputMinutesStr, 10);
                      if (!isNaN(h) && !isNaN(m)) {
                        updateShiftDuration(h, m);
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    Set
                  </button>
                </div>
              </div>

              {/* Event Quick Chips */}
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-white/40 mb-2">
                  Quick Event &amp; Schedule Presets:
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { h: 9, m: 0, label: '09:00', desc: 'Standard' },
                    { h: 8, m: 30, label: '08:30', desc: '8.5 hrs' },
                    { h: 8, m: 0, label: '08:00', desc: '8 hrs' },
                    { h: 6, m: 0, label: '06:00', desc: 'Event' },
                    { h: 4, m: 30, label: '04:30', desc: 'Half-day' },
                  ].map((preset) => {
                    const isSelected = shiftHours === preset.h && shiftMinutes === preset.m;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => updateShiftDuration(preset.h, preset.m)}
                        className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                            : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-mono font-semibold">{preset.label}</div>
                        <div className="text-[9px] opacity-60 truncate">{preset.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Test Matrix & Rules */}
            <div className="bg-[#131316] border border-white/5 p-6 rounded-3xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Workday Calculation Verification Matrix
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                  +{shiftHours}h {String(shiftMinutes).padStart(2, '0')}m Formula
                </span>
              </div>
              
              <p className="text-xs text-white/50 leading-relaxed">
                Test each example dynamically calculated with your configured {String(shiftHours).padStart(2, '0')}:{String(shiftMinutes).padStart(2, '0')} workday:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {BASE_PRESETS.map((preset, idx) => {
                  const expectedLeave = computePresetLeaveTimeStr(preset.hour, preset.minute);
                  return (
                    <button
                      key={idx}
                      id={`preset-btn-${idx}`}
                      onClick={() => handlePresetClick(preset)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-blue-500/40 border border-white/5 text-left transition-all group cursor-pointer"
                    >
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-white/40 font-medium">{preset.label}</div>
                        <div className="text-xs font-semibold text-white mt-0.5">
                          {preset.startTimeStr} <span className="text-blue-400 font-normal">→</span> {expectedLeave}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 font-mono font-bold group-hover:bg-blue-500/20">
                        +{shiftHours}h{shiftMinutes > 0 ? ` ${shiftMinutes}m` : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#131316] border border-white/5 p-6 rounded-3xl space-y-3 text-xs text-white/60">
              <div className="font-semibold text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                V1 Execution Guarantees:
              </div>
              <ul className="space-y-2 text-white/50 list-disc list-inside leading-relaxed">
                <li><strong className="text-white/80">No regressions:</strong> Widget START and RESET behavior preserved exactly.</li>
                <li><strong className="text-white/80">Offline &amp; Local:</strong> No network calls, telemetry, or remote API dependencies.</li>
                <li><strong className="text-white/80">Android 15 Exact Alarms:</strong> Uses <code className="text-blue-400">AlarmManager.setExactAndAllowWhileIdle</code> to trigger even through Doze mode.</li>
                <li><strong className="text-white/80">Full-Screen Close:</strong> Tap CLOSE on the alert to return directly to phone home screen.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
