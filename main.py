import yaml
from data.twitterStream import Twitter
from data.socketStream import SocketStream
from data.messageStream import MessageStream
import importlib

def get_data_sources_from_config(config):
	data_sources = []
	for source_config in config['data_sources']:
		if source_config['type'] == 'StreamingAPI':
			data_sources.append(Twitter(source_config))
		elif source_config['type'] == 'Socket':
			data_sources.append(SocketStream(source_config))
		elif source_config['type'] == 'MessageQueue':
			data_sources.append(MessageStream(source_config))

	return data_sources

def get_models_from_config(config):
	models = []
	for source_config in config['models']:
		# TODO: Fill this in
		pass

config = {}
with open('../config.yml') as f:
	config = yaml.load(f)

data_sources = get_data_sources_from_config(config)

