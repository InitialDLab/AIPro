import requests

# Returns an object with {county: {name: '', FIPS: 99999}, state: {name: '', code: '', FIPS: 12}}
# If the location isn't in the US, the result returned is None for each of the attributes
def get_state_and_county(latitude, longitude):
	url = 'http://data.fcc.gov/api/block/find?format=json&latitude=%s&longitude=%s&showall=false' % (latitude, longitude)
	response = requests.get(url)
	if response.status_code != 200:
		print "Error getting response, response code %d" % response.status_code
		print response.text

	data = response.json()
	result = data
	if 'messages' in result:
		del result['messages']
	if 'Block' in result:
		del result['Block']
	if 'status' in result:
		del result['status']
	if 'executionTime' in result:
		del result['executionTime']
	return result
