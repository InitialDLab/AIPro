# AI Pro [Demo](https://www.youtube.com/watch?v=e6imr87kdB4)
### What is it?
AI Pro is data science as a service. Rather than munging through data endlessly and forever tweaking lines of code to get your inference pipelines just right, AI Pro does this all seamlessly for you.

You can either use the browser-based UI, or write config files yourself.

At its core, AI Pro acts as a framework to unite `data sources`, `models` and `storage` components. 

	- Data Source types: 
		- JSON Lines
		- Twitter's Streaming API
		- CSV files
		- Image streams 
	- Models types:
		- Custom models (Tensorflow, Keras, Scikit-Learn, and more)
	- Storage types
		- MongoDB
		- Flat files

A pipeline with any combination of components can be created with just a configuration file. 
**AIPro**'s goal is to help you make your own **Data Science as a Service (DSaaS)** platform.

## :rocket:[Quick Start on Ubuntu](#rocketquick-start-on-ubuntu)
1. Clone this repository
``
git clone https://github.com/InitialDLab/AIPro.git
``

2. Install dependencies
	- Use Docker and Rabbit MQ for the message processing
		- `./docker-ubuntu.sh`
		- `./run.sh`	
	- Installing Python dependencies
		- `./install.sh`
3. Run Sentiment Analysis pipeline from `examples`
	- Install model dependencies
		- `source venv/bin/activate && pip install -r examples/sentiment-analysis/requirements.txt`
	- Run AI Pro
		- `python main.py -c examples/sentiment-analysis/config-rawfile.yml`
	- Output
		- JSON file contaiining tweets with sentiment scores 
		- `examples/sentiment-analysis/tweets-with-sentiment.json`
4. To stop
	- `ctrl+c` or `SIGKILL`

## :octocat:[Get started with the web UI](#octocatget-started-webui)
**AI Pro** comes with a state of the art web-based user interface to make managing pipelines easier. Here are some of the steps to get that started:
1. Clone this repository
2. Install dependencies
	- `./install.sh`
3. Start the API and its dependencies
	- `./run.sh`
	- `python api.py`
		- This will download the Docker images if they are not already downloaded
4. Build the React.js frontend in the `web/` directory
	- `cd web/`
	- `npm install`
	- `npm build`
5. Serve the front end from `web/public`, or run `npm start` from the web directory for hot-reload development
6. Create an account, then start building pipelines! You can manage pipeline runs from within the browser as well.

## :octocat:[Get started with command line](#octocatget-started-command-line)
1. Clone this repository
2. Install dependencies
    - Install Messaging Interface 
        - We use RabbitMQ
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
	- The directory `venv` resides in the `AIPro/` folder contains all the python dependency packages.
5. To run AI Pro 
    - Make sure you are in the same virtual environment.
    - `python main.py -c config-file`, where config-file is the location of the config file you created in step 3.
6. To stop
    - ctrl+c or SIGKILL
	- By default, each AI Pro instance will run indefinitely until stopped with a keyboard interrupt or SIGKILL.


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
Data Preprocessors are important for massaging the data when necessary. All of the massaging happens in memory too, so you don't need to worry about serialization when preprocessing your input data for the model.  For example, in the sentiment analysis example, tweets need to be translated into a sequence of integers to be run in the sentiment model.  If your data doesn't need preprocessing, don't worry - we have a default preprocessor that just passes data through.

It's important to remember that if you need to do any initialization for your preprocessors, you must do so within the constructor of your preprocessor class. In the tweet preprocessor example, the model reads in a dictionary file to convert words to integers.

Another really important use of data preprocessors is if you need to extract features from data points before feeding them to a model. You might not want to have bulky features sitting around in the data that gets written to output, so the data preprocessor discards them in the Python garbage collector when you're done using them for inference.
