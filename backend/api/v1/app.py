#!/usr/bin/python3
""" flask application that serves as api to flex_records """


from flask import Flask, request
from flask_cors import CORS
from flask_sock import Sock, ConnectionClosed
from storage.storage import Storage
from time import sleep
import json
from bson import json_util
import os


app = Flask(__name__)
sock = Sock(app)
CORS(app)
server = os.getenv("server") or "primary"

clientsMap = {}

def getClientsGroup(tableId):
    if clientsMap.get(tableId) == None:
        clientsMap[tableId] = set()
    return clientsMap.get(tableId)

def putInClientsGroup(client, tableId):
    getClientsGroup(tableId).add(client)

def removeFromClientsGroup(client, tableId):
    getClientsGroup(tableId).remove(client)

@sock.route('/ws')
def broadcast(sock):
    while True:
        try:
            data = sock.receive()
            message = json.loads(data)
        except ConnectionClosed:
            removeFromClientsGroup(sock, message.get("tableId"))
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
                removeFromClientsGroup(closedSocket, message.get("tableId"))
        sleep(0.01)

@app.route("/records_api/<record_id>", strict_slashes=False)
def get_records(record_id):
    key = "records-" + record_id
    con = Storage(server, key)
    res = {}
    if con.check_if_collection_exist():
        res = con.find_one({"_id": key})["data"]
    con.close()
    return json_util.dumps(res)


@app.route("/records_api", methods=["POST"], strict_slashes=False)
def create_records():
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


@app.route("/records_api", methods=["PUT"], strict_slashes=False)
def update_records():
    error = False
    req = request.get_json()
    id = req.get("id")
    if not id:
        return json_util.dumps({}), 409
    key = "records-" + id
    db = Storage(server, key)
    updated_table = req.get("tableData")
    update_val = updated_table
    changed_row = req.get("changedRow")
    table_name = req.get('tableName')
    operation = "$set"
    update_key = f"data.tables.{table_name}"
    
    if changed_row:
        update_key = f"data.tables.{table_name}.data.{changed_row}"
        update_val = updated_table["data"][f"{changed_row}"]

    update_desc = {operation: {update_key: update_val}}
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

@app.route("/records_api", methods=["DELETE"], strict_slashes=False)
def delete_records():
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


@app.route("/records_api/day_sales", methods=["PUT"], strict_slashes=False)
def update_daily_sales():
    req_payload = request.get_json()
    table_id = req_payload.get("tableId")
    if not table_id:
        return json_util.dumps({}), 409
    key = table_id
    day = req_payload["dayName"]
    db = Storage(server, key)
    error = False
    try:
        day_sales = db.find_one({"_id": key})
        item = req_payload["item"]
        quantity = req_payload["quantity"]
        price = req_payload["price"]
        transaction_type = req_payload["type"]
        if transaction_type == "return":
            price = -price
            quantity = -quantity
        if not day_sales:
            newVal = {
                day: {
                    item: {
                        "item": item,
                        "quantity": quantity,
                        "total_price": price
                    }
                }
            }
            new_day_sales = {"_id": key, "day_sales": newVal, "current_day": day}
            db.insert_one(new_day_sales)
        else:
            if day_sales["day_sales"].get("current_day") != day:
                # start new day sales record
                day_sales["day_sales"]["current_day"] = day
                day_sales["day_sales"][day] = {}
                operation = "$set"
                update_key = f"day_sales"
                update_desc = {operation: {update_key: day_sales["day_sales"]}}
                filter_ = {"_id": key}
                db.update_one(filter_, update_desc)

            if day_sales["day_sales"].get(day) and day_sales["day_sales"][day].get(item):
                prev_quantity = day_sales["day_sales"][day][item]["quantity"]
                prev_total_price = day_sales["day_sales"][day][item]["total_price"]
                day_sales["day_sales"][day][item]["quantity"] = prev_quantity + quantity
                day_sales["day_sales"][day][item]["total_price"] = prev_total_price + price
                operation = "$set"
                update_key = f"day_sales.{day}.{item}"
                update_desc = {operation: {update_key: day_sales["day_sales"][day][item]}}
                filter_ = {"_id": key}
                db.update_one(filter_, update_desc)
            else:
                updateVal = {
                    "item": item,
                    "quantity": quantity,
                    "total_price": price
                }
                operation = "$set"
                update_key = f"day_sales.{day}.{item}"
                update_desc = {operation: {update_key: updateVal}}
                filter_ = {"_id": key}
                db.update_one(filter_, update_desc)
    except Exception:
        error = True
    db.close()
    if not error:
        return json_util.dumps({"success": True}), 201
    else:
        return json_util.dumps({"success": False, "error": True}), 409
    


@app.route("/records_api/day_sales/<day_name>/<table_id>", methods=["GET"], strict_slashes=False)
def get_daily_sales(day_name, table_id):
    key = table_id
    day = day_name
    response_payload = {}
    db = Storage(server, key)
    error = False
    try:
        prev_day_sales = db.find_one({"_id": key})
        if prev_day_sales and prev_day_sales["day_sales"].get(day):
            response_payload[day] = prev_day_sales["day_sales"].get(day)
    except Exception as e:
        print(e)
        error = True
    db.close()
    if not error:
        return json_util.dumps(response_payload), 200
    else:
        return json_util.dumps({"error": True}), 409



def update_current_table_in_db(current_table, key, db):
    operation = "$set"
    update_key = "data.currentTable"
    update_desc = {operation: {update_key: current_table}}
    filter_ = {"_id": key}
    db.update_one(filter_, update_desc)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="3001", debug=True)
