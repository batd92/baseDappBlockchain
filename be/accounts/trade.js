/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const { Web3 } = require('web3');
const Token = require("../functionality/token");
const Router = require('../functionality/router');

// spenderAddress -> địa chỉ router pancakeswap
// yourTokenContractAddress -> địa chỉ token
async function t_approveToken(Wallet, yourTokenContractAddress, spenderAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E') {
    const account = Wallet._getAccount();
    const contract = await Token.t_getTokenSmartContract(yourTokenContractAddress);

    // Tạo một BigNumber đại diện cho giá trị 2^256 - 1
    const maxInt = Web3.utils.toBN(2).pow(Web3.utils.toBN(256)).sub(Web3.utils.toBN(1)).toString();
    const approveTx = contract.methods.approve(spenderAddress, maxInt);

    const gas = await approveTx.estimateGas({ from: account.address });
    const gasPrice = await Wallet.wl_getGasPrice();

    const signedTransaction = await Wallet.wl_signTransaction({
        from: account.address,
        to: yourTokenContractAddress,
        gas,
        gasPrice,
        data: approveTx.encodeABI(),
    });

    const receipt = await Wallet.wl_sendSignedTransaction(signedTransaction.rawTransaction);
    console.log('Function [t_approveToken] : ', receipt);
}

/**
* Buy Token
* @param {*} from 
* @param {*} to 
* @returns 
*/
async function t_buyTokenSupportingFeeOnTransferTokens(
    Wallet,
    routerAddress,
    toToken,
    amountBNB,
    slippageTolerance,
    _gasPrice,
    _gasLimit
) {
    try {
        // Get the current account's nonce
        const nonce = Wallet.wl_getNonce();
        const account = Wallet.wl_getAccount();

        // Calculate the minimum amount of tokens to receive based on slippage tolerance
        const amounts = await Router.r_getAmountsOut(
            web3Instance.utils.toWei(amountBNB.toString()),
            ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', toToken]
        );
        const amountOutMin = amounts[1].sub(amounts[1].mul(slippageTolerance).div(100));

        // Define the buy parameters
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

        // Build the transaction object
        const txObject = await Router.r_swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            [toToken],
            account,
            deadline
        );

        const value = Web3.utils.toWei(amountBNB.toString();
        const gasPrice = Web3.utils.toHex(_gasPrice);
        const gasLimit = Web3.utils.toHex(_gasLimit);

        // Estimate gas required for the transaction
        const xs = await txObject.estimateGas({ from: account, value });

        // Build the raw transaction
        const rawTransaction = {
            nonce: Web3.utils.toHex(nonce),
            gasPrice,
            gasLimit,
            to: routerAddress,
            data: txObject.encodeABI(),
            value,
            chainId: Wallet.wl_getChainId(),
        };

        // Sign the transaction
        const signedTransaction = await Wallet.wl_signTransaction(rawTransaction);

        // Send the signed transaction
        const receipt = await Wallet.wl_sendSignedTransaction(signedTransaction.rawTransaction);
        return receipt.transactionHash;

    } catch (error) {
        console.error('Error during transaction:', error.message || error);
        throw error; // Re-throw the error for external handling if needed
    }
}

/**
 * Sell Token
 * @param {*} from 
 * @param {*} to 
 * @returns 
 */
async function t_sellPercentageOfTokens(
    Wallet,
    routerAddress,
    fromToken,
    toToken,
    percentageToSell,
    slippageTolerance,
    initialGasLimit = 10000,
    maxGasLimit,
    _gasPrice,
    _gasLimit
) {
    try {
        // Get the current account's nonce
        const nonce = Wallet.wl_getNonce();
        const account = Wallet.wl_getAccount();

        // Get the balance of the fromToken in the account's wallet
        const fromTokenBalance = await Router.r_balanceOf(account);
        const originalTokenPrice = 100;

        // Calculate the amount to sell as a percentage of the balance
        const amountToSell = (fromTokenBalance * percentageToSell) / 100;

        // Kiểm tra xem có đủ token để bán không
        if (amountToSell > fromTokenBalance) {
            console.error('Không đủ token để bán');
            return;
        }

        // Fetch the current token price from an API or other source
        const currentTokenPrice = await fetchCurrentTokenPrice(); // Replace with your function to fetch the current token price

        // Check if currentTokenPrice is a valid number
        if (isNaN(currentTokenPrice)) {
            console.error('Invalid currentTokenPrice. Aborting sell.');
            return null;
        }

        const currentValue = amountToSell * currentTokenPrice;
        const originalValue = amountToSell * originalTokenPrice;

        if ((currentValue - originalValue) / originalValue >= 0.5) {
            // Define the sell parameters
            const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
            const amountOutMin = amountToSell * (1 - slippageTolerance / 100); // Adjust based on your slippage tolerance

            let transactionHash;
            let retryCount = 0;

            do {
                // Build the transaction object
                const txObject = await Router.r_swapExactTokensForTokens(
                    amountToSell,
                    amountOutMin,
                    [fromToken, toToken],
                    account,
                    deadline
                );

                const gasPrice = Web3.utils.toHex(_gasPrice);
                const gasLimit = Web3.utils.toHex(_gasLimit);
                // Estimate gas required for the transaction
                const gasEstimate = await txObject.estimateGas({ from: account, gasPrice, gas: gasLimit });

                // Check if the estimated gas limit
                if (gasEstimate > maxGasLimit) {
                    console.error('Gas estimate or gas price exceeds the specified maximums. Aborting transaction.');
                    return;
                }
                // Build the raw transaction
                const rawTransaction = {
                    nonce: Web3.utils.toHex(nonce),
                    gasPrice,
                    gasLimit,
                    to: routerAddress,
                    data: txObject.encodeABI(),
                    chainId: Wallet.wl_getChainId(),
                };

                try {
                    // Sign the transaction
                    const signedTransaction = await Wallet.wl_signTransaction(rawTransaction);

                    // Send the signed transaction
                    const receipt = await Wallet.wl_sendSignedTransaction(signedTransaction.rawTransaction);
                    transactionHash = receipt.transactionHash;
                } catch (error) {
                    if (error.message && error.message.includes('out of gas') && retryCount < 3) {
                        // Handle Out of Gas error and retry (up to 3 times)
                        console.warn('Out of Gas. Retrying...');
                        gasLimit *= 2; // Double the gas limit
                        retryCount++;
                    } else {
                        // Handle other errors
                        console.error('Error during transaction:', error.message || error);
                        throw error; // Re-throw the error for external handling if needed
                    }
                }
            } while (!transactionHash && gasLimit <= maxGasLimit);

            if (!transactionHash) {
                console.error('Transaction failed even with maximum gas limit.');
                // Handle the case where the transaction fails even with the maximum gas limit
                return;
            }

            // Transaction successful
            console.log('Transaction successful. Transaction hash:', transactionHash);
        }

    } catch (error) {
        console.error('Error during transaction:', error.message || error);
        throw error; // Re-throw the error for external handling if needed
    }
}

module.exports = {
    t_approveToken,
    t_buyTokenSupportingFeeOnTransferTokens,
    t_sellPercentageOfTokens
}