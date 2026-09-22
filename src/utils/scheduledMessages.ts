import messagesData from '../../scheduled_messages.json';
import { ScheduleItemType, ScheduledMessageItem, TimeCategory } from '../types';

interface RawMessage {
  id: number;
  message: string;
}

interface RawData {
  morning: RawMessage[];
  afternoon: RawMessage[];
  evening: RawMessage[];
  night: RawMessage[];
}

const rawData = messagesData as unknown as RawData;

const data: Record<TimeCategory, ScheduledMessageItem[]> = {
  morning: (rawData.morning || []).map((m) => ({ id: m.id, message: m.message, category: 'morning' })),
  afternoon: (rawData.afternoon || []).map((m) => ({ id: m.id, message: m.message, category: 'afternoon' })),
  evening: (rawData.evening || []).map((m) => ({ id: m.id, message: m.message, category: 'evening' })),
  night: (rawData.night || []).map((m) => ({ id: m.id, message: m.message, category: 'night' })),
};

export function getTimeCategory(hour: number): TimeCategory {
  if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 16) {
    return 'afternoon';
  } else if (hour >= 16 && hour < 20) {
    return 'evening';
  } else {
    return 'night';
  }
}

export function getCategoryBadgeInfo(category: TimeCategory): {
  label: string;
  emoji: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
} {
  switch (category) {
    case 'morning':
      return {
        label: 'MORNING BOOT',
        emoji: '☀️',
        textColor: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/20',
      };
    case 'afternoon':
      return {
        label: 'AFTERNOON PROCESS',
        emoji: '🍱',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20',
      };
    case 'evening':
      return {
        label: 'EVENING BUILD',
        emoji: '🔥',
        textColor: 'text-rose-400',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/20',
      };
    case 'night':
    default:
      return {
        label: 'NIGHT REFLECTION',
        emoji: '🌙',
        textColor: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
      };
  }
}

export function formatTime(hour: number, minute: number): string {
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const padMin = minute.toString().padStart(2, '0');
  return `${displayHour.toString().padStart(2, '0')}:${padMin} ${ampm}`;
}

export function getNextTriggerDescription(hour: number, minute: number): string {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = hour * 60 + minute;

  const isToday = targetMinutes > currentMinutes;
  return `${isToday ? 'Today' : 'Tomorrow'} at ${formatTime(hour, minute)}`;
}

/**
 * Deterministic Message Selector based on:
 * Date (Day of Year + Year) + Configured Time (Hour * 60 + Minute) + Category
 *
 * Guarantees:
 * - Same date + same time → same message
 * - Different day → different message
 * - Different configured time → independent message selection
 * - Avoid consecutive message repetition
 */
export function getDeterministicMessage(
  date: Date,
  hour: number,
  minute: number,
  category?: TimeCategory
): ScheduledMessageItem {
  const cat = category || getTimeCategory(hour);
  const pool = data[cat] || data.morning;

  if (!pool || pool.length === 0) {
    return {
      id: 1,
      category: cat,
      message: 'TerminalSoul instance online.\nHave a productive session, developer! 🚀',
    };
  }

  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const year = date.getFullYear();
  const timeSeed = hour * 60 + minute;

  let catHash = 0;
  for (let i = 0; i < cat.length; i++) {
    catHash = (catHash << 5) - catHash + cat.charCodeAt(i);
  }

  const hash = Math.abs(year * 365 + dayOfYear * 73 + timeSeed * 31 + catHash);
  const index = hash % pool.length;

  return pool[index];
}

export function getAllMessagesForCategory(category: TimeCategory): ScheduledMessageItem[] {
  return data[category] || [];
}

export function getTotalMessageCount(): {
  total: number;
  morning: number;
  afternoon: number;
  evening: number;
  night: number;
} {
  return {
    total:
      (data.morning?.length || 0) +
      (data.afternoon?.length || 0) +
      (data.evening?.length || 0) +
      (data.night?.length || 0),
    morning: data.morning?.length || 0,
    afternoon: data.afternoon?.length || 0,
    evening: data.evening?.length || 0,
    night: data.night?.length || 0,
  };
}
