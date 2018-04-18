# How to use Compass
### A primer

Compass is meant to be used by providing your own (previously trained) models, data sources and storage methods.  Compass's job is to unite all of these components to form customizable pipelines, with the goal of providing Data Science as a Service (DSaaS)

## How to get started, the quick and dirty
1. Clone this repository
2. Start a RabbitMQ server instance, preferably locally
	- If you don't have RabbitMQ installed, we highly recommend using Docker to get one set up. Once you have Docker installed, the run.sh script in this directory will start RabbitMQ with the proper settings.
3. Run install.sh to install a virtual environment and core dependencies
4. Create a config file based on the config-template.yml file with your pipeline requirements
	- More on this to follow
5. Install the Python requirements specific to your models, data sources and storage methods within the same virtual environment that was created in step 2
	- This directory will be named "venv" and will reside in the directory where this repository was cloned
6. While in the same virtual environment used in Steps 2 and 4, run main.py -c <config-file>, where <config-file> is the location of the config file you created in step 3.
7. To stop a pipeline, just close out of the process with ctrl+c or SIGKILL

## Notes on the config file setup
In order to get the config file set up, there are some things you'll need to pay attention to:
- Every module besides storage methods needs an "outputs" section to specify the next module(s) in the pipeline
- Every module has an "alias" attribute, and is the unique identifier for that module.  This is the most important attribute for a module, so don't forget it!
- To get an idea of how to set up a config file correctly, check out the examples directory.  They not only include the code necessary to run a pipeline, they also include the configuration file to run the examples so you can get a feel of how they work.
	- The config-template.yml file in this main directory also contains every currently supported option, so a good place to start might be to copy this file and make adjustments of your own.
- Different types of modules (data sources, models, data preprocessors, storage methods) have unique requirements, but many of them are optional.  The config-template.yml file has comments to let you know what's required and what's not
- To get a walkthrough on specific config examples (i.e. like in examples/sentiment-analysis), take a look at the README.md that shows up in each example's directory for an explanation

## Specific notes on different module types
### Data Sources
TODO: Something here

### Models
TODO: Something here

### Data preprocessors
TODO: Something here

### Storage methods
TODO: Something here
