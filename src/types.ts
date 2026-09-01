export type PlatformMode = 'ios' | 'android';

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
}

