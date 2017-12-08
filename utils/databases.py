from pymongo.mongo_client import MongoClient

class MongoConnection:
	def __init__(self, conn_url):
		self.conn = MongoClient(conn_url)

	def insert_one(self, collection, document):
		pass

	def insert_many(self, collection, documents):
		pass

	def update_one(self, collection, filter, update, upsert=False):
		pass

	def update_many(self, collection, filter, update, upsert=False):
		pass

	def delete_one(self, collection, filter):
		pass

	def delete_many(self, collection, filter):
		pass

	def find(self, collection, filter=None, projection=None, sort=None, skip=0, limit=0):
		pass

	def find_one(self, collection, filter=None):
		pass

	def count(self, collection, filter=None):
		pass

	def distinct(self, collection, key, filter=None):
		pass
