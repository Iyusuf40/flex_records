#!/bin/bash
# deploys flex_records_api

cd flex_records
git checkout deployment
git pull

#deploy api
sudo service flex_records_api restart
