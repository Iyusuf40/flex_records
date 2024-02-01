#!/bin/bash


source venv/bin/activate

cd backend

python3 -m api.v1.app
