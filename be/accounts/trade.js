/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const { Web3 } = require('web3');
const Token = require("../functionality/token");
const Router = require('../functionality/router');
const Helper = require('./helper');
const Wallet = require('../accounts/wallet');

// spenderAddress -> địa chỉ router pancakeswap
// yourTokenContractAddress -> địa chỉ token

async function t_approveToken(yourTokenContractAddress, spenderAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E') {
    const account = Wallet._getAccount();
    const contract = await Token.t_getTokenSmartContract(yourTokenContractAddress);

    // Tạo một BigNumber đại diện cho giá trị 2^256 - 1
    const maxInt = Web3.utils.toBN(2).pow(Web3.utils.toBN(256)).sub(Web3.utils.toBN(1)).toString();
    const approveTx = contract.methods.approve(spenderAddress, maxInt);

    const gas = await approveTx.estimateGas({ from: account.address });
    const gasPrice = await Wallet.getGasPrice();

    const signedTransaction = await Wallet.signTransaction({
        from: account.address,
        to: yourTokenContractAddress,
        gas,
        gasPrice,
        data: approveTx.encodeABI(),
    });

    const receipt = await Wallet.sendSignedTransaction(signedTransaction.rawTransaction);
    console.log('Function [t_approveToken] : ', receipt);
}

/**
* Buy Token (SupportingFeeOnTransferTokens)
* @param {*} from 
* @param {*} to 
* @returns 
*/
async function t_buyToken(
    routerAddress,
    toToken,
    amountBNB,
    slippageTolerance,
    maxGasLimit,
    numberTrySwap
) {
    try {
        // 1. Get nonce and account
        const nonce = Wallet.getNonce();
        const account = Wallet.getAccount();

        // 2. Tính toán số lượng tối thiểu của token nhận được dựa trên slippage tolerance
        const amounts = await Router.r_getAmountsOut(
            web3Instance.utils.toWei(amountBNB.toString()),
            [Helper.getTokenWrapByChain('BNB'), toToken]
        );
        const amountOutMin = amounts[1].sub(amounts[1].mul(+slippageTolerance).div(100));

        // 3. Set deadline
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 phút từ thời điểm hiện tại

        // 4. Transaction object
        const txObject = await Router.r_swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            [toToken],
            account,
            deadline
        );

        // 5. Set gasPrice
        const gasPrice = Web3.utils.toHex(await Wallet.getGasPrice());

        // 6. Estimate gas
        const gasEstimate = await txObject.estimateGas({ from: account, value: Web3.utils.toWei(amountBNB.toString()) });

        // 7. Set gasLimit
        if (gasEstimate > maxGasLimit) {
            const gasToAdd = gasEstimate - maxGasLimit;
            gasLimit = Math.min(gasLimit + gasToAdd, maxGasLimit);
        } else {
            gasLimit = gasEstimate; // Tăng gasLimit lên bằng với gasEstimate
        }
        // 8. Transaction raw
        const rawTransaction = {
            nonce: Web3.utils.toHex(nonce),
            gasPrice,
            gasLimit,
            to: routerAddress,
            data: txObject.encodeABI(),
            value: Web3.utils.toWei(amountBNB.toString()),
            chainId: Wallet.getChainId(),
        };

        // 9. Transaction sign
        const signedTransaction = await Wallet.signTransaction(rawTransaction);

        // 10. Send transaction
        const receipt = await Wallet.sendSignedTransaction(signedTransaction.rawTransaction);

        // 11. Return transaction hash
        return receipt.transactionHash;

    } catch (error) {
        console.error('Lỗi trong quá trình giao dịch:', error.message || error);
        throw error; // Ném lại lỗi để xử lý bên ngoài nếu cần
    }
}

/**
 * Sell Token
 * @param {*} from 
 * @param {*} to 
 * @returns 
 */
async function t_swapToken(
    routerAddress,
    toToken,
    percentageToSell,
    slippageTolerance,
    maxGasLimit,
    numberTrySwap,
    isAutoGasFee
) {
    try {
        const nonce = Wallet.getNonce();
        const account = Wallet.getAccount();

        const fromTokenBalance = await Router.r_balanceOf(account);

        const amountToSell = (fromTokenBalance * percentageToSell) / 100;
        if (amountToSell > fromTokenBalance) {
            console.error('Không đủ token để bán');
            return;
        }

        const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 phút từ thời điểm hiện tại
        const amountOutMin = amountToSell * (1 - slippageTolerance / 100);

        let transactionHash;
        let retryCount = 0;

        const gasPrice = Web3.utils.toHex(await Wallet.getGasPrice());
        let gasLimit = Web3.utils.toHex(maxGasLimit);

        const txObject = await Router.r_swapExactTokensForTokens(
            amountToSell,
            amountOutMin,
            [Helper.getTokenWrapByChain('BNB'), toToken],
            account,
            deadline
        );

        do {
            // Estimate gas required for the transaction
            const gasEstimate = await txObject.estimateGas({ from: account, gasPrice, gas: gasLimit });

            // Check if the estimated gas limit exceeds the maximum limit
            if (gasEstimate > maxGasLimit) {
                const gasToAdd = gasEstimate - maxGasLimit;
                gasLimit = Math.min(gasLimit + gasToAdd, maxGasLimit);
            } else {
                gasLimit = gasEstimate; // Tăng gasLimit lên bằng với gasEstimate
            }

            const rawTransaction = {
                nonce: Web3.utils.toHex(nonce),
                gasPrice,
                gasLimit,
                to: routerAddress,
                data: txObject.encodeABI(),
                chainId: Wallet.getChainId(),
            };

            try {
                const signedTransaction = await Wallet.signTransaction(rawTransaction);
                const receipt = await Wallet.sendSignedTransaction(signedTransaction.rawTransaction);
                transactionHash = receipt.transactionHash;
            } catch (error) {
                if (error.message && error.message.includes('out of gas') && retryCount < numberTrySwap) {
                    console.warn('Hết gas. Đang thử lại...');
                    if (isAutoGasFee) gasLimit *= 2;
                    retryCount++;
                } else {
                    console.error('Lỗi trong quá trình giao dịch:', error.message || error);
                    throw error;
                }
            }
        } while (!transactionHash && gasLimit <= maxGasLimit);

        if (!transactionHash) {
            console.error('Giao dịch thất bại ngay cả với gas limit tối đa.');
            return;
        }

        console.log('Giao dịch thành công. Transaction hash:', transactionHash);

    } catch (error) {
        console.error('Lỗi trong quá trình giao dịch:', error.message || error);
        throw error;
    }
}

/**
 * Mint NFT
 * @param {*} from 
 * @param {*} to 
 * @returns 
 */
async function t_mintToken(
) {

}

module.exports = {
    t_approveToken,
    t_buyToken,
    t_swapToken,
    t_mintToken
}