import unittest
from storage.storage import Storage

class StorageTestCase(unittest.TestCase):
    def setUp(self):
        self.storage = Storage("primary", "test")
    
    def tearDown(self) -> None:
        self.storage.drop_collection()
        self.storage.close()

    def test_insert_one(self):
        doc = {"a": 1, "b": 2}
        res = self.storage.find_one(doc)
        self.assertEqual(res, None) # doesnt exist

        self.storage.insert_one(doc)
        res = self.storage.find_one(doc)
        self.assertEqual(res, doc) # exists

    def test_update(self):
        doc = {"a": 1, "b": 2}

        self.storage.insert_one(doc)
        res = self.storage.find_one(doc)
        self.assertEqual(res, doc) # exists

        filter_ = {"a": 1}
        path = "b"
        op = "$set"
        value = 5
        updateDesc = {op: {path: value}}

        self.storage.update_one(filter_, updateDesc)
        res = self.storage.find_one(filter_)

        self.assertEqual(res["b"], value)

        # test update nested fields
        doc = {"a": 2, "b": {"c": "before update" }}

        self.storage.insert_one(doc)
        res = self.storage.find_one(doc)
        self.assertEqual(res["b"]["c"], "before update") # exists

        filter_ = {"a": 2}
        path = "b.c"
        op = "$set"
        value = "new nested value"
        updateDesc = {op: {path: value}}

        self.storage.update_one(filter_, updateDesc)
        res = self.storage.find_one(filter_)

        self.assertEqual(res["b"]["c"], value)

    def test_unset(self):
        doc = {"a": 1, "b": 2}

        self.storage.insert_one(doc)
        res = self.storage.find_one(doc)
        self.assertEqual(res, doc) # exists

        filter_ = {"a": 1}
        path = "b"
        op = "$unset"
        value = ""
        updateDesc = {op: {path: value}}

        self.storage.update_one(filter_, updateDesc)
        res = self.storage.find_one(filter_)

        self.assertEqual(res.get("b"), None)



if __name__ == "__main__":
    unittest.main()