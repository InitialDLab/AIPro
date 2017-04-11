## Compass
### Comprehensive Analytics on Sentiment for Spatiotemporal Data
------------

#### Structure 
* install.py - `Configures and Installs SONAR analytic engine, downloads models `
* config.yml - ` YAML file for configuration of the system, Data Source, Plugin Models, Databases etc. `
* main.py   - ` Driver code `
* data/   
    * twitterStream.py - ` Twitter Stream as data source directly from API `
    * socketStream.py - ` Stream from UDP/TCP socket; incoming data as JSON `
* models/
    * initializeModels.py - ` Based on configuration initializae models, two types of model service is available: Socket/API, Download Model ` 
        * SERVICE - ` Service Oriented (Socket/API based) Model - host, port, api `
        * DOWNLOAD - ` Downloaded Model - model, code, function `
    * classificationModel - ` Example classification model `
    * sentimentModel - ` Example sentiment model `
* utils/
    * geomapper.py - ` geomapping module lat-long to State and County `
    * databases.py - ` Drivers for some databases `
* analytics/
    * api.py   - ` API to interact with analytics engine`
    * server.py - ` Expose a server to interact with Web UI`
* docs/ - Web UI 
    * index.html
    * assets/
        * js
        * css
