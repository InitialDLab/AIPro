class DataCleaner:
	def clean(self, data):
		raise Exception('Not implemented in subclass')

class TextToNumerical(DataCleaner):
	def __init__(self):
		self.dictionary = {}
		self.max_item = 0

	def add_word_to_dictionary(self, word):
		if word not in self.dictionary:
			self.dictionary[word] = self.max_item
			self.max_item += 1

	def clean(self, data):
		data_to_return = []
		for entry in data:
			# Add words to the dictionary
			words = entry.split()
			for word in words:
				self.add_word_to_dictionary(word)
			data_to_return.append([self.dictionary[word] for word in words if word in self.dictionary])

		return data_to_return