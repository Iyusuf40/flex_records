#!/bin/bash
# deploys flex_records

# deploy frontend
cd flex_records/frontend
git checkout deployment
git pull
rm -rf build
npm install
npm run build
sudo service flex_records_fe restart

cd

#deploy backend
sudo service flex_records_api restart
