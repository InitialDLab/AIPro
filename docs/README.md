# How to use Compass
## Steps to get started:
1.	Clone the repository
2.	Install dependencies by running install.sh
  *	This will create a python virtual environment with all of the required Python modules installed
3.	Copy the sample configuration file provided, config-template.yml, and save it as config.yml. For security purposes, we recommend not including config.yml in your git repository.
  * Change the settings for data sources, models, and storage methods in config.yml to fit your own needs.
4.	Create a plan file by copying the plan-sample.yml file and modifying it for your own project (see the section on Plan Files for more details).  Make sure your new plan file is named plan.yml.
5.	Initialize the Python virtual environment by running source venv/bin/activate
6.	Run the pipeline program by running python main.py


## Configuration Files:
The configuration file is how Compass knows to initialize data sources, models, and storage methods correctly.  The template provided, config-template.yml, includes comments about which fields are required with each different type of data source, model, or storage method.  Make sure that there is an entry for each data source/model/storage method to be used in your plan, otherwise Compass won’t be able to run your plan (more on plans to follow).  Regardless of the settings required for each module to be run, each entry in the configuration file contains an alias, which is used to identify which components to use in the plan.

## How to make a plan file:
1.	Copy the plan-sample.yml file and name it plan.yml
2.	Change your new plan.yml to your specifications.  Each entry in the YAML array corresponds to a component in the plan (data source, model, or storage method)
  * Required fields:
    * “type” (Can be “Data Source”, “Model”, or “Storage”)
    * “alias” (Must match an entry in the config file)
    * “attribute” (Since all input data must be in JSON format, you must specify an attribute in your JSON object to use)

## How do plan files work?
Plan files tell Compass the order of execution for the data pipeline.  For best results, start with a data source, then a series of one or more models, then a storage method.  Each component in a plan executes with input based on the previous component’s output, with the exception of data sources.  With the storage method as the last entry, it saves the output from the last model in the sequence.
Data sources aggregate the data to be input for models, and provide a starting point for the data pipeline.  Storage methods provide an outlet for the learned models to save their output.
