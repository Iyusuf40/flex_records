#!/usr/bin/python3
""" flask application that serves as api to flex_records """


from flask import Flask, request, abort
from flask_cors import CORS
from storage.storage import Storage
from bson import json_util
import os


app = Flask(__name__)
CORS(app)
server = os.getenv("server")


@app.route("/records/<record_id>", strict_slashes=False)
def get_records(record_id):
    """ retrieves records from db """
    key = "records-" + record_id
    con = Storage(server, key)
    res = {}
    if con.check_if_collection_exist():
        res = con.find_one({"_id": key})["data"]
    con.close()
    return json_util.dumps(res)


@app.route("/records", methods=["POST"], strict_slashes=False)
def create_records():
    """ creates new record """
    res = {}
    error = False
    req = request.get_json()
    key = "records-" + req["id"]
    con = Storage(server, key)
    to_save = {"_id": key, "data": req}
    try:
        con.insert_one(to_save)
    except Exception:
        error = True
        res = con.find_one({"_id": key})
    con.close()
    if not error:
        return json_util.dumps(req), 201
    else:
        return json_util.dumps(res), 200


@app.route("/records", methods=["PUT"], strict_slashes=False)
def update_records():
    """ creates new record """
    res = {}
    error = False
    req = request.get_json()
    key = "records-" + req["id"]
    con = Storage(server, key)
    to_save = {"_id": key, "data": req}
    filter_ = {"_id": key}
    try:
        con.replace_one(filter_, to_save)
    except Exception:
        error = True
        pass
    con.close()
    if not error:
        return json_util.dumps(req), 200
    else:
        return json_util.dumps({}), 409


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="3001", debug=True)
