/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

const Redis = require('ioredis');

let redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379,
  });

  redisClient.on('error', err => console.log('Redis Client Error', err));

function getRedisClient() {
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

async function r_getRedis(key) {
    try {
        return JSON.parse(await getRedisClient().get(key));
    } catch (err) {
        console.log('r_getRedis :', err);
        return [];
    }
}

async function r_setRedis(key, value) {
    try {
        await getRedisClient().set(
            key,
            JSON.stringify(value)
        );
        return value;
    } catch (err) {
        console.log('r_setRedis :', err);
        return null;
    }
}

module.exports = {
    r_setRedis,
    r_getRedis,
};