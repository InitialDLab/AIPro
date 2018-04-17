import os
import preprocessor as p
import gensim
import re

class TweetPreprocessor:
	def __init__(self, config):
		assert 'json_attribute' in config
		self.json_attribute = config['json_attribute']
		self.prepare(os.path.dirname(os.path.realpath(__file__)) + '/model')
		self.regex = r'[^\x00-\x7f]+'

	def prepare(self, model_files_dir):
		self.loaded_dict = gensim.corpora.Dictionary().load(model_files_dir+"/sentiment_classifier_dictionary_model.dict")
		self.dict_keys = self.loaded_dict.token2id

	def preprocess(self, data):
		if 'lang' in data and data['lang'] != 'en':
			return
		if self.json_attribute in data:
			to_preprocess = data[self.json_attribute]
			to_preprocess = re.sub(self.regex, '', to_preprocess)
			text = p.clean(to_preprocess).split()
			text_as_token_ids = [self.loaded_dict.token2id[token] for token in text if token in self.dict_keys]
			return text_as_token_ids
