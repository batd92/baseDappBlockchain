/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const { Web3 } = require('web3');
const { WebSocketProvider } = require('web3-providers-ws');
const ABI = require('../be_bot/abis');
const PancakeRouterV2 = '0x10ED43C718714eb63d5aA57B78B54704E256024E';

// -----functions -----------
// - factory
// - WETH
// - quote
// - getAmountOut
// - getAmountIn
// - getAmountsOut
// - getAmountsIn
// - addLiquidity
// - swapExactTokensForTokens
// - swapExactTokensForTokensSupportingFeeOnTransferTokens
// - swapExactETHForTokensSupportingFeeOnTransferTokens
// - swapExactTokensForETHSupportingFeeOnTransferTokens
// - swapETHForExactTokens

// -------------------------
// cấu hình wss
const options = {
    timeout: 30000, // ms

    // Useful for credentialed urls, e.g: ws://username:password@localhost:8546
    headers: {
        authorization: 'Basic username:password'
    },

    clientConfig: {
        // Useful if requests are large
        maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
        maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

        // Useful to keep a connection alive
        keepalive: true,
        keepaliveInterval: 60000 // ms
    },

    // Enable auto reconnection
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    }
};

const wsProvider = new WebSocketProvider('wss://bsc.publicnode.com', options);
const web3 = new Web3(wsProvider);

// cấu hình router
const router = new web3.eth.Contract(ABI.getPancakeFactory(), PancakeRouterV2);

/**
 * Get AmountsOut
 * @param {*} inputTokenAmount 
 * @param {*} param
 * @returns 
 */
async function r_getAmountsOut(inputTokenAmount, [from, to]) {
    return await router.getAmountsOut(inputTokenAmount, [from, to]);
}

/**
 * Buy token
 * @param {*} amountIn 
 * @param {*} amountOutMin 
 * @param {*} contracts 
 * @param {*} nonce 
 * @returns 
 */
async function r_swapExactETHForTokensSupportingFeeOnTransferTokens(
    amountIn,
    amountOutMin,
    contracts,
    nonce,
    account_address
    ) {
    try {
        return router.swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            contracts,
            account_address,
            (Date.now() + 1000 * 60 * 10),
            {
                'value': amountIn,
                'gasLimit': CFG.CustomStrategyBuy.GAS_LIMIT,
                'gasPrice': CFG.CustomStrategyBuy.GAS_PRICE,
                'nonce': nonce
            }
        );

    } catch (e) {
        console.log(`[error::swap] ${e.error}`);
        process.exit();
    }
}

/**
 * Sell token
 * @param {*} sellAmount 
 * @param {*} amountOutMin 
 * @param {*} contracts 
 * @returns 
 */
async function r_swapExactTokensForETHSupportingFeeOnTransferTokens(sellAmount, amountOutMin, contracts, my_address) {
    try {
        return router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            sellAmount,   // The amount of input tokens to send.
            amountOutMin, // The minimum amount of output tokens that must be received for the transaction not to revert.
            contracts,    // An array of token addresses. path.length must be >= 2. Pools for each consecutive pair of addresses must exist and have liquidity.
            my_address, // Recipient of the ETH.
            Math.floor(Date.now() / 1000) + 60 * 20, // (Date.now() + 1000 * 60 * 10)
            {
                'gasLimit': CFG.CustomStrategySell.GAS_LIMIT,
                'gasPrice': CFG.CustomStrategySell.GAS_PRICE
            }
        );
    } catch (error) {
        console.log('swapExactTokensForETHSupportingFeeOnTransferTokens: ', error);
    }
}

/**
 * Get estimate
 * @param {*} amountIn 
 * @param {*} amountOutMin 
 * @param {*} contracts 
 * @returns 
 */
async function r_estimateTransaction(amountIn, amountOutMin, contracts, account_address) {
    try {
        let gas = await router.estimateGas.swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            contracts,
            account_address,
            (Date.now() + 1000 * 60 * 10),
            {
                'value': amountIn,
                'gasLimit': CFG.CustomStrategyBuy.GAS_LIMIT,
                'gasPrice': CFG.CustomStrategyBuy.GAS_PRICE
            }
        );

        // TODO: Check (fee gas + fee buy) <= money in wallet => gas increase
        // Check if is using enough gas.
        if (gas > parseInt(CFG.CustomStrategyBuy.GAS_LIMIT)) {
            msg.error(`[error::simulate] The transaction requires at least ${gas} gas, your limit is ${CFG.CustomStrategyBuy.GAS_LIMIT}.`);
            process.exit();
        }
        return gas;
    } catch (e) {
        // TODO: Check (fee gas + fee buy) <= money in wallet => gas increase
        console.log(`[error::estimate_gas] ${e}`);
        //return this.estimateTransaction(amountIn, amountOutMin, contracts);
        process.exit();
    }
}

module.exports = {
    r_getAmountsOut,
    r_swapExactETHForTokensSupportingFeeOnTransferTokens,
    r_swapExactTokensForETHSupportingFeeOnTransferTokens,
    r_estimateTransaction
}