import sys
import os
from import_module import import_module_from_file
from messaging import Messenger
from data_sources.twitterStream import Twitter
from custom_entity import CustomEntity
from storage_methods.IO import IO
from storage_methods.databases import MongoDB
from data_sources.flatFile import FlatFile
from storage_methods.fileStorage import FileStorage
from ai_preprocessor import AIPreprocessor
from filter_module import Filter
from model import Model,  APIModel

def get_data_sources(config):
	data_sources = []
	if 'data_sources' in config:
		for source_config in config['data_sources']:
			messenger = Messenger(config['messaging'])
			# Only need to set outputs for messenger, since data sources don't receive external messages
			messenger.set_outgoing(source_config['outputs'])
			
			if source_config['type'] == 'TwitterStreamingAPI':
				data_sources.append(Twitter(source_config, messenger))

			if source_config['type'] == 'FlatFileDataSource':
				# Include the base path (the location of the config file), in case the flat file's path is relative to the config file
				#source_config['base_path'] = config['base_path']
				data_sources.append(FlatFile(source_config, messenger))

	return data_sources

def get_models(config):
	models = []
	if 'models' in config:
		for model_config in config['models']:
			messenger = Messenger(config['messaging'])
			messenger.set_incoming(model_config['alias'])
			messenger.set_outgoing(model_config['outputs'])

			if 'preprocessor_filename' in model_config and model_config['preprocessor_filename'] != '':
				preprocessor_path = os.path.join(os.getcwd(), model_config['preprocessor_filename'])
				print('Loading preprocessor from path "%s"' % preprocessor_path)
				preprocessor = import_module_from_file(model_config['preprocessor_classname'], preprocessor_path)
				constructor = getattr(preprocessor, model_config['preprocessor_classname'])
				instance = constructor()
				preprocessor = AIPreprocessor(model_config, instance)	
			
			# No preprocessor provided? That's ok, we'll just use the default one and pass data through without preprocessing.
			else:
				preprocessor = AIPreprocessor(None, None)

			# TODO: Make it more obvious that models can be either on-premise or exist as APIs
			if 'module_file_path' in model_config:
				module = import_module_from_file(model_config['module_classname'], os.path.join(os.getcwd(), model_config['module_file_path']))
				constructor = getattr(module, model_config['module_classname'])
				
				#  Used for ONNX models
				if 'model_path' in model_config and model_config['model_path'].strip()  != '':
					instance = constructor(model_config)
				else:
					instance = constructor()
				models.append(Model(model_config, instance, messenger, preprocessor))
			else:
				instance =  None
				models.append(APIModel(model_config, instance,  messenger,  preprocessor))

	return models

def get_storage(config):
	storage = []
	if 'storage' in config:
		for storage_config in config['storage']:
			messenger = Messenger(config['messaging'])
			messenger.set_incoming(storage_config['alias'])
			
			if storage_config['type'] == 'MongoDB':
				storage.append(MongoDB(storage_config, messenger))

			if storage_config['type'] == 'FlatFileStorage':
				storage.append(FileStorage(storage_config, messenger))

			if storage_config['type'] == 'IO':
				storage.append(IO(messenger))

	return storage

def get_filters(config):
	filters = []
	if 'filters' in config:
		for filter_config in config['filters']:
			messenger = Messenger(config['messaging'])
			messenger.set_incoming(filter_config['alias'])
			messenger.set_outgoing(filter_config['outputs'])

			filters.append(Filter(filter_config, messenger))

	return filters

def get_custom_entities(pipeline):
	custom_entities = []
	if 'custom_entities' in pipeline:
		for config in pipeline['custom_entities']:
			messenger = Messenger(pipeline['messaging'])
			messenger.set_incoming(config['alias'])
			messenger.set_outgoing(config['outputs'])

			module = import_module_from_file(config['classname'], os.path.join(os.getcwd(), config['filename']))
			constructor = getattr(module, config['classname'])
			instance = constructor()

			custom_entities.append(CustomEntity(config, instance, messenger))
	
	return custom_entities

def init_modules(config):
	modules = []
	modules += get_data_sources(config)
	modules += get_models(config)
	modules += get_storage(config)
	modules += get_filters(config)
	modules += get_custom_entities(config)

	return modules
