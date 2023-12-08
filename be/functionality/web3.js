const { Web3 } = require('web3');
const { HttpProvider } = require('web3-providers-http');
const { WebSocketProvider } = require('web3-providers-ws');

// Các options và địa chỉ HTTP của BSC public node
const optionsHTTP = {
    timeout: 30000,
    // ...các options khác
};

const BSC_NODE_HTTP_URL = 'https://bsc-dataseed.bnbchain.org';  // Thay đổi địa chỉ nếu bạn sử dụng HTTP
let web3InstanceHTTP = null;

// Hàm trả về instance của web3, tạo mới nếu chưa tồn tại
const w_getWeb3InstanceHTTP = () => {
    if (!web3InstanceHTTP) {
        const httpProvider = new HttpProvider(BSC_NODE_HTTP_URL, optionsHTTP);
        web3InstanceHTTP = new Web3(httpProvider);
    }
    return web3InstanceHTTP;
};

let web3InstanceWSS = null;
const w_getWeb3InstanceWSS = () => {
    if (!web3InstanceWSS) {
        web3InstanceWSS = new Web3('wss://bsc.publicnode.com', { timeout: 60000 });
    }
    return web3InstanceWSS;
};

module.exports = {
    w_getWeb3InstanceHTTP,
    w_getWeb3InstanceWSS,
};