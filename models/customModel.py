from model import Model
import pika
import json

class CustomModel(Model):
	def __init__(self, config, model_fn, messenger, preprocessor):
		assert 'input_attribute' in config
		assert 'output_attribute' in config
		assert messenger is not None
		assert preprocessor is not None
		self.input_attribute = config['input_attribute']
		self.output_attribute = config['output_attribute']
		self.model_fn = model_fn
		self.messenger = messenger
		self.preprocessor = preprocessor
		
	def run(self):
		self.messenger.start(self.process)

	def process(self, data):
		x = self.preprocessor.preprocess(data)

		# If there was an issue preprocessing (i.e. the JSON attribute was missing from the data), just discard this instance.
		if x == False:
			pass

		data[self.output_attribute] = self.model_fn(x)
		if data:
			self.publish(data)

	def publish(self, message):
		self.messenger.publish(message)
