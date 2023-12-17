/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

// const API_KEY_NODEREAL = env.API_KEY_NODEREAL || '83c2840fc57540b1a666b72f27271829';
const API_KEY_NODEREAL = '83c2840fc57540b1a666b72f27271829';
const schema = require('../graphql/schema');

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
        console.log('g_queryNodereal (GraphQL): ', error);
        return null;
    }
}

async function h_getLimitedPairsGraphql(limit = 100) {
    try {
        return await g_queryNodereal(await schema.s_getPairs(limit));        
    } catch (error) {
        console.error('h_getLimitedPairsGraphql:', error.message);
        return null;
    }
}

async function h_getPairGraphql(token0, token1) {
    try {
        return await g_queryNodereal(await schema.s_getPair(token0, token1));        
    } catch (error) {
        console.error('h_getPairGraphql:', error.message);
        return null;
    }
}

async function h_getTokenDayDataGraphql(address) {
    try {
        return await g_queryNodereal(await schema.s_getTokenDayData(address));        
    } catch (error) {
        console.error('h_getPairGraphql:', error.message);
        return null;s_
    }
}

async function h_getPairHourDatasGraphql(pair_address) {
    try {
        return await g_queryNodereal(await schema.s_getPairHourDatas(pair_address));        
    } catch (error) {
        console.error('h_getPairGraphql:', error.message);
        return null;s_
    }
}

async function h_getTokenGraphql(address) {
    try {
        return await g_queryNodereal(await schema.s_getToken(address));        
    } catch (error) {
        console.error('h_getPairGraphql:', error.message);
        return null;
    }
}


module.exports = {
    h_getLimitedPairsGraphql,
    h_getPairGraphql,
    h_getTokenDayDataGraphql,
    h_getPairHourDatasGraphql,
    h_getTokenGraphql
}