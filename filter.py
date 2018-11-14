import json

class Filter:
    def __init__(self, config, messenger):
        self.config = config
        self.condition = config['condition']
        self.attribute = config['attribute']
        self.value = config['value']
        self.funcs = {
            '>': lambda x: x if x[self.attribute] > self.value,
            '<': lambda x: x if x[self.attribute] < self.value,
            '==': lambda x: x if x[self.attribute] == self.value
        }
        self.projection = config['projection']
        self.messenger = messenger

    def publish(self, data);
        self.messenger.publish(data)

    def process(self, data):
        output = self.funcs[self.condition](data)
        
        # Filtered out, don't worry about it and let it drop
        if not output:
            return
        
        if self.projection:
            output = [output[key] for key in self.projection]
        self.messenger.publish(output)
