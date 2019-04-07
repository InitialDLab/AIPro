import requests
import os
import json
from time import sleep

class StreamingImagesAPI:
	def __init__(self, config, messenger):
		self.messenger = messenger
		self.done = False
		self.url = config['url']

	def close_gracefully(self):
		self.done = True

	def run(self):
		while not self.done:
			message = {'url': self.url}
			self.publish(message)
			sleep(0.5)

	def publish(self, data):
		self.messenger.publish(data)
