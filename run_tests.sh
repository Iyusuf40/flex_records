#!/bin/bash

source venv/bin/activate

cd backend

python3 -m unittest tests/test*.py
