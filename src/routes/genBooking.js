const Router = require("koa-router");
const mongoose = require("mongoose");
const repo = require("../model/");
const AsyncLock = require("async-lock");
const _ = require("lodash");
const lock = new AsyncLock({ timeout: 5000 });

const router = new Router({ prefix: "/genbooking" });

// ****************** set up ************************
const DIGITS = 10000000000;

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
      userId: "62610eb3a7bfcb495ecff111"
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
      userId: '62610eb3a7bfcb495ecff111',
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

module.exports = router;
