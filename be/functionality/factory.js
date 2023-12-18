const ABI = require('../abis');
const PancakeFactoryV2 = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73';
const Helper = require('./helper');
const {     
    w_getWeb3InstanceWSS,
} = require('./web3');

// instance của web3
const web3_wss = w_getWeb3InstanceWSS();

const {
    r_setRedis,
    r_getRedis,
} = require('./redis');

// -----functions -----------
// PairCreated
// getPair

// cấu hình factory_v2
const factory_v2 = new web3_wss.eth.Contract(ABI.getPancakeFactory(), PancakeFactoryV2);

// ---- implement -----
// get pair by token address
async function f_getPairs(address) {
    try {
        // get info token'
        const { token0, token1 } = await Helper.h_getTokenByAddress(address);
        // find pair address
        let pairAddress = JSON.parse(await r_getRedis(token0.address + token1.address)) || '';
        if (!pairAddress) {
            pairAddress = await factory_v2.methods.getPair(token0.address, token1.address).call();
            h_isPairAddress
            if (!Helper.h_isPairAddress(pairAddress)) {
                console.error(`Invalid pair address for ${coinList[i]} & ${config.coin}`);
                return;
            }
            await r_setRedis(
                `${token0.address}-${token1.address}`,
                {
                    token0,
                    token1
                }
            );
        }
        console.log('[f_getPairs] : ', token0.name, '/' , token1.name, 'pair address: ', pairAddress);
        return {
            id: pairAddress,
            token0, 
            token1
        }
    } catch (error) {
        console.log('[f_getPairs] : ', error);
    }
}
async function f_checkPairCreated() {
    const fromBlockNumber = await pri_getLatestBlockNumber();
    console.log("--------------------------");
    console.log("Listening to PairCreated() with last block: " + fromBlockNumber);

    factory_v2.on('PairCreated', async (token0, token1, pairAddress) => {
        console.log(`
            =================
            token0: ${token0}
            token1: ${token1}
            pairAddress: ${pairAddress}
            =================
        `);
    });
}

async function pri_getLatestBlockNumber() {
    return web3_wss.eth.getBlockNumber();
}

module.exports = {
    f_getPairs,
    f_checkPairCreated
}