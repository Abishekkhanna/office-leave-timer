import messagesData from './leave_messages.json';
import { LeaveMessage } from '../types';

export function getAllLeaveMessages(): LeaveMessage[] {
  return messagesData.messages;
}

export function getLeaveMessageForDate(date: Date): LeaveMessage {
  const messages = messagesData.messages;
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const targetIndex = ((dayOfYear - 1) % 365 + 365) % 365;
  return messages[targetIndex] || messages[0];
}

export function getTodayDateString(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
