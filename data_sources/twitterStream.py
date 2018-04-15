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
		self.api_key = config['api_key']
		self.api_secret = config['api_secret']
		self.access_token = config['access_token']
		self.access_token_secret = config['access_token_secret']
		self.messenger = messenger
		self.projection = config['projection']

		# Default to auto restart, unless overridden
		if 'auto_restart' in config:
			self.auto_restart = config['auto_restart']
		else:
			self.auto_restart = True

	def on_stream_error(self):
		self.stream.disconnect()
		if self.auto_restart == True:
			self.run()
		else:
			self.close_gracefully()

	def publish(self, message):
		try:
			tmp = json.loads(message)
			data = {}
			if self.projection:
				# Only take the tweet if it has our entire projection
				if not all([key in tmp for key in self.projection]):
					print "Not everybody was here"
					for key in self.projection:
						if key not in tmp:
							print "%s not in tmp" % key
					print "\n\n"
					return
				for key in self.projection:
					if key in tmp:
						data[key] = tmp[key]
			else:
				data = tmp
			if not data:
				return
			self.messenger.publish(data)
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