import os
import preprocessor as p
import gensim
import re

class TweetPreprocessor:
	def __init__(self):
		model_files_dir = os.path.dirname(os.path.realpath(__file__)) + '/model'
		self.loaded_dict = gensim.corpora.Dictionary().load(model_files_dir+"/sentiment_classifier_dictionary_model.dict")
		self.dict_keys = self.loaded_dict.token2id
		self.regex = r'[^\x00-\x7f]+'

	def preprocess(self, data):
		text = re.sub(self.regex, '', data)
		text = p.clean(text).split()
		text_as_token_ids = [self.loaded_dict.token2id[token] for token in text if token in self.dict_keys]
		return text_as_token_ids
