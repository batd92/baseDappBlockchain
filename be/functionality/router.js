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
 * swapExactETHForTokensSupportingFeeOnTransferTokens (Buy token)
 * @param {*} amountIn 
 * @param {*} amountOutMin 
 * @param {*} contracts 
 * @param {*} nonce 
 * @returns 
 */
async function r_swapExactETHForTokensSupportingFeeOnTransferTokens(
    amountOutMin,
    [toToken],
    account,
    deadline
    ) {
    try {
        return router.swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            [toToken],
            account,
            deadline
        );

    } catch (e) {
        console.log(`[error::swap] ${e.error}`);
        process.exit();
    }
}

/**
 * Get balance
 * @param {*} account 
 * @returns 
 */
async function r_balanceOf(account) {
    return await router.methods.balanceOf(account).call();
}

/**
 * swapExactTokensForTokens (sell token)
 * @param {*} amountToSell 
 * @param {*} amountOutMin 
 * @param {*} fromToken 
 * @param {*} toToken 
 * @param {*} account 
 * @param {*} deadline 
 * @returns 
 */
async function r_swapExactTokensForTokens(amountToSell, amountOutMin, fromToken, toToken, account, deadline) {
    return router.methods.swapExactTokensForTokens(
        amountToSell,
        amountOutMin,
        [fromToken, toToken],
        account,
        deadline
    );
}

module.exports = {
    r_getAmountsOut,
    r_swapExactETHForTokensSupportingFeeOnTransferTokens,
    r_balanceOf,
    r_swapExactTokensForTokens
}

