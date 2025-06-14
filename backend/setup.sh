#!/bin/bash
echo "Installing required Python packages..."
pip install opencv-python numpy matplotlib

echo "Starting backend service..."
node index.js
