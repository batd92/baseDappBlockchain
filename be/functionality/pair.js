const ABI = require('../abis');
const {     
    w_getWeb3InstanceWSS,
    w_getWsProviderWSS
} = require('./web3');

// instance của web3
const web3_wss = w_getWeb3InstanceWSS();
const wsProvider = w_getWsProviderWSS();
 
// -----functions -----------
// - Mint
// - Burn
// - Swap
// - getReserves

// check mint pool on pair
async function p_checkMintEvent(pairAddress) {
    try {
        const liquidityPool = new web3_wss.eth.Contract(ABI.getPancakePair(), pairAddress);
        console.log("--------------------------");
        const currentBlockNumber = await web3_wss.eth.getBlockNumber();
        console.log("Listening to Mint() with last block: " + currentBlockNumber, ' with pair address: ', pairAddress);
        liquidityPool.on('Mint', async (data) => {
            console.log(`
                =================
                data: ${data}
                =================
            `);
        });
    } catch (error) {
        console.log('[p_checkMintEvent] ', error);
    }
}

// check swap pool on pair
async function p_checkSwap(pairAddress) {
    try {
        const liquidityPool = new web3_wss.eth.Contract(ABI.getPancakePair(), pairAddress);
        console.log("--------------------------");
        const currentBlockNumber = await web3_wss.eth.getBlockNumber();
        console.log("Listening to Swap() with last block: " + currentBlockNumber, ' with pair address: ', pairAddress);

        liquidityPool.on('swap', async (data) => {
            console.log(`
                =================
                data: ${data}
                =================
            `);
        });
    } catch (error) {
        
    }
}


// check burn pool on pair
async function p_checkBurn(pairAddress) {
    try {
        const liquidityPool = new web3_wss.eth.Contract(ABI.getPancakePair(), pairAddress);
        console.log("--------------------------");
        const currentBlockNumber = await web3_wss.eth.getBlockNumber();
        console.log("Listening to Burn() with last block: " + currentBlockNumber);
        liquidityPool.on('Burn', async (data) => {
            console.log(`
                =================
                data: ${data}
                =================
            `);
        });
    } catch (error) {
        
    }
}

// Event error on WebSocket
wsProvider.on('error', (data) => {
    console.log(`Error websocket !!!`, data);
});

// Lấy số lượng thanh khoản (getReserves)

async function p_getReserves(pairAddress) {
    try {
        if (pairAddress) {
            const liquidityPool = new web3_wss.eth.Contract(ABI.getPancakePair(), pairAddress);
            return await liquidityPool.methods.getReserves().call();
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông tin Reserves:', error);
        return null;
    }
}


module.exports = {
    p_getReserves,
    p_checkMintEvent,
    p_checkBurn,
    p_checkSwap
}