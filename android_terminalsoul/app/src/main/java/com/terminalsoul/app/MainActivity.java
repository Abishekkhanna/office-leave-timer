package com.terminalsoul.app;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class MainActivity extends Activity {

    private LinearLayout containerSchedules;
    private TextView txtActiveCountBadge;
    private TextView txtEmptySchedules;
    private Button btnAddTime;

    // Presets
    private Button btnPreset900;
    private Button btnPreset1300;
    private Button btnPreset1800;
    private Button btnPreset2130;

    // Testing
    private Button btnTest5s;
    private Button btnPreviewPopup;

    // Permissions
    private TextView txtPermissionStatus;
    private Button btnGrantOverlay;
    private Button btnGrantFullScreenIntent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Preload messages
        MessageProvider.ensureLoaded(this);

        containerSchedules = findViewById(R.id.container_schedules);
        txtActiveCountBadge = findViewById(R.id.txt_active_count_badge);
        txtEmptySchedules = findViewById(R.id.txt_empty_schedules);
        btnAddTime = findViewById(R.id.btn_add_time);

        btnPreset900 = findViewById(R.id.btn_preset_900);
        btnPreset1300 = findViewById(R.id.btn_preset_1300);
        btnPreset1800 = findViewById(R.id.btn_preset_1800);
        btnPreset2130 = findViewById(R.id.btn_preset_2130);

        btnTest5s = findViewById(R.id.btn_test_5s);
        btnPreviewPopup = findViewById(R.id.btn_preview_popup);

        txtPermissionStatus = findViewById(R.id.txt_permission_status);
        btnGrantOverlay = findViewById(R.id.btn_grant_overlay);
        btnGrantFullScreenIntent = findViewById(R.id.btn_grant_fullscreen_intent);

        // Ensure all active schedules are armed in AlarmManager
        ScheduleManager.rescheduleAll(this);

        setupEventHandlers();
        refreshSchedulesList();
    }

    @Override
    protected void onResume() {
        super.onResume();
        checkPermissionsStatus();
        refreshSchedulesList();
    }

    private void setupEventHandlers() {
        // + Add Time
        btnAddTime.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openTimePicker(null);
            }
        });

        // Presets
        btnPreset900.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addOrUpdatePreset(9, 0, "Morning Boot");
            }
        });

        btnPreset1300.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addOrUpdatePreset(13, 0, "Afternoon Process");
            }
        });

        btnPreset1800.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addOrUpdatePreset(18, 0, "Evening Build");
            }
        });

        btnPreset2130.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addOrUpdatePreset(21, 30, "Night Reflection");
            }
        });

        // 5-Second Test Alarm for immediate Screen-ON & Screen-OFF verification
        btnTest5s.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                triggerTestAlarmIn5Seconds();
            }
        });

        // Instant Preview
        btnPreviewPopup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Calendar now = Calendar.getInstance();
                int hour = now.get(Calendar.HOUR_OF_DAY);
                int minute = now.get(Calendar.MINUTE);
                String cat = new ScheduleItem("preview", hour, minute, true, "").getCategory();
                MessageProvider.ScheduledMessage msg = MessageProvider.getMessageForSchedule(
                        MainActivity.this, new Date(), hour, minute, cat
                );

                Intent intent = new Intent(MainActivity.this, PopupActivity.class);
                intent.putExtra(PopupActivity.EXTRA_MESSAGE, msg.message);
                intent.putExtra(PopupActivity.EXTRA_CATEGORY, cat);
                intent.putExtra(PopupActivity.EXTRA_HOUR, hour);
                intent.putExtra(PopupActivity.EXTRA_MINUTE, minute);
                intent.putExtra(PopupActivity.EXTRA_MSG_ID, msg.id);
                startActivity(intent);
            }
        });

        // Grant Overlay Permission
        btnGrantOverlay.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    try {
                        Intent intent = new Intent(
                                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                Uri.parse("package:" + getPackageName())
                        );
                        startActivity(intent);
                    } catch (Exception e) {
                        Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
                        startActivity(intent);
                    }
                }
            }
        });

        // Grant Full-Screen Intent Permission (Android 14+)
        btnGrantFullScreenIntent.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (Build.VERSION.SDK_INT >= 34) {
                    try {
                        Intent intent = new Intent(
                                Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT,
                                Uri.parse("package:" + getPackageName())
                        );
                        startActivity(intent);
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "Check Special App Access in Settings", Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });
    }

    private void addOrUpdatePreset(int hour, int minute, String label) {
        List<ScheduleItem> list = ScheduleManager.getSchedules(this);
        for (ScheduleItem item : list) {
            if (item.getHour() == hour && item.getMinute() == minute) {
                item.setEnabled(true);
                ScheduleManager.updateSchedule(this, item);
                Toast.makeText(this, "Slot " + item.getFormattedTime() + " enabled!", Toast.LENGTH_SHORT).show();
                refreshSchedulesList();
                return;
            }
        }
        String id = "preset_" + System.currentTimeMillis();
        ScheduleItem newItem = new ScheduleItem(id, hour, minute, true, label);
        ScheduleManager.addSchedule(this, newItem);
        Toast.makeText(this, "Added " + newItem.getFormattedTime() + " (" + newItem.getCategoryDisplayName() + ")", Toast.LENGTH_SHORT).show();
        refreshSchedulesList();
    }

    private void openTimePicker(final ScheduleItem existingItem) {
        Calendar cal = Calendar.getInstance();
        int initialHour = existingItem != null ? existingItem.getHour() : cal.get(Calendar.HOUR_OF_DAY);
        int initialMinute = existingItem != null ? existingItem.getMinute() : cal.get(Calendar.MINUTE);

        TimePickerDialog picker = new TimePickerDialog(
                this,
                new TimePickerDialog.OnTimeSetListener() {
                    @Override
                    public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
                        if (existingItem != null) {
                            existingItem.setHour(hourOfDay);
                            existingItem.setMinute(minute);
                            ScheduleManager.updateSchedule(MainActivity.this, existingItem);
                            Toast.makeText(MainActivity.this, "Updated to " + existingItem.getFormattedTime(), Toast.LENGTH_SHORT).show();
                        } else {
                            String id = "sch_" + System.currentTimeMillis();
                            ScheduleItem newItem = new ScheduleItem(id, hourOfDay, minute, true, "");
                            ScheduleManager.addSchedule(MainActivity.this, newItem);
                            Toast.makeText(MainActivity.this, "Added " + newItem.getFormattedTime() + " (" + newItem.getCategoryDisplayName() + ")", Toast.LENGTH_SHORT).show();
                        }
                        refreshSchedulesList();
                    }
                },
                initialHour,
                initialMinute,
                false
        );
        picker.show();
    }

    private void triggerTestAlarmIn5Seconds() {
        AlarmManager am = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;

        Calendar cal = Calendar.getInstance();
        int hour = cal.get(Calendar.HOUR_OF_DAY);
        int minute = cal.get(Calendar.MINUTE);
        String category = new ScheduleItem("test", hour, minute, true, "").getCategory();

        long triggerAt = System.currentTimeMillis() + 5000L;

        Intent intent = new Intent(this, PopupReceiver.class);
        intent.setAction(ScheduleManager.ACTION_TRIGGER_POPUP);
        intent.putExtra(ScheduleManager.EXTRA_SCHEDULE_ID, "test_5s");
        intent.putExtra(ScheduleManager.EXTRA_HOUR, hour);
        intent.putExtra(ScheduleManager.EXTRA_MINUTE, minute);
        intent.putExtra(ScheduleManager.EXTRA_CATEGORY, category);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent pi = PendingIntent.getBroadcast(this, 99999, intent, flags);

        Intent showIntent = new Intent(this, MainActivity.class);
        PendingIntent showPi = PendingIntent.getActivity(this, 99998, showIntent, flags);
        AlarmManager.AlarmClockInfo clockInfo = new AlarmManager.AlarmClockInfo(triggerAt, showPi);

        am.setAlarmClock(clockInfo, pi);

        Toast.makeText(
                this,
                "⚡ Test armed for 5 seconds!\nPress Home or Lock phone now to test auto-popup!",
                Toast.LENGTH_LONG
        ).show();
    }

    private void refreshSchedulesList() {
        containerSchedules.removeAllViews();
        List<ScheduleItem> list = ScheduleManager.getSchedules(this);

        int activeCount = 0;
        LayoutInflater inflater = LayoutInflater.from(this);

        for (final ScheduleItem item : list) {
            if (item.isEnabled()) activeCount++;

            View itemView = inflater.inflate(R.layout.item_schedule, containerSchedules, false);

            TextView txtStatus = itemView.findViewById(R.id.txt_status_indicator);
            TextView txtTime = itemView.findViewById(R.id.txt_schedule_time);
            TextView txtCategory = itemView.findViewById(R.id.txt_category_badge);
            TextView txtNextTrigger = itemView.findViewById(R.id.txt_next_trigger);
            final Button btnToggle = itemView.findViewById(R.id.btn_toggle);
            Button btnEdit = itemView.findViewById(R.id.btn_edit);
            Button btnDelete = itemView.findViewById(R.id.btn_delete);

            txtTime.setText(item.getFormattedTime());
            txtCategory.setText(item.getCategoryDisplayName());

            // Colorize category badge
            switch (item.getCategory()) {
                case "morning":
                    txtCategory.setTextColor(0xFF38BDF8); // Cyan
                    break;
                case "afternoon":
                    txtCategory.setTextColor(0xFFFBBF24); // Amber
                    break;
                case "evening":
                    txtCategory.setTextColor(0xFFF87171); // Rose
                    break;
                case "night":
                default:
                    txtCategory.setTextColor(0xFFC084FC); // Purple
                    break;
            }

            if (item.isEnabled()) {
                txtStatus.setText("🟢");
                txtTime.setTextColor(0xFFFFFFFF);
                btnToggle.setText("ACTIVE");
                btnToggle.setBackgroundColor(0xFF059669); // Emerald
                txtNextTrigger.setText(getNextTriggerLabel(item));
            } else {
                txtStatus.setText("⚪");
                txtTime.setTextColor(0xFF64748B);
                btnToggle.setText("OFF");
                btnToggle.setBackgroundColor(0xFF334155); // Slate
                txtNextTrigger.setText("Disabled (will not trigger)");
            }

            btnToggle.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    boolean newState = !item.isEnabled();
                    ScheduleManager.toggleSchedule(MainActivity.this, item.getId(), newState);
                    refreshSchedulesList();
                }
            });

            btnEdit.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    openTimePicker(item);
                }
            });

            btnDelete.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    ScheduleManager.deleteSchedule(MainActivity.this, item.getId());
                    Toast.makeText(MainActivity.this, "Removed " + item.getFormattedTime(), Toast.LENGTH_SHORT).show();
                    refreshSchedulesList();
                }
            });

            containerSchedules.addView(itemView);
        }

        txtActiveCountBadge.setText(activeCount + " ACTIVE");
        txtActiveCountBadge.setBackgroundColor(activeCount > 0 ? 0xFF064E3B : 0xFF374151);

        if (list.isEmpty()) {
            txtEmptySchedules.setVisibility(View.VISIBLE);
        } else {
            txtEmptySchedules.setVisibility(View.GONE);
        }
    }

    private String getNextTriggerLabel(ScheduleItem item) {
        Calendar cal = Calendar.getInstance();
        Calendar target = Calendar.getInstance();
        target.setTimeInMillis(item.getNextTriggerMillis());

        boolean isToday = cal.get(Calendar.DAY_OF_YEAR) == target.get(Calendar.DAY_OF_YEAR) &&
                          cal.get(Calendar.YEAR) == target.get(Calendar.YEAR);

        return "Next: " + (isToday ? "Today" : "Tomorrow") + " at " + item.getFormattedTime();
    }

    private void checkPermissionsStatus() {
        boolean overlayGranted = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            overlayGranted = Settings.canDrawOverlays(this);
        }

        boolean fullScreenIntentGranted = true;
        if (Build.VERSION.SDK_INT >= 34) {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) {
                fullScreenIntentGranted = nm.canUseFullScreenIntent();
            }
        }

        if (overlayGranted && fullScreenIntentGranted) {
            txtPermissionStatus.setText("✅ FULL-SCREEN POPUPS ACTIVE\nDirect popups will display smoothly on Screen ON (over any app) and Screen OFF (wake lock screen).");
            txtPermissionStatus.setTextColor(0xFF34D399); // Green
            btnGrantOverlay.setVisibility(View.GONE);
            btnGrantFullScreenIntent.setVisibility(View.GONE);
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append("⚠️ ACTION REQUIRED FOR SCREEN-ON POPUP:\n");
            if (!overlayGranted) {
                sb.append("• 'Display over other apps' is needed so the terminal popup can appear while using other apps.\n");
                btnGrantOverlay.setVisibility(View.VISIBLE);
            } else {
                btnGrantOverlay.setVisibility(View.GONE);
            }

            if (!fullScreenIntentGranted) {
                sb.append("• Full-screen intent permission needed in Special App Access (Android 14+).\n");
                btnGrantFullScreenIntent.setVisibility(View.VISIBLE);
            } else {
                btnGrantFullScreenIntent.setVisibility(View.GONE);
            }

            txtPermissionStatus.setText(sb.toString().trim());
            txtPermissionStatus.setTextColor(0xFFFBBF24); // Amber
        }
    }
}
