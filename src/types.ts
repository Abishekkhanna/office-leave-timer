export type PlatformMode = 'ios' | 'android';
export type ActiveAppTab = 'terminalsoul' | 'officeleave';

export type TimeCategory = 'morning' | 'afternoon' | 'evening' | 'night';

export interface ScheduleItemType {
  id: string;
  hour: number;
  minute: number;
  enabled: boolean;
  label: string;
}

export interface ScheduledMessageItem {
  id: number;
  category: TimeCategory;
  message: string;
}

export interface TimeTestPreset {
  startTimeStr: string;
  expectedLeaveTimeStr: string;
  hour: number;
  minute: number;
  label: string;
}

export interface WidgetState {
  isActive: boolean;
  startTime: number | null;
  leaveTime: number | null;
  durationMinutes?: number;
}

export interface OfficeHoursConfig {
  hours: number;
  minutes: number;
}

export interface LeaveMessage {
  id: number;
  message: string;
}
