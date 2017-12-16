import sys
import os
import yaml

# Stored as a dictionary, with aliases as keys
def get_data_sources_from_config(config):
	data_sources = {}
	for source_config in config['data_sources']:
		if source_config['type'] == 'StreamingAPI':
			if 'data.twitterStream' not in sys.modules:
				from data.twitterStream import Twitter
			data_sources[source_config['alias']] = Twitter(source_config)
			data_sources[source_config['alias']].start_stream()
		
		elif source_config['type'] == 'Socket':
			if 'data.socketStream' not in sys.modules:
				from data.socketStream import SocketStream
			data_sources[source_config['alias']] = SocketStream(source_config)
			data_sources[source_config['alias']].connect()
		
		elif source_config['type'] == 'MessageQueue':
			if 'data.messageStream' not in sys.modules:
				from data.messageStream import MessageStream
			data_sources[source_config['alias']] = MessageStream(source_config)

	return data_sources

def get_models_from_config(config):
	models = {}
	for source_config in config['models']:
		if source_config['type'] == 'Keras-Saved':
			if 'models.kerasModel' not in sys.modules:
				from models.kerasModel import KerasModel
			models[source_config['alias']] = KerasModel(source_config)
		
		# TODO: More models
	return models

def get_storage_from_config(config):
	storage = {}
	for source_config in config['storage']:
		if source_config['type'] == 'MongoDB':
			if 'utils.databases' not in sys.modules:
				from utils.databases import MongoDB
			storage[source_config['alias']] = MongoDB(source_config)
		if source_config['type'] == 'File':
			if 'utils.fileStorage' not in sys.modules:
				from utils.fileStorage import FileStorage
			storage[source_config['alias']] = FileStorage(source_config)
		
		# TODO: Add more storage methods, but keep them in JSON format for now

	return storage

def parse_plan(config, plan_file='plan.yml'):
	# Initialize the plan, based on the plan file
	if not os.path.isfile(plan_file):
		print "Couldn't find plan file %s" % plan_file
		sys.exit(1)

	data_sources = get_data_sources_from_config(config)
	models = get_models_from_config(config)
	storage_methods = get_storage_from_config(config)

	plan = []
	with open(plan_file) as f:
		plan = yaml.load(f)

	# For now, plans will be serial sequences from data source to final database storage
	datasource_aliases, model_aliases, storage_aliases = set(data_sources.keys()), set(models.keys()), set(storage_methods.keys())
	modules = [None] * len(plan)
	for i, item in enumerate(plan):
		if item['type'] == 'Data Source':
			modules[i] = data_sources[item['alias']]
			datasource_aliases.remove(item['alias'])
		elif item['type'] == 'Model':
			modules[i] = models[item['alias']]
			model_aliases.remove(item['alias'])
		elif item['type'] == 'Storage':
			modules[i] = storage_methods[item['alias']]
			storage_aliases.remove(item['alias'])

	# Check to see if any data source, model, or storage method from the config file is unused in this plan
	if len(datasource_aliases) > 0:
		print "Unused data sources (by alias): %s" % ', '.join(list(datasource_aliases))

	if len(model_aliases) > 0:
		print "Unused models (by alias): %s" % ', '.join(list(model_aliases))

	if len(storage_aliases) > 0:
		print "Unused storage methods (by alias): %s" % ', '.join(list(storage_aliases))

	# Make sure a plan was actually loaded!
	if not modules or any([entry is None for entry in modules]):
		print "No valid plan was detected in the plan.yml file."
		sys.exit(1)

	return modules, plan