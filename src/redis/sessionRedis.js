const redis = require('../redis/index');

module.exports.findToken = async (token) => {
  const result = await redis.get(token);
  if (!result) {
    throw new Error("Not found token target");
  }
  return JSON.parse(result);
};

module.exports.create = async (token, payload) => {
  redis.setex(token, 120, payload);
};
