const httpServer = require('http').createServer();
const PcSwapFactory = require('./functionality/factory');
const PcSwapPair = require('./functionality/pair');
const Helper = require('./functionality/helper');
const Wallet = require('./accounts/wallet');
const Trade = require('./accounts/trade');
const Config = require('./accounts/config');
const Token = require('./functionality/token');
const Monitor = require('./monitor');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const os = require('os');
process.env.UV_THREADPOOL_SIZE = os.cpus().length - 1;

// Load system
(async () => {
  const LoadGraphql = false;
  if (LoadGraphql) {
    // get top pair address.
    await Helper.h_loadTopPairsByGraphql();
  }
  // Load and Push data on Redis
  // await Helper.h_loadTokenByGraphql();
})();

/**
 * Socket
 */
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.setMaxListeners(15); // Adjust the number based on your needs

/**
 * Router
 */

/* connect-wallet */
app.post('/connect-wallet', async (req, res) => {

  try {
    const { privateKey, httpRpc = 'https://data-seed-prebsc-1-s1.binance.org:8545' } = req.body;
    const wallet = await Wallet.wl_Load(privateKey, httpRpc);
    if (wallet.account) {
      await Config.c_setTrade({}, key = 'privateKey', privateKey.toString());
      return res.send({
        statusText: 'OK',
        data: {
          bnbBalance: await Wallet.wl_getBalance(),
          chainId: await Wallet.wl_getChainId()
        }
      });
    }
  } catch (error) {
    return res.send({
      statusText: 'NG',
      data: {
        error
      }
    });
  }
});

app.get('/config', async (req, res) => {

  try {
    const config = await Config.c_getTrade('_config');
    return res.send({
      statusText: 'OK',
      data: {
        config
      }
    });
  } catch (error) {
    return res.send({
      statusText: 'NG',
      data: {
        error
      }
    });
  }
});

app.post('/save-config', async (req, res) => {
  const params = {
    gasLimit: req.body.gasLimit || 0,
    gasWei: req.body.gasWei || 0,
    feeEstimate: req.body.feeEstimate || 0,
    usdtInitial: req.body.usdtInitial || 0,
    profitSell: req.body.profitSell || 0,
    amountSell: req.body.amountSell || 0,
    quantityToken: req.body.quantityToken || 0,
    slippage: req.body.slippage || 0,
    percentageToSell: req.body.percentageToSell || 0,
    maxGasLimit: req.body.maxGasLimit || 0
  }
  const config = await Config.c_setTrade(params);
  return res.send({
    statusText: 'OK',
    data: {
      config
    }
  });
});

app.get('/auto-sell', async (req, res) => {
  // Your logic here
  const { privateKey, httpRpc } = req.body;
  const wallet = await Wallet.wl_Load(privateKey, httpRpc);
  const balance = await Wallet.wl_getBalance();
  return res.send({
    data: 'OK',
    wallet,
    balance
  });
});


app.get('/manual-sell', async (req, res) => {
  // Your logic here
  const { privateKey, httpRpc } = req.body;
  const wallet = await Wallet.wl_Load(privateKey, httpRpc);
  const balance = await Wallet.wl_getBalance();
  return res.send({
    statusText: 'OK',
    data: {
      wallet,
      balance
    }
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(2705, () => {
  console.log('Server is listening on port 2705');
});

io.on("connection", function (socket) {

  // check token
  socket.on('check_h_Token', async function (params) {
    await app_getToken(socket, params);
  });

  // check price
  socket.on('check_h_getPrice', async function (params) {
    await app_getPrice(socket, params);
  });

  // check mint token (block)
  socket.on('check_h_getMint', async function (params) {
    await app_checkMint(socket, params);
  });

});


// get info token
async function app_getToken(socket, params) {
  try {
    const query = JSON.parse(params || '');
    const response = await PcSwapFactory.f_getPairs(query);
    socket.emit('app_getToken', JSON.stringify(response));
  } catch (error) {
    console.log('[app_getToken]: ', error);
  }
}

// get price token
async function app_getPrice(socket, params) {
  try {
    const query = JSON.parse(params || '');
    const pair = await PcSwapFactory.f_getPairs(query);
    const reserves = await PcSwapPair.p_getReserves(pair.id);
    const price = await Helper.h_getPrice(reserves, pair.token0, pair.token1);
    socket.emit('app_getPrice', JSON.stringify(price));
  } catch (error) {
    console.log('[app_getPrice]: ', error);
  }
}

// check mint pair address
async function app_checkMint(socket, params) {
  try {
    const query = JSON.parse(params || '');
    const pair = await PcSwapFactory.f_getPairs(query);
    await PcSwapPair.p_checkMintEvent(pair.id);
  } catch (error) {
    console.log('[app_checkMint]: ', error);
  }
}
