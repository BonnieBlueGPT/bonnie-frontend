#!/bin/bash
# Render build script for Bonnie Chat

# Set proper permissions for node_modules
chmod +x node_modules/.bin/*

# Run the build
npm run actual-build