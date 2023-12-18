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

