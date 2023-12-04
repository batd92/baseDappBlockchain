const { Web3 } = require('web3');
const { HttpProvider } = require('web3-providers-http');
const { WebSocketProvider } = require('web3-providers-ws');

// Các options và địa chỉ HTTP của BSC public node
const optionsHTTP = {
    timeout: 30000,
    // ...các options khác
};

const BSC_NODE_HTTP_URL = 'https://bsc-dataseed.bnbchain.org';  // Thay đổi địa chỉ nếu bạn sử dụng HTTP

// Biến tĩnh để lưu trữ instance của web3
let web3InstanceHTTP = null;

// Hàm trả về instance của web3, tạo mới nếu chưa tồn tại
const w_getWeb3InstanceHTTP = () => {
    if (!web3InstanceHTTP) {
        const httpProvider = new HttpProvider(BSC_NODE_HTTP_URL, optionsHTTP);
        web3InstanceHTTP = new Web3(httpProvider);
    }
    return web3InstanceHTTP;
};

const optionsWSS = {
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
        delay: 1000, // ms
        maxAttempts: 5,
        onTimeout: false

    }
};

// Biến tĩnh để lưu trữ instance của web3
let web3InstanceWSS = null;

// wsProvider of web3
let wsProvider = null;

// Hàm trả về instance của web3, tạo mới nếu chưa tồn tại
const w_getWeb3InstanceWSS = () => {
    if (!web3InstanceWSS) {
        wsProvider = new WebSocketProvider('wss://bsc.publicnode.com', optionsWSS);
        web3InstanceWSS = new Web3(wsProvider);
    }
    return web3InstanceWSS;
};

const w_getWsProviderWSS = () => {
    if (!wsProvider) {
        wsProvider = new WebSocketProvider('wss://bsc.publicnode.com', optionsWSS);
    }
    return wsProvider;
};

// Xuất hàm để có thể sử dụng ở nơi khác trong ứng dụng
module.exports = {
    w_getWeb3InstanceHTTP,
    w_getWeb3InstanceWSS,
    w_getWsProviderWSS
};