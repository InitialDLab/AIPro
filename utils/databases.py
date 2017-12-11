from pymongo.mongo_client import MongoClient

class MongoConnection:
	def __init__(self, db_name, host='localhost', port=27017):
		self.client = MongoClient(host, port)
		self.db = client[db_name]

	def insert_one(self, collection, document):
		current_collection = self.db[collection]
		result = current_collection.insert_one(document)
		return result.inserted_id

	def insert_many(self, collection, documents):
		current_collection = self.db[collection]
		result = current_collection.insert_many(documents)
		return result.inserted_ids

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
			yield return doc

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
