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

    async load(privateKey, httpRpc, accountIndex = 0) {
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
    

    async _getBalance() {
        return this.web3.utils.fromWei(await this.web3.eth.getBalance(this.account.address), 'ether');
    }

    async _getNetwork() {
        return this.network;
    }

    async _getPrivateKey() {
        return this.privateKey;
    }

    async _getAccount() {
        return this.account;
    }

    getNonce() {
        return this.baseNonce + this.nonceOffset++;
    }

    async tryNonce() {
        this.baseNonce = parseInt(await this.web3.eth.getTransactionCount(this.account.address));
        this.nonceOffset = 0;
        this.firstBlock = -1;
    }
}
module.exports = new Wallet();
