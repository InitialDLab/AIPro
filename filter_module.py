import json

class Filter:
    def __init__(self, config, messenger):
        self.config = config
        self.condition = config['condition']
        self.attribute = config['attribute']
        self.value = config['value']
        self.funcs = {
            '>': self.gt,
            '<': self.lt,
            '==': self.eq,
            '!=': self.neq
        }
        self.projection = config['projection']
        self.messenger = messenger

    def publish(self, data):
        self.messenger.publish(data)

    def process(self, data):
        output = self.funcs[self.condition](data)
        
        # Filtered out, don't worry about it and let it drop
        if not output:
            return
        
        if self.projection:
            output = [output[key] for key in self.projection]
        self.messenger.publish(output)

    def gt(self, data):
        return data if data[self.attribute] > self.value else None

    def lt(self, data):
        return data if data[self.attribute] < self.value else None

    def eq(self, data):
        return data if data[self.attribute] == self.value else None

    def neq(self, data):
        return data if data[self.attribute] != self.value else None
