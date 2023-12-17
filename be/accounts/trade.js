/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const { Web3 } = require('web3');
const Wallet = require("../accounts/wallet.js");



// spenderAddress -> địa chỉ router pancakeswap
// yourTokenContractAddress -> địa chỉ token
async function t_approveToken(yourTokenContractAddress, spenderAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E') {
    const web3 = new Web3(BSC_NODE_URL); // Kết nối
    const account = Wallet._getAccount();
    const abis = []; // Call get ABIs
    const contract = new web3.eth.Contract(abis, yourTokenContractAddress);

    // Tạo một BigNumber đại diện cho giá trị 2^256 - 1
    const maxInt = Web3.utils.toBN(2).pow(Web3.utils.toBN(256)).sub(Web3.utils.toBN(1)).toString();
    const approveTx = contract.methods.approve(spenderAddress, maxInt);

    const gas = await approveTx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();

    const signedTransaction = await web3.eth.accounts.signTransaction({
        from: account.address,
        to: yourTokenContractAddress,
        gas,
        gasPrice,
        data: approveTx.encodeABI(),
    }, Wallet._getPrivateKey());

    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    console.log('Transaction Receipt:', receipt);
}


/**
 * Estimate transaction gas
 * @param {Object} transactionObject - Đối tượng giao dịch cần ước lượng gas
 * @param {string} accountAddress - Địa chỉ tài khoản cần sử dụng để ước lượng gas
 * @returns {number} - Ước lượng chi phí gas
 * // Example usage
    const transactionObject = {
        to: '0xTargetAddress',
        value: '1000000000000000000', // 1 BNB in Wei
        gasPrice: '1000000000', // 1 Gwei in Wei
        // ... other transaction parameters
    };
 */
async function t_estimateGas(transactionObject, yourAccountAddress) {
    const BSC_NODE_URL = 'https://bsc-dataseed.binance.org/'; // Thay đổi URL nếu cần
    const web3 = new Web3(BSC_NODE_URL);

    try {
        // Estimate gas for the transaction
        const gasEstimate = await web3.eth.estimateGas({
            ...transactionObject,
            from: yourAccountAddress,
        });

        console.log('Estimated Gas:', gasEstimate);
        return gasEstimate;
    } catch (error) {
        console.error('Error estimating gas:', error);
        throw error;
    }
}

/**
 * Check Liquidity
 * @param {*} pair 
 * @returns {Promise<string>} Formatted liquidity value
 */
async function t_getLiquidity(pair) {
    // Assuming you have a web3 instance connected to your Ethereum node
    const web3 = new Web3(/* your Ethereum node URL */);

    // Call the 'getLiquidity' method on the 'contract_in' object with the provided 'pair'
    const bnbValue = await this.contract_in.methods.getLiquidity(pair).call();

    // Convert the 'bnbValue' from Wei to BNB
    const formattedbnbValue = web3.utils.fromWei(bnbValue, 'ether');

    // Testing: Check if the liquidity is less than 1 BNB
    if (parseFloat(formattedbnbValue) < 1) {
        // Log a warning message
        console.warn("[debug::liquidity] There is not enough liquidity yet.");

        // Recursive call to 'getLiquidity' until there is enough liquidity (formattedbnbValue >= 1)
        return getLiquidity(pair);
    }

    // Return the formatted liquidity value
    return formattedbnbValue;
}


/**
* Buy Token
* @param {*} from 
* @param {*} to 
* @returns 
*/
async function t_buyTokenSupportingFeeOnTransferTokens(
    web3Instance,
    routerAddress,
    toToken,
    amountBNB,
    slippageTolerance,
    account,
    privateKey
) {
    try {
        // Create a Web3 contract instance for the PancakeSwap router
        const routerContract = new web3Instance.eth.Contract(ROUTER_ABI, routerAddress);

        // Get the current account's nonce
        const nonce = await web3Instance.eth.getTransactionCount(account);

        // Calculate the minimum amount of tokens to receive based on slippage tolerance
        const amounts = await routerContract.methods.getAmountsOut(web3Instance.utils.toWei(amountBNB.toString()), ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', toToken]).call();
        const amountOutMin = amounts[1].sub(amounts[1].mul(slippageTolerance).div(100));

        // Define the buy parameters
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

        // Build the transaction object
        const txObject = routerContract.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            [toToken],
            account,
            deadline
        );

        // Estimate gas required for the transaction
        const xs = await txObject.estimateGas({ from: account, value: web3Instance.utils.toWei(amountBNB.toString()) });

        // Build the raw transaction
        const rawTransaction = {
            nonce: web3Instance.utils.toHex(nonce),
            gasPrice: web3Instance.utils.toHex(await web3Instance.eth.getGasPrice()),
            gasLimit: web3Instance.utils.toHex(gasEstimate),
            to: routerAddress,
            data: txObject.encodeABI(),
            value: web3Instance.utils.toHex(web3Instance.utils.toWei(amountBNB.toString())),
            chainId: await web3Instance.eth.net.getId(),
        };

        // Sign the transaction
        const signedTransaction = await web3Instance.eth.accounts.signTransaction(rawTransaction, privateKey);

        // Send the signed transaction
        const receipt = await web3Instance.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        return receipt;
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
    web3Instance,
    routerAddress,
    fromToken,
    toToken,
    percentageToSell,
    slippageTolerance,
    account,
    privateKey,
    initialGasLimit = 10000,
    maxGasLimit
) {
    try {
        // Create a Web3 contract instance for the PancakeSwap router
        const routerContract = new web3Instance.eth.Contract(ROUTER_ABI, routerAddress);

        // Get the current account's nonce
        const nonce = await web3Instance.eth.getTransactionCount(account);

        // Get the balance of the fromToken in the account's wallet
        const fromTokenBalance = await routerContract.methods.balanceOf(account).call();
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
                const txObject = routerContract.methods.swapExactTokensForTokens(
                    amountToSell,
                    amountOutMin,
                    [fromToken, toToken],
                    account,
                    deadline
                );

                // Estimate gas required for the transaction
                const gasEstimate = await txObject.estimateGas({ from: account, gasPrice: web3Instance.utils.toHex(gasPrice), gas: web3Instance.utils.toHex(gasLimit) });

                // Check if the estimated gas limit
                if (gasEstimate > maxGasLimit) {
                    console.error('Gas estimate or gas price exceeds the specified maximums. Aborting transaction.');
                    return;
                }
                // Build the raw transaction
                const rawTransaction = {
                    nonce: web3Instance.utils.toHex(nonce),
                    gasPrice: web3Instance.utils.toHex(gasPrice),
                    gasLimit: web3Instance.utils.toHex(gasLimit),
                    to: routerAddress,
                    data: txObject.encodeABI(),
                    chainId: await web3Instance.eth.net.getId(),
                };

                try {
                    // Sign the transaction
                    const signedTransaction = await web3Instance.eth.accounts.signTransaction(rawTransaction, privateKey);

                    // Send the signed transaction
                    const receipt = await web3Instance.eth.sendSignedTransaction(signedTransaction.rawTransaction);
                    transactionHash = receipt.transactionHash;
                } catch (error) {
                    if (error.message.includes('out of gas') && retryCount < 3) {
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
    t_estimateGas,
    t_getLiquidity,
    t_sellPercentageOfTokens
}