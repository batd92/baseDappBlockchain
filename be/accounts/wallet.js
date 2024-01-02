/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const { Web3 } = require('web3');
const Log = require('../functionality/log');
const Config = require('./config');
class Wallet {
    constructor() {
        if (!Wallet.instance) {
            this.Load('ef1f3e5df1dd5e3457596505cd44e203a3a43379e1f14b654b97a7333b889570', 'https://bsc-dataseed1.bnbchain.org').then();
            Wallet.instance = this
        }
        return Wallet.instance;
    }

    async Load(privateKey, httpRpc, accountIndex = 0) {
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

    async getBalance() {
        return this.web3.utils.fromWei(await this.web3.eth.getBalance(this.account.address), 'ether');
    }

    async getChainId() {
        return (await this.web3.eth.getChainId()).toString();
    }

    getPrivateKey() {
        return this.privateKey;
    }

    getAccount() {
        return this.account;
    }

    getNonce() {
        return this.baseNonce + this.nonceOffset++;
    }

    // The number of transactions sent from the given address.
    async tryNonce() {
        this.baseNonce = parseInt(await this.web3.eth.getTransactionCount(this.account.address));
        this.nonceOffset = 0;
        this.firstBlock = -1;
    }

    // Sign the transaction
    async signTransaction(rawTransaction) {
        return await this.web3.eth.accounts.signTransaction(rawTransaction, this.privateKey);
    }

    // Send the signed transaction
    async sendSignedTransaction(signedTransaction) {
        await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
    }

    // Returns the current gas price oracle. The gas price is determined by the last few blocks median gas price.
    async getGasPrice() {
        return await this.web3.eth.getGasPrice();
    }
}
module.exports = new Wallet();
