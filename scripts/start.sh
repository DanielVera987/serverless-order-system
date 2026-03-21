#!/bin/bash
STAGE=${1:-dev}
SERVICE=${2:-orders}

cd "src/services/$SERVICE" && npx serverless offline start --stage "$STAGE" --reloadHandler
