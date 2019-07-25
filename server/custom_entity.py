import json

class CustomEntity:
	def __init__(self, config, instance, messenger):
		assert messenger is not None
		if 'input_attribute' in config:
			self.input_attribute = config['input_attribute']
		if 'output_attribute' in config:
			self.output_attribute = config['output_attribute']

		self.fn = getattr(instance, config['function'])
		self.messenger = messenger
		
	def run(self):
		self.messenger.start(self.process)

	def process(self, data):
		if hasattr(self, 'input_attribute'):
			x = self.fn(data[self.input_attribute])
		else:
			x = self.fn(data)

		# If there was an issue, just discard this instance.
		if x == None:
			return

		if hasattr(self, 'output_attribute'):
			# Make sure we can add an output attribute :)
			if type(data) != dict:
				data = {'input_data': data}
			data[self.output_attribute] = x
		else:
			data = x
		if data:
			self.publish(data)

	def publish(self, data):
		self.messenger.publish(data)

	def stop(self):
		self.messenger.stop()
