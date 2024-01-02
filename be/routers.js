const express = require('express');
const useRouter = express.Router();

const PcSwapFactory = require('./functionality/factory');
const PcSwapPair = require('./functionality/pair');
const Helper = require('./functionality/helper');
const Config = require('./accounts/config');
const Trade = require('./accounts/trade');

useRouter.post('/address', async function (req, res) {
    const address = req.body.address;
    const wrapToken = await Helper.h_getWrapToken(req.query.wrapToken || 'BNB');
    if (address) {
        const pair = await PcSwapFactory.f_getPairs([wrapToken, address]);
        if (pair) {
            const reserves = await PcSwapPair.p_getReserves(pair.id);
            const dex_swap = await Helper.h_getPrice(reserves, pair.token0, pair.token1);
            const { token0, token1 } = pair;
            await Config.c_setParams('_token', pair.token1);
            return res.send({
                statusText: 'OK',
                data: {
                    dex_swap: {
                        content: `${token0.symbol} ↔ ${token1.symbol}: ${dex_swap.fromRatio} ∗ ${token1.symbol} ↔ ${token0.symbol} ${dex_swap.toRatio}`,
                    },
                    smart_contract: pair,
                }
            })
        } else {
            return res.send({
                statusText: 'NG',
                data: {}
            })
        }
    }
});

useRouter.get('/price', async function (req, res) {
    const address = req.query.address;
    const wrapToken = await Helper.h_getWrapToken(req.query.wrapToken || 'BNB');
    if (address && wrapToken) {
        const pair = await PcSwapFactory.f_getPairs([wrapToken, address]);
        if (!pair) return res.send({
            statusText: 'NG',
            data: {}
        })
        const reserves = await PcSwapPair.p_getReserves(pair.id);
        const dex_swap = await Helper.h_getPrice(reserves, pair.token0, pair.token1);
        const { token0, token1 } = pair;
        return res.send({
            statusText: 'OK',
            data:
            {
                dex_swap: {
                    content: `${token0.symbol} ↔ ${token1.symbol}: ${dex_swap.fromRatio} ∗ ${token1.symbol} ↔ ${token0.symbol} ${dex_swap.toRatio}`,
                }
            }
        })
    }
});

useRouter.get('/token-info', async function (req, res) {
    const address = req.query.address;
    const wrapToken = await Helper.h_getWrapToken(req.query.wrapToken || 'BNB');
    if (address && wrapToken) {
        const pair = await PcSwapFactory.f_getPairs([wrapToken, address]);
        if (!pair) return res.send({
            statusText: 'NG',
            data: {}
        })
        const reserves = await PcSwapPair.p_getReserves(pair.id);
        const dex_swap = await Helper.h_getPrice(reserves, pair.token0, pair.token1);
        const { token0, token1 } = pair;
        return res.send({
            statusText: 'OK',
            data:
            {
                dex_swap: {
                    content: `${token0.symbol} ↔ ${token1.symbol}: ${dex_swap.fromRatio} ∗ ${token1.symbol} ↔ ${token0.symbol} ${dex_swap.toRatio}`,
                },
                smart_contract: pair,
            }
        })
    }
});

useRouter.get('/swap_settings', async function (req, res) {
    const params = await Config.c_getParams('_swap');
    if (params) {
        const account = await Config.c_getParams('_private_key');
        let myWallet;
        if (account && account.private_key && account.my_address) {
            myWallet = {
                amountSell: 0,
                feeEstimate: 0,
                quantity: 0,
                bnbInWallet: 0,
                totalBnb: 0,
                totalUsdt: 0
            }

        } else {
            myWallet = {
                amountSell: 0,
                feeEstimate: 0,
                quantity: 0,
                bnbInWallet: 0,
                totalBnb: 0,
                totalUsdt: 0
            }
        }
        return res.send({
            statusText: 'OK',
            data:
            {
                swap_response: Object.assign(params, myWallet),
            }
        })
    }
});

useRouter.post('/swap_settings', async function (req, res) {
    const {
        gasLimit,
        gasWei,
        amountSell,
    } = req.body;

    const params = await Config.c_setParams('_swap', {
        amountSell: (+(amountSell) <= 0) ? process.env.AMOUNT_SWAP : +(amountSell),
        gasLimit: (+(gasLimit) <= 0) ? process.env.GAS_LIMIT_SWAP : +(gasLimit),
        gasWei: (+(gasWei) <= 0) ? process.env.GAS_PRICE_SWAP : +(gasWei)
    });

    if (params) {
        return res.send({
            statusText: 'OK',
            data:
            {
                swap_response: params
            }
        })
    }
    return res.send({
        statusText: 'NG',
        data: {}
    })


});

useRouter.get('/private_key', async function (req, res) {
    const params = await Config.c_getParams('_private_key');
    if (params && params.private_key && params.my_address) {
        return res.send({
            statusText: 'OK',
            data:
            {
                private_keys: [
                    params
                ],
            }
        })
    }
    return res.send({
        statusText: 'NG',
        data: {}
    })
});

useRouter.post('/private_key', async function (req, res) {
    const {
        private_key,
    } = req.body;

    if (private_key) {
        const id = Math.floor(Math.random() * 1000);
        const params = await Config.c_setParams('_private_key', {
            private_key: private_key || process.env.PRIVATE_KEY,
            my_address: process.env.MY_ADDRESS || 'address testing',
            id: id,
            name: `private_key-${id}`
        });

        if (params) {
            return res.send({
                statusText: 'OK',
                data:
                {
                    private_key: params
                }
            })
        }
    } else {
        return res.send({
            statusText: 'NG',
            data: {}
        })
    }
});

useRouter.get('/options', async function (req, res) {
    const params = await Config.c_getParams('_options');
    return res.send({
        statusText: 'OK',
        data:
        {
            options: params
        }
    });
});

useRouter.post('/options', async function (req, res) {
    const {
        isAutoGasFee,
        numberTryMint,
        numberTrySwap
    } = req.body;

    const params = await Config.c_setParams('_options', {
        isAutoGasFee: (typeof isAutoGasFee === 'boolean') ? isAutoGasFee : true,
        isMainnet: true,
        numberTryMint: (+(numberTryMint) <= 0) ? process.env.NUMBER_TRY_MINT : +(numberTryMint),
        numberTrySwap: (+(numberTrySwap) <= 0) ? process.env.NUMBER_TRY_SWAP : +(numberTrySwap)
    });

    if (params) {
        return res.send({
            statusText: 'OK',
            data:
            {
                options: params
            }
        })
    }
    return res.send({
        statusText: 'NG',
        data: {}
    })
});

useRouter.get('/mint_settings', async function (req, res) {
    const params = await Config.c_getParams('_mint');
    return res.send({
        statusText: 'OK',
        data:
        {
            mint_response: params
        }
    })
});

useRouter.post('/mint_settings', async function (req, res) {
    const {
        gasLimit,
        gasWei,
        numberMint,
    } = req.body;

    const params = await Config.c_setParams('_mint', {
        numberMint: (+(numberMint) <= 0) ? process.env.NUMBER_MINT : +(numberMint),
        gasLimit: (+(gasLimit) <= 0) ? process.env.GAS_LIMIT_MINT : +(gasLimit),
        gasWei: (+(gasWei) <= 0) ? process.env.GAS_PRICE_MINT : +(gasWei)
    });

    if (params) {
        return res.send({
            statusText: 'OK',
            data:
            {
                mint_response: params
            }
        })
    }
    return res.send({
        statusText: 'NG',
        data: {}
    })

});

useRouter.post('/action', async function (req, res) {
    try {
        const method = req.body.method;
        if (method) {
            const {
                gasLimitSwap,
                gasPriceSwap,
                amountSell,
                feeEstimate,
                quantity,
                bnbInWallet,
                totalBnb,
                totalUsdt,
                gasLimitMint,
                gasPriceMint,
                numberMint,
                isAutoGasFee,
                numberTryMint,
                numberTrySwap,
                my_address,
                slippageTolerance,
                address,
                name,
                symbol,
                decimals,
                routerAddress,
                amountBuy,
            } = await Config.c_getParams('', true);
            let rs;
            switch (method) {
                case 'mint':
                    await Trade.t_mintToken({

                    });
                    break;
                case 'buy':
                    await Trade.t_buyToken({
                        routerAddress,              /* router factory */
                        address,                    /* address token need buy */
                        amountBuy: 1,               /* amount BNB */
                        slippageTolerance,          /* slippage (%) */
                        gasPriceSwap,               /* gas price */
                        gasLimitSwap,               /* gas limit */
                        numberTrySwap,              /* number swap */
                    });
                    break;
                case 'swap':
                    await Trade.t_swapToken({
                        routerAddress,              /* router factory */
                        address,                    /* token address */
                        amountSell,                 /* amount need sell (%) */
                        slippageTolerance,          /* slippage (%) */
                        gasLimitSwap,               /* gas limit */
                        numberTrySwap,              /* number swap */
                        isAutoGasFee                /* number swap */
                    });
                    break;
                default:
                    break;
            }

            return res.send({
                statusText: 'OK',
                data: rs
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            statusText: 'NG',
            data: {}
        })
    }
});

useRouter.post('/reset', async function (req, res) {
    try {
        const reset = req.body.reset;
        if (reset) {
            await Config.c_setReset();
            return res.send({
                statusText: 'OK',
                data: {
                    reset: 'OK'
                }
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            statusText: 'NG',
            data: {}
        })
    }

});

module.exports = useRouter;