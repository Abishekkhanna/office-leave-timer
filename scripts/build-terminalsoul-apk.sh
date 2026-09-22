#!/usr/bin/env bash
set -e

echo "=== Building TerminalSoul Native Android APK ==="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$WORKSPACE_ROOT/android_terminalsoul"
PUBLIC_DIR="$WORKSPACE_ROOT/public"
DIST_DIR="$WORKSPACE_ROOT/dist"

export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

BUILD_TOOLS_DIR=$(find /opt/android-sdk/build-tools/ -mindepth 1 -maxdepth 1 -type d | head -n 1)
PLATFORM_JAR="/opt/android-sdk/platforms/android-34/android.jar"

echo "Build tools: $BUILD_TOOLS_DIR"
echo "Platform jar: $PLATFORM_JAR"
echo "Project root: $PROJECT_ROOT"

cd "$PROJECT_ROOT"

APP_DIR="$PROJECT_ROOT/app"
BUILD_DIR="$APP_DIR/build/manual"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/gen" "$BUILD_DIR/obj" "$BUILD_DIR/apk" "$BUILD_DIR/dex"

# Ensure scheduled_messages.json is present in assets
mkdir -p "$APP_DIR/src/main/assets"
if [ -f "$WORKSPACE_ROOT/scheduled_messages.json" ]; then
    cp "$WORKSPACE_ROOT/scheduled_messages.json" "$APP_DIR/src/main/assets/scheduled_messages.json"
fi

echo "Step 1: Compiling resources with aapt2..."
"$BUILD_TOOLS_DIR/aapt2" compile --dir "$APP_DIR/src/main/res" -o "$BUILD_DIR/resources.zip"

echo "Step 2: Linking resources and assets with aapt2..."
"$BUILD_TOOLS_DIR/aapt2" link "$BUILD_DIR/resources.zip" \
    -I "$PLATFORM_JAR" \
    --manifest "$APP_DIR/src/main/AndroidManifest.xml" \
    -A "$APP_DIR/src/main/assets" \
    --java "$BUILD_DIR/gen" \
    -o "$BUILD_DIR/unaligned.apk" \
    --auto-add-overlay

echo "Step 3: Compiling Java sources with javac..."
javac -encoding UTF-8 \
    -cp "$PLATFORM_JAR" \
    -d "$BUILD_DIR/obj" \
    $(find "$APP_DIR/src/main/java" "$BUILD_DIR/gen" -name "*.java")

echo "Step 4: Compiling class files into DEX with d8..."
CLASS_FILES=$(find "$BUILD_DIR/obj" -name "*.class")
"$BUILD_TOOLS_DIR/d8" --output "$BUILD_DIR/dex" \
    --lib "$PLATFORM_JAR" \
    --min-api 26 \
    $CLASS_FILES

echo "Step 5: Adding DEX and assets to APK..."
cp "$BUILD_DIR/unaligned.apk" "$BUILD_DIR/app-unsigned.apk"
cd "$BUILD_DIR/dex"
"$BUILD_TOOLS_DIR/aapt" add "$BUILD_DIR/app-unsigned.apk" classes.dex
cd "$APP_DIR/src/main"
"$BUILD_TOOLS_DIR/aapt" add "$BUILD_DIR/app-unsigned.apk" assets/scheduled_messages.json || true
cd "$PROJECT_ROOT"

echo "Step 6: Aligning APK with zipalign..."
"$BUILD_TOOLS_DIR/zipalign" -f 4 "$BUILD_DIR/app-unsigned.apk" "$BUILD_DIR/app-aligned.apk"

echo "Step 7: Signing APK with debug keystore..."
KEYSTORE="$BUILD_DIR/debug.keystore"
if [ ! -f "$KEYSTORE" ]; then
    keytool -genkey -v -keystore "$KEYSTORE" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=TerminalSoul,C=US"
fi

"$BUILD_TOOLS_DIR/apksigner" sign --ks "$KEYSTORE" --ks-pass pass:android --key-pass pass:android --ks-key-alias androiddebugkey --out "$APP_DIR/TerminalSoul.apk" "$BUILD_DIR/app-aligned.apk"

mkdir -p "$PUBLIC_DIR"
cp "$APP_DIR/TerminalSoul.apk" "$PUBLIC_DIR/TerminalSoul.apk"

if [ -d "$DIST_DIR" ]; then
    cp "$APP_DIR/TerminalSoul.apk" "$DIST_DIR/TerminalSoul.apk" || true
fi

echo "=== TerminalSoul APK Successfully Built ==="
ls -lh "$PUBLIC_DIR/TerminalSoul.apk"
"$BUILD_TOOLS_DIR/aapt" dump badging "$PUBLIC_DIR/TerminalSoul.apk" | grep -E "package:|application-label:|launchable-activity:" || true
echo "Assets in TerminalSoul APK:"
"$BUILD_TOOLS_DIR/aapt" list "$PUBLIC_DIR/TerminalSoul.apk" | grep "assets/scheduled_messages.json" || true
