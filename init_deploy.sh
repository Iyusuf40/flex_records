#!/bin/bash
# deploys flex_records
git clone -b deployment https://github.com/Iyusuf40/flex_records

cd flex_records
sudo cp *.service /lib/systemd/system

sudo systemctl daemon-reload
sudo systemctl enable flex_records_fe
sudo systemctl enable flex_records_api

cd

# deploy frontend
cd flex_records/frontend
git checkout deployment
git pull
npm install
rm -rf build
npm run build
sudo service flex_records_fe start

cd

#deploy backend
sudo service flex_records_api start
