from data_source import DataSource
import os
import json

class FlatFile(DataSource):
	def __init__(self, config, messenger):
		self.messenger = messenger
		self.filename = os.path.realpath(config['filename'])

	def run(self):
		with open(self.filename) as f:
			for line in f:
				message = json.loads(line.rstrip())
				self.publish(message)

	def publish(self, data):
		self.messenger.publish(data)
