/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const { Network } = require('./src/swapper/network');
const EventEmitter = require('events').EventEmitter;
const Log = require('./functionality/log');
// Main
class Monitor extends EventEmitter {
    constructor(account, factory, contract_in, contract_out, router) {
        super();
        this.account = account;
        this.factory = factory;
        this.contract_in = contract_in;
        this.contract_out = contract_out;
        this.router = router;
        this.network = {};
        this.outputAmount = CFG.Environment.MinimumQuantityForSell;
    }

    async load() {
        await this.account.load();
        const _account = await this.account._getAccount();
        await this.factory.init(_account);
        await this.contract_in.init(_account);
        await this.contract_out.init(_account);
        await this.router.init(_account);
        this.network = new Network(this);
        await Cache.load(CFG.Environment.MY_ADDRESS);
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
                await Until.sleep(500);
                // Get token 
                let { outputAmount, raw } = await this.contract_out._getBalance(await this.account._getAccount());
                let bnb = await this.account._getBalance();
                console.clear();
                Log.primary('Đang quét ví .... ');
                Log.warning(`Số lượng (BNB) trong ví:  ${bnb}`);
                Log.warning(`Số lượng token (${CFG.Tokens.TokenSwap}) trong ví: ${outputAmount}`);
                Log.warning(`Số lượng token (${CFG.Tokens.TokenSwap}) trong ví trước đó: ${this.outputAmount}`);
                // Truy vấn số token trong ví
                if (outputAmount !== this.outputAmount && outputAmount > CFG.Environment.MinimumQuantityForSell) {
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

    /**
     * Burn token
     */
    async monitBurnUnicrypt() {
        while (this.isBurnUnicrypt) {
            const bnb = await this.network.getLiquidity(BNB);
            const priceBusd = await this.network.getPriceTokenOutput(BUSD);
            console.log('bnb monit liquidity (monitBurnUnicrypt): ', bnb, priceBusd);
            // Check nếu có sự thay đổi về liquidity thì bán token
        }
    }

    /**
     * Get Profit
     * @param {*} currentPrice 
     * @param {*} oldPrice 
     * @returns 
     */
    async getProfit(currentPrice, oldPrice) {
        return currentPrice / oldPrice;
    }
}

/**
 * Schedule Main
 * @param {*} param0 
 * @returns 
 */
const scheduleMonitor = async ({ 
        canBuy = undefined, 
        canSell = undefined, 
        canLiquidity = undefined
    }) => {
    const monitor = new Monitor(Wallet, Factory, ContractIn, ContractOut, Router);
    await monitor.load();

    // Nếu chỉ có bán
    if (canSell) {
        await monitor.startCheckWallet();

        // Tự động bán khi đạt đến bội số nhất định
        monitor.on('wallet.update.output_token', async (payload) => {
            if (this.prepare) {
                this.prepare = await payload.network.prepare();
            }
            console.time('time-sell');
            await payload.network.sellTokens(CFG.Tokens.TokenSwap, CFG.Tokens.BNB, payload.raw);
            console.timeEnd('time-sell');
        });
        return;
    }

    // Auto bán theo liquidity change
    if (canLiquidity) {
        console.log('Đang check liquidity và bán khi có lời !!!');
        monitor.startLiquidity();
        return;
    }
    // Load ví metamask
    monitor.on('wallet.loaded', (wallet) => {
        console.log("wallet loaded:", wallet)
    })

    // Liquidity
    monitor.on('liquidity.on', (trade) => {
        console.log("liquidity changed")
    })

    // Liquidity change
    monitor.on('liquidity.timer', async (amount, trade) => {
        const info = swapper.printTrade("liquidity.timer", amount, trade)
        // set current price
        task.swap.currentPrice = info.executionPrice;
        console.log(`swap.price.update: ${task.wallet.outputAmount} / percent:${swapper.getPrc(task.swap.currentPrice).toFixed(5)} / [C=${task.swap.currentPrice},B=${task._buyedPrice}]`) //当前价格
        if (task._buyedPrice <= 0) return;
        await swapper.autoSell(task.wallet.outputAmount, info) //auto sell
    })
}

module.exports = { scheduleMonitor };
