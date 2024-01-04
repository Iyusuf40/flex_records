#!/bin/bash
# deploys flex_records_api

cd flex_records
git checkout deployment
git pull

#deploy api
bash manage_service_files.sh
sudo service flex_records_api restart
