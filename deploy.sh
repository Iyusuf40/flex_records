#!/bin/bash
# deploys flex_records

# stop mongod first -> low memory server
# sudo service mongod stop

# deploy frontend
cd flex_records/frontend
git checkout deployment
git pull
rm -rf build
npm run build
sudo service flex_records_fe restart

# start mongod
# sudo service mongod start

cd

#deploy backend
sudo service flex_records_api restart
