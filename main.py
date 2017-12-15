import yaml
from data.twitterStream import Twitter
from data.socketStream import SocketStream
from data.messageStream import MessageStream
import importlib

# Stored as a dictionary, with aliases as keys
def get_data_sources_from_config(config):
	data_sources = {}
	for source_config in config['data_sources']:
		if source_config['type'] == 'StreamingAPI':
			data_sources[source_config['source_alias']] = Twitter(source_config)
		elif source_config['type'] == 'Socket':
			data_sources[source_config['source_alias']] = SocketStream(source_config)
		elif source_config['type'] == 'MessageQueue':
			data_sources[source_config['source_alias']] = MessageStream(source_config)

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

