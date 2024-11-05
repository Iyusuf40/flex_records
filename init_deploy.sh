#!/bin/bash
# deploys flex_records
git clone -b deployment https://github.com/Iyusuf40/flex_records

cd flex_records
sudo cp *.service /lib/systemd/system

sudo systemctl daemon-reload
sudo systemctl enable flex_records_fe
sudo systemctl enable flex_records_api

sudo service mongod stop

cd

# deploy frontend
cd flex_records/frontend
git checkout deployment
rm -rf node_modules package-lock.json
git pull
npm install --omit=dev
rm -rf build
npm run build
sudo service flex_records_fe start

cd

sudo service mongod start

#deploy backend
sudo service flex_records_api start

# setup nginx reverse proxy
bash setup_nginx_conf.sh

