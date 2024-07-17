#!/bin/bash
exec gunicorn -w 2 -b 0.0.0.0:8000 registry:app