class API {
    method = 'http';
    urlBase = 'server:5000';

    async postFile(resource, file) {
        const headers = new Headers({
            'Content-Type': 'multipart/form-data',
        });
        
        const options = {
            headers,
            //mode: 'cors',
            method: 'POST',
            body: file,
        };
        try{
            const url = `${this.method}://${this.urlBase}${resource}`;
            const response = await fetch(url, options);
            if (response.ok)
                return response.json();
            else {
                console.error(`POST request returned sad response: ${response.status}`);
                return false;
            }
                

        } catch(err) {
            console.error(`Problem with POST request to ${resource}`);
            console.error(err);
            return false;
        }
    }

    async post(resource, body, headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}) {
        const options = {
            body: JSON.stringify(body),
            method: 'POST',
            mode: 'cors',
            headers
        };
        try{
            const url = `${this.method}://${this.urlBase}${resource}`;
            const response = await fetch(url, options);
            if (response.ok)
                return response.json();
            else {
                console.error(`POST request returned sad response: ${response.status}`);
                return false;
            }
                

        } catch(err) {
            console.error(`Problem with POST request to ${resource}`);
            console.error(err);
            return false;
        }
        
    }

    async delete(resource, body) {
        const options = {
            body: JSON.stringify(body),
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        try{
            const url = `${this.method}://${this.urlBase}${resource}`;
            const response = await fetch(url, options);
            if (response.ok)
                return response.json();
            else {
                console.error(`POST request returned sad response: ${response.status}`);
                return false;
            }
                

        } catch(err) {
            console.error(`Problem with POST request to ${resource}`);
            console.error(err);
            return false;
        }
        
    }

    async get(resource) {
        const options = {
            method: 'GET'
        };
        
        try{
            const url = `${this.method}://${this.urlBase}${resource}`;
            const response = await fetch(url, options);
            if (response.ok)
            return response.json();
            else {
                console.error(`GET request returned sad response: ${response.status}`);
                return false;
            }
        } catch(err) {
            console.error(`Problem with GET request to ${resource}`);
            console.error(err);
            return false;
        }
    }
}

export default API