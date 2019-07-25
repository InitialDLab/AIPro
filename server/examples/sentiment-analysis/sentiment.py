import os
from keras.models import model_from_json
from keras.preprocessing import sequence

class SentimentClassifier:
    def __init__(self):
        self.lstm_model = None
        self.loaded_dict = None
        self.dict_keys = None
        self.prepare(os.path.dirname(os.path.realpath(__file__)) + '/model')
        
        # Keras bug - we need to make a prediction before we can use this in a multi-threaded environment
        # https://github.com/jaara/AI-blog/issues/2
        text_sequence = sequence.pad_sequences([[0,0,0,0]], maxlen=100)
        self.lstm_model.predict_proba(text_sequence)
        
    def model_loading_from_json_and_weights(self, saved_json_file, saved_weights):
        with open(saved_json_file, 'r') as model_json_file:
            loaded_json_model = model_json_file.read()
            ml_model = model_from_json(loaded_json_model)
            ml_model.load_weights(saved_weights)
            print("Loaded keras model from disk")
            return ml_model

    def prepare(self, model_files_dir):
        self.lstm_model = self.model_loading_from_json_and_weights(model_files_dir+"/model.json", model_files_dir+"/model.h5")
        
    def predict(self, text_as_token_ids):
        if len(text_as_token_ids) > 0:
            text_sequence = sequence.pad_sequences([text_as_token_ids], maxlen=100)
            prob_1 = self.lstm_model.predict_proba(text_sequence, verbose=2)[0][0].item() # JSON bug - np.float32 isn't JSON-serializable, call .item() to make it a float
        else:
            prob_1 = 0.5
        
        return prob_1

if __name__ == '__main__':
    sc = SentimentClassifier()
    print(sc.predict('RT @Michael5SOS: so nice to meet you https://t.co/Xv7oqTXWQe'))
