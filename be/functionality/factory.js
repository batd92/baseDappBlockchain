const ABI = require('../abis');
const PancakeFactoryV2 = '0xca143ce32fe78f1f7019d7d551a6402fc5350c73';

const {     
    w_getWeb3InstanceWSS,
} = require('./web3');

// instance của web3
const web3_wss = w_getWeb3InstanceWSS();

const {
    r_getRedis
} = require('./redis');

// -----functions -----------
// PairCreated
// getPair

// cấu hình factory_v2
const factory_v2 = new web3_wss.eth.Contract(ABI.getABIFactory(), PancakeFactoryV2);

// ---- implement -----
// get pair by token address
async function f_getPairs(token0, token1) {
    console.log('f_getPairs: ', token0.name, '/' , token1.name);
    try {
        let pairAddress = JSON.parse(await r_getRedis().get(token0.address.toString() + token1.address.toString())) || '';
        if (!pairAddress) {
            pairAddress = await factory_v2.methods.getPair(token0.address, token1.address).call();
            if (!pairAddress || pairAddress === '0x0000000000000000000000000000000000000000') {
                console.error(`Invalid pair address for ${coinList[i]} & ${config.coin}`);
            }
            await (r_getRedis().set(token0.address.toString() + token1.address.toString(), JSON.stringify(pairAddress)));
        }
        return pairAddress;
    } catch (error) {

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