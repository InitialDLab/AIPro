import yaml
import sys
import signal
from utils.plan_parser import init_modules
import argparse
import os
import threading
from time import sleep

def run_thread(module, thread_num):
	#print "Running thread %d" % thread_num
	module.run()

def run_pipeline(modules):
	try:
		threads = [None] * len(modules)
		for thread_num, module in enumerate(modules):
			threads[thread_num] = threading.Thread(target=run_thread, args=(module, thread_num))
			threads[thread_num].daemon = True
			threads[thread_num].start()
		while 1:
			sleep(1)

	except Exception as e:
		print e
		#close_gracefully(None, None)

def close_gracefully(signal, frame):
	print "Closing gracefully"
	if modules:
		for module in modules:
			# Try to clean up resources, if we can (close the streaming thread used in the Twitter Stream, for example)
			if hasattr(module, 'close_gracefully'):
				module.close_gracefully()
	sys.exit(0)

if __name__ == '__main__':
	# Register that when the program is terminated, all threads must close gracefully as well
	signal.signal(signal.SIGTERM, close_gracefully)
	signal.signal(signal.SIGINT, close_gracefully)

	# Initialize data sources, models and storage methods based on the config
	parser = argparse.ArgumentParser(description="Please specify the location of your config file")
	parser.add_argument('-c', '--config-file', type=str, help='The filepath to your config.yml file', default='config.yml', required=True)
	args = parser.parse_args()
	config = {}

	with open(args.config_file) as f:
		print os.path.dirname(os.path.realpath(args.config_file))
		config = yaml.load(f)
		config['base_path'] = os.path.dirname(os.path.realpath(args.config_file))

	modules = init_modules(config)

	# Execute the plan on a loop, waiting for the keyboard interrupt to end the loop
	try:
		run_pipeline(modules)
	except KeyboardInterrupt as e:
		close_gracefully(None, None)
