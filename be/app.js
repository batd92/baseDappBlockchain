const httpServer = require('http').createServer();
const PcSwapFactory = require('./functionality/factory');
const PcSwapPair = require('./functionality/pair');
const Helper = require('./functionality/helper');

(async () => {
  const pairAddress = await Helper.h_getLimitedPairsGraphql();
  console.log(pairAddress);

})();

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
io.on('connection', client => {
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});
httpServer.listen(9001);

io.on("connection", function (socket) {
  console.log("------- Made socket connection ----- ");
  // check price
  socket.on('check_h_getPrice', async function (params) {
    const query = JSON.parse(params);
    await app_getPrice(socket, query);
  });

});

async function app_getPrice(socket, query) {
  const { address_token0, address_token1 } = query;
  if (!address_token0 || !address_token1) return res.send(JSON.stringify({}));

  // token A
  const token0 = await Helper.h_getTokenByAddress(address_token0);
  // token B
  const token1 = await Helper.h_getTokenByAddress(address_token1);

  const pairAddress = await PcSwapFactory.f_getPairs(token0, token1);
  const reserves = await PcSwapPair.p_getReserves(pairAddress);
  const price = await Helper.h_getPrice(reserves, token0, token1);
  console.log('API h_getPrice: ', token0, token1);
  socket.emit('h_getPrice', JSON.stringify({
    token0,
    token1,
    price
  }));
  const date = new Date().toLocaleString('en-GB', {
    hour12: false,
  });
  socket.emit('h_getLogs', JSON.stringify({
    message: `Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees.`,
    time: date
  }));
}
