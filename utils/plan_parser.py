import sys
import os
import yaml
from import_module import import_module_from_file

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

def get_data_cleaners_from_config(config):
	cleaners = {}
	# Data cleaners are optional, check to see if they're included
	if 'cleaners' in config:
		for source_config in config['cleaners']:
			if source_config['type'] == 'TextToNumerical':
				#if 'data.dataCleaner' not in sys.modules:
				from data.dataCleaner import TextToNumerical
				cleaners[source_config['alias']] = TextToNumerical()

		# TODO: Add more robust cleaners here, specified by your own file

	return cleaners

def get_models_from_config(config):
	models = {}
	for source_config in config['models']:
		if source_config['type'] == 'Keras-Saved':
			if 'models.kerasModel' not in sys.modules:
				from models.kerasModel import KerasModel
			models[source_config['alias']] = KerasModel(source_config)
		
		if source_config['type'] == 'Custom':
			if 'models.customModel' not in sys.modules:
				from models.customModel import CustomModel
			custom_module = import_module_from_file(source_config['module_classname'], source_config['module_file_path'])
			constructor = getattr(custom_module, source_config['module_classname'])
			instance = constructor()
			models[source_config['alias']] = CustomModel(getattr(instance, source_config['method_name']))

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
	data_cleaners = get_data_cleaners_from_config(config)
	models = get_models_from_config(config)
	storage_methods = get_storage_from_config(config)

	plan = []
	with open(plan_file) as f:
		plan = yaml.load(f)

	# For now, plans will be serial sequences from data source to final database storage
	datasource_aliases, data_cleaner_aliases, model_aliases, storage_aliases = set(data_sources.keys()), set(data_cleaners.keys()), set(models.keys()), set(storage_methods.keys())
	modules = [None] * len(plan)
	plan_err = False
	for i, item in enumerate(plan):
		if item['type'] == 'Data Source':
			if item['alias'] not in data_sources:
				print "Data source '%s' not found in config" % item['alias']
				plan_err = True
			else:
				modules[i] = data_sources[item['alias']]
				datasource_aliases.remove(item['alias'])
		elif item['type'] == 'Data Cleaner':
			if item['alias'] not in data_cleaners:
				print "Data cleaner '%s' not found in config" % item['alias']
				plan_err = True
			else:
				modules[i] = data_cleaners[item['alias']]
				data_cleaner_aliases.remove(item['alias'])
		elif item['type'] == 'Model':
			if item['alias'] not in models:
				print "Model '%s' not found in config"
				plan_err = True
			else:
				modules[i] = models[item['alias']]
				model_aliases.remove(item['alias'])
		elif item['type'] == 'Storage':
			if item['alias'] not in storage_methods:
				print "Storage method '%s' not found in config"
				plan_err = True
			else:
				modules[i] = storage_methods[item['alias']]
				storage_aliases.remove(item['alias'])

	# Check to see if any data source, data cleaner, model, or storage method from the config file is unused in this plan
	if len(datasource_aliases) > 0:
		print "Unused data sources (by alias): %s" % ', '.join(list(datasource_aliases))

	if len(data_cleaner_aliases) > 0:
		print "Unused data cleaner (by alias): %s" % ', '.join(list(data_cleaner_aliases))

	if len(model_aliases) > 0:
		print "Unused models (by alias): %s" % ', '.join(list(model_aliases))

	if len(storage_aliases) > 0:
		print "Unused storage methods (by alias): %s" % ', '.join(list(storage_aliases))

	# Make sure a plan was actually loaded!
	if not modules or any([entry is None for entry in modules]):
		print "No valid plan was detected in the plan.yml file."
		sys.exit(1)

	# Make sure all plan entries were loaded
	if plan_err:
		print "Error loading plan - some modules were not loaded. See previous errors for details."
		sys.exit(1)

	return modules, plan