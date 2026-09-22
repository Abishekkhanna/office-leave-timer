package com.officeleave.timerv1;

import android.content.Context;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * MessageProvider loads exactly 365 unique developer messages from leave_messages.json
 * in assets, and deterministically selects the message based on YYYY-MM-DD.
 */
public class MessageProvider {

    public static class LeaveMessage {
        public final int id;
        public final String message;

        public LeaveMessage(int id, String message) {
            this.id = id;
            this.message = message;
        }
    }

    private static List<LeaveMessage> cachedMessages = null;

    public static synchronized List<LeaveMessage> getAllMessages(Context context) {
        if (cachedMessages != null && !cachedMessages.isEmpty()) {
            return cachedMessages;
        }

        List<LeaveMessage> list = new ArrayList<>();
        try {
            InputStream is = context.getAssets().open("leave_messages.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            int read = is.read(buffer);
            is.close();

            String json = new String(buffer, 0, read, StandardCharsets.UTF_8);
            JSONObject root = new JSONObject(json);
            JSONArray array = root.getJSONArray("messages");

            for (int i = 0; i < array.length(); i++) {
                JSONObject obj = array.getJSONObject(i);
                int id = obj.getInt("id");
                String msg = obj.getString("message");
                list.add(new LeaveMessage(id, msg));
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback emergency message if asset reading fails
            list.add(new LeaveMessage(1, "🚨 HTTP 200 — WORKDAY COMPLETED! Hey Abishek 👋 Your office session has successfully terminated. 🏃‍♂️💨"));
        }

        cachedMessages = list;
        return cachedMessages;
    }

    /**
     * Deterministically returns the message for a given date (or today).
     * Seed is YYYY-MM-DD.
     * Same date -> exactly same message.
     * Consecutive days -> different message.
     */
    public static LeaveMessage getMessageForDate(Context context, Date date) {
        List<LeaveMessage> messages = getAllMessages(context);
        if (messages.isEmpty()) {
            return new LeaveMessage(1, "🚨 HTTP 200 — WORKDAY COMPLETED! Great work Abishek 👋 Go home now! 🏃‍♂️💨");
        }

        Calendar cal = Calendar.getInstance();
        if (date != null) {
            cal.setTime(date);
        }

        int dayOfYear = cal.get(Calendar.DAY_OF_YEAR);
        int targetIndex = ((dayOfYear - 1) % 365);
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex >= messages.size()) targetIndex = targetIndex % messages.size();

        return messages.get(targetIndex);
    }

    public static String getTodayDateString() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        return sdf.format(new Date());
    }
}
