from tweepy import OAuthHandler
from tweepy import Stream
from tweepy import StreamListener
from tweepy import API

class TwitterStream(StreamListener):
	def on_data(self, data):
		print data

	def on_error(self, status):
		print status

class Twitter:
	def __init__(self, config):
		assert('api_key' in config)
		assert('api_secret' in config)
		assert('access_token' in config)
		assert('access_token_secret' in config)
		self.api_key = config['api_key']
		self.api_secret = config['api_secret']
		self.access_token = config['access_token']
		self.access_token_secret = config['access_token_secret']

		# Authorize with Twitter
		auth = OAuthHandler(self.api_key, self.api_secret)
		auth.set_access_token(self.access_token, self.access_token_secret)

		self.api = API(auth)

	def start_stream(self):
		# Open the stream (on_data in TwitterStream decides what to do with incoming data)
		self.stream = Stream(self.api.auth, listener=TwitterStream())
		self.stream.filter(track=['python'], async=True)

	def get_public_tweets(self):
		for tweet in self.api.home_timeline():
			print tweet

if __name__ == '__main__':
	import yaml
	from time import sleep
	with open('../config.yml') as f:
		config = yaml.load(f)
		for source_config in config['data_sources']:
			if source_config['source_type'] == 'StreamingAPI':
				ts = Twitter(source_config)
				ts.start_stream()
