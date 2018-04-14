from data_source import DataSource
import os

class FlatFile(DataSource):
	def __init__(self, config, messenger):
		self.messenger = messenger
		self.filename = os.path.realpath(config['filename'])

	def run(self):
		with open(self.filename) as f:
			for line in f:
				self.publish(line.rstrip())

	def publish(self, data):
		self.messenger.publish(data)
