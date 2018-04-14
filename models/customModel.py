from model import Model
import pika
import json

class CustomModel(Model):
	def __init__(self, model_fn, messenger):
		self.model_fn = model_fn
		self.messenger = messenger
		
	def run(self):
		self.messenger.start(self.process)

	def process(self, data):
		message = self.model_fn(data)
		if message:
			self.publish(message)

	def publish(self, message):
		self.messenger.publish(message)
