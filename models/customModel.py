from model import Model

class CustomModel(Model):
	def __init__(self, model_fn):
		self.model_fn = model_fn

	def process(self, data):
		return self.model_fn(data)