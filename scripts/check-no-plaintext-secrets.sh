#!/usr/bin/env bash
set -euo pipefail

if grep -R --line-number --exclude-dir=.git --exclude='*.enc.yaml' --exclude='*.sops.yaml' 'BEGIN PRIVATE KEY\|clientSecret:\|password:' infra .devcontainer apps packages; then
  echo 'Potential plaintext secret detected.' >&2
  exit 1
fi
