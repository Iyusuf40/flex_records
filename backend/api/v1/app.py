#!/usr/bin/python3
""" flask application that serves as api to flex_records """


from flask import Flask, request, abort
from flask_cors import CORS
from storage.storage import Storage
from bson import json_util


if __name__ == "__main__":
    print("done")
