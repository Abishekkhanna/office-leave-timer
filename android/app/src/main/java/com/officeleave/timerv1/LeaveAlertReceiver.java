package com.officeleave.timerv1;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.util.Log;

import java.util.Date;

/**
 * BroadcastReceiver triggered by AlarmManager when the 9-hour leave time arrives.
 * Launches the full-screen alert and delivers high-priority full-screen notifications.
 */
public class LeaveAlertReceiver extends BroadcastReceiver {

    public static final String ACTION_TRIGGER_LEAVE_ALERT = "com.officeleave.timerv1.ACTION_TRIGGER_LEAVE_ALERT";
    private static final String TAG = "LeaveAlertReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "Leave alert alarm fired!");

        SharedPreferences prefs = context.getSharedPreferences(OfficeLeaveWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE);
        boolean isActive = prefs.getBoolean(OfficeLeaveWidgetProvider.PREF_KEY_IS_ACTIVE, false);
        long leaveTimeMillis = prefs.getLong(OfficeLeaveWidgetProvider.PREF_KEY_LEAVE_TIME, 0);

        if (!isActive || leaveTimeMillis == 0) {
            Log.w(TAG, "Shift is not active or leave time is 0. Ignoring alarm.");
            return;
        }

        // Acquire a wake lock to ensure the CPU and screen wake up immediately (Screen OFF scenario)
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = null;
        if (pm != null) {
            try {
                wakeLock = pm.newWakeLock(
                        PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.ON_AFTER_RELEASE,
                        "officeleave:alert_wakelock_full"
                );
                wakeLock.acquire(20000); // 20 seconds
            } catch (Exception e) {
                Log.w(TAG, "FULL_WAKE_LOCK failed: " + e.getMessage());
                try {
                    wakeLock = pm.newWakeLock(
                            PowerManager.SCREEN_BRIGHT_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.ON_AFTER_RELEASE,
                            "officeleave:alert_wakelock_bright"
                    );
                    wakeLock.acquire(20000);
                } catch (Exception e2) {
                    Log.e(TAG, "All wakeLock acquire attempts failed: " + e2.getMessage());
                }
            }
        }

        // 1. Prepare intent for full screen activity
        Intent alertIntent = new Intent(context, LeaveAlertActivity.class);
        alertIntent.putExtra(LeaveAlertActivity.EXTRA_LEAVE_TIME_MILLIS, leaveTimeMillis);
        alertIntent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK
                | Intent.FLAG_ACTIVITY_CLEAR_TOP
                | Intent.FLAG_ACTIVITY_SINGLE_TOP
                | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
        );

        // 2. Directly launch the Full-Screen Activity FIRST (Works on Screen ON and Screen OFF with setAlarmClock / overlay)
        try {
            context.startActivity(alertIntent);
            Log.d(TAG, "Direct context.startActivity(alertIntent) succeeded!");
        } catch (Exception e) {
            Log.e(TAG, "Direct startActivity threw error: " + e.getMessage());
        }

        // 3. Deliver Notification with Full-Screen Intent (backup & system lock screen trigger)
        int pendingFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            pendingFlags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(
                context,
                6001,
                alertIntent,
                pendingFlags
        );

        createNotificationChannel(context);

        MessageProvider.LeaveMessage dailyMessage = MessageProvider.getMessageForDate(context, new Date());

        Notification.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder = new Notification.Builder(context, AlertScheduler.NOTIFICATION_CHANNEL_ID);
        } else {
            builder = new Notification.Builder(context);
        }

        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        if (soundUri == null) {
            soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
        }

        builder.setContentTitle("🚨 HTTP 200 — WORKDAY COMPLETED")
                .setContentText(dailyMessage.message)
                .setSmallIcon(R.drawable.ic_office_clock)
                .setFullScreenIntent(fullScreenPendingIntent, true)
                .setContentIntent(fullScreenPendingIntent)
                .setAutoCancel(true)
                .setOngoing(false)
                .setPriority(Notification.PRIORITY_MAX)
                .setCategory(Notification.CATEGORY_ALARM)
                .setSound(soundUri);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            builder.setVisibility(Notification.VISIBILITY_PUBLIC);
        }

        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.notify(AlertScheduler.LEAVE_NOTIFICATION_ID, builder.build());
        }
    }

    private void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return;

            NotificationChannel existing = nm.getNotificationChannel(AlertScheduler.NOTIFICATION_CHANNEL_ID);
            if (existing == null) {
                NotificationChannel channel = new NotificationChannel(
                        AlertScheduler.NOTIFICATION_CHANNEL_ID,
                        "Office Leave Alerts",
                        NotificationManager.IMPORTANCE_HIGH
                );
                channel.setDescription("Full-screen alerts when 9-hour workday ends");
                channel.enableLights(true);
                channel.setLightColor(Color.BLUE);
                channel.enableVibration(true);
                channel.setVibrationPattern(new long[]{0, 300, 200, 300});
                channel.setBypassDnd(true);
                channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

                Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .build();
                channel.setSound(soundUri, audioAttributes);

                nm.createNotificationChannel(channel);
            }
        }
    }
}
