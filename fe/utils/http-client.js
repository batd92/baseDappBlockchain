import fetch from "node-fetch";

class HttpClient {
    constructor(baseURL = 'http://localhost:2705') {
        this.baseURL = baseURL;
    }

    async request(url, method = "GET", params = {}) {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (method === "GET") {
            const queryParams = new URLSearchParams(params);
            url = `${url}?${queryParams}`;
        } else {
            options.body = JSON.stringify(params);
        }

        try {
            const response = await fetch(`${this.baseURL}${url}`, options);
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Error during fetch: ${error.message}`);
        }
    }
}

export default HttpClient;