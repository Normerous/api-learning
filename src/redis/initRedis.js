const tests = require("./tests");

module.exports.init = async () => {
  Promise.all([tests.set()]);
};
