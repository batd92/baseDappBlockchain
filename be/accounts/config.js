/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const {     
    r_setRedis,
    r_getRedis,
} = require('../functionality/redis');

 
// -----functions -----------
// - save config
// - get

async function c_setTrade(params, key = '', value = '') {
    let config = await r_getRedis('_config') || {};
    if (key === 'privateKey') {
        config.privateKey = value;
    }
    return r_setRedis('_config', Object.assign(config, params));
}

async function c_getTrade() {
    try {
        const config = await r_getRedis('_config') || {};

        if (config) {
            // load JSON

        }
        return config;
    } catch (error) {
        
    }
}

module.exports = {
    c_setTrade,
    c_getTrade,
}