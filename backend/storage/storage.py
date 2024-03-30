#!/usr/bin/python3
""" module contains storage class to simplify connecting to Mongodb
and closure of connection"""


from pymongo import MongoClient
from bson import json_util


class Storage:
    """ storage instance """
    def __init__(self, server="primary", col=None, db="flex_records"):
        if server not in ["primary", "secondary"]:
            raise ValueError("server must be primary or secondary")
        self.client = MongoClient(readPreference=server)
        self.db = self.client[db]
        self.col = self.db[col] if col else self.db.test


    def find_one(self, data):
        """ finds one based on filter"""
        transformed_data = self.transform_data(data)
        return self.col.find_one(transformed_data)

    def insert_one(self, data):
        """ inserts one record into self.col """
        try:
            to_insert = self.transform_data(data)
        except:
            return None

        res = self.col.insert_one(to_insert)
        return res
    
    def update_one(self, filter_, updateDesc):
        return self.col.update_one(filter_, updateDesc)

    def replace_one(self, filter_, replc):
        """ replaces a document in a collecion """
        replc = self.transform_data(replc)
        filter_ = self.transform_data(filter_)
        self.col.replace_one(filter_, replc)

    def transform_data(self, data):
        """ transforms str to dict """
        if type(data) == str:
            return json_util.loads(data)
        return data
    
    def check_if_collection_exist(self):
        res = self.col.find_one({})
        if res:
            return True
        return False

    def get_db(self):
        return self.db

    def get_col(self):
        return self.col

    def get_all_docs(self):
        """ call pymongo find """
        return self.col.find()

    def print_find(self):
        """ prints all docs in collection """
        for x in self.get_all_docs():
            print(x)

    def get_collection_names(self):
        """ get a list of all collections in db"""
        return self.db.list_collection_names()

    def get_collections(self):
        """ returns the collections in db """
        return self.db.list_collections()
    
    def close(self):
        """ closes the current connection """
        self.client.close()
    
    def drop_collection(self):
        """ deletes a collecion """
        return self.col.drop()
