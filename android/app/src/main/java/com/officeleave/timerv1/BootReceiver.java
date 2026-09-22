package com.officeleave.timerv1;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

/**
 * Restores the scheduled 9-hour leave alert upon device reboot.
 * Prevents repeating/stale alert loops if boot occurs after the leave time has passed.
 */
public class BootReceiver extends BroadcastReceiver {

    private static final String TAG = "BootReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(action) || Intent.ACTION_MY_PACKAGE_REPLACED.equals(action)) {
            Log.d(TAG, "Device rebooted or app updated. Checking active shift status...");

            SharedPreferences prefs = context.getSharedPreferences(OfficeLeaveWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE);
            boolean isActive = prefs.getBoolean(OfficeLeaveWidgetProvider.PREF_KEY_IS_ACTIVE, false);
            long leaveTimeMillis = prefs.getLong(OfficeLeaveWidgetProvider.PREF_KEY_LEAVE_TIME, 0);
            long now = System.currentTimeMillis();

            if (isActive && leaveTimeMillis > 0) {
                if (leaveTimeMillis > now) {
                    // Leave time is still in the future: reschedule exact alarm!
                    Log.d(TAG, "Rescheduling leave alert for future time: " + leaveTimeMillis);
                    AlertScheduler.scheduleLeaveAlert(context, leaveTimeMillis);
                } else {
                    // Boot occurred after leave time already passed.
                    // Gracefully prevent infinite looping alerts.
                    Log.d(TAG, "Boot occurred after leave time passed. Not scheduling stale alert.");
                }
            }

            // Keep widgets in sync
            OfficeLeaveWidgetProvider.updateAllWidgets(context);
        }
    }
}
