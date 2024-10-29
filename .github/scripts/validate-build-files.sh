#!/bin/bash
set -eo pipefail

if [[ -z "$PLUGIN_SLUG" ]]; then
	echo "Set the PLUGIN_SLUG env var"
	exit 1
fi

if [[ -z "$PLUGIN_VERSION" ]]; then
	echo "Set the PLUGIN_VERSION env var"
	exit 1
fi

PLUGIN_PATH="$GITHUB_WORKSPACE/${PLUGIN_SLUG}"

cd $PLUGIN_PATH

PLUGIN_MAIN_FILE="${PLUGIN_SLUG}.php"

if [ ! -f "${PLUGIN_MAIN_FILE}" ]; then
	echo "${PLUGIN_MAIN_FILE} file does not exist"
	exit 1
fi

if [ ! -f "readme.txt" ]; then
	echo "readme.txt file does not exist"
	exit 1
fi

if [[ $(grep -c "Version: $PLUGIN_VERSION" "$PLUGIN_MAIN_FILE") -eq 0 ]]; then
	echo "${PLUGIN_MAIN_FILE} file does not contain the correct build version : $PLUGIN_VERSION"
	EXISTING_VERSION=$(sed -n 's/.*Version: \(.*\)/\1/p' "$PLUGIN_MAIN_FILE")
	echo "Existing version: $EXISTING_VERSION"
	exit 1
fi

if [[ $(grep -c "Stable tag: $PLUGIN_VERSION" "readme.txt") -eq 0 ]]; then
  echo "readme.txt file does not contain the correct stable tag version : $PLUGIN_VERSION"
  EXISTING_VERSION=$(sed -n 's/.*Stable tag: \(.*\)/\1/p' "readme.txt")
  echo "Existing version: $EXISTING_VERSION"
  exit 1
fi

echo "validate-build-files Details:"
echo "---"
echo "SVN Tag name: $PLUGIN_VERSION"
echo "Package Version: $PACKAGE_VERSION"
echo "Trunk Files:"
ls -la
