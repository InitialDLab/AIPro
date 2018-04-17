import pika
import json
import traceback

'''
Interface for communicating in the pipeline,
currently using RabbitMQ
'''
class Messenger:
	def __init__(self, config):
		# TODO: Make connection params more robust
		self.connection = pika.BlockingConnection(pika.ConnectionParameters(config['host']))
		self.channel = self.connection.channel()
		self.do_log = False

	def set_incoming(self, incoming_alias):
		self.channel.queue_declare(queue=incoming_alias, durable=True)
		self.incoming_alias = incoming_alias

	def set_outgoing(self, outgoing_aliases):
		self.outgoing_aliases = outgoing_aliases
		if type(outgoing_aliases) == list:
			for alias in outgoing_aliases:
				self.channel.queue_declare(queue=alias, durable=True)
		else:
			self.channel.queue_declare(queue=outgoing_aliases, durable=True)

	def start(self, process_handler):
		self.process = process_handler
		self.channel.basic_consume(self.receive_handler, queue=self.incoming_alias)
		self.channel.start_consuming()

	def publish(self, message):
		# Always publish an actual string of JSON
		message = json.dumps({'message': message})
		for alias in self.outgoing_aliases:
			self.channel.basic_publish(exchange='', \
				routing_key=alias, \
				body=message, \
				properties=pika.BasicProperties( \
					delivery_mode = 2
				))
			if self.do_log:
				with open('messaging.log', 'a+') as f:
					f.write('Message written to alias %s\n' % alias)
					f.write(message)
					f.write('\n\n\n')
			#print "Published %r to %s" % (message, alias)

	def receive_handler(self, ch, method, properties, message):
		try:
			data = json.loads(message)
			if self.do_log:
				with open('messaging-receive.log', 'a+') as f:
					f.write('Message received:\n')
					f.write(message)
					f.write('\n\n\n')
			# The incoming message will always have a 'message' attribute that contains the actual data from the previous node in the DAG
			self.process(data['message'])
		except Exception as e:
			print "Couldn't process incoming message %r" % message
			print e
			traceback.print_exc()
		finally:
			# Judgment call - if we can't process the JSON in an incoming message, we don't want it anyway - so it's OK for RabbitMQ to drop it
			ch.basic_ack(delivery_tag = method.delivery_tag)
