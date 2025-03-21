#!/bin/sh

set -e  # Exit on error

echo "Setting up ContentProcessor..."
cd ./src/ContentProcessor
uv sync --frozen
cd ../../

pwd

echo "Setting up ContentProcessorApi..."
cd ./src/ContentProcessorAPI
uv sync --frozen
cd ../../
pwd

echo "Installing dependencies for ContentProcessorWeb..."
cd ./src/ContentProcessorWeb
yarn install

echo "Setup complete! 🎉"
