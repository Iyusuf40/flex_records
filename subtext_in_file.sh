#!/bin/bash

sed -i "s/.cloza.tech/.cloza.org/g" $(find frontend/ -not -path '*node_modu*' -name '*jsx')
