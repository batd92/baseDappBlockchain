/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const e = require('cors');
const { Web3 } = require('web3');
const Log = require('../functionality/log');
class Wallet {
    constructor() {
        if (!Wallet.instance) {
            this.web3 = null;
            this.account = null;
            this.nonceOffset = 0;
            this.network = null;
            this.bnbBalance = null;
            this.baseNonce = null;
            this.firstBlock = -1;
            this.privateKey = '';

            Wallet.instance = this
        }
        return Wallet.instance;
    }

    async wl_Load(privateKey, httpRpc, accountIndex = 0) {
        try {
            if (privateKey && httpRpc) {
                try {
                    const web3 = new Web3(httpRpc);
                    // convert to hexadecimal
                    const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
                    web3.eth.accounts.wallet.add(account);
                    this.web3 = web3;
                    this.account = account;
                    this.network = await web3.eth.net.getId();
                    this.bnbBalance = parseFloat(await web3.eth.getBalance(account.address));
                    this.baseNonce = parseInt(await web3.eth.getTransactionCount(account.address));
                    this.privateKey = privateKey;
                    return this;
                } catch (e) {
                    Log.error(`[Wallet::error] ${e}`);
                    return this;
                }
            }     
        } catch (error) {
            console.log('[wl_Load]', error);
        }
    }

    wl_Wallet() {
        return this;
    }
    async wl_getBalance() {
        return this.web3.utils.fromWei(await this.web3.eth.getBalance(this.account.address), 'ether');
    }

    async wl_getChainId() {
        return (await this.web3.eth.getChainId()).toString();
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

    async wl_calSwap() {
        return '0';
    }
}
module.exports = new Wallet();
