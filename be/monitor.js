/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const Token = require('./functionality/token');
const EventEmitter = require('events').EventEmitter;
const Log = require('./functionality/log');
const Trade = require('./accounts/trade');

const { promisify } = require('util');
const sleep = promisify(setTimeout);
// Main
class Monitor extends EventEmitter {
    constructor(wallet) {
        super();
        this.wallet = wallet;
        // save sell setting
        this.config = {};
    }

    /**
     * Start wallet
     */
    async startCheckWallet() {
        this.running = true;
        this.prepare = false;
        this.monitWallet().then();
    }


    /**
     * Run
     */
    async run() {
        while (this.running) {
            await sleep(500)
            // await this.fetchTrade()
        }
    }

    /**
     * Monit Wallet
     */
    async monitWallet() {
        try {
            while (this.running) {
                await sleep(500);
                // Get token in wallet
                let outputAmount = await Token.t_getBalance('0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867', this.wallet.account);
                let bnb = await this.wallet.wl_getBalance();
                console.clear();
                Log.primary('Đang quét ví .... ');
                Log.warning(`Số lượng (BNB) trong ví:  ${bnb}`);
                // Truy vấn số token trong ví
                if (outputAmount !== this.outputAmount && outputAmount > 100) {
                    Log.warning('Đang bán token .... ');
                    this.emit('wallet.update.output_token', { raw, network: this.network });
                    this.outputAmount = outputAmount;
                    this.emit('wallet.loaded');
                    this.running = false;
                }
            }
        } catch (error) {
            console.log('monitWallet : ' + error);
        }
    }

    /**
     * monit Liquidity
     */
    async monitLiquidity() {
        while (this.runCheckLiquidity) {
            const bnb = await this.network.getLiquidity(BNB);
            const priceBusd = await this.network.getPriceTokenOutput(BUSD);
            console.log('bnb monit liquidity (monitLiquidity): ', bnb, priceBusd);
            // Check nếu có sự thay đổi về liquidity thì bán token
        }
    }
}

/**
 * Schedule Main
 * @param {*} param0 
 * @returns 
 */
const scheduleMonitor = async ({
        wallet,
        canBuy = undefined, 
        canSell = undefined, 
        canLiquidity = undefined
    }) => {
    const monitor = new Monitor(wallet);
    // Nếu chỉ có bán
    if (canSell) {
        await monitor.startCheckWallet();
        // Tự động bán khi đạt đến bội số nhất định
        monitor.on('wallet.update.output_token', async (payload) => {
            console.log('payload', payload);
            await Trade.t_sellPercentageOfTokens();
        });
        return;
    }
}

module.exports = { scheduleMonitor };
