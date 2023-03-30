#!/bin/bash
# deploys flex_records
cd flex_records/frontend
git checkout deployment
git pull
rm -rf build
npm run build
sudo service flex_records_fe restart
