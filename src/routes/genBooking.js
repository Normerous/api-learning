const Router = require("koa-router");
const mongoose = require("mongoose");
const Transaction = require("mongoose-transactions");
const repo = require("../model/");
const AsyncLock = require("async-lock");
const _ = require("lodash");
const moment = require("moment-timezone");
const lock = new AsyncLock({ timeout: 5000 });

const router = new Router({ prefix: "/genbooking" });

// ****************** set up ************************
// const DIGITS = 10000000000;

function countZero(number) {
  const array = _.split(number.toString(), "");
  let count = 0;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] === "0") count += 1;
  }
  return count;
}

function generateBooking(incrementNo) {
  if (!incrementNo) incrementNo = 0;
  const runningNumber = `${_.padStart(incrementNo, countZero(DIGITS), "0")}`;
  return runningNumber;
}

function generatePersonalBookingNo(incrementNo) {
  let runningNumber = 0;
  if (!incrementNo) return runningNumber;
  runningNumber = incrementNo;
  return runningNumber;
}

const genBookingNumber = ({ userId }) => {
  return lock.acquire("genBookingNumber", async () => {
    let latestId = await repo.runningNumbers
      .findOne({ type: "bookingNumber" })
      .lean();
    // let latestId = await repo.runningNumbers.findOne({ type: 'bookingNumber' })
    let latestPersonalId = await repo.runningNumbers.findOne({
      type: "personalBookingNumber",
      userId,
    });
    if (!latestId || _.isEmpty(latestId)) {
      latestId = await repo.runningNumbers.create({
        reference: 1,
        outputId: 0,
        type: "bookingNumber",
      });
    }
    if (!latestPersonalId) {
      latestPersonalId = await repo.runningNumbers.create({
        reference: 1,
        type: "personalBookingNumber",
        userId,
      });
    }
    let composedConsignment = generateBooking(latestId.reference);
    const personalBookingNumber = generatePersonalBookingNo(
      latestPersonalId.reference
    );
    // console.log('genBookingNumber => latestPersonalId', latestPersonalId.reference)
    // console.log('genBookingNumber => latestId', latestId.reference)
    if (latestId.outputId.match(new RegExp(latestId.reference.toString()))) {
      console.log("IFFF");
      const newBooking = await repo.runningNumbers.update(
        { type: "bookingNumber" },
        { $set: { reference: latestId.reference + 1 } } // 27
      );
      composedConsignment = generateBooking(newBooking.reference); // 0027
    }
    await repo.runningNumbers.update(
      { type: "bookingNumber" },
      { $set: { outputId: composedConsignment }, $inc: { reference: 1 } } // 28
    );
    await repo.runningNumbers.update(
      { type: "personalBookingNumber", userId },
      { $set: { outputId: personalBookingNumber }, $inc: { reference: 1 } }
    );
    return {
      bookingNo: `700${composedConsignment}`,
      personalBookingNumber,
    };
  });
};

router.get("/genbooking", async (ctx) => {
  try {
    // let random = getRandomInt();
    // random ? "62610eb3a7bfcb495ecff111" : "62610eeea7bfcb495ed00fd8",
    const { bookingNo, personalBookingNumber } = await genBookingNumber({
      userId: "62610eb3a7bfcb495ecff111",
    });
    console.log(
      "genbooking => personalBookingNumber:",
      personalBookingNumber,
      "&",
      bookingNo
    );
    ctx.body = {
      bookingNo,
      personalBookingNumber,
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
});

const genBookingNumberV2 = async ({ userId }) => {
  let latestId = await repo.runningNumbers.findOneAndUpdate(
    { type: "bookingNumber" },
    { $inc: { reference: 1 } },
    { new: true, upsert: true }
  );
  let latestPersonalId = await repo.runningNumbers.findOneAndUpdate(
    {
      type: "personalBookingNumber",
      userId,
    },
    { $inc: { reference: 1 } },
    { new: true, upsert: true }
  );
  // console.log('genBookingNumberV2 => latestId', latestId.reference);
  // console.log('genBookingNumberV2 => latestPersonalId', latestPersonalId.reference);

  const composedConsignment = generateBooking(latestId.reference);
  const personalBookingNumber = latestPersonalId.reference;
  return {
    bookingNo: `700${composedConsignment}`,
    personalBookingNumber,
  };
};

const getRandomInt = () => {
  return Math.floor(Math.random() * 2);
};

router.get("/genbookingV2", async (ctx) => {
  try {
    // let random = getRandomInt();
    // userId: random ? "62610eb3a7bfcb495ecff111" : "62610eeea7bfcb495ed00fd8",
    const { bookingNo, personalBookingNumber } = await genBookingNumberV2({
      userId: "62610eb3a7bfcb495ecff111",
    });
    console.log(
      "genbookingV2 => personalBookingNumber:",
      personalBookingNumber,
      "&",
      bookingNo
    );
    ctx.body = {
      bookingNo,
      personalBookingNumber,
    };
  } catch (error) {
    console.log("error", error);
    ctx.statusCode = 400;
    ctx.body = error;
  }
});

const DIGITS = 1000000;

function countZero(number) {
  const array = _.split(number.toString(), "");
  let count = 0;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] === "0") count += 1;
  }
  return count;
}

function generatePouch(incrementNo) {
  if (!incrementNo) incrementNo = 0;
  const runningNumber = `${_.padStart(incrementNo, countZero(DIGITS), "0")}`;
  return runningNumber;
}

router.get("/genPouch", async (ctx) => {
  const currentPrefixDate = moment().add(1, "M").tz("Asia/Bangkok");
  let currentDate = currentPrefixDate.format("DD");
  const year = currentPrefixDate.format("YY");
  const month = currentPrefixDate.format("MM");
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(
      async (fn) => {
        let latestId = await repo.runningNumbers
          .findOne({ type: "pouchNumber2" })
          .session(session);
        if (!latestId) {
          // if cannot find running number, create one
          [latestId] = await repo.runningNumbers.create(
            [
              {
                reference: 1,
                type: "pouchNumber2",
                isFirstTimeOfMonth: false,
              },
            ],
            { session }
          );
        } else if (currentDate === "01" && !latestId.isFirstTimeOfMonth) {
          // reset reference to 1 at the start of month
          // latestId.isFirstTimeOfMonth = true;
          // latestId.reference = 1;

          await repo.runningNumbers
            .updateOne(
              { type: "pouchNumber2" },
              {
                $set: { isFirstTimeOfMonth: true, reference: 1 },
              }
            )
            .session(session);
        }
        const pouchNumber = generatePouch(latestId.reference);
        await repo.runningNumbers
          .updateOne(
            { type: "pouchNumber2" },
            {
              $set: { outputId: `${year}${month}${pouchNumber}` },
              $inc: { reference: 1 },
            }
          )
          .session(session);

        if (currentDate !== "01" && latestId.isFirstTimeOfMonth) {
          // latestId.isFirstTimeOfMonth = false;
          await repo.runningNumbers
            .updateOne(
              { type: "pouchNumber2" },
              {
                $set: { isFirstTimeOfMonth: false },
              }
            )
            .session(session);
        }
        console.log(`V1::`, `SPDX${year}${month}${pouchNumber}`);
        // await latestId.save(session)
        await session.commitTransaction();
        ctx.body = {
          message: "ssssssss",
          currentPrefixDate,
          currentDate,
          pouchName: `SPDX${year}${month}${pouchNumber}`,
        };
      },
      {
        readPreference: "primary",
        readConcern: { level: "local" },
        writeConcern: { w: "majority" },
      }
    );
  } catch (error) {
    console.log("error", error);
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
});

router.get("/genPouchV2", async (ctx) => {
  const currentPrefixDate = moment().tz("Asia/Bangkok");
  let currentDate = currentPrefixDate.format("DD");
  const year = currentPrefixDate.format("YY");
  const month = currentPrefixDate.format("MM");
  currentDate = "01";
  // const session = await mongoose.startSession();
  let latestId;
  if (currentDate === "01") {
    latestId = await repo.runningNumbers.findOneAndUpdate(
      { type: "pouchNumber", isFirstTimeOfMonth: true },
      {
        $inc: { reference: 1 },
        $set: {
          isFirstTimeOfMonth: true,
        },
      },
      {
        new: true,
      }
    );

    if (!latestId)
      latestId = await repo.runningNumbers.findOneAndUpdate(
        { type: "pouchNumber", isFirstTimeOfMonth: false },
        {
          $set: {
            reference: 1,
            isFirstTimeOfMonth: true,
          },
        },
        {
          new: true,
        }
      );
  } else {
    latestId = await repo.runningNumbers.findOneAndUpdate(
      { type: "pouchNumber" },
      {
        $inc: { reference: 1 },
        $set: {
          isFirstTimeOfMonth: false,
        },
      },
      {
        new: true,
      }
    );
  }
  if (!latestId) {
    latestId = await repo.runningNumbers.findOneAndUpdate(
      { type: "pouchNumber" },
      {
        $inc: { reference: 1 },
        $set: {
          isFirstTimeOfMonth: true,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
  }
  console.log("latestId.reference", latestId.reference);
  pouchNumber = generatePouch(latestId.reference);
  console.log(`V2::`, `SPDX${year}${month}${pouchNumber}`);
  await repo.runningNumbers.findOneAndUpdate(
    {
      type: "pouchNumber",
      reference: latestId.reference
    },
    {
      $set: {
        outputId: `SPDX${year}${month}${pouchNumber}`,
      },
    }
  );
  ctx.status = 200;
});

const load = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("loading......................");
      resolve("data");
    }, 10000);
  });
};

module.exports = router;
