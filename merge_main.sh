#!/bin/bash

git checkout deployment
git merge main --no-edit
git push
git checkout main
