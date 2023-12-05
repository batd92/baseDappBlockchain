
// const API_KEY_NODEREAL = env.API_KEY_NODEREAL || '83c2840fc57540b1a666b72f27271829';
const API_KEY_NODEREAL = '83c2840fc57540b1a666b72f27271829';

const axios = require('axios');
const URL_NODEREAL = (api_key) => `https://data-platform.nodereal.io/graph/v1/${api_key}/projects/pancakeswap`;

async function g_queryNodereal(query, url = URL_NODEREAL(API_KEY_NODEREAL)) {
    try {
        const response = await axios.post(url, { 'query': query });
        if (response.data && response.data.data && response.data.data) {
            return response.data.data;
        } else {
            console.log('g_queryNodereal (GraphQL) 200: ', response.data.errors);
            return null;
        }
    } catch (error) {
        console.log('g_queryNodereal (GraphQL): ', error.data.errors);
        return null;
    }
}

module.exports = {
    g_queryNodereal
}