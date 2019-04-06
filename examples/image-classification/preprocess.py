import mxnet as mx
from mxnet.gluon.data.vision import transforms
import os

class ImagePreprocessor:
    def _get_absolute_path(self, path):
        return os.path.join(os.path.dirname(__file__), path)

    def _get_image(self, image_path):
        image_path = self._get_absolute_path(image_path)
        img = mx.image.imread(image_path)
        if img is None:
            return None
        return img

    # Preprocess inference image -> resize to 256x256, take center crop of 224x224, normalize image, add a dimension to batchify the image
    def preprocess(self, image_path):
        img = self._get_image(image_path)   
        transform_fn = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        img = transform_fn(img)
        img = img.expand_dims(axis=0)
        return img
