class API {
    method = 'http'
    urlBase = 'localhost:5000'
    async post(resource, body) {
        const options = {
            body: JSON.stringify(body),
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        try{
            const url = `${this.method}://${this.urlBase}${resource}`;
            const response = await fetch(url, options);
            if (response.ok)
                return true;
            else
                return false;

        } catch(err) {
            console.error(`Problem with POST request to ${resource}`);
            console.error(err);
        }
        
    }

    async get(resource) {
        const options = {
            method: 'GET'
        };
        
        const url = `${this.method}://${this.urlBase}${resource}`;
        const response = await fetch(url, options);
        return response.json();
    }
}

export default API