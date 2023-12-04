// danh sách coin list
const coinList = {
    'BNB': '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    'BUSD': '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    'USDT': '0x55d398326f99059fF775485246999027B3197955'
};

const PancakeFactoryV2 = '0xca143ce32fe78f1f7019d7d551a6402fc5350c73';

const chains = {
    // ETH Mainnet
    '1': {
        'name': 'Ethereum',
        'symbol': 'ETH',
        'wrapped': 'WETH',
        'token': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        'router': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        'factory': '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        'page': 'https://etherscan.io'
    },

    '5': {
        'name': 'Ethereum Goerli',
        'symbol': 'ETH',
        'wrapped': 'WETH',
        'token': '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        'router': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        'factory': '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        'page': 'https://goerli.etherscan.io'
    },

    // BSC Mainnet
    '56': {
        'name': 'Binance Smart Chain',
        'symbol': 'BNB',
        'wrapped': 'WBNB',
        'token': '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        'router': '0x10ED43C718714eb63d5aA57B78B54704E256024E',
        'factory': '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
        'page': 'https://bscscan.com'
    },

    // BSC Testnet
    '97': {
        'name': 'Binance Smart Chain TESTNET',
        'symbol': 'BNBT',
        'wrapped': 'WBNBT',
        'token': '0xae13d989dac2f0debff460ac112a837c89baa7cd',
        'router': '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
        'factory': '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
        'page': 'https://testnet.bscscan.com'
    },

};

module.exports = {
    coinList,
    PancakeFactoryV2,
    chains
}