import numpy as np
import mxnet as mx
from collections import namedtuple
from mxnet.contrib.onnx.onnx2mx.import_model import import_model
import os

# Credit to the ImageNet notebook tutorial for ONNX with MXNet
class ImageClassifier:
    def _get_absolute_path(self, path):
        return os.path.join(os.path.dirname(os.path.abspath(__file__)), path)

    def __init__(self, model_config):
        # Load all of the labels into memory
        labels_path = self._get_absolute_path('data/synset.txt')
        with open(labels_path, 'r') as f:
            # synset.txt has a weird format, just get the first label
            self.labels = [' '.join(l.rstrip().split()[1:]).split(',')[0] for l in f]

        self.Batch = namedtuple('Batch', ['data'])

        # Load the ONNX model
        model_path= self._get_absolute_path(model_config['model_path'])
        sym, arg_params, aux_params = import_model(model_path)

        # Determine and set context
        if len(mx.test_utils.list_gpus())==0:
            print('No GPUs available')
            ctx = mx.cpu()
        else:
            print('Using GPU')
            ctx = mx.gpu(0)
        # Load module
        self.mod = mx.mod.Module(symbol=sym, context=ctx, label_names=None)
        self.mod.bind(for_training=False, data_shapes=[('data', (1,3,224,224))], 
                label_shapes=self.mod._label_shapes)
        self.mod.set_params(arg_params, aux_params, allow_missing=True, allow_extra=True)

    def predict(self, image):
        self.mod.forward(self.Batch([image]))
        scores = mx.ndarray.softmax(self.mod.get_outputs()[0]).asnumpy()
        scores = np.squeeze(scores)
        ranked_scores = np.argsort(scores)[::-1]
        
        predictions_with_probabilities = [{'class': self.labels[i], 'probability': scores[i].astype(float)} for i in ranked_scores[:5]]
        return predictions_with_probabilities[0]
