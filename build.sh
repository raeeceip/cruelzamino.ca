#!/bin/bash
# Install dependencies
npm install

# Build the project
npm run build

# Ensure the dist directory exists
mkdir -p dist

# Print build directory contents for debugging
echo "Contents of build directory:"
ls -la dist/