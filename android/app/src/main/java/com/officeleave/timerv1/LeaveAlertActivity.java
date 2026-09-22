package com.officeleave.timerv1;

import android.app.Activity;
import android.app.KeyguardManager;
import android.app.NotificationManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

import java.util.Date;

/**
 * Full-screen, developer-themed leave alert activity.
 * Appears automatically at the calculated 9-hour leave time.
 */
public class LeaveAlertActivity extends Activity {

    public static final String EXTRA_LEAVE_TIME_MILLIS = "extra_leave_time_millis";
    private Ringtone alertRingtone = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Configure modern full-screen and lock screen wake-up flags for Android 8.0 - 15
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
            KeyguardManager km = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
            if (km != null) {
                try {
                    km.requestDismissKeyguard(this, null);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        // Always add window flags too, as many OEM skins (ColorOS, OneUI, HyperOS) require them
        getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
                | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON
        );

        setContentView(R.layout.activity_leave_alert);

        TextView messageBodyView = findViewById(R.id.alert_message_body);
        TextView dateSeedView = findViewById(R.id.alert_date_seed);
        Button closeButton = findViewById(R.id.btn_alert_close);

        // Load deterministic daily developer message from 365 JSON pool
        MessageProvider.LeaveMessage dailyMessage = MessageProvider.getMessageForDate(this, new Date());
        messageBodyView.setText(dailyMessage.message);
        dateSeedView.setText("SEED: " + MessageProvider.getTodayDateString());

        // Play subtle alert tone and vibration
        playAlertFeedback();

        // Mark today's alert as acknowledged in SharedPreferences
        markAlertAcknowledged();

        // Close button: dismisses immediately and returns to previous screen
        closeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                stopAlertFeedback();

                // Dismiss any persistent notification
                NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                if (nm != null) {
                    nm.cancel(AlertScheduler.LEAVE_NOTIFICATION_ID);
                }

                // Finish and remove from recents so user returns to what was previously on screen
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    finishAndRemoveTask();
                } else {
                    finish();
                }
            }
        });
    }

    private void playAlertFeedback() {
        try {
            Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator != null && vibrator.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    long[] pattern = {0, 300, 200, 300};
                    vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1));
                } else {
                    vibrator.vibrate(500);
                }
            }

            Uri alertUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            if (alertUri == null) {
                alertUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            }
            alertRingtone = RingtoneManager.getRingtone(getApplicationContext(), alertUri);
            if (alertRingtone != null) {
                alertRingtone.play();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void stopAlertFeedback() {
        if (alertRingtone != null && alertRingtone.isPlaying()) {
            try {
                alertRingtone.stop();
            } catch (Exception ignored) {}
        }
    }

    private void markAlertAcknowledged() {
        SharedPreferences prefs = getSharedPreferences(OfficeLeaveWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
                .putLong(OfficeLeaveWidgetProvider.PREF_KEY_LAST_ALERTED_TIME, System.currentTimeMillis())
                .apply();
    }

    @Override
    protected void onDestroy() {
        stopAlertFeedback();
        super.onDestroy();
    }
}
