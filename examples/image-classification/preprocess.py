import mxnet as mx
from mxnet.gluon.data.vision import transforms
import os
import requests
import random

class ImagePreprocessor:
    def generate_random_string(self, length):
        letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        numbers = '0123456789'
        return ''.join(random.choice(letters + numbers) for __ in range(length))

    def _get_image(self, data):
        url = data['url']
        response = requests.get(url, stream=True)
        image = response.raw.read()
        if image:
            filename = 'streaming-images/{}.jpeg'.format(self.generate_random_string(15))
            with open(filename, 'w+') as f:
                f.write(image)
                data['image-location'] = filename
            img = mx.image.imread(filename)
            if img is None:
                return None
            return img
        else:
            return None

    # Preprocess inference image -> resize to 256x256, take center crop of 224x224, normalize image, add a dimension to batchify the image
    def preprocess(self, data):
        img = self._get_image(data)  
        if img is None:
            return None 
        transform_fn = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        img = transform_fn(img)
        img = img.expand_dims(axis=0)
        return img
