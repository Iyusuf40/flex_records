#!/bin/bash

sudo cp *.service /lib/systemd/system

sudo systemctl daemon-reload
sudo systemctl enable flex_records_fe
sudo systemctl enable flex_records_api