import requests
import random

class ImageRequestBuilder:
    def __init__(self):
        print('Initializing image request builder')

    def generate_random_string(self, length):
        letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        numbers = '0123456789'
        return ''.join(random.choice(letters + numbers) for __ in range(length))

    def prepare_request(self, data):
        url = data['url']
        response = requests.get(url, stream=True)
        image = response.raw.read()
        if image:
            filename = 'streaming-images/{}.jpeg'.format(self.generate_random_string(15))
            with open(filename, 'w+') as f:
                f.write(image)
        req = {'image': ('image.jpeg', image, 'image/jpeg')}
        return req
