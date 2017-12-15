from keras.models import load_model
import numpy as np

'''
We assume that the model has already been trained, and saved
by calling model.save(filename) and saving as an h5 file.
'''
class KerasModel:
	def __init__(self, source_config):
		self.model_file = source_config['model_file']
		self.model = load_model(source_config['model_file'])

	# Input: a numpy array, or list of numpy arrays if the model has multiple outputs.
	# Returns a numpy array of predictions
	def predict(self, X):
		if type(X) != np.ndarray:
			X = np.array(X)
		try:
			return self.model.predict(X, verbose=0)
		except ValueError as e:
			print "Error with Keras prediction"
			print e
		finally:
			return []
