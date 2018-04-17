from data_source import DataSource
import os
import json

class FlatFile(DataSource):
	def __init__(self, config, messenger):
		self.messenger = messenger
		relative_file_path = os.path.realpath(os.path.join(config['base_path'], config['filename']))
		full_file_path = os.path.realpath(config['filename'])
		if os.path.isfile(relative_file_path):
			self.filename = relative_file_path
		elif os.path.isfile(full_file_path):
			self.filename = full_file_path
		else:
			raise Exception("File for alias %s not found. File path must be either relative to config file or the full path of the file." % config['alias'])
		
	def run(self):
		with open(self.filename) as f:
			for line in f:
				message = json.loads(line.rstrip())
				self.publish(message)

	def publish(self, data):
		self.messenger.publish(data)
