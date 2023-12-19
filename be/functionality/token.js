/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const ABI = require('../abis');
const { w_getWeb3InstanceWSS } = require('./web3');

// instance của web3
const web3_wss = w_getWeb3InstanceWSS();

// Cache để lưu trữ các instances đã tạo
const tokenContractCache = new Map();

// -----functions -----------
// - t_getTokenSmartContract

async function t_getTokenSmartContract(token_address) {
    // Kiểm tra xem instance đã được lưu trữ trong cache hay chưa
    if (tokenContractCache.has(token_address)) {
        return tokenContractCache.get(token_address);
    }

    // Nếu chưa có, tạo mới và lưu vào cache
    const tokenContract = new web3_wss.eth.Contract(ABI.getABITokenERC20(), token_address);
    tokenContractCache.set(token_address, tokenContract);

    return tokenContract;
}

// - t_getBalance
async function t_getBalance(token_address, account) {
    try {
        const tokenContract = await t_getTokenSmartContract(token_address);
        const balance = await tokenContract.methods.balanceOf(account.address).call();
        return balance;
    } catch (error) {
        console.error(`Error getting balance: ${error}`);
        throw error;
    }
}

module.exports = {
    t_getTokenSmartContract,
    t_getBalance
};
