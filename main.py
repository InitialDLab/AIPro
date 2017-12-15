import yaml
import sys

# Stored as a dictionary, with aliases as keys
def get_data_sources_from_config(config):
	data_sources = {}
	for source_config in config['data_sources']:
		if source_config['type'] == 'StreamingAPI':
			if 'data.twitterStream' not in sys.modules:
				from data.twitterStream import Twitter
			data_sources[source_config['source_alias']] = Twitter(source_config)
		
		elif source_config['type'] == 'Socket':
			if 'data.socketStream' not in sys.modules:
				from data.socketStream import SocketStream
			data_sources[source_config['source_alias']] = SocketStream(source_config)
		
		elif source_config['type'] == 'MessageQueue':
			if 'data.messageStream' not in sys.modules:
				from data.messageStream import MessageStream
			data_sources[source_config['source_alias']] = MessageStream(source_config)

	return data_sources

def get_models_from_config(config):
	models = {}
	for source_config in config['models']:
		if source_config['model_type'] == 'Keras-With-H5-File':
			if 'models.kerasModel' not in sys.modules:
				from models.kerasModel import KerasModel
			models[source_config['model_alias']] = KerasModel(source_config)
		
		# TODO: More models
	return models

def get_storage_from_config(config):
	storage = {}
	for source_config in config['storage']:
		if source_config['storage_type'] == 'MongoDB':
			if 'utils.databases' not in sys.modules:
				from utils.databases import MongoDB
			storage[source_config['storage_alias']] = MongoDB(source_config)

		# TODO: Add more storage methods, but keep them in JSON format for now

	return storage

# Initialize data sources, models and storage methods based on the config
config = {}
with open('config.yml') as f:
	config = yaml.load(f)

data_sources = get_data_sources_from_config(config)
models = get_models_from_config(config)
storage_methods = get_storage_from_config(storage_config)

# Initialize the plan, based on the plan file
plan_agenda = {}
with open('plan.yml') as f:
	plan_agenda = yaml.load(f)

# For now, plans will be serial sequences from data source to final database storage
plan = [None] * len(plan_agenda)
for i, item in enumerate(plan_agenda):
	if item['type'] == 'data_source':
		plan[i] = data_sources[item['alias']]
	elif item['type'] == 'model':
		plan[i] = models[item['alias']]
	elif item['type'] == 'storage':
		plan[i] = models[item['alias']]

# Make sure a plan was actually loaded!
if not plan:
	print "No plan was detected in the plan.yml file."
	sys.exit(1)

# TODO: Make sure the first entry in the plan is either storage or a data source

# TODO: Execute the plan on a loop
