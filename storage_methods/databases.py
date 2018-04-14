from pymongo.mongo_client import MongoClient
from storage import Storage

class MongoDB(Storage):
	def __init__(self, source_config, messenger):
		if 'db_name' not in source_config:
			print "Missing database name for Mongo connection!"
			import sys
			sys.exit(1)

		if 'port' in source_config:
			port = source_config['port']
		else:
			port = 27017
			
		if 'host' in source_config:
			host = source_config['host']
		else:
			host = 'localhost'

		self.client = MongoClient(host, port)
		self.db = client[db_name]
		self.collection = source_config['collection']
		self.messenger = messenger

	def run(self):
		self.messenger.start(self.save)

	def save(self, data):
		if type(data) is list:
			self.insert_many(self.collection, data)
		else:
			self.insert_one(self.collection, data)

	def insert_one(self, collection, document):
		current_collection = self.db[collection]
		result = current_collection.insert_one(document)
		return result.inserted_id

	def insert_many(self, collection, documents):
		current_collection = self.db[collection]
		result = current_collection.insert_many(documents)
		return result.inserted_ids
