// get abi factory
function getPancakeFactory() {
    return require('../be/abi/PancakeFactory.json');
}

// get abi router
function getPancakeRouter() {
    return require('../be/abi/PancakeRouter.json');
}

// get abi liquidity
function getPancakePair() {
    return require('../be/abi/PancakePair.json');
}

// get abi token on pancake swap
function getABITokenERC20() {
    return require('../be/abi/PancakeERC20.json');
}

module.exports = {
    getPancakeFactory,
    getPancakePair,
    getABITokenERC20,
    getPancakeRouter
}