const httpServer = require('http').createServer();
const PcSwapFactory = require('./functionality/factory');
const PcSwapPair = require('./functionality/pair');
const Helper = require('./functionality/helper');

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
    const connections = io.sockets.sockets;
    console.log("The number of connections: ", Object.keys(connections).length);
    await app_getToken(socket, params);
  });

  // check price
  socket.on('check_h_getPrice', async function (params) {
    const connections = io.sockets.sockets;
    console.log("The number of connections: ", Object.keys(connections).length);
    await app_getPrice(socket, params);
  });

  // check mint token (block)
  socket.on('check_h_getMint', async function (params) {
    const connections = io.sockets.sockets;
    console.log("The number of connections: ", Object.keys(connections).length);
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
