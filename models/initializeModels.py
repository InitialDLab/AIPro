import importmodule
import argparse

def init_downloadable_model(config, args):
	'''
	model_type: 'Classification'
	model_service_type: 'DOWNLOAD'
	model_code: 'classificationModel.py'
	model_build_function: 'model.build'
	model_fit_function: 'model.fit'
	model_save_function: 'model.save'
	mode_predict_function: 'model.predict'
	'''
	module = importlib.importmodule(config['model_code'])
	build_function = getattr(module, config['model_build_function'])
	model = build_function(model_file=args['model_file'], weights_file=args['weights_file'])
	return model


if __name__ == '__main__':
	parser = argparse.ArgumentParser(description="Provide arguments to your model initialization")
	parser.add_argument("--model-file", type="str", help="The file to ingest to recreate your saved model", required=True)
	parser.add_argument("--weights-file", type="str", help="The file to ingest to set the weights from your saved model", required=True)
	args = parser.parse_args()

	import yaml
	with open("../config.yml") as f:
		yaml_config = yaml.load(f)
		for config in yaml_config['models']:
			if config['model_service_type'] == 'DOWNLOAD':
				model = init_downloadable_model(config, args)
