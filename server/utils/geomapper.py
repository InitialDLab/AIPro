import requests

class GeoMapper:
	# Returns an object with {county: {name: '', FIPS: 99999}, state: {name: '', code: '', FIPS: 12}}
	# If the location isn't in the US, the result returned is None for each of the attributes
	def get_state_and_county(self, geolocation):
		if geolocation is None or 'coordinates' not in geolocation:
			return None
		
		longitude, latitude = geolocation['coordinates']
		url = 'https://geo.fcc.gov/api/census/block/find?latitude=%s&longitude=%s&showall=false&format=json' % (latitude, longitude)
		#url = 'http://data.fcc.gov/api/block/find?format=json&latitude=%s&longitude=%s&showall=false' % (latitude, longitude)
		print('\n\n\n')
		print(url)
		print('\n\n\n')
		response = requests.get(url)
		if response.status_code != 200:
			print("Error getting response, response code %d" % response.status_code)
			print(response.text)

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
