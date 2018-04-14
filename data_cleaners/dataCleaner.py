class DataCleaner:
	def clean(self, data):
		raise Exception('Not implemented in subclass')

class TextToNumerical(DataCleaner):
	def __init__(self, messenger):
		self.dictionary = {}
		self.max_item = 0

	def run(self):
		self.messenger.start(self.clean)

	def add_word_to_dictionary(self, word):
		if word not in self.dictionary:
			self.dictionary[word] = self.max_item
			self.max_item += 1

	def clean(self, text):
		# Add words to the dictionary
		for word in text.split():
			self.add_word_to_dictionary(word)
		word_ids = [self.dictionary[word] for word in words if word in self.dictionary]
		self.publish(word_ids)

	def publish(self, message):
		self.messenger.publish(message)
