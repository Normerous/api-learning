const Router = require("koa-router");
const mongoose = require("mongoose");
const repo = require("../model/");

const router = new Router({ prefix: "/mongo" });

router.get("/withTransaction", async (ctx) => { // auto retry เมื่อเกิด operation conflicted
  console.log("start withTransaction");
  const session = await mongoose.startSession();
  await session.withTransaction(
    async (fn) => {
      console.log("fn", fn.transaction.state);
      try {
        let test2 = await repo.repoTest2
          .findOne({ name: "test2" })
          .session(session);
        let test1 = await repo.repoTest
          .findOneAndUpdate(
            { name: "test" },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
          )
          .session(session);
        test2.testcount = test1.count;
        test2.count = test2.count + 1;
        if (test1.maxUser > test1.userList.length) {
          test1.userList = [...test1.userList, test2.count];
        } else {
          await session.abortTransaction();
          console.log("rollBack..........................");
          throw null;
        }
        await test1.save();
        await test2.save();
        await session.commitTransaction();
        console.log("commitTransaction", fn.transaction.state);
      } catch (error) {
        console.log("name", error.name);
        console.log("message", error.message);
        console.log("error", fn.transaction.state);
      } finally {
        console.log("finally", fn.transaction.state);
      }
    },
    {
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    }
  );
  session.endSession();
  ctx.status = 200;
});

router.get("/transaction", async (ctx) => { // ไม่ได้ auto retry เมื่อเกิด operation conflicted
  const session = await mongoose.startSession();
  try {
    session.startTransaction({
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    });
    let test2 = await repo.repoTest2
      .findOne({ name: "test2" })
      .session(session);
    let test1 = await repo.repoTest.findOne({ name: "test" }).session(session);

    test1.count = test1.count + 1;
    test2.testcount = test1.count;
    test2.count = (test2.count || 0) + 1;

    await test1.save();
    await test2.save();
    await session.commitTransaction();
  } catch (error) {
    // await session.abortTransaction();
  }
  session.endSession();
});

const load = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("loading......................");
      resolve("data");
    }, 5000);
  });
};

module.exports = router;
