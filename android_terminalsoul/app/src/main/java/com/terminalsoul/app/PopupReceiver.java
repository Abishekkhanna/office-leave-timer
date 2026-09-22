package com.terminalsoul.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;

import java.util.Date;
import java.util.List;

public class PopupReceiver extends BroadcastReceiver {
    private static final String CHANNEL_ID = "channel_terminalsoul_popup";
    private static final String CHANNEL_NAME = "TerminalSoul Scheduled Popups";

    @Override
    public void onReceive(Context context, Intent intent) {
        // 1. Acquire WakeLock to immediately wake up screen
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = null;
        if (pm != null) {
            wakeLock = pm.newWakeLock(
                    PowerManager.FULL_WAKE_LOCK |
                    PowerManager.ACQUIRE_CAUSES_WAKEUP |
                    PowerManager.ON_AFTER_RELEASE,
                    "TerminalSoul:PopupWakeLock"
            );
            wakeLock.acquire(15000L); // 15 seconds
        }

        String scheduleId = intent.getStringExtra(ScheduleManager.EXTRA_SCHEDULE_ID);
        int hour = intent.getIntExtra(ScheduleManager.EXTRA_HOUR, 9);
        int minute = intent.getIntExtra(ScheduleManager.EXTRA_MINUTE, 0);
        String category = intent.getStringExtra(ScheduleManager.EXTRA_CATEGORY);
        if (category == null || category.isEmpty()) {
            category = "morning";
        }

        // 2. Fetch deterministic message for today
        MessageProvider.ScheduledMessage msg = MessageProvider.getMessageForSchedule(
                context, new Date(), hour, minute, category
        );

        // 3. Create Full-Screen Popup Intent
        Intent popupIntent = new Intent(context, PopupActivity.class);
        popupIntent.putExtra(PopupActivity.EXTRA_MESSAGE, msg.message);
        popupIntent.putExtra(PopupActivity.EXTRA_CATEGORY, category);
        popupIntent.putExtra(PopupActivity.EXTRA_HOUR, hour);
        popupIntent.putExtra(PopupActivity.EXTRA_MINUTE, minute);
        popupIntent.putExtra(PopupActivity.EXTRA_MSG_ID, msg.id);
        popupIntent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK |
                Intent.FLAG_ACTIVITY_CLEAR_TOP |
                Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS
        );

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(
                context,
                Math.abs((scheduleId != null ? scheduleId.hashCode() : 1) + 999),
                popupIntent,
                flags
        );

        // 4. Create and dispatch high-priority full-screen notification
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(
                        CHANNEL_ID,
                        CHANNEL_NAME,
                        NotificationManager.IMPORTANCE_HIGH
                );
                channel.setDescription("Full-screen terminal alerts for scheduled daily events");
                channel.setBypassDnd(true);
                channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
                channel.enableLights(true);
                channel.enableVibration(true);
                channel.setVibrationPattern(new long[]{0, 250, 150, 250});

                Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .build();
                channel.setSound(soundUri, audioAttributes);

                nm.createNotificationChannel(channel);
            }

            Notification.Builder builder;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                builder = new Notification.Builder(context, CHANNEL_ID);
            } else {
                builder = new Notification.Builder(context);
            }

            builder.setSmallIcon(R.drawable.ic_terminal_soul)
                    .setContentTitle("TerminalSoul: " + category.toUpperCase())
                    .setContentText(msg.message)
                    .setPriority(Notification.PRIORITY_MAX)
                    .setCategory(Notification.CATEGORY_ALARM)
                    .setVisibility(Notification.VISIBILITY_PUBLIC)
                    .setAutoCancel(true)
                    .setFullScreenIntent(fullScreenPendingIntent, true)
                    .setContentIntent(fullScreenPendingIntent);

            nm.notify(Math.abs((scheduleId != null ? scheduleId.hashCode() : 1) + 500), builder.build());
        }

        // 5. Also launch Activity directly for immediate overlay (Screen ON & OFF)
        try {
            context.startActivity(popupIntent);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 6. Reschedule this item for tomorrow at the same time
        if (scheduleId != null) {
            List<ScheduleItem> list = ScheduleManager.getSchedules(context);
            for (ScheduleItem item : list) {
                if (item.getId().equals(scheduleId) && item.isEnabled()) {
                    ScheduleManager.scheduleAlarm(context, item);
                    break;
                }
            }
        }
    }
}
