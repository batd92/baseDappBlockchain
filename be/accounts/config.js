/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const {
    r_setRedis,
    r_getRedis,
    r_delRedis
} = require('../functionality/redis');
require('dotenv').config();
const Help = require('./helper');

// -----functions -----------
// - save config
// - get

async function c_setParams(key, params) {
    let config = await r_getRedis(key) || {};
    return r_setRedis(key, Object.assign(config, params));
}

async function c_getParams(key, is_all_config = false) {
    if (is_all_config) {
        const keys = ['_mint', '_swap', '_private_key', '_options, _token'];
        const result = {};
        for (const key of keys) {
            const data = await r_getRedis(key);
            Object.assign(result, data);
        }
        return result;
    }
    let data = await r_getRedis(key);
    if (!data) {
        let params;
        switch (key) {
            case '_options':
                params = {
                    isAutoGasFee: process.env.AUTO_GAS_FEE || true,
                    isMainnet: process.env.AUTO_GAS_FEE || true,
                    numberTryMint: process.env.NUMBER_TRY_MINT || 1,
                    numberTrySwap: process.env.NUMBER_TRY_SWAP || 1,
                }
                break;
            case '_mint':
                params = {
                    gasLimitMint: process.env.GAS_LIMIT_MINT || 500000,
                    gasPriceMint: process.env.GAS_PRICE_MINT || await web3.eth.getGasPrice(),
                    numberMint: process.env.NUMBER_TRY_MINT || 1,
                }
                break;
            case '_swap':
                params = {
                    gasLimitSwap: process.env.GAS_LIMIT_SWAP || 500000,
                    gasPriceMint: process.env.GAS_PRICE_SWAP || await web3.eth.getGasPrice(),
                    amountSell: process.env.AMOUNT_SWAP || 50,
                    slippageTolerance: process.env.SLIPPAGE_TOLERANCE || 5,
                    routerAddress: Help.getRouterByChain('BNB'),
                    amountBuy: process.env.AMOUNT_BUY || 1,
                }
                break;
            case '_private_key':
                const id = Math.floor(Math.random() * 1000);
                params = {
                    id: id,
                    private_key: process.env.PRIVATE_KEY || '',
                    my_address: process.env.MY_ADDRESS || '',
                    name: `private_key-${id}`,
                    httpRpc: Help.getRPC('BNB'),
                }
                break;
            default:
                break;
        }
        await r_setRedis(key, params);
        return params;
    }
    return data;
}

async function c_setReset() {
    const keys = ['_mint', '_swap', '_private_key', '_options', '_token'];
    for (const key of keys) {
        await r_delRedis(key);
    }
}

module.exports = {
    c_setParams,
    c_getParams,
    c_setReset
}