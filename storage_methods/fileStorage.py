from storage import Storage
from numpy import ndarray # Keras outputs predictions to a numpy array
import json
import os

class FileStorage(Storage):
	def __init__(self, config, messenger):
		relative_file_path = os.path.realpath(os.path.join(config['base_path'], config['save_filename']))
		full_file_path = os.path.realpath(config['save_filename'])
		if os.path.isdir(os.path.dirname(relative_file_path)):
			self.save_filename = relative_file_path
		elif os.path.isdir(os.path.dirname(full_file_path)):
			self.save_filename = full_file_path
		else:
			print os.path.dirname(full_file_path)
			print os.path.dirname(config['save_filename'])
			message = "File for alias %s not found. File path must be either relative to config file or the full path of the file." % config['alias']
			raise Exception(message)
		
		self.messenger = messenger

	def run(self):
		self.messenger.start(self.save)

	def save(self, data):
		if not data:
			return
		with open(self.save_filename, "a") as f:
			if type(data) is list or type(data) is ndarray:
				# Some data sources and models can return unicode, so we need to convert it to UTF-8 before writing to file
				if hasattr(data[0], 'encode'):
					f.write("\n".join([item.encode('UTF-8') for item in data]))
				else:
					f.write("\n".join([str(item) for item in data]))
			else:
				f.write(json.dumps((data)))
				f.write("\n")
