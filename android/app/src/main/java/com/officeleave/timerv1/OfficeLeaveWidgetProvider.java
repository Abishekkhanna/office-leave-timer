package com.officeleave.timerv1;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.view.View;
import android.widget.RemoteViews;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/**
 * Native Android AppWidgetProvider for Office Leave Timer V1.
 * Supports 1-tap START and RESET directly from the mobile home screen,
 * calculates the exact 9-hour leave time, and schedules the full-screen alert.
 */
public class OfficeLeaveWidgetProvider extends AppWidgetProvider {

    public static final String ACTION_START = "com.officeleave.timerv1.ACTION_START";
    public static final String ACTION_RESET = "com.officeleave.timerv1.ACTION_RESET";
    public static final String PREFS_NAME = "office_leave_v1_prefs";
    public static final String PREF_KEY_START_TIME = "start_time_millis";
    public static final String PREF_KEY_LEAVE_TIME = "leave_time_millis";
    public static final String PREF_KEY_IS_ACTIVE = "is_active";
    public static final String PREF_KEY_LAST_ALERTED_TIME = "last_alerted_time_millis";

    // Dynamic shift duration keys (Default: 09:00 = 9 hours 00 minutes)
    public static final String PREF_KEY_DURATION_HOURS = "shift_duration_hours";
    public static final String PREF_KEY_DURATION_MINUTES = "shift_duration_minutes";
    public static final int DEFAULT_DURATION_HOURS = 9;
    public static final int DEFAULT_DURATION_MINUTES = 0;

    public static int getShiftDurationHours(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getInt(PREF_KEY_DURATION_HOURS, DEFAULT_DURATION_HOURS);
    }

    public static int getShiftDurationMinutes(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getInt(PREF_KEY_DURATION_MINUTES, DEFAULT_DURATION_MINUTES);
    }

    public static int getTotalShiftDurationMinutes(Context context) {
        int hours = getShiftDurationHours(context);
        int mins = getShiftDurationMinutes(context);
        int total = hours * 60 + mins;
        return total > 0 ? total : DEFAULT_DURATION_HOURS * 60;
    }

    public static void setShiftDuration(Context context, int hours, int minutes) {
        if (hours < 0) hours = 0;
        if (hours > 23) hours = 23;
        if (minutes < 0) minutes = 0;
        if (minutes > 59) minutes = 59;
        if (hours == 0 && minutes == 0) {
            hours = DEFAULT_DURATION_HOURS;
            minutes = DEFAULT_DURATION_MINUTES;
        }

        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
                .putInt(PREF_KEY_DURATION_HOURS, hours)
                .putInt(PREF_KEY_DURATION_MINUTES, minutes)
                .apply();

        // If shift is currently active, recalculate leave time and reschedule alert
        boolean isActive = prefs.getBoolean(PREF_KEY_IS_ACTIVE, false);
        long startTimeMillis = prefs.getLong(PREF_KEY_START_TIME, 0);
        if (isActive && startTimeMillis > 0) {
            long durationMillis = ((long) hours * 60L + (long) minutes) * 60L * 1000L;
            long newLeaveTimeMillis = startTimeMillis + durationMillis;

            prefs.edit()
                    .putLong(PREF_KEY_LEAVE_TIME, newLeaveTimeMillis)
                    .apply();

            updateAllWidgets(context);
            AlertScheduler.scheduleLeaveAlert(context, newLeaveTimeMillis);
        }
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);

        if (intent == null || intent.getAction() == null) {
            return;
        }

        String action = intent.getAction();
        if (ACTION_START.equals(action)) {
            handleStart(context);
        } else if (ACTION_RESET.equals(action)) {
            handleReset(context);
        }
    }

    /**
     * When START is pressed:
     * 1. Read current device local date/time.
     * 2. Save exact start timestamp locally.
     * 3. Add configured office hours (default 09:00 = 9h 00m, or user-set hh:mm).
     * 4. Save calculated leave timestamp.
     * 5. Update widget display.
     * 6. Schedule full-screen alert for the leave time (cancels any previous alarm).
     */
    public static void handleStart(Context context) {
        Calendar now = Calendar.getInstance();
        long startTimeMillis = now.getTimeInMillis();

        // Calculate offset based on configured office duration (in minutes)
        int totalMinutes = getTotalShiftDurationMinutes(context);
        Calendar leaveTime = (Calendar) now.clone();
        leaveTime.add(Calendar.MINUTE, totalMinutes);
        long leaveTimeMillis = leaveTime.getTimeInMillis();

        // Save locally to SharedPreferences
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
                .putLong(PREF_KEY_START_TIME, startTimeMillis)
                .putLong(PREF_KEY_LEAVE_TIME, leaveTimeMillis)
                .putBoolean(PREF_KEY_IS_ACTIVE, true)
                .apply();

        // Update home-screen widgets
        updateAllWidgets(context);

        // Schedule exact full-screen leave alert (and cancel any existing one)
        AlertScheduler.scheduleLeaveAlert(context, leaveTimeMillis);
    }

    /**
     * When RESET is pressed:
     * 1. Cancel scheduled alert and dismiss any active notification.
     * 2. Clear saved start and leave timestamps.
     * 3. Return widget to "Tap START".
     */
    public static void handleReset(Context context) {
        // Cancel scheduled alarm
        AlertScheduler.cancelLeaveAlert(context);

        // Clear local storage
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().clear().apply();

        // Update home-screen widgets
        updateAllWidgets(context);
    }

    public static void updateAllWidgets(Context context) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName widgetComponent = new ComponentName(context, OfficeLeaveWidgetProvider.class);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(widgetComponent);
        if (appWidgetIds != null && appWidgetIds.length > 0) {
            for (int appWidgetId : appWidgetIds) {
                updateAppWidget(context, appWidgetManager, appWidgetId);
            }
        }
    }

    public static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_office_leave);

        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        boolean isActive = prefs.getBoolean(PREF_KEY_IS_ACTIVE, false);
        long leaveTimeMillis = prefs.getLong(PREF_KEY_LEAVE_TIME, 0);

        if (isActive && leaveTimeMillis > 0) {
            SimpleDateFormat timeFormat = new SimpleDateFormat("h:mm a", Locale.getDefault());
            String formattedLeaveTime = timeFormat.format(new Date(leaveTimeMillis));

            views.setTextViewText(R.id.widget_status_text, "Leave at");
            views.setTextViewText(R.id.widget_time_display, formattedLeaveTime);
            views.setViewVisibility(R.id.widget_time_display, View.VISIBLE);
        } else {
            views.setTextViewText(R.id.widget_status_text, "Tap START");
            views.setTextViewText(R.id.widget_time_display, "");
            views.setViewVisibility(R.id.widget_time_display, View.GONE);
        }

        // START button PendingIntent
        Intent startIntent = new Intent(context, OfficeLeaveWidgetProvider.class);
        startIntent.setAction(ACTION_START);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent startPendingIntent = PendingIntent.getBroadcast(
                context,
                2001,
                startIntent,
                flags
        );
        views.setOnClickPendingIntent(R.id.btn_start, startPendingIntent);

        // RESET button PendingIntent
        Intent resetIntent = new Intent(context, OfficeLeaveWidgetProvider.class);
        resetIntent.setAction(ACTION_RESET);
        PendingIntent resetPendingIntent = PendingIntent.getBroadcast(
                context,
                2002,
                resetIntent,
                flags
        );
        views.setOnClickPendingIntent(R.id.btn_reset, resetPendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
