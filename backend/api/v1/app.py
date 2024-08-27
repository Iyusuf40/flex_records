#!/usr/bin/python3
""" flask application that serves as api to flex_records """


from flask import Flask, request
from flask_cors import CORS
from flask_sock import Sock, ConnectionClosed
from storage.storage import Storage
import json
from bson import json_util
import os


app = Flask(__name__)
sock = Sock(app)
CORS(app)
server = os.getenv("server") or "primary"

clients = set()
clientsMap = {}

def getClientsGroup(tableId):
    if clientsMap.get(tableId) == None:
        clientsMap[tableId] = set()
    return clientsMap.get(tableId)

def putInClientsGroup(client, tableId):
    getClientsGroup(tableId).add(client)

def removeFromCliensGroup(client, tableId):
    getClientsGroup(tableId).remove(client)

@sock.route('/ws')
def broadcast(sock):
    while True:
        data = sock.receive()
        try:
            message = json.loads(data)
        except ConnectionClosed:
            removeFromCliensGroup(client, message.get("tableId"))
        except Exception:
            print("unable to load", data)
        if message["type"] == "join":
            putInClientsGroup(sock, message.get("tableId"))
        else:
            closedSockets = []
            for client in getClientsGroup(message.get("tableId")):
                if client != sock:
                    try:
                        client.send(json.dumps(message))
                    except ConnectionClosed:
                        closedSockets.append(client)
            for closedSocket in closedSockets:
                removeFromCliensGroup(closedSocket, message.get("tableId"))

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
    id = req.get("id")
    if not id:
        return json_util.dumps({}), 409
    key = "records-" + id
    db = Storage(server, key)
    to_save = {"_id": key, "data": req}
    try:
        db.insert_one(to_save)
    except Exception:
        error = True
        res = db.find_one({"_id": key})
    db.close()
    if not error:
        return json_util.dumps(req), 201
    else:
        return json_util.dumps(res), 200


@app.route("/records", methods=["PUT"], strict_slashes=False)
def update_records():
    """ creates new record """
    error = False
    req = request.get_json()
    id = req.get("id")
    if not id:
        return json_util.dumps({}), 409
    key = "records-" + id
    db = Storage(server, key)
    updated_table = req.get("tableData")
    table_name = req.get('tableName')
    operation = "$set"
    update_key = f"data.tables.{table_name}"
    update_desc = {operation: {update_key: updated_table}}
    filter_ = {"_id": key}
    try:
        db.update_one(filter_, update_desc)
        update_current_table_in_db(table_name, key, db)
    except Exception as e:
        print(e)
        error = True

    db.close()
    if not error:
        return json_util.dumps(req), 200
    else:
        return json_util.dumps({}), 409

@app.route("/records", methods=["DELETE"], strict_slashes=False)
def delete_records():
    """ deletes a record """
    error = False
    req = request.get_json()
    id = req.get("id")
    if not id:
        return json_util.dumps({}), 409
    key = "records-" + id
    db = Storage(server, key)
    table_name = req.get('tableName')
    operation = "$unset"
    update_key = f"data.tables.{table_name}"
    update_desc = {operation: {update_key: ""}}
    filter_ = {"_id": key}
    try:
        db.update_one(filter_, update_desc)
        update_current_table_in_db("", key, db)
    except Exception as e:
        print(e)
        error = True

    db.close()
    if not error:
        return json_util.dumps(req), 200
    else:
        return json_util.dumps({}), 409

def update_current_table_in_db(current_table, key, db):
    operation = "$set"
    update_key = "data.currentTable"
    update_desc = {operation: {update_key: current_table}}
    filter_ = {"_id": key}
    db.update_one(filter_, update_desc)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="3001", debug=True)
