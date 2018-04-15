class IO:
	def __init__(self, messenger):
		self.messenger = messenger

	def run(self):
		self.messenger.start(self.write)

	def write(self, data):
		print data