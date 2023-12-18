/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const ABI = require('../abis');
const {     
    w_getWeb3InstanceWSS,
} = require('./web3');

// instance của web3
const web3_wss = w_getWeb3InstanceWSS();
 
// -----functions -----------
// - t_getTokenSmartContract

async function t_getTokenSmartContract(token_address) {
    return new web3_wss.eth.Contract(ABI.getABITokenERC20(), token_address)
}


module.exports = {
    t_getTokenSmartContract
}