# Compass
### A primer
**Compass** stands for **Compr**ehensive **A**nalytics on **S**entiment for **S**patiotemporal data. The project started with an aim to provide framework for running several machine learning models over spatiotempral data with a single configuration file. 

Presently **Compass** do much more. It act as a framework to unite `data sources`, `models` and `stores` components. 

	- Data Source types: 
		- `API`
		- `Socket`
		- `File` 
	- Models types:
		- `API`
		- `Downloadable` or `Local`
	- Store types
		- `Databases`
		- `File`
A pipeline with any combination of components can be created with just a configuration file. 
**Compass**'s goal is to help you make your own **Data Science as a Service (DSaaS)** platform.

## :rocket:[Quick Start on Ubuntu](#rocketquick-start-on-ubuntu)
1. Clone this repository
``
git clone https://github.com/debjyoti385/Compass.git
``

2. Install dependencies
	- Assuming Docker and RabbitMQ both not present
		- `./docker-ubuntu.sh`
		- `./run.sh`	
	- Installing Python dependencies
		- `./install.sh`
3. Run Sentiment Analysis pipeline from `examples`
	- Install model dependencies
		- `source venv/bin/activate && pip install -r examples/sentiment-analysis/requirements.txt`
	- Run Compass
		- `python main.py -c examples/sentiment-analysis/config-rawfile.yml`
	- Output
		- JSON file contaiining tweets with sentiment scores 
		- `examples/sentiment-analysis/tweets-with-sentiment.json`
4. To stop
	- `ctrl+c` or `SIGKILL`

## :octocat:[Get started](#octocatget-started)
1. Clone this repository
2. Install dependencies
    - Install Messaging Interface 
        - We use RabbitMQ as of now.
        - Start a RabbitMQ server instance, preferably your local machine.
	    - If you don't have RabbitMQ installed, we highly recommend using [Docker](https://hub.docker.com/_/rabbitmq/). We provide a script `docker-ubuntu.sh` to install docker on Ubuntu 16.04.  
        - Once you have Docker installed, the `run.sh` script in this directory will start RabbitMQ with the proper settings.
    - Install Python virtual environment and core dependencies (Note: It uses `python2.7` right now. )
        - `./install.sh` 
3. Create a config file based on the config-template.yml file with your pipeline requirements
	- More on config file setup in [next section](#config-file-setup)
    - An example can be found at `examples/sentiment-analysis/config-rawfile.yml`
4. Install all the Python requirements specific to your models, data sources and storage methods within the same virtual environment that was created in step 2.
	- Example: `source venv/bin/activate && pip install -r examples/sentiment-analysis/requirements.txt`.
	- The directory `venv` resides in the `Compass/` folder contains all the python dependency packages.
5. To run Compass 
    - Make sure you are in the same virtual environment.
    - `python main.py -c config-file`, where config-file is the location of the config file you created in step 3.
6. To stop
    - ctrl+c or SIGKILL
	- By default, each Compass instance will run indefinitely until stopped with a keyboard interrupt or SIGKILL.


## [Config file setup](#config-file-setup)
In order to get the config file set up, there are some things you'll need to pay attention to:
- Every module besides storage methods needs an "outputs" section to specify the next module(s) in the pipeline. To output to another module with alias "My model", for example, add "My model" to the list of outputs.
- Every module has an "alias" attribute, and is the unique identifier for that module.  This is the most important attribute for a module, so don't forget to include it with your module!
- To get an idea of how to set up a config file correctly, check out the sentiment analysis example in the examples directory.  It not only includes the code necessary to run a pipeline, it also includes the configuration file to run the example so you can get a feel of how they work.
	- The config-template.yml file in this main directory also contains every currently supported option, so a good place to start (and understand how config files work) might be to copy this file and make adjustments of your own.
- Different types of modules (data sources, models, data preprocessors, storage methods) have unique requirements, but many of them are optional.  The config-template.yml file has comments to let you know what's required and what's not.
- To get a walkthrough on specific config examples (i.e. like in examples/sentiment-analysis), take a look at the README.md that shows up in the sentiment analysis's directory for an explanation.
	- Sorry about the size of the repo in general, we have a larger-than-we'd-like model file for the sentiment analysis example
- If you have an instance of RabbitMQ you want to connect to, you can provide the host name in the config file. The default host name is localhost.


## [Data Preprocessor Notes](#data-preprocessor-notes)
Data Preprocessors are important for massaging the data when necessary.  For example, in the sentiment analysis example, tweets need to be translated into a sequence of integers to be run in the sentiment model.  If your data doesn't need preprocessing, don't worry - we have a default preprocessor that just passes data through.
