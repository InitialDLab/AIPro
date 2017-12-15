from pymongo.mongo_client import MongoClient
from storage import Storage

class MongoDB(Storage):
	def __init__(self, source_config):
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

	'''
	Don't need these for the main functionality in this program, consider deleting:

	def update_one(self, collection, query_filter, update, upsert=False):
		current_collection = self.db[collection]
		result = current_collection.update_one(query_filter, update, upsert=upsert)
		return result.modified_count

	def update_many(self, collection, query_filter, update, upsert=False):
		current_collection = self.db[collection]
		result = current_collection.update_many(query_filter, update, upsert=upsert)
		return result.modified_count

	def delete_one(self, collection, query_filter):
		current_collection = self.db[collection]
		result = current_collection.delete(query_filter)
		return result.deleted_count

	def delete_many(self, collection, query_filter):
		current_collection = self.db[collection]
		result = current_collection.delete(query_filter)
		return result.deleted_count		

	def find(self, collection, query_filter=None, projection=None, sort=None, skip=0, limit=0):
		current_collection = self.db[collection]
		cursor = current_collection.find(filter=query_filter, projection=projection, sort=sort, skip=skip, limit=limit)
		for doc in cursor:
			yield doc

	def find_one(self, collection, query_filter=None, projection=None):
		current_collection = self.db[collection]
		result = current_collection.find_one(filter=query_filter, projection=projection)
		return result

	def count(self, collection, query_filter=None, limit=0, skip=0):
		current_collection = self.db[collection]
		result = current_collection.count(filter=query_filter, limit=limit, skip=skip)
		return result

	def distinct(self, collection, key, query_filter=None):
		current_collection = self.db[collection]
		result = current_collection.distinct(key, filter=query_filter)
		return result
	'''