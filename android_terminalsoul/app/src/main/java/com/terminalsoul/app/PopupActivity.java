package com.terminalsoul.app;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

import java.util.Locale;

public class PopupActivity extends Activity {
    public static final String EXTRA_MESSAGE = "extra_message";
    public static final String EXTRA_CATEGORY = "extra_category";
    public static final String EXTRA_HOUR = "extra_hour";
    public static final String EXTRA_MINUTE = "extra_minute";
    public static final String EXTRA_MSG_ID = "extra_msg_id";

    private TextView txtHeader;
    private TextView txtCategoryBadge;
    private TextView txtScheduledEventTag;
    private TextView txtMessage;
    private TextView txtMeta;
    private Button btnClose;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Configure lockscreen display & auto wake-up for Android 8 through 15
        setupWindowFlags();

        setContentView(R.layout.activity_popup);

        txtHeader = findViewById(R.id.txt_terminal_header);
        txtCategoryBadge = findViewById(R.id.txt_popup_category_badge);
        txtScheduledEventTag = findViewById(R.id.txt_scheduled_event_tag);
        txtMessage = findViewById(R.id.txt_popup_message);
        txtMeta = findViewById(R.id.txt_message_meta);
        btnClose = findViewById(R.id.btn_close_popup);

        Intent intent = getIntent();
        String message = intent.getStringExtra(EXTRA_MESSAGE);
        String category = intent.getStringExtra(EXTRA_CATEGORY);
        int hour = intent.getIntExtra(EXTRA_HOUR, 9);
        int minute = intent.getIntExtra(EXTRA_MINUTE, 0);
        int msgId = intent.getIntExtra(EXTRA_MSG_ID, 1);

        if (category == null || category.isEmpty()) category = "morning";
        if (message == null || message.isEmpty()) {
            message = "☀️ MORNING DEPLOYMENT\nGood morning, Abishek. 🧑💻\nYour developer instance has started.\n\nCoffee dependency: REQUIRED ☕😂";
        }

        // Format event time
        int displayHour = hour % 12;
        if (displayHour == 0) displayHour = 12;
        String amPm = (hour < 12) ? "AM" : "PM";
        String timeStr = String.format(Locale.US, "%02d:%02d %s", displayHour, minute, amPm);

        txtScheduledEventTag.setText("[SCHEDULED EVENT: " + timeStr + "]");
        txtCategoryBadge.setText(getCategoryBadge(category));
        txtMessage.setText(message);
        txtMeta.setText("TerminalSoul #" + msgId + " • " + category.toUpperCase() + " • Daily Deterministic Seed");

        // Close button: cleanly dismiss without reopening main activity
        btnClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    finishAndRemoveTask();
                } else {
                    finish();
                }
            }
        });
    }

    private String getCategoryBadge(String cat) {
        switch (cat.toLowerCase()) {
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

    private void setupWindowFlags() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
            KeyguardManager km = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
            if (km != null) {
                km.requestDismissKeyguard(this, null);
            }
        } else {
            getWindow().addFlags(
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            );
        }

        getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON
        );
    }

    @Override
    public void onBackPressed() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            finishAndRemoveTask();
        } else {
            finish();
        }
    }
}
