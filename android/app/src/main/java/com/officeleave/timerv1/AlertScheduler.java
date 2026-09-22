package com.officeleave.timerv1;

import android.app.AlarmManager;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

/**
 * Handles scheduling and cancellation of exact 9-hour leave alarms.
 * Supports Android 15 exact alarm requirements and idle wake-up.
 */
public class AlertScheduler {

    private static final String TAG = "AlertScheduler";
    public static final int ALARM_REQUEST_CODE = 4001;
    public static final int LEAVE_NOTIFICATION_ID = 5001;
    public static final String NOTIFICATION_CHANNEL_ID = "office_leave_alert_v2";

    /**
     * Schedules the full-screen leave alert at the exact calculated leave time.
     * Uses AlarmManager.setAlarmClock() to guarantee Background Activity Launch (BAL) exemption,
     * exact triggering during Doze mode, and automatic wake-up of device.
     */
    public static void scheduleLeaveAlert(Context context, long leaveTimeMillis) {
        if (context == null) return;

        // 1. Cancel any previously scheduled alert first
        cancelLeaveAlert(context);

        if (leaveTimeMillis <= System.currentTimeMillis()) {
            Log.w(TAG, "Leave time is already in the past, skipping schedule.");
            return;
        }

        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        PendingIntent pendingIntent = getAlarmPendingIntent(context);

        // PendingIntent for user tapping the alarm clock icon in system UI
        Intent showIntent = new Intent(context, MainActivity.class);
        showIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent showPendingIntent = PendingIntent.getActivity(
                context,
                ALARM_REQUEST_CODE + 1,
                showIntent,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                        ? PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                        : PendingIntent.FLAG_UPDATE_CURRENT
        );

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                // setAlarmClock provides Background Activity Launch (BAL) exemption in Android 10 - 15
                // and wakes device from deep Doze mode
                AlarmManager.AlarmClockInfo clockInfo = new AlarmManager.AlarmClockInfo(leaveTimeMillis, showPendingIntent);
                alarmManager.setAlarmClock(clockInfo, pendingIntent);
                Log.d(TAG, "Successfully scheduled leave alert via setAlarmClock for timestamp: " + leaveTimeMillis);
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        leaveTimeMillis,
                        pendingIntent
                );
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                alarmManager.setExact(
                        AlarmManager.RTC_WAKEUP,
                        leaveTimeMillis,
                        pendingIntent
                );
            } else {
                alarmManager.set(
                        AlarmManager.RTC_WAKEUP,
                        leaveTimeMillis,
                        pendingIntent
                );
            }
        } catch (SecurityException se) {
            Log.w(TAG, "Exact alarm permission issue: " + se.getMessage() + ", falling back to setExactAndAllowWhileIdle");
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    alarmManager.setExactAndAllowWhileIdle(
                            AlarmManager.RTC_WAKEUP,
                            leaveTimeMillis,
                            pendingIntent
                    );
                } else {
                    alarmManager.set(
                            AlarmManager.RTC_WAKEUP,
                            leaveTimeMillis,
                            pendingIntent
                    );
                }
            } catch (Exception fallbackEx) {
                Log.e(TAG, "All alarm scheduling failed: " + fallbackEx.getMessage());
            }
        }
    }

    /**
     * Cancels the scheduled leave alert and dismisses any active notification.
     */
    public static void cancelLeaveAlert(Context context) {
        if (context == null) return;

        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager != null) {
            PendingIntent pendingIntent = getAlarmPendingIntent(context);
            alarmManager.cancel(pendingIntent);
            pendingIntent.cancel();
        }

        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.cancel(LEAVE_NOTIFICATION_ID);
        }

        Log.d(TAG, "Canceled leave alert.");
    }

    public static PendingIntent getAlarmPendingIntent(Context context) {
        Intent intent = new Intent(context, LeaveAlertReceiver.class);
        intent.setAction(LeaveAlertReceiver.ACTION_TRIGGER_LEAVE_ALERT);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        return PendingIntent.getBroadcast(context, ALARM_REQUEST_CODE, intent, flags);
    }
}
