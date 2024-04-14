#!/bin/sh

WORKING_DIR=$(pwd)
OUTPUT_LOG_PATH="$WORKING_DIR/log.output.log"
ERROR_LOG_PATH="$WORKING_DIR/log.err.log"
OUTPUT_PATH="$WORKING_DIR/com.mrskiro.on-air.plist"
SCRIPT_PATH="$PWD/scripts/index.ts"
DENO=$(which deno)

CONTENT=$(cat <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>com.mrskiro.on-air</string>

    <key>WatchPaths</key>
    <array>
      <string>/Library/Preferences/Audio/com.apple.audio.SystemSettings.plist</string>
    </array>

    <key>ProgramArguments</key>
    <array>
      <string>$DENO</string>
      <string>run</string>
      <string>--allow-write</string>
      <string>--allow-run</string>
      <string>--allow-read</string>
      <string>--allow-env</string>
      <string>--allow-net</string>
      <string>$SCRIPT_PATH</string>
    </array>
    
    <key>StandardOutPath</key>
    <string>$OUTPUT_LOG_PATH</string>

    <key>StandardErrorPath</key>
    <string>$ERROR_LOG_PATH</string>
  </dict>
</plist>
EOF
)

echo "$CONTENT" > "$OUTPUT_PATH"

echo "The plist file has been created: $OUTPUT_PATH"