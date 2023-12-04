const Redis = require('ioredis');

let redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379,
  });

  redisClient.on('error', err => console.log('Redis Client Error', err));

const r_getRedis = () => {
    if (!redisClient) {
        redisClient = new Redis({
            host: '127.0.0.1',
            port: 6379,
        });
    }
    return redisClient;
};

// echo redis errors to the console
redisClient.on('error', (err) => {
    console.log("error " + err)
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

module.exports = {
    r_getRedis,
};