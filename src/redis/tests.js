const redis = require("./index").default;
const repo = require("../model/");
const fs = require('fs');
const postcodeFile = require('./../../postcode.json')
const path = require('path')
module.exports.set = async () => {
  // const res = await repo.repoTest.find().lean();
  // res.map(el => {
  //   redis.setex(`____MY_POSTCODE___${el.zip}`, 40, JSON.stringify(el));
  // })
  redis.incr('tests')
};

module.exports.running = async () => {
  const data = await redis.incr("tests");
  let running = data
  return running
}

module.exports.get = async () => {
  const data = await redis.get("tests");
  if (!data) {
    const res = await repo.repoTest.find({});
    redis.setex("tests", 20,JSON.stringify(res));
    return res
  }
  return data && JSON.parse(data);
};

module.exports.filter = async (name) => {
    // const res = await repo.repoTest.find({ name: name }).lean();
    // redis.set("tests", JSON.stringify(res));
    // const data = await redis.get(`tests`);
    return null
};