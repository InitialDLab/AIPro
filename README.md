# AI Pro 
**AIPro**'s goal is to help you make your own **Data Science as a Service (DSaaS)** platform. Rather than munging through data endlessly and forever tweaking lines of code to get your inference pipelines just right, AI Pro does this all seamlessly for you. 

You can either use the browser-based UI, or write config files yourself.

###### Check our demo [video](https://www.youtube.com/watch?v=e6imr87kdB4).


At its core, AI Pro acts as a framework to unite `data sources`, `preprocessors`, `filters`, `models`, and `storage` components. 

A pipeline with any combination of components can be created with just a configuration file. 

## :rocket:[Super Quick Start](#rocketsuper-quick-start)
1. Clone this repository
```
git clone https://github.com/InitialDLab/AIPro.git
```
2. Run Docker compose
```
$ docker-compose up
```


## :rocket:[Quick Start](#quickstart)
1. Clone this repository
``
git clone https://github.com/InitialDLab/AIPro.git
``

2. Install dependencies
	- Use Docker and Rabbit MQ for the message processing
		- `./docker-ubuntu.sh`
		- `./run.sh`	
	- Installing Python dependencies
	 	- `pip install --upgrade pip` 
		- `pip install -r requirements.txt`
3. Run Sentiment Analysis pipeline from `examples`
 	- Get model from github
 		-  `git clone https://github.com/debjyoti385/aipro_sentiment_analysis`
	- Install model dependencies
		- `pip install -r aipro_sentiment-analysis/requirements.txt`
	- Run AI Pro
		- `python main.py -c aipro_sentiment-analysis/config-rawfile.yml`
	- Output
		- JSON file contaiining tweets with sentiment scores 
		- `aipro_sentiment-analysis/tweets-with-sentiment.json`
4. To stop
	- `ctrl+c` or `SIGKILL`
