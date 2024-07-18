#!/bin/bash

if [ "$TEST" = "true" ]; then
    echo "Running unit tests..."
    python3 -m unittest test_registry.py
else
    echo "Starting application..."
    exec gunicorn -w 2 -b 0.0.0.0:8000 registry:app
fi