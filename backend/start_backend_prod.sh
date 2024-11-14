#!/bin/bash

source myenv/bin/activate
gunicorn --workers 1 --threads 50 --bind 0.0.0.0:5010 --error-logfile /tmp/flex_records_api-error.log --access-logfile /tmp/flex_records-access.log api.v1.app:app