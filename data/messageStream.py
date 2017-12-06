class MessageStream:
	def __init__(self, config):
		'''
		NOTE: This is just boilerplate, this should change
		'''
		assert('api_key' in config)
		assert('api_secret' in config)
		assert('access_token' in config)
		assert('access_token_secret' in config)
		self.api_key = config['api_key']
		self.api_secret = config['api_secret']
		self.access_token = config['access_token']
		self.access_token_secret = config['access_token_secret']