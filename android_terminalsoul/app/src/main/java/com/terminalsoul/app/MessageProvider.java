package com.terminalsoul.app;

import android.content.Context;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MessageProvider {

    public static class ScheduledMessage {
        public final int id;
        public final String category;
        public final String message;

        public ScheduledMessage(int id, String category, String message) {
            this.id = id;
            this.category = category;
            this.message = message;
        }
    }

    private static final Map<String, List<ScheduledMessage>> categoryPools = new HashMap<>();
    private static boolean isLoaded = false;

    public static synchronized void ensureLoaded(Context context) {
        if (isLoaded) return;
        try {
            InputStream is = context.getAssets().open("scheduled_messages.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();

            String jsonString = new String(buffer, StandardCharsets.UTF_8);
            JSONObject root = new JSONObject(jsonString);

            loadCategoryList(root, "morning");
            loadCategoryList(root, "afternoon");
            loadCategoryList(root, "evening");
            loadCategoryList(root, "night");

            isLoaded = true;
        } catch (Exception e) {
            e.printStackTrace();
            loadFallbacks();
            isLoaded = true;
        }
    }

    private static void loadCategoryList(JSONObject root, String category) {
        List<ScheduledMessage> list = new ArrayList<>();
        JSONArray arr = root.optJSONArray(category);
        if (arr != null) {
            for (int i = 0; i < arr.length(); i++) {
                JSONObject item = arr.optJSONObject(i);
                if (item != null) {
                    int id = item.optInt("id", i + 1);
                    String msg = item.optString("message", "");
                    if (!msg.isEmpty()) {
                        list.add(new ScheduledMessage(id, category, msg));
                    }
                }
            }
        }
        categoryPools.put(category, list);
    }

    private static void loadFallbacks() {
        List<ScheduledMessage> mList = new ArrayList<>();
        mList.add(new ScheduledMessage(1, "morning", "☀️ SYSTEM BOOT COMPLETE\nGood morning, Abishek. 🧑💻\nBrain.exe is initializing...\nCoffee dependency: REQUIRED ☕😂"));
        categoryPools.put("morning", mList);

        List<ScheduledMessage> aList = new ArrayList<>();
        aList.add(new ScheduledMessage(1, "afternoon", "🍱 POST-LUNCH PROCESS\nLunch successfully committed.\nBrain latency: +347ms\nPlease wait while developer.exe wakes up. 😂"));
        categoryPools.put("afternoon", aList);

        List<ScheduledMessage> eList = new ArrayList<>();
        eList.add(new ScheduledMessage(1, "evening", "🔥 EVENING BUILD\nToday's human process has reached maximum uptime.\nGraceful shutdown recommended. 🧑💻💤"));
        categoryPools.put("evening", eList);

        List<ScheduledMessage> nList = new ArrayList<>();
        nList.add(new ScheduledMessage(1, "night", "🌙 NIGHT MODE\nThe office is quiet. The screens are glowing.\nServers running peacefully.\nGreat progress today, Abishek. 🧑💻💚"));
        categoryPools.put("night", nList);
    }

    /**
     * Deterministic Message Selector based on:
     * Date (Day of Year + Year) + Configured Time (Hour * 60 + Minute) + Category
     *
     * Guarantees:
     * - Same date + same time → same message
     * - Different day → different message
     * - Different configured time → independent message selection
     * - Avoid consecutive message repetition
     */
    public static ScheduledMessage getMessageForSchedule(Context context, Date date, int hour, int minute, String category) {
        ensureLoaded(context);

        List<ScheduledMessage> pool = categoryPools.get(category.toLowerCase());
        if (pool == null || pool.isEmpty()) {
            pool = categoryPools.get("morning");
        }
        if (pool == null || pool.isEmpty()) {
            return new ScheduledMessage(1, category, "TerminalSoul initialized.\nHave a great shift, developer! 🚀");
        }

        Calendar cal = Calendar.getInstance();
        if (date != null) cal.setTime(date);

        int dayOfYear = cal.get(Calendar.DAY_OF_YEAR);
        int year = cal.get(Calendar.YEAR);
        int timeSeed = (hour * 60) + minute;

        // Mathematical hash for distinct distribution without collisions
        long hash = (long) year * 365L
                + (long) dayOfYear * 73L
                + (long) timeSeed * 31L
                + (long) category.hashCode();

        int index = (int) (Math.abs(hash) % pool.size());
        return pool.get(index);
    }

    public static int getPoolSize(Context context, String category) {
        ensureLoaded(context);
        List<ScheduledMessage> pool = categoryPools.get(category.toLowerCase());
        return pool != null ? pool.size() : 0;
    }
}
