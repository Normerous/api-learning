const Router = require("koa-router");
const mongoose = require("mongoose");
const router = new Router({ prefix: "" });
const repo = require("../model/");
const AsyncLock = require("async-lock");
const lock = new AsyncLock({});
const numCPUs = require('os').cpus().length;

// const redisTests = require("../redis/tests");

router.get("/test1", async (ctx) => {
  const sess = await mongoose.startSession();
  let filterName = "test";
  try {
    await sess.withTransaction(
      async () => {
        try {
          let test2 = await repo.repoTest2
          .findOne({ name: "test2" })
          .session(sess);
        let test1 = await repo.repoTest
          .findOneAndUpdate({ name: filterName }, { $inc: { count: 1 } })
          .session(sess);
        test2.count = test1.count + 1;
        test2.testcount = test1.count;
        test2.count = test2.count + 1;
        // if (test1.maxUser > test1.userList.length) {
        //   test1.userList = [...test1.userList, test2.count];
        // } else {
        //   await sess.abortTransaction();
        //   return (ctx = { status: 400, body: "error" });
        // }
        console.log("test1.coun", test1.count)
        await test1.save();
        await test2.save();
        await sess.commitTransaction();
        } catch (error) {
          console.log("error", error);
        }
      },
      {
        readPreference: "primary",
        readConcern: { level: "local" },
        writeConcern: { w: "majority" },
      }
    );
  } catch (error) {
    console.log("error", error);
    await sess.abortTransaction();
    throw (
      ((ctx.body = {
        message: "error",
      }),
      (ctx.status = 400))
    );
  } finally {
    sess.endSession();
  }
  ctx.body = {
    message: "success",
  };
});

router.get("/test2", async (ctx) => {
  const sess = await mongoose.startSession();
  let filterName = "testtest";
  try {
    await sess.withTransaction(
      async () => {
        console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀");
        let test2 = await repo.repoTest2
          .findOne({ name: "test2" })
          .session(sess);
        let test1 = await repo.repoTest
          .findOneAndUpdate(
            { name: filterName },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
          )
          .session(sess);
        // await load();
        console.log("test1", test1);
        test2.testcount = test1.count;
        test2.count = test2.count + 1;
        if (test1.maxUser > test1.userList.length) {
          test1.userList = [...test1.userList, test2.count];
        } else {
          await sess.abortTransaction();
          return (ctx = { statusCode: 400, body: "error" });
        }
        console.log(filterName === "test" ? "💥" : "🚀", "::", test1.userList);
        console.log("🚀⭐️test2.count", test2.count);
        await test1.save();
        await test2.save();
        await sess.commitTransaction();
      },
      {
        readPreference: "primary",
        readConcern: { level: "local" },
        writeConcern: { w: "majority" },
      }
    );
  } catch (error) {
    console.log("error", error);
    await sess.abortTransaction();
    throw (
      ((ctx.body = {
        message: "error",
      }),
      (ctx.status = 400))
    );
  } finally {
    sess.endSession();
  }
  ctx.body = {
    message: "success",
  };
});
var i = 0;
router.get("/test3", async (ctx) => {
  // await lock.acquire("genBookingNumber", async () => {
  //   await load()
  // });
  // await load();
  // const data = await redisTests.filter("test");
  let test1 = await repo.repoTest.findOne({ name: '1' })
  console.log("----------------- END -----------------");
  ctx.status = 200;
  ctx.body = test1;
});

const load = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("loading......................");
      i = i + 1;
      resolve("data");
    }, 5000);
  });
};
console.log("Time:", Date.now());
router.get("/test4", async (ctx) => {
  const sess = await mongoose.startSession();
  let filterName = "test";
  try {
    await sess.withTransaction(
      async () => {
        let test1 = await repo.repoTest
          .findOneAndUpdate({ name: filterName }, { $inc: { count: 1 } })
          .session(sess);
        await load();
        let test2 = await repo.repoTest2
          .findOneAndUpdate({ name: "test2" }, { $inc: { count: 1 } })
          .session(sess);
        console.log("test4:", test1.count, "Time:", Date.now());
        await sess.commitTransaction();
      },
      {
        readPreference: "primary",
        readConcern: { level: "local" },
        writeConcern: { w: "majority" },
      }
    );
  } catch (error) {
    console.log("error", error);
    await sess.abortTransaction();
    throw (
      ((ctx.body = {
        message: "error",
      }),
      (ctx.status = 400))
    );
  } finally {
    sess.endSession();
  }
  ctx.body = {
    message: "success",
  };
});
router.get("/gettest4", async (ctx) => {
  let filterName = "test";
  let test1 = await repo.repoTest.findOneAndUpdate(
    { name: filterName },
    { $inc: { count: 1 } }
  );
  ctx.body = {
    message: "success",
    test1,
  };
});
router.get("/deleteTest4", async (ctx) => {
  const sess = await mongoose.startSession();
  let filterName = "test";
  try {
    await sess.withTransaction(
      async () => {
        await repo.repoTest.remove().session(sess);
        let test1 = await repo.repoTest
          .findOneAndUpdate(
            { name: filterName },
            { $inc: { count: 1 } },
            { upsert: true }
          )
          .session(sess);
        await load();
        let test2 = await repo.repoTest2
          .findOneAndUpdate({ name: "test2" }, { $inc: { count: 1 } })
          .session(sess);
        console.log("test4:", test1?.count, "Time:", Date.now());
        await sess.commitTransaction();
      },
      {
        readPreference: "primary",
        readConcern: { level: "local" },
        writeConcern: { w: "majority" },
      }
    );
  } catch (error) {
    console.log("error", error);
    await sess.abortTransaction();
    throw (
      ((ctx.body = {
        message: "error",
      }),
      (ctx.status = 400))
    );
  } finally {
    sess.endSession();
  }
  ctx.body = {
    message: "success",
  };
  ctx.body = {
    message: "success",
    test1,
  };
});
router.get("/test5", async (ctx) => {
  const sess = await mongoose.startSession();
  let filterName = "testtest";
  try {
    await sess.withTransaction(
      async () => {
        let test1 = await repo.repoTest
          .findOneAndUpdate({ name: filterName }, { $inc: { count: 1 } })
          .session(sess);
        console.log("test5:", test1.count, "Time:", Date.now());
        await sess.commitTransaction();
      },
      {
        readPreference: "primary",
        readConcern: { level: "local" },
        writeConcern: { w: "majority" },
      }
    );
  } catch (error) {
    console.log("error", error);
    await sess.abortTransaction();
    throw (
      ((ctx.body = {
        message: "error",
      }),
      (ctx.status = 400))
    );
  } finally {
    sess.endSession();
  }
  ctx.body = {
    message: "success",
  };
});

router.get("/test6", async (ctx) => {
  let filterName = "test";
  let test1 = await repo.repoTest.findOneAndUpdate(
    { name: filterName },
    { $inc: { count: 1 } }
  );
  console.log("test6:", test1.count, "Time:", Date.now());
  ctx.body = {
    message: "success",
  };
});
router.get("/test7", async (ctx) => {
  let filterName = "testtest";
  let test1 = await repo.repoTest.findOneAndUpdate(
    { name: filterName },
    { $inc: { count: 1 } }
  );
  console.log("test7:", test1.count);
  ctx.body = {
    message: "success",
  };
});

router.get("/test8", async (ctx) => {
  ctx.body = {
    message: "success",
  };
});

router.get("/testrunningredis", async (ctx) => {
  const data = await redisTests.running("test");
  console.log("data: ", data);
  ctx.body = {
    message: "success",
  };
});

router.get("/insertbulkWrite", async (ctx) => {
  // bulkWrite
  let setData = new Array(1000)
    .fill(0)
    .map((el, i) => ({ name: `${i + 1}`, count: 2 }));
  try {
    let res = await repo.repoTest.bulkWrite(
      setData.map((el) => ({
        updateOne: {
          filter: { name: el.name },
          update: { $set: { name: el.name, count: el.count } },
          upsert: true,
        },
      }))
    );
    ctx.message = "success"
    ctx.status = 200
  } catch (error) {
    ctx.status = 400
    (ctx.message = "fail"), (ctx.body = error);
  }
});
module.exports = router;
