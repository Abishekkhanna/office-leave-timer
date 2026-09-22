package com.terminalsoul.app;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.Locale;

public class ScheduleItem {
    private String id;
    private int hour;       // 0 - 23
    private int minute;     // 0 - 59
    private boolean enabled;
    private String label;

    public ScheduleItem(String id, int hour, int minute, boolean enabled, String label) {
        this.id = id;
        this.hour = hour;
        this.minute = minute;
        this.enabled = enabled;
        this.label = label != null ? label : "";
    }

    public String getId() {
        return id;
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    public int getMinute() {
        return minute;
    }

    public void setMinute(int minute) {
        this.minute = minute;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    /**
     * Determines category based on user prompt rules:
     * - Morning: 6:00 AM → 11:59 AM (hour >= 6 && hour < 12)
     * - Afternoon: 12:00 PM → 3:59 PM (hour >= 12 && hour < 16)
     * - Evening: 4:00 PM → 7:59 PM (hour >= 16 && hour < 20)
     * - Night: 8:00 PM and later, or early hours (hour >= 20 || hour < 6)
     */
    public String getCategory() {
        if (hour >= 6 && hour < 12) {
            return "morning";
        } else if (hour >= 12 && hour < 16) {
            return "afternoon";
        } else if (hour >= 16 && hour < 20) {
            return "evening";
        } else {
            return "night";
        }
    }

    public String getCategoryDisplayName() {
        String cat = getCategory();
        switch (cat) {
            case "morning":
                return "☀️ MORNING";
            case "afternoon":
                return "🍱 AFTERNOON";
            case "evening":
                return "🔥 EVENING";
            case "night":
            default:
                return "🌙 NIGHT";
        }
    }

    public String getFormattedTime() {
        int displayHour = hour % 12;
        if (displayHour == 0) displayHour = 12;
        String amPm = (hour < 12) ? "AM" : "PM";
        return String.format(Locale.US, "%02d:%02d %s", displayHour, minute, amPm);
    }

    public long getNextTriggerMillis() {
        Calendar cal = Calendar.getInstance();
        Calendar now = Calendar.getInstance();

        cal.set(Calendar.HOUR_OF_DAY, hour);
        cal.set(Calendar.MINUTE, minute);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);

        if (!cal.after(now)) {
            // Already passed today, trigger tomorrow
            cal.add(Calendar.DAY_OF_YEAR, 1);
        }
        return cal.getTimeInMillis();
    }

    public JSONObject toJson() {
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", id);
            obj.put("hour", hour);
            obj.put("minute", minute);
            obj.put("enabled", enabled);
            obj.put("label", label);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;
    }

    public static ScheduleItem fromJson(JSONObject obj) {
        String id = obj.optString("id", String.valueOf(System.currentTimeMillis()));
        int hour = obj.optInt("hour", 9);
        int minute = obj.optInt("minute", 0);
        boolean enabled = obj.optBoolean("enabled", true);
        String label = obj.optString("label", "");
        return new ScheduleItem(id, hour, minute, enabled, label);
    }
}
