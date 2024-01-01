/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const {
    r_setRedis,
    r_getRedis,
} = require('../functionality/redis');
require('dotenv').config();

// -----functions -----------
// - save config
// - get

async function c_setParams(key, params) {
    let config = await r_getRedis(key) || {};
    return r_setRedis(key, Object.assign(config, params));
}

async function c_getParams(key) {
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
                    gasLimit: process.env.GAS_LIMIT_MINT || 500000,
                    gasWei: process.env.GAS_PRICE_MINT || 1000000,
                    numberMint: process.env.NUMBER_TRY_MINT || 1,
                }
                break;
            case '_swap':
                params = {
                    gasLimit: process.env.GAS_LIMIT_SWAP || 500000,
                    gasWei: process.env.GAS_PRICE_SWAP || 1000000,
                    amountSell: process.env.AMOUNT_SWAP || 50,
                }
                break;
            case '_private_key':
                const id = Math.floor(Math.random() * 1000);
                params = {
                    id: id,
                    private_key: process.env.PRIVATE_KEY || '',
                    my_address: process.env.MY_ADDRESS || '',
                    name: `private_key-${id}`
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

module.exports = {
    c_setParams,
    c_getParams,

}