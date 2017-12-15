import socket
from data_source import DataSource

class SocketStream(DataSource):
	'''
	A prototypical socket connection for the Compass data pipeline.
	This one doesn't do much (just writes to and reads from a dummy server socket),
	but it shows how the config works with setting up the socket connection.
	'''
	def __init__(self, socket_config):
		self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.host = socket_config['host']
		self.port = socket_config['port']

	def connect(self):
		self.sock.connect((self.host, self.port))
		print "Socket connected to host %s at port %i." % (self.host, self.port)

	def read(self):
		message = self.sock.recv(20)
		return message

	def write(self, msg):
		self.sock.send(msg)

	def close(self):
		# Shutdown is a more graceful way of closing the connection, it doesn't make the server think we're still working on a reply
		print "Shutting down"
		self.sock.shutdown(0)
		print "Closing"
		self.sock.close()
		print "Socket connection to host %s at port %i has been closed successfully." % (self.host, self.port)

'''
Example usage:
1) Load the config file
2) Find a data source with the Socket type
3) Instantiate a new SocketStream instance ()
4) Connect the socket to the host and port specified in the config file
5) Read to and write from the server socket we connected to in step 4
6) Close when ready
'''
if __name__ == '__main__':
	import yaml
	with open("../config-template.yml") as f:
		config = yaml.load(f)

		for source_config in config['data_sources']:
			if source_config['type'] == 'Socket':
				print "Connecting to socket with alias", source_config['alias']
				s = SocketStream(source_config)
				s.connect()
				s.write("Hi there")
				message = s.read()
				print message
				s.close()
