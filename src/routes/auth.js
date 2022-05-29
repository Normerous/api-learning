const Router = require("koa-router");
const jsonwebtoken = require("jsonwebtoken");
const router = new Router({ prefix: "/oauth" });
const repo = require("../model/");
const bcrypt = require("bcrypt");
const session = require('../redis/sessionRedis')
const saltRounds = 6;

const genToken = (payload) => {
    console.log(payload)
  return jsonwebtoken.sign(payload, "secret", { expiresIn: 60 });
};

const genRefreshToken = (payload) => {
  return jsonwebtoken.sign(payload, "secret2", { expiresIn: 120 });
};

router.post("/login", async (ctx) => {
  const { username, password } = ctx.request.body;

  try {
    const findUser = await repo.User.findOne({ username });
    if (!findUser) throw { message: "dont have user" };
    const checkPassword = bcrypt.compareSync(password, findUser.hashPassword);
    if (!checkPassword) throw { message: "password fail" };

    const token = genToken({ username, password })
    const reToken = genRefreshToken({ username, password })
    await session.create(token, findUser)
    ctx.status = 200;
    ctx.body = {
        message: "login success",
        token: `Bearer ${token}`,
        refreshToken: `Bearer ${reToken}`
    }
  } catch (error) {
    ctx.status = 400;
    ctx.body = error.message;
  }
});

router.post("/createuser", async (ctx) => {
  const { username, password } = ctx.request.body;
  try {
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    await repo.User.create({ username, hashPassword });

    ctx.status = 200;
    ctx.body = "Create user success!!!";
  } catch (error) {
    console.log("error", error)
    ctx.status = 400;
    ctx.body = "Create user fail!!!";
  }
});

router.post('/verify', async (ctx) => {
  const { token, refreshToken } = ctx.request.body
  try {
    const verifytoken = jsonwebtoken.verify(token.replace('Bearer ', ''), "secret", (err, decoded) => {
      if(err) return false
      return true
    })
    let newtoken
    if(!verifytoken) {
      var verifyrefreshToken = jsonwebtoken.verify(refreshToken.replace('Bearer ', ''), "secret2", (err, decoded) => {
        if(err) return false
        return true
      })
      if(verifyrefreshToken) {
        newtoken = genToken(jsonwebtoken.decode(token.replace('Bearer ', ''), { complete: true }))
      }
    }
  
    ctx.status = 200;
    ctx.body = {
        message: "verify success",
        verifytoken,
        verifyrefreshToken,
        oldtoken: `Bearer ${token}`,
        newtoken: `Bearer ${newtoken}`,
        refreshToken: refreshToken
    }
  } catch (error) {
    console.log("error", error)
    ctx.status = 400;
  }
})

const getSession = async (ctx, next) => {
  const { authorization } = ctx.header;
  let token = (authorization || '').replace('Bearer ', '')
  const user = await session.findToken(token)
  ctx.user = user
  next()
}
router.get("/testsession", getSession,async (ctx) => {
  console.log('..................', ctx.state)
  console.log('..................', ctx.user)
  console.log('..................', ctx.test)
  ctx.body = 'IIOOOOOO'
  ctx.status = 200
});

module.exports = router;