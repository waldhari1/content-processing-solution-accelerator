#!/bin/sh

set -e  # Exit on error
echo "Pull latest code for the current branch"
git fetch
git pull

echo "Setting up ContentProcessor..."
cd ./src/ContentProcessor
uv sync --frozen
cd ../../

echo "Setting up ContentProcessorApi..."
cd ./src/ContentProcessorAPI
uv sync --frozen
cd ../../

echo "Installing dependencies for ContentProcessorWeb..."
cd ./src/ContentProcessorWeb
yarn install

cd ../../

echo "Setting up executable permission for shell scripts"
chmod +x ./infra/scripts/docker-build.sh
chmod +x ./src/ContentProcessorAPI/samples/upload_files.sh
chmod +x ./src/ContentProcessorAPI/samples/schemas/register_schema.sh

echo "Setup complete! 🎉"
