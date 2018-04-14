from storage import Storage
from numpy import ndarray # Keras outputs predictions to a numpy array
import json

class FileStorage(Storage):
	def __init__(self, source_config, messenger):
		self.save_filename = source_config['save_filename']
		self.messenger = messenger

	def run(self):
		self.messenger.start(self.save)

	def save(self, data):
		print "Got new data: %r" % data
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
				f.write(str(data))
				f.write("\n")
