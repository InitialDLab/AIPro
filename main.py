import yaml
import sys
import signal
from data.data_source import DataSource
from models.model import Model
from utils.storage import Storage
from utils.plan_parser import parse_plan

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

# Register that when the program is terminated, all threads must close gracefully as well
signal.signal(signal.SIGTERM, close_gracefully)
signal.signal(signal.SIGINT, close_gracefully)

# Initialize data sources, models and storage methods based on the config
config = {}
with open('config.yml') as f:
	config = yaml.load(f)

modules, plan = parse_plan(config)

# Execute the plan on a loop, waiting for the keyboard interrupt to end the loop
while True:
	try:
		run_plan_loop(modules, plan)
	except KeyboardInterrupt as e:
		close_gracefully(None, None)