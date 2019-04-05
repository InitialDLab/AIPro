import json
import requests

class Model(object):
	def __init__(self, config, instance, messenger, preprocessor):
		assert messenger is not None
		assert preprocessor is not None
		if 'input_attribute' in config:
			self.input_attribute = config['input_attribute']
		if 'output_attribute' in config:
			self.output_attribute = config['output_attribute']
		
		if 'method_name' in config and hasattr(instance, config['method_name']):
			self.model_fn = getattr(instance, config['method_name'])
		else:
			# Set model function to None if you plan on overriding it
			self.model_fn =  None
		self.messenger = messenger
		self.preprocessor = preprocessor
		
	def run(self):
		self.messenger.start(self.process)

	def process(self, data):
		if hasattr(self, 'input_attribute') and self.input_attribute.strip() != '':
			if self.input_attribute in data:
				x = self.preprocessor.preprocess(data[self.input_attribute])
			else:
				x = None
		else:
			x = self.preprocessor.preprocess(data)
		
		# If there was an issue preprocessing (i.e. the JSON attribute was missing from the data), just discard this instance.
		if x is None:
			print('Error during preprocessing')
			return

		if hasattr(self, 'output_attribute'):
			# Make sure we can add an output attribute :)
			if type(data) != dict:
				data = {'input_data': data}
			data[self.output_attribute] = self.model_fn(x)
		else:
			data = self.model_fn(x)
		if data:
			self.publish(data)

	def publish(self, data):
		self.messenger.publish(data)

	def stop(self):
		self.messenger.stop()

class APIModel(Model):
	def __init__(self, config, instance, messenger, preprocessor):
		super(APIModel, self).__init__(config, instance, messenger, preprocessor)
		print('Initializing API Model with config:')
		print(json.dumps(config))
		if 'http_method' in config:
			self.http_method = config['http_method']
		else:
			# Default to GET
			self.http_method = 'GET'
		print('HTTP Method: {}'.format(self.http_method))
		self.endpoint = config['endpoint']
		self.model_fn = self._send_request
		self.image_location_attr  = config['image_location_attr']

	# TODO: Make this something the user provides for handling request/response
	def _build_request_data(self, data):
		image_file = open(data[self.image_location_attr], 'rb')
		image =  image_file.read()
		image_file.close()
		return {'image':  (data[self.image_location_attr], image, 'image/jpg')}

	# TODO: Same here
	def _extract_response(self, response):
		data = response.json()
		if data['status'] == 'ok':
			predictions = data['predictions']
			prediction = predictions[0]
			del prediction['index']
			return prediction
		else:
			return {'caption': 'N/A'}

	def _send_request(self, data):
		result = None
		try:
			if self.http_method == 'GET':
				response  = requests.get(self.endpoint)
			elif self.http_method == 'POST':
				request_data = self._build_request_data(data)
				print('Sending POST request to {}'.format(self.endpoint))
				response = requests.post(self.endpoint, files=request_data)
				print('Response: {}'.format(response.text))

			if not response.ok:
				print('Non-ok response')
				print(response.text)
				result = None
			else:
				print('Response successful, status code {}'.format(response.status_code))
				result = self._extract_response(response)
				return result

		except Exception as e:
			print('Problem occurred while sending request to {}'.format(self.endpoint))
			print(e)

		return result
