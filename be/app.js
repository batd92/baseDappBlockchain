const httpServer = require('http').createServer();
const Helper = require('./functionality/helper');

const express = require('express');
const cors = require('cors');
const useRoute = require('./routers')

const os = require('os');
process.env.UV_THREADPOOL_SIZE = os.cpus().length - 1;

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', useRoute);

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

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "connect-src 'self' ws://localhost:9001");
  next();
});

io.setMaxListeners(15); // Adjust the number based on your needs
app.listen(2705, () => {
  console.log('Server is listening on port 2705');
});

io.on("connection", function (socket) {
});

