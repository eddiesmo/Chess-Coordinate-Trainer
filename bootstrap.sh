#!/bin/bash

# Set the NVM directory; adjust if your nvm is installed elsewhere.
export NVM_DIR="$HOME/.nvm"

# Source nvm if the script exists.
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # This loads nvm
  . "$NVM_DIR/nvm.sh"
else
  echo "nvm script not found in $NVM_DIR"
  exit 1
fi

# Use Node.js LTS version
echo "Installing and using Node.js LTS..."
nvm install lts/*
nvm use lts/*

# Create .nvmrc file for project-specific Node version
node -v > .nvmrc

# Clean install dependencies
echo "Installing dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "Setup complete! Run 'npm run dev' to start the development server."
