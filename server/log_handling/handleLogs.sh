#!/bin/bash

# Configuration
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HOST_LOG_FILE="/tmp/access.log"
LOCAL_LOG_DIR="$SCRIPT_DIR/logs"

echo "Looking for log file at: $HOST_LOG_FILE"

# Month conversion map
declare -A MONTH_MAP=(
  [Jan]="01" [Feb]="02" [Mar]="03" [Apr]="04" [May]="05" [Jun]="06"
  [Jul]="07" [Aug]="08" [Sep]="09" [Oct]="10" [Nov]="11" [Dec]="12"
)

# Ensure log file exists
if [ ! -f "$HOST_LOG_FILE" ]; then
  echo "Log file not found: $HOST_LOG_FILE"
  exit 1
fi

if [ ! -s "$HOST_LOG_FILE" ]; then
  echo "Log file is empty."
  exit 1
fi

# Create output directory
mkdir -p "$LOCAL_LOG_DIR"

# Read and split logs
while IFS= read -r line; do
  # Needs a specific format for logs
  # Example format: 127.0.0.1 - - [10/Jun/2024:12:34:56 +0000] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0"
  if [[ $line =~ \[([0-9]{2})/([A-Za-z]{3})/([0-9]{4}) ]] ; then
    DAY="${BASH_REMATCH[1]}"
    MONTH_STR="${BASH_REMATCH[2]}"
    YEAR="${BASH_REMATCH[3]}"
    MONTH="${MONTH_MAP[$MONTH_STR]}"
    DATE="${YEAR}-${MONTH}-${DAY}"

    echo "$line" >> "${LOCAL_LOG_DIR}/access-${DATE}.log"
  else
    # Handle lines that don't match the expected format
    echo "$line" >> "${LOCAL_LOG_DIR}/unmatched.log"
  fi
done < "$HOST_LOG_FILE"

# Empty the original log file
: > "$HOST_LOG_FILE"

echo "Log splitting complete. See files in: $LOCAL_LOG_DIR"
