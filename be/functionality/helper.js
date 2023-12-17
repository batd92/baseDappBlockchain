/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/


const ABI = require('../abis');
const { coinList } = require('../functionality/constants');
const graphql = require('../graphql/index');

const {
    w_getWeb3InstanceHTTP,
    w_getWeb3InstanceWSS
} = require('./web3');

const {
    r_setRedis,
    r_getRedis,
} = require('./redis');

// instance của web3
const web3_http = w_getWeb3InstanceHTTP();
const web3_wss = w_getWeb3InstanceWSS();

async function h_getTokenByAddress(address) {
    try {
        let result = {};
        // check validate -> get token -> save Redis
        for (let index = 0; index < address.length; index++) {
            const add = address[index];
            if (!web3_http.utils.isAddress(add)) return null;
            let token = await r_getRedis(add);
            if (!token) {
                const methods = (new web3_http.eth.Contract(ABI.getABITokenERC20(), add)).methods;
                const name = await methods.name().call();
                const symbol = await methods.symbol().call();
                const decimals = (await methods.decimals().call()).toString();
                if (name && symbol && decimals) {
                    token = {
                        address: add,
                        name,
                        symbol,
                        decimals,
                    }
                    await (r_setRedis(add, token));
                }
            }
            result[`token${index}`] = token;
        }
        return result;
    } catch (error) {
        console.log('h_getTokenByAddress :' + error);
        return null;
    }
}

async function h_getTokensPair(select = ['BNB']) {
    return (select.map(x => {
        if (coinList[x]) return coinList[x]
    })).filter(Boolean);
}

async function h_setContract(token_address) {
    return {
        coin: token,
        symbol: '18',
        contract: new web3_http.eth.Contract(ABI.getABITokenERC20(), token_address),
    };
}

async function h_getPrice(reserves, token0, token1, slippageTolerance = 0.5) {
    try {
        if (reserves) {
            const _reserve0 = Number(reserves[0] / BigInt(10n ** BigInt(token0.decimals)));
            const _reserve1 = Number(reserves[1] / BigInt(10n ** BigInt(token1.decimals)));
            const dateTime = new Date(reserves[2].toString() * 1000).toLocaleString();
            const toRatio = (Number(_reserve1) / Number(_reserve0) * (1 + slippageTolerance / 100)).toFixed(18);
            const fromRatio = (Number(_reserve0) / Number(_reserve1) * (1 + slippageTolerance / 100)).toFixed(18);

            console.log(`DateTime: ${dateTime}: ${token0.name} to ${token1.name} Ratio: ${toRatio}`);
            console.log(`DateTime: ${dateTime}: ${token1.name} to ${token0.name} Ratio: ${fromRatio}`);

            return {
                _reserve0: _reserve0,
                _reserve1: _reserve1,
                toRatio,
                fromRatio,
                dateTime
            }
        }
    } catch (error) {
        console.error("h_getPrice:", error);
    }
}

// using get and push data when init system
async function h_loadTopPairsByGraphql() {
    const response = await graphql.h_getLimitedPairsGraphql(100);
    if (response && response.pairs) {
        const pairs = response.pairs;
        for (let index = 0; index < pairs.length; index++) {
            const pair = pairs[index];
            const key = `${pair.token0.id}-${pair.token1.id}`
            await (r_getRedis().set(key, JSON.stringify(pair)));
        }
    }
    return;
}

// using get and push data when init system
async function h_loadTokenByGraphql() {
    const keys = Object.keys(coinList);
    for (let index = 0; index < keys.length; index++) {
        const response = await graphql.h_getTokenGraphql(coinList[keys[index]]);
        if (response.token) {
            const key = `${response.token.id}`
            await (r_getRedis().set(key, JSON.stringify(response.token)));
        }
    }
    return;
}
async function h_checkAddress(address) {
    await web3_http.utils.isAddress(address);
}

/**
 * Check Pair
 * @param {*} pair 
 * @returns 
 */
async function h_isPairAddress(pair) {
    // No pair found, re-launch
    if (!pair || (pair.toString().indexOf('0x0000000000000') > -1)) {
        msg.warning("[debug::pair] Could not find pair for specified contracts.");
        process.exit();
    }
    return true;
}
module.exports = {
    h_getTokenByAddress,
    h_getTokensPair,
    h_setContract,
    h_getPrice,
    h_loadTopPairsByGraphql,
    h_loadTokenByGraphql,
    h_checkAddress,
    h_isPairAddress
}