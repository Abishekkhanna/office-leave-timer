package com.officeleave.widget;

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
 * Native Android AppWidgetProvider for Office Leave Timer.
 * Handles START and RESET actions directly from the home screen without opening the app.
 */
public class OfficeLeaveWidgetProvider extends AppWidgetProvider {

    public static final String ACTION_START = "com.officeleave.widget.ACTION_START";
    public static final String ACTION_RESET = "com.officeleave.widget.ACTION_RESET";
    public static final String PREFS_NAME = "office_leave_prefs";
    public static final String PREF_KEY_START_TIME = "start_time_millis";
    public static final String PREF_KEY_LEAVE_TIME = "leave_time_millis";
    public static final String PREF_KEY_IS_ACTIVE = "is_active";

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
     * 2. Save that exact start time locally.
     * 3. Add exactly 9 hours to start time.
     * 4. Display only the calculated leaving time.
     */
    private void handleStart(Context context) {
        Calendar now = Calendar.getInstance();
        long startTimeMillis = now.getTimeInMillis();

        // Add exactly 9 hours
        Calendar leaveTime = (Calendar) now.clone();
        leaveTime.add(Calendar.HOUR_OF_DAY, 9);
        long leaveTimeMillis = leaveTime.getTimeInMillis();

        // Save locally to SharedPreferences
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
                .putLong(PREF_KEY_START_TIME, startTimeMillis)
                .putLong(PREF_KEY_LEAVE_TIME, leaveTimeMillis)
                .putBoolean(PREF_KEY_IS_ACTIVE, true)
                .apply();

        // Refresh all widget instances on home screen
        updateAllWidgets(context);
    }

    /**
     * When RESET is pressed:
     * Clear saved state and return widget to "Tap START".
     */
    private void handleReset(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().clear().apply();

        // Refresh all widget instances on home screen
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
