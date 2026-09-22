import React, { useState } from 'react';
import { FileCode, Layers, CheckCircle2, ShieldCheck, Apple, Smartphone, Copy, Check } from 'lucide-react';

interface CodeSnippet {
  id: string;
  platform: 'ios' | 'android';
  filename: string;
  path: string;
  description: string;
  code: string;
}

const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'android_widget_provider',
    platform: 'android',
    filename: 'OfficeLeaveWidgetProvider.java',
    path: 'android/app/src/main/java/com/officeleave/timerv1/OfficeLeaveWidgetProvider.java',
    description: 'Dynamic HH:MM workday calculation, widget state persistence, and automatic recalculation',
    code: `package com.officeleave.timerv1;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import java.util.Calendar;

public class OfficeLeaveWidgetProvider extends AppWidgetProvider {
    public static final String PREF_KEY_DURATION_HOURS = "shift_duration_hours";
    public static final String PREF_KEY_DURATION_MINUTES = "shift_duration_minutes";
    public static final int DEFAULT_DURATION_HOURS = 9;
    public static final int DEFAULT_DURATION_MINUTES = 0;

    public static int getTotalShiftDurationMinutes(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int hours = prefs.getInt(PREF_KEY_DURATION_HOURS, DEFAULT_DURATION_HOURS);
        int mins = prefs.getInt(PREF_KEY_DURATION_MINUTES, DEFAULT_DURATION_MINUTES);
        int total = hours * 60 + mins;
        return total > 0 ? total : DEFAULT_DURATION_HOURS * 60;
    }

    public static void setShiftDuration(Context context, int hours, int minutes) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
            .putInt(PREF_KEY_DURATION_HOURS, hours)
            .putInt(PREF_KEY_DURATION_MINUTES, minutes)
            .apply();

        // If shift is currently active, recalculate leave time and reschedule alert
        boolean isActive = prefs.getBoolean(PREF_KEY_IS_ACTIVE, false);
        long startTimeMillis = prefs.getLong(PREF_KEY_START_TIME, 0);
        if (isActive && startTimeMillis > 0) {
            long newLeaveTimeMillis = startTimeMillis + ((long) hours * 60L + minutes) * 60L * 1000L;
            prefs.edit().putLong(PREF_KEY_LEAVE_TIME, newLeaveTimeMillis).apply();
            updateAllWidgets(context);
            AlertScheduler.scheduleLeaveAlert(context, newLeaveTimeMillis);
        }
    }

    public static void handleStart(Context context) {
        Calendar now = Calendar.getInstance();
        long startTimeMillis = now.getTimeInMillis();

        // Calculate offset based on configured office duration (in minutes)
        int totalMinutes = getTotalShiftDurationMinutes(context);
        Calendar leaveTime = (Calendar) now.clone();
        leaveTime.add(Calendar.MINUTE, totalMinutes);
        long leaveTimeMillis = leaveTime.getTimeInMillis();

        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
            .putLong(PREF_KEY_START_TIME, startTimeMillis)
            .putLong(PREF_KEY_LEAVE_TIME, leaveTimeMillis)
            .putBoolean(PREF_KEY_IS_ACTIVE, true)
            .apply();

        updateAllWidgets(context);
        AlertScheduler.scheduleLeaveAlert(context, leaveTimeMillis);
    }
}`
  },
  {
    id: 'android_main_activity',
    platform: 'android',
    filename: 'MainActivity.java',
    path: 'android/app/src/main/java/com/officeleave/timerv1/MainActivity.java',
    description: 'In-app HH:MM time picker, direct numeric inputs, quick event chips, and dynamic presets',
    code: `package com.officeleave.timerv1;

import android.app.Activity;
import android.app.TimePickerDialog;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import java.util.Locale;

public class MainActivity extends Activity {
    // Allows user to pick total office hours in 24-hour HH:MM format
    private void showTimePickerDialog() {
        int currentHours = OfficeLeaveWidgetProvider.getShiftDurationHours(this);
        int currentMins = OfficeLeaveWidgetProvider.getShiftDurationMinutes(this);

        TimePickerDialog dialog = new TimePickerDialog(this,
            (view, hourOfDay, minute) -> applyAndSaveDuration(hourOfDay, minute),
            currentHours, currentMins, true // 24-hour mode allows 00:00 to 23:59 duration
        );
        dialog.setTitle("Select Total Office Hours (HH:MM)");
        dialog.show();
    }

    private void applyAndSaveDuration(int hours, int minutes) {
        OfficeLeaveWidgetProvider.setShiftDuration(this, hours, minutes);
        String formatted = String.format(Locale.US, "%02d:%02d", hours, minutes);
        Toast.makeText(this, "Workday set to " + formatted + " (" + hours + "h " + minutes + "m)", Toast.LENGTH_SHORT).show();
        refreshUI();
    }
}`
  },
  {
    id: 'android_leave_alert_act',
    platform: 'android',
    filename: 'LeaveAlertActivity.java',
    path: 'android/app/src/main/java/com/officeleave/timerv1/LeaveAlertActivity.java',
    description: 'Android 15 Full-Screen developer-themed alert activity with CLOSE dismiss action',
    code: `package com.officeleave.timerv1;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;
import java.util.Date;

public class LeaveAlertActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Android 15 Wakeup & Fullscreen flags
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
            );
        }

        setContentView(R.layout.activity_leave_alert);

        // Load deterministic developer joke for today's date
        MessageProvider.LeaveMessage dailyMessage = MessageProvider.getMessageForDate(this, new Date());
        ((TextView) findViewById(R.id.alert_text_message)).setText(dailyMessage.message);

        // Prominent CLOSE button
        Button btnClose = findViewById(R.id.alert_btn_close);
        btnClose.setOnClickListener(v -> {
            stopVibrationAndAlert();
            finish();
        });
    }
}`
  },
  {
    id: 'android_scheduler',
    platform: 'android',
    filename: 'AlertScheduler.java',
    path: 'android/app/src/main/java/com/officeleave/timerv1/AlertScheduler.java',
    description: 'AlarmManager exact scheduling with Doze mode compatibility and auto-cancellation',
    code: `package com.officeleave.timerv1;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

public class AlertScheduler {
    public static void scheduleLeaveAlert(Context context, long leaveTimeMillis) {
        cancelLeaveAlert(context); // Cancel any previous alarms

        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, LeaveAlertReceiver.class);
        intent.setAction(LeaveAlertReceiver.ACTION_TRIGGER_LEAVE_ALERT);

        PendingIntent pi = PendingIntent.getBroadcast(
            context, 5001, intent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, leaveTimeMillis, pi);
        } else {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, leaveTimeMillis, pi);
        }
    }

    public static void cancelLeaveAlert(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, LeaveAlertReceiver.class);
        PendingIntent pi = PendingIntent.getBroadcast(
            context, 5001, intent, 
            PendingIntent.FLAG_NO_CREATE | PendingIntent.FLAG_IMMUTABLE
        );
        if (pi != null) {
            alarmManager.cancel(pi);
            pi.cancel();
        }
    }
}`
  },
  {
    id: 'android_receiver',
    platform: 'android',
    filename: 'LeaveAlertReceiver.java',
    path: 'android/app/src/main/java/com/officeleave/timerv1/LeaveAlertReceiver.java',
    description: 'Exact Alarm receiver that triggers full-screen activity and high-priority notification',
    code: `package com.officeleave.timerv1;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;

public class LeaveAlertReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        // Wake device CPU
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = pm.newWakeLock(
            PowerManager.SCREEN_BRIGHT_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP,
            "officeleave:alert"
        );
        wakeLock.acquire(10000);

        // Start Full-Screen Intent & Activity
        Intent alertIntent = new Intent(context, LeaveAlertActivity.class);
        alertIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        context.startActivity(alertIntent);
    }
}`
  },
  {
    id: 'android_msg_provider',
    platform: 'android',
    filename: 'MessageProvider.java',
    path: 'android/app/src/main/java/com/officeleave/timerv1/MessageProvider.java',
    description: '100% offline deterministic 365 developer messages parser from assets/leave_messages.json',
    code: `package com.officeleave.timerv1;

import android.content.Context;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Calendar;
import java.util.Date;

public class MessageProvider {
    public static LeaveMessage getMessageForDate(Context context, Date date) {
        ensureLoaded(context);
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int dayOfYear = cal.get(Calendar.DAY_OF_YEAR);
        int index = (dayOfYear - 1) % cachedMessages.size();
        return cachedMessages.get(index);
    }
}`
  },
  {
    id: 'android_manifest',
    platform: 'android',
    filename: 'AndroidManifest.xml',
    path: 'android/app/src/main/AndroidManifest.xml',
    description: 'Android 15 permissions, AlarmManager wakeup, and full-screen intent registrations',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.officeleave.timerv1"
    android:versionCode="3"
    android:versionName="1.0.0-V1">

    <uses-sdk android:minSdkVersion="26" android:targetSdkVersion="35" />

    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_office_clock"
        android:label="@string/app_name"
        android:theme="@style/Theme.OfficeLeave">

        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity
            android:name=".LeaveAlertActivity"
            android:exported="true"
            android:showWhenLocked="true"
            android:turnScreenOn="true"
            android:theme="@android:style/Theme.NoTitleBar.Fullscreen" />

        <receiver android:name=".OfficeLeaveWidgetProvider" android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
                <action android:name="com.officeleave.timerv1.ACTION_START" />
                <action android:name="com.officeleave.timerv1.ACTION_RESET" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/office_leave_widget_info" />
        </receiver>

        <receiver android:name=".LeaveAlertReceiver" android:exported="false" />
        <receiver android:name=".BootReceiver" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>
    </application>
</manifest>`
  },
  {
    id: 'ios_widget',
    platform: 'ios',
    filename: 'OfficeLeaveWidget.swift',
    path: 'ios/OfficeLeaveWidget/OfficeLeaveWidget.swift',
    description: 'SwiftUI + WidgetKit widget view with AppIntent interactive buttons for iOS 17/18+',
    code: `import WidgetKit
import SwiftUI
import AppIntents

struct OfficeLeaveEntry: TimelineEntry {
    let date: Date
    let isActive: Bool
    let leaveTime: Date?
}

struct OfficeLeaveWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("OFFICE LEAVE")
                .font(.system(size: 10, weight: .bold))
                .foregroundStyle(.blue)

            if let leaveTime = entry.leaveTime, entry.isActive {
                Text("Leave at")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundStyle(.secondary)
                Text(leaveTime, style: .time)
                    .font(.system(size: 30, weight: .light, design: .rounded))
            } else {
                Text("Tap START")
                    .font(.system(size: 22, weight: .light))
                    .foregroundStyle(.secondary)
            }

            HStack(spacing: 6) {
                Button(intent: StartShiftIntent()) {
                    Text("START")
                }
                Button(intent: ResetShiftIntent()) {
                    Text("RESET")
                }
            }
        }
    }
}`
  }
];

export const CodeInspector: React.FC = () => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>('android_leave_alert_act');
  const [copied, setCopied] = useState(false);

  const currentSnippet = CODE_SNIPPETS.find((s) => s.id === selectedSnippetId) || CODE_SNIPPETS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="code-inspector-section" className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white">
              V1 Native Source Code Inspector
            </h2>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Browse the native Android V1 Java classes, full-screen activities, AlarmManager receiver, and iOS Swift widget code.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-white/70 hover:text-white transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy File'}</span>
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CODE_SNIPPETS.map((snippet) => (
          <button
            key={snippet.id}
            onClick={() => setSelectedSnippetId(snippet.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              selectedSnippetId === snippet.id
                ? 'bg-blue-600 text-white font-semibold shadow-md'
                : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {snippet.platform === 'ios' ? (
              <Apple className="w-3.5 h-3.5 text-white/80" />
            ) : (
              <Smartphone className="w-3.5 h-3.5 text-blue-300" />
            )}
            <span>{snippet.filename}</span>
          </button>
        ))}
      </div>

      {/* Code Viewer */}
      <div className="bg-[#070709] border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 bg-white/5 border-b border-white/5 flex items-center justify-between text-xs font-mono text-white/40">
          <span className="truncate">{currentSnippet.path}</span>
          <span className="text-[11px] text-blue-400 font-sans hidden sm:inline">
            {currentSnippet.description}
          </span>
        </div>
        <pre className="p-4 text-xs font-mono text-white/80 overflow-x-auto max-h-[460px] leading-relaxed select-all">
          <code>{currentSnippet.code}</code>
        </pre>
      </div>
    </div>
  );
};
