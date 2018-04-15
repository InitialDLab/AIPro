class Preprocessor:
	def __init__(self, config, engine=None):
		self.engine = engine
		# TODO: Get the preprocess function name from the engine and set it to our preprocess function

	# If no preprocess function was provided, default to this one - just a wrapper
	def preprocess(self, data):
		if not self.engine:
			return data
