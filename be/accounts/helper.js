/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/
require('dotenv').config();

/**
 * Format ddyymm
 * @param {*} d 
 * @returns 
 */
const ddMMYY = (d, charSpace = '-') => d.getDate() + charSpace + (d.getMonth() + 1) + charSpace + d.getFullYear;

const getRPC = (chainName = 'BNB') => {
    let rpc;
    switch (chainName) {
        case 'ETH':
            rpc = process.env.HTTP_RPC_ETH || 'https://eth.llamarpc.com';
            break;
        case 'ABR':
            rpc = process.env.HTTP_RPC_ABR || 'https://arbitrum.llamarpc.com';
            break;
        case 'MATIC':
            rpc = process.env.HTTP_RPC_MATIC || 'https://polygon.llamarpc.com';
            break;
        case 'BNB':
            rpc = process.env.HTTP_RPC_BNB || 'https://bsc-dataseed1.bnbchain.org';
            break;
        case 'OP':
            rpc = process.env.HTTP_RPC_OP || 'https://optimism.api.onfinality.io/public';
            break;
        default:
            break;
    }
    return rpc;
};

const getRouterByChain = (chainName = 'BNB') => {
    let routerAddress;
    switch (chainName) {
        case 'ETH':
            routerAddress = process.env.HTTP_RPC_ETH || 'https://eth.llamarpc.com';
            break;
        case 'BNB':
            routerAddress = process.env.HTTP_RPC_BNB || 'https://bsc-dataseed1.bnbchain.org';
            break;
        default:
            break;
    }
    return routerAddress;
};

const getTokenWrapByChain = (chainName = 'BNB') => {
    let tokenAddress;
    switch (chainName) {
        case 'ETH':
            tokenAddress = '0x2170ed0880ac9a755fd29b2688956bd959f933f8';
            break;
        case 'BNB':
            tokenAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
            break;
        default:
            break;
    }
    return tokenAddress;
};

module.exports = {
    ddMMYY,
    getRPC,
    getRouterByChain,
    getTokenWrapByChain,

}