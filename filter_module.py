import json

class Filter:
    def __init__(self, config, messenger):
        self.config = config
        self.condition = config['condition']
        if 'attribute' in config and config['attribute'] != '':
            self.attribute = config['attribute']
        self.value = config['value']
        self.funcs = {
            'gt': self.gt,
            'lt': self.lt,
            'eq': self.eq,
            'neq': self.neq
        }
        if 'projection' in config and len(config['projection']) > 0:
            self.projection = config['projection']
        self.messenger = messenger

    def publish(self, data):
        self.messenger.publish(data)

    # Just a wrapper, for backwards compati
    def run(self):
		self.messenger.start(self.process)

    def stop(self):
        self.messenger.stop()

    def process(self, data):
        output = self.funcs[self.condition](data)
        
        # Filtered out, don't worry about it and let it drop
        if not output:
            #print('Output dropped with filter \'%s %s\'' %(self.condition, self.value))
            return

        if hasattr(self, 'projection'):
            output = [output[key] for key in self.projection]
        self.messenger.publish(output)

    def gt(self, data):
        if hasattr(self, 'attribute'):
            return data if data[self.attribute] > self.value else None
        else:
            return data if data > self.value else None

    def lt(self, data):
        if hasattr(self, 'attribute'):
            return data if data[self.attribute] < self.value else None
        else:
            return data if data < self.value else None

    def eq(self, data):
        if hasattr(self, 'attribute'):
            return data if data[self.attribute] == self.value else None
        else:
            return data if data == self.value else None

    def neq(self, data):
        if hasattr(self, 'attribute'):
            return data if data[self.attribute] != self.value else None
        else:
            return data if data != self.value else None
