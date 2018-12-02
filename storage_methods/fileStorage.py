from storage import Storage
from numpy import ndarray # Keras outputs predictions to a numpy array
import json
import os

class FileStorage(Storage):
	def __init__(self, config, messenger):
		file_path = os.path.realpath(os.path.join(os.getcwd(), config['save_filename']))
		if os.path.isdir(os.path.dirname(file_path)):
			print('Saving output at %s' % file_path)
			self.save_filename = file_path
		else:
			message = "Directory '%s' does not exist for saving files. File path in config must be relative to the root directory of your AI Pro installation." % file_path
			raise Exception(message)
		
		self.messenger = messenger

	def run(self):
		self.messenger.start(self.save)

	def save(self, data):
		if data is None:
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

	def stop(self):
		self.messenger.stop()
