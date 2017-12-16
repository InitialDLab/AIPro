from storage import Storage
from numpy import ndarray # Keras outputs predictions to a numpy array

class FileStorage(Storage):
	def __init__(self, source_config):
		self.save_filename = source_config['save_filename']

	def save(self, data):
		if not data:
			return
		with open(self.save_filename, "a") as f:
			if type(data) is list or type(data) is ndarray:
				# Some data sources and models can return unicode, so we need to convert it to UTF-8 before writing to file
				if hasattr(data[0], 'encode'):
					f.write("\n".join([item.encode('UTF-8') for item in data]))
				else:
					f.write("\n".join(data))
			else:
				f.write(data)
				f.write("\n")

	def load(self, filename):
		with open(filename) as f:
			return [line.strip() for line in f]
