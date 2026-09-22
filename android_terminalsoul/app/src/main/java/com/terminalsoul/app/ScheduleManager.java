package com.terminalsoul.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ScheduleManager {
    private static final String PREF_NAME = "terminalsoul_schedules_pref";
    private static final String KEY_SCHEDULES = "schedules_data";

    public static final String ACTION_TRIGGER_POPUP = "com.terminalsoul.app.ACTION_TRIGGER_POPUP";
    public static final String EXTRA_SCHEDULE_ID = "extra_schedule_id";
    public static final String EXTRA_HOUR = "extra_hour";
    public static final String EXTRA_MINUTE = "extra_minute";
    public static final String EXTRA_CATEGORY = "extra_category";

    public static List<ScheduleItem> getSchedules(Context context) {
        SharedPreferences sp = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        String json = sp.getString(KEY_SCHEDULES, null);

        List<ScheduleItem> list = new ArrayList<>();
        if (json == null || json.trim().isEmpty()) {
            // Seed defaults: 09:00 AM, 01:00 PM, 06:00 PM, 09:30 PM
            list.add(new ScheduleItem("seed_morning", 9, 0, true, "Morning Boot"));
            list.add(new ScheduleItem("seed_afternoon", 13, 0, true, "Afternoon Process"));
            list.add(new ScheduleItem("seed_evening", 18, 0, true, "Evening Build"));
            list.add(new ScheduleItem("seed_night", 21, 30, true, "Night Reflection"));
            saveSchedules(context, list);
            return list;
        }

        try {
            JSONArray arr = new JSONArray(json);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                list.add(ScheduleItem.fromJson(obj));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Sort by time of day
        sortSchedules(list);
        return list;
    }

    public static void saveSchedules(Context context, List<ScheduleItem> list) {
        sortSchedules(list);
        JSONArray arr = new JSONArray();
        for (ScheduleItem item : list) {
            arr.put(item.toJson());
        }
        SharedPreferences sp = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        sp.edit().putString(KEY_SCHEDULES, arr.toString()).apply();
    }

    private static void sortSchedules(List<ScheduleItem> list) {
        Collections.sort(list, new Comparator<ScheduleItem>() {
            @Override
            public int compare(ScheduleItem o1, ScheduleItem o2) {
                int t1 = o1.getHour() * 60 + o1.getMinute();
                int t2 = o2.getHour() * 60 + o2.getMinute();
                return Integer.compare(t1, t2);
            }
        });
    }

    public static void addSchedule(Context context, ScheduleItem item) {
        List<ScheduleItem> list = getSchedules(context);
        list.add(item);
        saveSchedules(context, list);
        if (item.isEnabled()) {
            scheduleAlarm(context, item);
        }
    }

    public static void updateSchedule(Context context, ScheduleItem item) {
        List<ScheduleItem> list = getSchedules(context);
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getId().equals(item.getId())) {
                cancelAlarm(context, list.get(i).getId());
                list.set(i, item);
                break;
            }
        }
        saveSchedules(context, list);
        if (item.isEnabled()) {
            scheduleAlarm(context, item);
        }
    }

    public static void deleteSchedule(Context context, String id) {
        cancelAlarm(context, id);
        List<ScheduleItem> list = getSchedules(context);
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getId().equals(id)) {
                list.remove(i);
                break;
            }
        }
        saveSchedules(context, list);
    }

    public static void toggleSchedule(Context context, String id, boolean enabled) {
        List<ScheduleItem> list = getSchedules(context);
        for (ScheduleItem item : list) {
            if (item.getId().equals(id)) {
                item.setEnabled(enabled);
                if (enabled) {
                    scheduleAlarm(context, item);
                } else {
                    cancelAlarm(context, id);
                }
                break;
            }
        }
        saveSchedules(context, list);
    }

    public static void scheduleAlarm(Context context, ScheduleItem item) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;

        long triggerAtMillis = item.getNextTriggerMillis();
        int requestCode = Math.abs(item.getId().hashCode());

        Intent intent = new Intent(context, PopupReceiver.class);
        intent.setAction(ACTION_TRIGGER_POPUP);
        intent.putExtra(EXTRA_SCHEDULE_ID, item.getId());
        intent.putExtra(EXTRA_HOUR, item.getHour());
        intent.putExtra(EXTRA_MINUTE, item.getMinute());
        intent.putExtra(EXTRA_CATEGORY, item.getCategory());

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent pi = PendingIntent.getBroadcast(context, requestCode, intent, flags);

        // Show in alarm clock UI (highest system priority, wake-up guaranteed on Android 15)
        Intent showIntent = new Intent(context, MainActivity.class);
        PendingIntent showPendingIntent = PendingIntent.getActivity(context, requestCode + 100000, showIntent, flags);

        AlarmManager.AlarmClockInfo clockInfo = new AlarmManager.AlarmClockInfo(triggerAtMillis, showPendingIntent);
        am.setAlarmClock(clockInfo, pi);
    }

    public static void cancelAlarm(Context context, String id) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;

        int requestCode = Math.abs(id.hashCode());
        Intent intent = new Intent(context, PopupReceiver.class);
        intent.setAction(ACTION_TRIGGER_POPUP);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent pi = PendingIntent.getBroadcast(context, requestCode, intent, flags);
        am.cancel(pi);
        pi.cancel();
    }

    public static void rescheduleAll(Context context) {
        List<ScheduleItem> list = getSchedules(context);
        for (ScheduleItem item : list) {
            if (item.isEnabled()) {
                scheduleAlarm(context, item);
            } else {
                cancelAlarm(context, item.getId());
            }
        }
    }
}
