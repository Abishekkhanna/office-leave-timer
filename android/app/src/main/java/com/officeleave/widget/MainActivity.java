package com.officeleave.widget;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends Activity {

    private TextView statusTextView;
    private TextView timeDisplayTextView;
    private Button startButton;
    private Button resetButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        statusTextView = findViewById(R.id.main_status_text);
        timeDisplayTextView = findViewById(R.id.main_time_display);
        startButton = findViewById(R.id.main_btn_start);
        resetButton = findViewById(R.id.main_btn_reset);

        startButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Calendar now = Calendar.getInstance();
                long startTimeMillis = now.getTimeInMillis();

                Calendar leaveTime = (Calendar) now.clone();
                leaveTime.add(Calendar.HOUR_OF_DAY, 9);
                long leaveTimeMillis = leaveTime.getTimeInMillis();

                SharedPreferences prefs = getSharedPreferences(OfficeLeaveWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE);
                prefs.edit()
                        .putLong(OfficeLeaveWidgetProvider.PREF_KEY_START_TIME, startTimeMillis)
                        .putLong(OfficeLeaveWidgetProvider.PREF_KEY_LEAVE_TIME, leaveTimeMillis)
                        .putBoolean(OfficeLeaveWidgetProvider.PREF_KEY_IS_ACTIVE, true)
                        .apply();

                OfficeLeaveWidgetProvider.updateAllWidgets(MainActivity.this);
                refreshUI();
            }
        });

        resetButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences prefs = getSharedPreferences(OfficeLeaveWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE);
                prefs.edit().clear().apply();

                OfficeLeaveWidgetProvider.updateAllWidgets(MainActivity.this);
                refreshUI();
            }
        });

        refreshUI();
    }

    @Override
    protected void onResume() {
        super.onResume();
        refreshUI();
    }

    private void refreshUI() {
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
    }
}
