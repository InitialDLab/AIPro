from tweepy import OAuthHandler
from tweepy import Stream
from tweepy import StreamListener
from tweepy import API
import json
from time import sleep
from data_source import DataSource

class TwitterStream(StreamListener):
	def  __init__(self, instance):
		self.instance = instance

	def on_data(self, data):
		#print "Receiving data of size %d" % len(data)
		self.instance.add_data(data)

	def on_error(self, status_code):
		print "Twitter streaming error: %s" % status_code
		self.instance.on_stream_error(auto_restart=True)

class Twitter(DataSource):
	def __init__(self, config):
		assert('api_key' in config)
		assert('api_secret' in config)
		assert('access_token' in config)
		assert('access_token_secret' in config)
		self.api_key = config['api_key']
		self.api_secret = config['api_secret']
		self.access_token = config['access_token']
		self.access_token_secret = config['access_token_secret']
		self.data = []
		self.dictionary = {}
		self.max_item = 0

	def add_word_to_dictionary(self, word):
		if word not in self.dictionary:
			self.dictionary[word] = self.max_item
			self.max_item += 1

	def on_stream_error(self, auto_restart=True):
		self.stream.disconnect()
		if auto_restart == True:
			self.start_stream()

	def add_data(self, data):
		self.data.append(json.loads(data))

	# Seconds to wait - allow time for the stream to download new tweets
	def get_data(self, attribute, seconds_to_wait=5):
		sleep(seconds_to_wait)
		data_to_return = []
		for entry in self.data:
			# Add words to the dictionary
			if attribute in entry:
				words = entry[attribute].split()
				for word in words:
					self.add_word_to_dictionary(word)
				data_to_return.append([self.dictionary[word] for word in words if word in self.dictionary])

		# Clear our data buffer so we don't run out of memory
		self.data = []
		return data_to_return # [data[attribute] for data in data_to_return if attribute in data]

	def start_stream(self, stream_filter='e'):
		# Authorize with Twitter
		auth = OAuthHandler(self.api_key, self.api_secret)
		auth.set_access_token(self.access_token, self.access_token_secret)
		self.api = API(auth)
		
		# Open the stream (on_data in TwitterStream decides what to do with incoming data)
		self.stream = Stream(self.api.auth, listener=TwitterStream(self))
		self.stream.sample(async=True)

	def close_stream(self):
		print "Closing twitter stream"
		self.stream.disconnect()

	def close_gracefully(self):
		print "Gracefully shutting down Twitter Stream..."
		self.data = []
		self.close_stream()

# Demo usage, not necessary to keep this
if __name__ == '__main__':
	import yaml
	with open('../config.yml') as f:
		config = yaml.load(f)
		for source_config in config['data_sources']:
			if source_config['type'] == 'StreamingAPI':
				ts = Twitter(source_config)
				ts.start_stream()
				print "Stream started"
				print len(ts.get_data('text', seconds_to_wait=10))
				ts.close_stream()
