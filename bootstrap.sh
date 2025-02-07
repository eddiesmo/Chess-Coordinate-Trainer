#!/bin/bash

# Check if nvm is installed
if [ ! -d "$HOME/.nvm" ]; then
    echo "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    
    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Use Node.js LTS version
nvm install lts/*
nvm use lts/*

# Create .nvmrc file for project-specific Node version
node -v > .nvmrc

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

echo "Setup complete! Run 'npm run dev' to start the development server"
