from tweepy import OAuthHandler
from tweepy import Stream
from tweepy import StreamListener
from tweepy import API
import json
from data_source import DataSource

class TwitterStream(StreamListener):
	def  __init__(self, instance):
		self.instance = instance

	def on_data(self, data):
		#print "Receiving data of size %d" % len(data)
		self.instance.publish(data)

	def on_error(self, status_code):
		print "Twitter streaming error: %s" % status_code
		self.instance.on_stream_error()

class Twitter(DataSource):
	def __init__(self, config, messenger):
		assert('api_key' in config)
		assert('api_secret' in config)
		assert('access_token' in config)
		assert('access_token_secret' in config)
		assert('json_attribute' in config)
		self.api_key = config['api_key']
		self.api_secret = config['api_secret']
		self.access_token = config['access_token']
		self.access_token_secret = config['access_token_secret']
		self.messenger = messenger
		self.json_attribute = config['json_attribute']
		
		# Default to auto restart, unless overridden
		if 'auto_restart' in config:
			self.auto_restart = config['auto_restart']
		else:
			self.auto_restart = True

		print "JSON Attribute: %r" % self.json_attribute

	def on_stream_error(self):
		self.stream.disconnect()
		if self.auto_restart == True:
			self.run()
		else:
			self.close_gracefully()

	def publish(self, data):
		try:
			data = json.loads(data)
			if self.json_attribute in data:
				self.messenger.publish(data[self.json_attribute])
			else:
				if not self.json_attribute:
					print "JSON attribute missing"
				else:
					print "JSON attribute %s not in data" % self.json_attribute
					print "Keys in data: %s" % (', '.join([str(key) for key in data]))
					print "\n\n\n"
		except Exception as e:
			print "Could not load streaming tweets."
			print e
			self.close_gracefully()

	def run(self):
		# Authorize with Twitter
		auth = OAuthHandler(self.api_key, self.api_secret)
		auth.set_access_token(self.access_token, self.access_token_secret)
		self.api = API(auth)
		
		# Open the stream (on_data in TwitterStream decides what to do with incoming data)
		self.stream = Stream(self.api.auth, listener=TwitterStream(self))
		self.stream.sample(async=False)

	def close_stream(self):
		print "Closing twitter stream"
		self.stream.disconnect()

	def close_gracefully(self):
		print "Gracefully shutting down Twitter Stream..."
		self.close_stream()

if __name__ == '__main__':
	class Messenger:
		def publish(self, data):
			pass
	messenger = Messenger()
	twitter_creds = {
	    'api_key': 'OQEQBZDOOX6ByWpxT7QCUymcY',
	    'api_secret': 'IfS6AK9i8JCFalaaeIs3mD2MVRe5pqNW6ABO8MbbYZjVW2yCzM',
	    'access_token': '913791119770525702-tmOMfIEIgejuUV6W4maSLpLqTzFIFtp',
	    'access_token_secret': 'Zt6PjCDAKIbmLLS4ucX26DDZSEGd5KdtWaSqltDw0l64t',
	    'json_attribute': 'text'
	}
	twitter = Twitter(twitter_creds, messenger)
	twitter.run()