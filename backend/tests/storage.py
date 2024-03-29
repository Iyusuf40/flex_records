import unittest
from storage.storage import Storage

class StorageTestCase(unittest.TestCase):
    def setUp(self):
        self.storage = Storage()
    
    def tearDown(self) -> None:
        self.storage.drop_collection()
        self.storage.close()

    def test_update(self):
        pass

    def test_inssert(self):
        self.assertEqual(50, 50)