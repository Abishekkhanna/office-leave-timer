import React, { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Play,
  Eye,
  CheckCircle2,
  Trash2,
  Edit2,
  Sun,
  Coffee,
  Flame,
  Moon,
  Sparkles,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  X,
  Volume2
} from 'lucide-react';
import { ScheduleItemType, TimeCategory } from '../types';
import {
  formatTime,
  getCategoryBadgeInfo,
  getDeterministicMessage,
  getNextTriggerDescription,
  getTimeCategory
} from '../utils/scheduledMessages';

const INITIAL_SCHEDULES: ScheduleItemType[] = [
  { id: 'morning_seed', hour: 9, minute: 0, enabled: true, label: 'Morning Boot & Standup' },
  { id: 'afternoon_seed', hour: 13, minute: 0, enabled: true, label: 'Post-Lunch Coffee Loop' },
  { id: 'evening_seed', hour: 18, minute: 0, enabled: true, label: 'Evening Build & Signoff' },
  { id: 'night_seed', hour: 21, minute: 30, enabled: true, label: 'Night Reflection' },
];

export function TerminalSoulSimulator() {
  const [schedules, setSchedules] = useState<ScheduleItemType[]>(() => {
    const saved = localStorage.getItem('terminalsoul_web_schedules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_SCHEDULES;
  });

  const [activePopup, setActivePopup] = useState<{
    isOpen: boolean;
    hour: number;
    minute: number;
    category: TimeCategory;
    messageText: string;
    msgId: number;
  } | null>(null);

  const [testCountdown, setTestCountdown] = useState<number | null>(null);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [pickerHour, setPickerHour] = useState(9);
  const [pickerMinute, setPickerMinute] = useState(0);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('terminalsoul_web_schedules', JSON.stringify(schedules));
  }, [schedules]);

  // Handle test countdown
  useEffect(() => {
    if (testCountdown === null) return;
    if (testCountdown === 0) {
      setTestCountdown(null);
      triggerPopupForCurrentTime();
      return;
    }
    const timer = setTimeout(() => {
      setTestCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [testCountdown]);

  const triggerPopupForCurrentTime = (customHour?: number, customMin?: number) => {
    const now = new Date();
    const h = customHour !== undefined ? customHour : now.getHours();
    const m = customMin !== undefined ? customMin : now.getMinutes();
    const cat = getTimeCategory(h);
    const msg = getDeterministicMessage(now, h, m, cat);

    setActivePopup({
      isOpen: true,
      hour: h,
      minute: m,
      category: cat,
      messageText: msg.message,
      msgId: msg.id,
    });
  };

  const handleToggle = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleDelete = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleOpenAdd = () => {
    setEditingScheduleId(null);
    const now = new Date();
    setPickerHour(now.getHours());
    setPickerMinute(now.getMinutes());
    setIsTimePickerOpen(true);
  };

  const handleOpenEdit = (schedule: ScheduleItemType) => {
    setEditingScheduleId(schedule.id);
    setPickerHour(schedule.hour);
    setPickerMinute(schedule.minute);
    setIsTimePickerOpen(true);
  };

  const handleSaveTime = () => {
    if (editingScheduleId) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingScheduleId
            ? { ...s, hour: pickerHour, minute: pickerMinute }
            : s
        )
      );
    } else {
      const newSchedule: ScheduleItemType = {
        id: 'sch_' + Date.now(),
        hour: pickerHour,
        minute: pickerMinute,
        enabled: true,
        label: '',
      };
      setSchedules((prev) => [...prev, newSchedule].sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute)));
    }
    setIsTimePickerOpen(false);
  };

  const addPreset = (h: number, m: number, label: string) => {
    const exists = schedules.some((s) => s.hour === h && s.minute === m);
    if (exists) {
      setSchedules((prev) =>
        prev.map((s) => (s.hour === h && s.minute === m ? { ...s, enabled: true } : s))
      );
    } else {
      const newItem: ScheduleItemType = {
        id: 'preset_' + Date.now(),
        hour: h,
        minute: m,
        enabled: true,
        label,
      };
      setSchedules((prev) => [...prev, newItem].sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute)));
    }
  };

  const activeCount = schedules.filter((s) => s.enabled).length;

  return (
    <div className="relative">
      {/* Simulator Device Frame */}
      <div className="max-w-md mx-auto bg-[#0a0d14] border border-white/10 rounded-[36px] p-4 sm:p-6 shadow-2xl shadow-black relative overflow-hidden">
        {/* Device Notch & Status bar */}
        <div className="flex items-center justify-between text-[11px] text-white/40 mb-4 px-2 font-mono">
          <span>09:41</span>
          <div className="w-18 h-4 bg-white/10 rounded-full mx-auto" />
          <span>5G 100%</span>
        </div>

        {/* App Title Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-sm">
              &gt;_
            </div>
            <div>
              <h3 className="font-mono font-bold text-base text-white tracking-tight flex items-center gap-2">
                TerminalSoul
              </h3>
              <p className="text-[11px] text-white/40 font-mono">Scheduled Developer Popups</p>
            </div>
          </div>
          <span
            className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
              activeCount > 0
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-white/5 text-white/40 border-white/10'
            }`}
          >
            {activeCount} ARMED
          </span>
        </div>

        {/* Full-Screen Permissions Status Box */}
        <div className="mb-5 p-3.5 rounded-2xl bg-[#121622] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Full-Screen Auto-Popup (Android 15)</span>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed font-sans">
            Guaranteed screen wake-up for both <strong>Screen OFF</strong> (WakeLock &amp; Keyguard Dismiss) and <strong>Screen ON</strong> (System Alert Window).
          </p>
        </div>

        {/* Daily Schedules List */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center justify-between text-xs text-white/50 px-1 font-mono uppercase tracking-wider">
            <span>Configured Shifts</span>
            <span>Local Time</span>
          </div>

          {schedules.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-white/5 border border-dashed border-white/10 text-white/40 text-xs">
              No daily popups configured yet.<br />Tap "+ ADD TIME" below.
            </div>
          ) : (
            schedules.map((schedule) => {
              const category = getTimeCategory(schedule.hour);
              const badge = getCategoryBadgeInfo(category);
              return (
                <div
                  key={schedule.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    schedule.enabled
                      ? 'bg-[#151a24] border-white/10'
                      : 'bg-[#11141c]/60 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{schedule.enabled ? '🟢' : '⚪'}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-white tracking-tight">
                            {formatTime(schedule.hour, schedule.minute)}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}
                          >
                            {badge.emoji} {badge.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-white/40 font-mono mt-0.5">
                          {schedule.enabled
                            ? getNextTriggerDescription(schedule.hour, schedule.minute)
                            : 'Disabled'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggle(schedule.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
                          schedule.enabled
                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                            : 'bg-white/10 text-white/40 hover:bg-white/20'
                        }`}
                      >
                        {schedule.enabled ? 'ACTIVE' : 'OFF'}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(schedule)}
                        className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Edit Time"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="p-1.5 rounded-lg bg-white/5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        title="Delete Schedule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* + Add Time Button */}
        <button
          onClick={handleOpenAdd}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer mb-5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Time</span>
        </button>

        {/* Quick Presets */}
        <div className="space-y-2 mb-6">
          <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider px-1">
            Quick Shift Presets
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => addPreset(9, 0, 'Morning Boot')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-cyan-300 flex items-center justify-between cursor-pointer transition-all"
            >
              <span>09:00 AM</span>
              <span>☀️ Morning</span>
            </button>
            <button
              onClick={() => addPreset(13, 0, 'Afternoon Coffee')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-amber-300 flex items-center justify-between cursor-pointer transition-all"
            >
              <span>01:00 PM</span>
              <span>🍱 Afternoon</span>
            </button>
            <button
              onClick={() => addPreset(18, 0, 'Evening Wrap')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-rose-300 flex items-center justify-between cursor-pointer transition-all"
            >
              <span>06:00 PM</span>
              <span>🔥 Evening</span>
            </button>
            <button
              onClick={() => addPreset(21, 30, 'Night Reflection')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-purple-300 flex items-center justify-between cursor-pointer transition-all"
            >
              <span>09:30 PM</span>
              <span>🌙 Night</span>
            </button>
          </div>
        </div>

        {/* Testing Controls */}
        <div className="pt-4 border-t border-white/10 space-y-2.5">
          <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider px-1">
            Fast Verification Actions
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTestCountdown(5)}
              disabled={testCountdown !== null}
              className="py-3 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-mono font-bold tracking-tight flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-900/30"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{testCountdown !== null ? `Triggering in ${testCountdown}s...` : '⚡ Test in 5s'}</span>
            </button>

            <button
              onClick={() => triggerPopupForCurrentTime()}
              className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-mono font-bold tracking-tight flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Instant Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Time Picker Dialog Modal */}
      {isTimePickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121622] border border-white/15 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-mono font-bold text-white text-base">
                {editingScheduleId ? 'Edit Daily Shift' : 'Add New Daily Time'}
              </h4>
              <button
                onClick={() => setIsTimePickerOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3 py-4 bg-black/40 rounded-2xl border border-white/5">
                <div className="flex flex-col items-center">
                  <label className="text-[10px] font-mono text-white/40 uppercase mb-1">Hour (0-23)</label>
                  <select
                    value={pickerHour}
                    onChange={(e) => setPickerHour(parseInt(e.target.value, 10))}
                    className="bg-[#1a202c] text-white font-mono text-2xl font-bold px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-2xl font-mono font-bold text-white/40 pt-5">:</span>

                <div className="flex flex-col items-center">
                  <label className="text-[10px] font-mono text-white/40 uppercase mb-1">Min (0-59)</label>
                  <select
                    value={pickerMinute}
                    onChange={(e) => setPickerMinute(parseInt(e.target.value, 10))}
                    className="bg-[#1a202c] text-white font-mono text-2xl font-bold px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                  >
                    {Array.from({ length: 60 }).map((_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category indicator preview */}
              <div className="flex items-center justify-between text-xs px-2 py-1 font-mono text-white/60">
                <span>Selected Category:</span>
                <span className="font-bold text-blue-400 uppercase">
                  {getCategoryBadgeInfo(getTimeCategory(pickerHour)).emoji}{' '}
                  {getCategoryBadgeInfo(getTimeCategory(pickerHour)).label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsTimePickerOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTime}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Alert Popup Simulator (Exact replica of PopupActivity) */}
      {activePopup?.isOpen && (
        <div className="fixed inset-0 z-50 bg-[#0a0d14] flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-200">
          <div className="max-w-xl mx-auto w-full my-auto">
            {/* Terminal Window Card */}
            <div className="bg-[#121622] border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
              {/* Terminal Window Top Bar */}
              <div className="bg-[#1b2232] px-4 py-3 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-mono text-white/50 ml-2">
                    terminalsoul@dev-workstation:~$ ./event
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-cyan-400 border border-cyan-500/20 uppercase">
                  {getCategoryBadgeInfo(activePopup.category).emoji} {activePopup.category}
                </span>
              </div>

              {/* Terminal Content Body */}
              <div className="p-6 sm:p-8 space-y-5">
                <div className="text-xs font-mono text-indigo-400 font-bold tracking-wider">
                  [SCHEDULED EVENT: {formatTime(activePopup.hour, activePopup.minute)}]
                </div>

                <div className="text-base sm:text-lg font-mono text-slate-100 whitespace-pre-line leading-relaxed border-l-2 border-indigo-500/50 pl-4 py-1">
                  {activePopup.messageText}
                </div>

                <div className="text-[11px] font-mono text-slate-500 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span>TerminalSoul #{activePopup.msgId}</span>
                  <span>Daily Deterministic Seed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prominent Bottom [ CLOSE ] Button */}
          <div className="max-w-xl mx-auto w-full pt-6">
            <button
              onClick={() => setActivePopup(null)}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-sm tracking-widest uppercase transition-all shadow-xl shadow-blue-600/30 cursor-pointer"
            >
              [ CLOSE ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
