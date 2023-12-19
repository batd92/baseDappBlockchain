const httpServer = require('http').createServer();
const PcSwapFactory = require('./functionality/factory');
const PcSwapPair = require('./functionality/pair');
const Helper = require('./functionality/helper');
const Wallet = require('./accounts/wallet');
const Trade = require('./accounts/trade');
const Token = require('./functionality/token');
const Monitor = require('./monitor');

// Lấy số luồng trong máy tính và ép ứng dụng chạy tài nguyên
const os = require('os');
process.env.UV_THREADPOOL_SIZE = os.cpus().length - 1;

// init system
(async () => {
  const LoadGraphql = false;
  if (LoadGraphql) {
    // get top pair address.
    await Helper.h_loadTopPairsByGraphql();
  }
  // Load and Push data on Redis
  // await Helper.h_loadTokenByGraphql();


})();

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.setMaxListeners(15); // Adjust the number based on your needs
httpServer.listen(9001);

io.on("connection", function (socket) {
  console.log("------- Made socket connection -----");

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

  // save setting wallet
  socket.on('add_envWallet', async function (params) {
    await app_setEnvWallet(socket, params);
  });

  // Get wallet info
  socket.on('get_envWallet', async function (params) {
    
  });

  // sell token manual
  socket.on('trade_h_sellTokenManual', async function (params) {
    await trade_h_sellTokenManual(socket, params);
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

// set wallet
async function app_setEnvWallet(socket, params) {
  try {
    const query = JSON.parse(params || '');
    // check validate
    const private_key = query.private_key;
    let response = {
      status: 200,
      content: 'NG'
    }
    if (private_key) {
      const result = await Wallet.wl_Load(private_key);
      if (result) response.content = 'OK'
    }
    socket.emit('get_h_envWallet', JSON.stringify(response));
  } catch (error) {
    console.log('[app_setEnvWallet]: ', error);
  }
}

// sell token manual
async function trade_h_sellTokenManual(socket, params) {
  try {
    const query = JSON.parse(params || '');
    // check validate
    const gasPrice = query.gasPrice;
    const gasLimit = query.gasLimit;
    const fromToken = query.fromToken;
    const percentageToSell = query.percentageToSell;
    const slippageTolerance = query.slippageTolerance;
    const toToken = query.toToken;

    // get account
    const wallet = Wallet.wl_Wallet();
    if (wallet.account) {
      await Trade.t_sellPercentageOfTokens(
        wallet,
        routerAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E',
        gasPrice,
        gasLimit,
        fromToken,
        percentageToSell,
        slippageTolerance,
        toToken,
      )
    }
  } catch (error) {
    console.log('[trade_h_sellTokenManual]: ', error);
  }
}

// sell token manual
async function trade_h_sellTokenAuto(socket, params) {
  try {
    // const query = JSON.parse(params || '');
    // // check validate
    // const gasPrice = query.gasPrice;
    // const gasLimit = query.gasLimit;
    // const fromToken = query.fromToken;
    // const percentageToSell = query.percentageToSell;
    // const slippageTolerance = query.slippageTolerance;
    // const toToken = query.toToken;

    const wallet = await Wallet.wl_Load('641b5ddacec781b69f347c84abe8b2c1b00487a71b15f5ac0530e359a5e2726d', 'https://bsc-dataseed.bnbchain.org');
    const balance = await Wallet.wl_getBalance();
  
    const token = await Token.t_getBalance('0x55d398326f99059fF775485246999027B3197955', wallet.account);
    Monitor.scheduleMonitor({
      wallet,
      canSell: true
    })
  } catch (error) {
    console.log('[trade_Auto]: ', error);
  }
}