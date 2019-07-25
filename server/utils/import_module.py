import importlib.util
import os

def import_from_file(module_name, filename):
	try:
		if not os.path.isfile(filename):
			raise Exception("File does not exist: '{}'".format(filename))
		else:
			spec = importlib.util.spec_from_file_location(module_name, filename)
			module = importlib.util.module_from_spec(spec)
			spec.loader.exec_module(module)
			
			return module
	except Exception as e:
		print("Module '{}' could not be loaded from file '{}'".format(module_name, filename))
		print(e)
		return None

	return None
