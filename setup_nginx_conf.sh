#!/bin/bash

cd /home/ubuntu/cloza

sudo cp flexrecords_nginx.conf /etc/nginx/conf.d/
sudo nginx -t && sudo nginx -s reload