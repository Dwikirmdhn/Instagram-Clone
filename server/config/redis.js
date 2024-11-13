if (process.env.NODE_ENV !== "production") { require("dotenv").config(); }

const Redis = require("ioredis");

const dataRedis = new Redis(process.env.REDIS_PASS);

module.exports = dataRedis;