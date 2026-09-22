package com.officeleave.timerv1;

import android.app.Activity;
import android.app.NotificationManager;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends Activity {

    private TextView statusTextView;
    private TextView timeDisplayTextView;
    private TextView todayMessageTextView;
    private Button startButton;
    private Button resetButton;
    private Button previewAlertButton;

    // Full-screen permissions & testing
    private TextView txtOverlayStatus;
    private Button btnGrantOverlay;
    private Button btnGrantFullScreenIntent;
    private Button btnTest5sAlert;

    // Office Hours (HH:MM) Configuration views
    private TextView hoursDisplayTextView;
    private TextView hoursSummaryTextView;
    private EditText editHours;
    private EditText editMinutes;
    private Button btnSaveDuration;
    private Button btnPickTimeDialog;

    // Quick chips
    private Button btnChip900;
    private Button btnChip830;
    private Button btnChip800;
    private Button btnChip600;
    private Button btnChip430;
    private Button btnChip001;

    // Presets
    private Button btnPreset900;
    private Button btnPreset932;
    private Button btnPreset942;
    private Button btnPreset1005;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        statusTextView = findViewById(R.id.main_status_text);
        timeDisplayTextView = findViewById(R.id.main_time_display);
        todayMessageTextView = findViewById(R.id.main_today_message);
        startButton = findViewById(R.id.main_btn_start);
        resetButton = findViewById(R.id.main_btn_reset);
        previewAlertButton = findViewById(R.id.main_btn_preview_alert);

        // Permissions views
        txtOverlayStatus = findViewById(R.id.txt_overlay_status);
        btnGrantOverlay = findViewById(R.id.btn_grant_overlay);
        btnGrantFullScreenIntent = findViewById(R.id.btn_grant_fullscreen_intent);
        btnTest5sAlert = findViewById(R.id.btn_test_5s_alert);

        // Office Hours Config
        hoursDisplayTextView = findViewById(R.id.main_hours_display);
        hoursSummaryTextView = findViewById(R.id.main_hours_summary);
        editHours = findViewById(R.id.edit_shift_hours);
        editMinutes = findViewById(R.id.edit_shift_minutes);
        btnSaveDuration = findViewById(R.id.btn_save_shift_duration);
        btnPickTimeDialog = findViewById(R.id.btn_pick_time_dialog);

        // Chips
        btnChip900 = findViewById(R.id.btn_chip_900);
        btnChip830 = findViewById(R.id.btn_chip_830);
        btnChip800 = findViewById(R.id.btn_chip_800);
        btnChip600 = findViewById(R.id.btn_chip_600);
        btnChip430 = findViewById(R.id.btn_chip_430);
        btnChip001 = findViewById(R.id.btn_chip_001);

        // Presets
        btnPreset900 = findViewById(R.id.btn_preset_900);
        btnPreset932 = findViewById(R.id.btn_preset_932);
        btnPreset942 = findViewById(R.id.btn_preset_942);
        btnPreset1005 = findViewById(R.id.btn_preset_1005);

        // Permissions handlers
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

        // 5-Second Alert Test (Allows instant testing with Screen ON or Screen OFF)
        btnTest5sAlert.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                long testLeaveTime = System.currentTimeMillis() + 5000L; // 5 seconds
                AlertScheduler.scheduleLeaveAlert(MainActivity.this, testLeaveTime);
                Toast.makeText(
                        MainActivity.this,
                        "⚡ 5-Sec Alert Armed! Press Home (Screen ON) or Lock Phone (Screen OFF) now!",
                        Toast.LENGTH_LONG
                ).show();
            }
        });

        // Load today's deterministic message
        MessageProvider.LeaveMessage dailyMessage = MessageProvider.getMessageForDate(this, new Date());
        todayMessageTextView.setText("Today's Alert (ID #" + dailyMessage.id + "):\n" + dailyMessage.message);

        // START Button (delegates to widget logic)
        startButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                OfficeLeaveWidgetProvider.handleStart(MainActivity.this);
                refreshUI();
            }
        });

        // RESET Button (delegates to widget logic)
        resetButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                OfficeLeaveWidgetProvider.handleReset(MainActivity.this);
                refreshUI();
            }
        });

        // Instant Preview of Full-Screen Alert
        previewAlertButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent alertIntent = new Intent(MainActivity.this, LeaveAlertActivity.class);
                startActivity(alertIntent);
            }
        });

        // Save Duration from manual HH:MM inputs
        btnSaveDuration.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveDurationFromInputs();
            }
        });

        // Pick Time Dialog (24-hour mode to select hours 0-23 and minutes 0-59)
        btnPickTimeDialog.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int currentHours = OfficeLeaveWidgetProvider.getShiftDurationHours(MainActivity.this);
                int currentMins = OfficeLeaveWidgetProvider.getShiftDurationMinutes(MainActivity.this);

                TimePickerDialog dialog = new TimePickerDialog(
                        MainActivity.this,
                        new TimePickerDialog.OnTimeSetListener() {
                            @Override
                            public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
                                applyAndSaveDuration(hourOfDay, minute);
                            }
                        },
                        currentHours,
                        currentMins,
                        true // 24 hour view allows 00:00 to 23:59 duration
                );
                dialog.setTitle("Select Total Office Hours (HH:MM)");
                dialog.show();
            }
        });

        // Setup Quick Chips
        setupChipButton(btnChip900, 9, 0);
        setupChipButton(btnChip830, 8, 30);
        setupChipButton(btnChip800, 8, 0);
        setupChipButton(btnChip600, 6, 0);
        setupChipButton(btnChip430, 4, 30);
        setupChipButton(btnChip001, 0, 1);

        // Preset Test Buttons
        setupPresetButton(btnPreset900, 9, 0);
        setupPresetButton(btnPreset932, 9, 32);
        setupPresetButton(btnPreset942, 9, 42);
        setupPresetButton(btnPreset1005, 10, 5);

        refreshUI();
    }

    private void setupChipButton(Button btn, final int hours, final int minutes) {
        if (btn == null) return;
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                applyAndSaveDuration(hours, minutes);
            }
        });
    }

    private void saveDurationFromInputs() {
        String hStr = editHours.getText() != null ? editHours.getText().toString().trim() : "";
        String mStr = editMinutes.getText() != null ? editMinutes.getText().toString().trim() : "";

        int hours = 9;
        int minutes = 0;

        try {
            if (!hStr.isEmpty()) {
                hours = Integer.parseInt(hStr);
            }
            if (!mStr.isEmpty()) {
                minutes = Integer.parseInt(mStr);
            }
        } catch (NumberFormatException e) {
            Toast.makeText(this, "Please enter valid numbers for HH and MM", Toast.LENGTH_SHORT).show();
            return;
        }

        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            Toast.makeText(this, "Hours must be 0-23 and minutes 0-59", Toast.LENGTH_SHORT).show();
            return;
        }

        if (hours == 0 && minutes == 0) {
            Toast.makeText(this, "Duration must be at least 1 minute", Toast.LENGTH_SHORT).show();
            return;
        }

        applyAndSaveDuration(hours, minutes);
    }

    private void applyAndSaveDuration(int hours, int minutes) {
        OfficeLeaveWidgetProvider.setShiftDuration(this, hours, minutes);

        String formattedDuration = String.format(Locale.US, "%02d:%02d", hours, minutes);
        Toast.makeText(this, "Workday set to " + formattedDuration + " (" + hours + "h " + minutes + "m)", Toast.LENGTH_SHORT).show();

        refreshUI();
    }

    private void setupPresetButton(Button btn, final int startHour, final int startMinute) {
        if (btn == null) return;

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Calendar startCal = Calendar.getInstance();
                startCal.set(Calendar.HOUR_OF_DAY, startHour);
                startCal.set(Calendar.MINUTE, startMinute);
                startCal.set(Calendar.SECOND, 0);
                startCal.set(Calendar.MILLISECOND, 0);

                int totalMinutes = OfficeLeaveWidgetProvider.getTotalShiftDurationMinutes(MainActivity.this);
                Calendar leaveCal = (Calendar) startCal.clone();
                leaveCal.add(Calendar.MINUTE, totalMinutes);

                SharedPreferences prefs = getSharedPreferences(OfficeLeaveWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE);
                prefs.edit()
                        .putLong(OfficeLeaveWidgetProvider.PREF_KEY_START_TIME, startCal.getTimeInMillis())
                        .putLong(OfficeLeaveWidgetProvider.PREF_KEY_LEAVE_TIME, leaveCal.getTimeInMillis())
                        .putBoolean(OfficeLeaveWidgetProvider.PREF_KEY_IS_ACTIVE, true)
                        .apply();

                OfficeLeaveWidgetProvider.updateAllWidgets(MainActivity.this);
                AlertScheduler.scheduleLeaveAlert(MainActivity.this, leaveCal.getTimeInMillis());
                refreshUI();
            }
        });
    }

    private void updatePresetButtonLabels() {
        int totalMinutes = OfficeLeaveWidgetProvider.getTotalShiftDurationMinutes(this);
        SimpleDateFormat timeFormat = new SimpleDateFormat("h:mm a", Locale.getDefault());

        updateSinglePresetLabel(btnPreset900, 9, 0, totalMinutes, timeFormat);
        updateSinglePresetLabel(btnPreset932, 9, 32, totalMinutes, timeFormat);
        updateSinglePresetLabel(btnPreset942, 9, 42, totalMinutes, timeFormat);
        updateSinglePresetLabel(btnPreset1005, 10, 5, totalMinutes, timeFormat);
    }

    private void updateSinglePresetLabel(Button btn, int startHour, int startMin, int durationMins, SimpleDateFormat format) {
        if (btn == null) return;
        Calendar start = Calendar.getInstance();
        start.set(Calendar.HOUR_OF_DAY, startHour);
        start.set(Calendar.MINUTE, startMin);
        Calendar leave = (Calendar) start.clone();
        leave.add(Calendar.MINUTE, durationMins);

        String startStr = format.format(start.getTime());
        String leaveStr = format.format(leave.getTime());
        btn.setText(startStr + " → " + leaveStr);
    }

    @Override
    protected void onResume() {
        super.onResume();
        refreshUI();
    }

    private void refreshUI() {
        int hours = OfficeLeaveWidgetProvider.getShiftDurationHours(this);
        int mins = OfficeLeaveWidgetProvider.getShiftDurationMinutes(this);

        String hhmm = String.format(Locale.US, "%02d:%02d", hours, mins);
        hoursDisplayTextView.setText(hhmm);
        hoursSummaryTextView.setText("(" + hours + " hrs " + String.format(Locale.US, "%02d", mins) + " mins)");

        editHours.setText(String.format(Locale.US, "%02d", hours));
        editMinutes.setText(String.format(Locale.US, "%02d", mins));

        updatePresetButtonLabels();

        SharedPreferences prefs = getSharedPreferences(OfficeLeaveWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE);
        boolean isActive = prefs.getBoolean(OfficeLeaveWidgetProvider.PREF_KEY_IS_ACTIVE, false);
        long leaveTimeMillis = prefs.getLong(OfficeLeaveWidgetProvider.PREF_KEY_LEAVE_TIME, 0);

        if (isActive && leaveTimeMillis > 0) {
            SimpleDateFormat timeFormat = new SimpleDateFormat("h:mm a", Locale.getDefault());
            String formattedLeaveTime = timeFormat.format(new Date(leaveTimeMillis));

            statusTextView.setText("Leave at");
            timeDisplayTextView.setText(formattedLeaveTime);
            timeDisplayTextView.setVisibility(View.VISIBLE);
        } else {
            statusTextView.setText("Tap START");
            timeDisplayTextView.setText("");
            timeDisplayTextView.setVisibility(View.GONE);
        }

        checkPermissionsStatus();
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
            txtOverlayStatus.setText("✅ FULL-SCREEN POPUP ACTIVE\nDirect popups are permitted for both Screen ON (over any app) and Screen OFF (lock screen wake-up).");
            txtOverlayStatus.setTextColor(0xFF34D399); // Green
            btnGrantOverlay.setVisibility(View.GONE);
            btnGrantFullScreenIntent.setVisibility(View.GONE);
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append("⚠️ ACTION REQUIRED FOR SCREEN-ON POPUP:\n");
            if (!overlayGranted) {
                sb.append("• 'Display over other apps' is needed so the full-screen alert can pop up while screen is ON or while using other apps.\n");
                btnGrantOverlay.setVisibility(View.VISIBLE);
            } else {
                btnGrantOverlay.setVisibility(View.GONE);
            }

            if (!fullScreenIntentGranted) {
                sb.append("• Full-screen notifications need permission in Special App Access.\n");
                btnGrantFullScreenIntent.setVisibility(View.VISIBLE);
            } else {
                btnGrantFullScreenIntent.setVisibility(View.GONE);
            }

            txtOverlayStatus.setText(sb.toString().trim());
            txtOverlayStatus.setTextColor(0xFFFBBF24); // Amber
        }
    }
}
