/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const Web3 = require('web3');
const Msg = require('../classes/msg');

class Wallet {
    constructor() {
        this.web3 = null;
        this.account = null;
        this.nonceOffset = 0;
        this.network = null;
        this.bnbBalance = null;
        this.baseNonce = null;
        this.firstBlock = -1;
        this.privateKey = '';
    }

    async wl_Load(privateKey, httpRpc, accountIndex = 0) {
        if (privateKey && httpRpc) {
            try {
                const web3 = new Web3(httpRpc);
                const account = web3.eth.accounts.privateKeyToAccount(privateKey);
                web3.eth.accounts.wallet.add(account);
                
                this.account = account;
                this.network = await web3.eth.net.getId();
                this.bnbBalance = parseFloat(await web3.eth.getBalance(account.address));
                this.baseNonce = parseInt(await web3.eth.getTransactionCount(account.address));
                this.privateKey = privateKey;
            } catch (e) {
                Msg.error(`[Wallet::error] ${e}`);
                process.exit();
            }
        }
    }
    

    wl_getBalance() {
        return this.web3.utils.fromWei(await this.web3.eth.getBalance(this.account.address), 'ether');
    }

    wl_getChainId() {
        return this.network;
    }

    wl_getPrivateKey() {
        return this.privateKey;
    }

    wl_getAccount() {
        return this.account;
    }

    wl_getNonce() {
        return this.baseNonce + this.nonceOffset++;
    }

    // The number of transactions sent from the given address.
    async wl_tryNonce() {
        this.baseNonce = parseInt(await this.web3.eth.getTransactionCount(this.account.address));
        this.nonceOffset = 0;
        this.firstBlock = -1;
    }

    // Sign the transaction
    async wl_signTransaction(rawTransaction) {
        return await this.web3.eth.accounts.signTransaction(rawTransaction, this.privateKey);
    }

    // Send the signed transaction
    async wl_sendSignedTransaction(signedTransaction) {
        await await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
    }

    // Returns the current gas price oracle. The gas price is determined by the last few blocks median gas price.
    async wl_getGasPrice() {
        return await this.web3.eth.getGasPrice();
    }

}
module.exports = new Wallet();
