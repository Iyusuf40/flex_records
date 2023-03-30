#!/bin/bash
# deploys flex_records
rm -rf flex_records
git clone --branch deployment https://github.com/Iyusuf40/flex_records
cd flex_records/frontend
sudo pkill gunicorn
npm install
npm run build
sudo systemctl daemon-reload
sudo systemctl enable flex_records_api
sudo systemctl enable flex_records_fe
sudo pkill node
sudo service flex_records_api restart 
sudo service flex_records_fe restart
