const { Web3 } = require('web3');
// if you are using ESM style imports, use this line instead:
// import { Web3 } from 'web3';

const web3 = new Web3("https://quiet-cold-waterfall.bsc.quiknode.pro/04e9c75e180b0dd4c537b616bb28ed0551856f6c/");

async function fetchBlockNumber() {
    try {
        const currentBlockNumber = await web3.eth.getBlockNumber();
        console.log('Current block number:', currentBlockNumber);
    } catch (error) {
        console.error('Error fetching block number:', error);
    }
}

fetchBlockNumber();