// get abi factory
function getABIFactory() {
    return require('../be/abi/factory_v2.json');
}

// get abi router
function getABIRouter() {
    return require('../be/abi/router_v2.json');
}

// get abi liquidity
function getABILiquidity() {
    return require('../be/abi/liquidity_v2.json');
}

// get abi token on pancake swap
function getABIToken() {
    return require('../be/abi/token.json');
}

module.exports = {
    getABIFactory,
    getABILiquidity,
    getABIRouter,
    getABIToken
}