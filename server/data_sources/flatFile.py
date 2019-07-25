from data_source import DataSource
import os
import pandas as pd
import json

class FlatFile(DataSource):
	def __init__(self, config, messenger):
		self.messenger = messenger
		file_path = os.path.realpath(os.path.join(os.getcwd(), config['filename']))
		if os.path.isfile(file_path):
			print('File path for data source: %s' % file_path)
			self.filename = file_path
		else:
			msg = "File for data source alias %s not found at %s. File path must be either relative to config file or the full path of the file." % (config['alias'], config['filename'])
			raise Exception(msg)

		if 'filetype' in config:
			self.filetype = config['filetype']
		else:
			# Default to plain lines
			self.filetype = 'lines'
		
	def run(self):
		if self.filetype == 'json':
			with open(self.filename) as f:
				data = json.loads(f.read())
				for line in data:
					self.publish(line)
		elif self.filetype == 'lines':
			with open(self.filename) as f:
				for line in f:
					message = json.loads(line.rstrip())
					self.publish(message)
		elif self.filetype == 'csv':
			df = pd.read_csv(self.filename)
			for __, row in df.iterrows():
				self.messenger.publish(row.to_json())

	def publish(self, data):
		self.messenger.publish(data)
