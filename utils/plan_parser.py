import sys
import os
from import_module import import_module_from_file
from messaging import Messenger
from compass_preprocessor import CompassPreprocessor
from filter_module import Filter

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

			if source_config['type'] == 'FlatFileDataSource':
				from data_sources.flatFile import FlatFile
				# Include the base path (the location of the config file), in case the flat file's path is relative to the config file
				source_config['base_path'] = config['base_path']
				data_sources.append(FlatFile(source_config, messenger))

	return data_sources

def get_models_from_config(config):
	models = []
	if 'models' in config:
		for model_config in config['models']:
			messenger = Messenger(config['messaging'])
			messenger.set_incoming(model_config['alias'])
			messenger.set_outgoing(model_config['outputs'])

			if 'preprocessor' in model_config and 'preprocessors' in config:
				for preprocess_config in config['preprocessors']:
					if preprocess_config['alias'] == model_config['preprocessor']:
						preprocessor_path = config['base_path'] + '/' + preprocess_config['module_file_path']
						print('Loading preprocessor from path "%s"' % preprocessor_path)
						preprocessor = import_module_from_file(preprocess_config['module_classname'], preprocessor_path)
						constructor = getattr(preprocessor, preprocess_config['module_classname'])
						instance = constructor(preprocess_config)
						preprocessor = CompassPreprocessor(preprocess_config, instance)
						break
			
			# No preprocessor provided? That's ok, we'll just use the default one.
			else:
				preprocessor = CompassPreprocessor(None, None)

			from model import Model
			module = import_module_from_file(model_config['module_classname'], config['base_path'] + '/' + model_config['module_file_path'])
			constructor = getattr(module, model_config['module_classname'])
			instance = constructor()
			models.append(Model(model_config, instance, messenger, preprocessor))

	return models

def get_storage_from_config(config):
	storage = []
	if 'storage' in config:
		for storage_config in config['storage']:
			messenger = Messenger(config['messaging'])
			messenger.set_incoming(storage_config['alias'])
			
			if storage_config['type'] == 'MongoDB':
				from storage_methods.databases import MongoDB
				storage.append(MongoDB(storage_config, messenger))
			if storage_config['type'] == 'FlatFileStorage':
				from storage_methods.fileStorage import FileStorage
				storage_config['base_path'] = config['base_path']
				storage.append(FileStorage(storage_config, messenger))

			if storage_config['type'] == 'IO':
				from storage_methods.IO import IO
				storage.append(IO(messenger))

	return storage

def get_filters_from_config(config):
	filters = []
	if 'filters' in config:
		for filter_config in config['filters']:
			messenger = Messenger(config['messaging'])
			messenger.set_incoming(filter_config['alias'])
			messenger.set_outgoing(filter_config['outputs'])

			filters.append(Filter(filter_config, messenger))

	return filters


def init_modules(config):
	modules = []
	modules += get_data_sources_from_config(config)
	modules += get_models_from_config(config)
	modules += get_storage_from_config(config)
	modules += get_filters_from_config(config)

	return modules
