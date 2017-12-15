import yaml
import sys
import signal
from data.data_source import DataSource
from models.model import Model
from utils.storage import Storage

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
		
		elif source_config['type'] == 'MessageQueue':
			if 'data.messageStream' not in sys.modules:
				from data.messageStream import MessageStream
			data_sources[source_config['alias']] = MessageStream(source_config)

	return data_sources

def get_models_from_config(config):
	models = {}
	for source_config in config['models']:
		if source_config['type'] == 'Keras-With-H5-File':
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

def run_plan_loop(modules, plan):
	previous_output = []
	assert(len(modules) == len(plan))
	m = len(plan)
	for i in xrange(m):
		module, plan_entry = modules[i], plan[i]
		if isinstance(module, DataSource):
			print "Getting data from data source '%s'" % plan[i]['alias']
			previous_output += module.get_data(plan_entry['attribute'])
		elif isinstance(module, Model):
			print "Processing data in model '%s'" % plan[i]['alias']
			previous_output = module.process(previous_output)
		elif isinstance(module, Storage):
			print "Saving output with storage method '%s'" % plan[i]['alias']
			module.save(previous_output)
		else:
			print "Unknown plan entry type: %s" % type(module)
	print

def close_gracefully(signal, frame):
	print "Closing gracefully"
	if modules:
		for module in modules:
			# Try to clean up resources, if we can (close the streaming thread used in the Twitter Stream, for example)
			if hasattr(module, 'close_gracefully'):
				module.close_gracefully()

	sys.exit(0)

signal.signal(signal.SIGTERM, close_gracefully)
signal.signal(signal.SIGINT, close_gracefully)

# Initialize data sources, models and storage methods based on the config
config = {}
with open('config.yml') as f:
	config = yaml.load(f)

data_sources = get_data_sources_from_config(config)
models = get_models_from_config(config)
storage_methods = get_storage_from_config(config)

# Initialize the plan, based on the plan file
plan = []
with open('plan.yml') as f:
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

# TODO: Make sure the first entry in the plan is either storage or a data source

# Execute the plan on a loop, waiting for the keyboard interrupt to end the loop
while True:
	try:
		run_plan_loop(modules, plan)
	except KeyboardInterrupt as e:
		close_gracefully(None, None)