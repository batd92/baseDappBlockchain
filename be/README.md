# Getting started

1. Clone repo
2. Install Redis `https://redis.io/docs/install/install-redis/`
3. Install dependencies: `npm install`
4. Run server: `npm start`

Use browser developer tools for websocket connection and sending messages:

1. Visit http://localhost:3000 and open developer console
1. `ws = new WebSocket('ws://localhost:3000')`
1. `ws.send('Hello')`
1. See network tab for messages

Ref: https://github.com/joshstevens19/simple-pancakeswap-sdk/tree/master
https://github.com/Uniswap/v2-sdk
https://github.com/pancakeswap/pancake-smart-contracts/blob/master/projects/exchange-protocol/data/abi/contracts/PancakePair.sol/PancakePair.json

https://docs.nodereal.io/reference/pancakeswap-graphql-api

.env

QUICK_NODE_WSS_PROVIDER=https://xxx
QUICK_NODE_HTTP_PROVIDER=wss://xxx
PRIVATE_KEY=xxx
HTTP_RPC_ETH=https://eth.llamarpc.com
HTTP_RPC_ABR=https://arbitrum.llamarpc.com
HTTP_RPC_MATIC=https://polygon.llamarpc.com
HTTP_RPC_BNB=https://bsc-dataseed1.bnbchain.org
WSS_RPC_BNB=wss://bsc.publicnode.com
HTTP_RPC_OP=https://optimism.api.onfinality.io/public
NUMBER_TRY_MINT=1
NUMBER_TRY_SWAP=1
AUTO_GAS_FEE=true
GAS_LIMIT_MINT=500000
GAS_PRICE_SWAP=1000000
AMOUNT_SWAP=50
MY_ADDRESS=
SLIPPAGE_TOLERANCE=0.2
MAX_GAS_LIMIT_SWAP=5000000
MAX_GAS_LIMIT_MINT=5000000
ROUTER_PANCAKE=0x10ED43C718714eb63d5aA57B78B54704E256024E
AMOUNT_BUY=1
