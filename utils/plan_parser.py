import sys
import os
import yaml
from import_module import import_module_from_file
from messaging.messaging import Messenger

def get_data_sources_from_config(config):
	data_sources = []
	if 'data_sources' in config:
		for source_config in config['data_sources']:
			messenger = Messenger(config['messaging'])
			# Only need to set outputs for messenger, since data sources don't receive external messages
			messenger.set_outgoing(source_config['outputs'])
			
			if source_config['type'] == 'StreamingAPI':
				from data_sources.twitterStream import Twitter
				data_sources.append(Twitter(source_config, messenger))

			if source_config['type'] == 'FlatFile':
				from data_sources.flatFile import FlatFile
				data_sources.append(FlatFile(source_config, messenger))

	return data_sources

def get_data_cleaners_from_config(config):
	cleaners = []
	# Data cleaners are optional
	if 'cleaners' in config:
		for source_config in config['cleaners']:
			messenger = Messenger(config['messaging'])
			messenger.set_incoming(source_config['alias'])
			messenger.set_outgoing(source_config['outputs'])

			if source_config['type'] == 'TextToNumerical':
				from data_cleaners.dataCleaner import TextToNumerical
				cleaners.append(TextToNumerical(messenger))

	return cleaners

def get_models_from_config(config):
	models = []
	if 'models' in config:
		for source_config in config['models']:
			messenger = Messenger(config['messaging'])
			messenger.set_incoming(source_config['alias'])
			messenger.set_outgoing(source_config['outputs'])

			if source_config['type'] == 'Custom':
				from models.customModel import CustomModel
				custom_module = import_module_from_file(source_config['module_classname'], config['base_path'] + '/' + source_config['module_file_path'])
				constructor = getattr(custom_module, source_config['module_classname'])
				instance = constructor()
				models.append(CustomModel(getattr(instance, source_config['method_name']), messenger))

	return models

def get_storage_from_config(config):
	storage = []
	if 'storage' in config:
		for source_config in config['storage']:
			messenger = Messenger(config['messaging'])
			messenger.set_incoming(source_config['alias'])
			
			if source_config['type'] == 'MongoDB':
				from storage_methods.databases import MongoDB
				storage.append(MongoDB(source_config, messenger))
			if source_config['type'] == 'File':
				from storage_methods.fileStorage import FileStorage
				storage.append(FileStorage(source_config, messenger))

	return storage


def init_modules(config):
	modules = []
	modules += get_data_sources_from_config(config)
	modules += get_data_cleaners_from_config(config)
	modules += get_models_from_config(config)
	modules += get_storage_from_config(config)

	return modules
