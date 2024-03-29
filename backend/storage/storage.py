#!/usr/bin/python3
""" module contains storage class to simplify connecting to Mongodb
and closure of connection"""


from pymongo import MongoClient
from bson import json_util


class Storage:
    """ storage instance """
    def __init__(self, server="primary", col=None):
        if server not in ["primary", "secondary"]:
            raise ValueError("server must be primary or secondary")
        self.client = MongoClient(readPreference=server)
        self.db = self.client.flex_records
        self.col = self.db[col] if col else self.db.nonExistent

    def close(self):
        """ closes the current connection """
        self.client.close()

    def check_if_collection_exist(self):
        res = self.col.find_one({})
        if res:
            return True
        return False

    def insert_one(self, data):
        """ inserts one record into self.col """
        to_insert = None
        if type(data) == str:
            try:
                to_insert = json_util.loads(data)
            except Exception:
                to_insert = None
        elif type(data) == dict or type(data) == list:
            to_insert = data

        if not to_insert:
            return False
        res = self.col.insert_one(to_insert)
        return res

    def drop_collection(self):
        """ deletes a collecion """
        return self.col.drop()

    def replace_one(self, filter_, replc):
        """ replaces a document in a collecion """
        if type(replc) == str:
            replc = json_util.loads(replc)
        if type(filter_) == str:
            filter_ = json_util.loads(filter_)
        self.col.replace_one(filter_, replc)

    def get_db(self):
        return self.db

    def get_col(self):
        return self.col

    def find(self):
        """ call pymongo find """
        return self.col.find()

    def print_find(self):
        """ prints all docs in collection """
        for x in self.find():
            print(x)

    def find_one(self, data):
        """ finds one based on filter"""
        data = self.transform_data(data)
        return self.col.find_one(data)

    def transform_data(self, data):
        """ transforms str to dict """
        if type(data) == str:
            return json_util.loads(data)
        return data

    def get_collection_names(self):
        """ get a list of all collections in db"""
        return self.db.list_collection_names()

    def get_collections(self):
        """ returns the collections in db """
        return self.db.list_collections()
