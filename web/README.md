# AI Pro Web

## :octocat:[Get started with the web UI](#octocatget-started-webui)
**AI Pro** comes with a state of the art web-based user interface to make managing pipelines easier. Here are some of the steps to get that started:
1. Start the API and its dependencies
	- `./run.sh`
	- `python api.py`
		- This will download the Docker images if they are not already downloaded
2. Build the React.js frontend in the `web/` directory
	- `cd web/`
	- `npm install`
	- `npm build`
3. Serve the front end from `web/public`, or run `npm start` from the web directory for hot-reload development
4. Create an account, then start building pipelines! You can manage pipeline runs from within the browser as well.


