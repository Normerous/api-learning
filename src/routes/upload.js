const Router = require("koa-router");
const koaBody = require("koa-body");
const router = new Router({ prefix: "/upload" });

router.post(
  "/file",
  koaBody({
    formidable: {
      keepExtensions: true,
      maxFieldsSize: 50 * 1024 * 1024,
      maxFileSize: 50 * 1024 * 1024,
    },
    multipart: true,
  }),
  async (ctx) => {
    const { body, files } = ctx.request;
    console.log("files");

    Object.keys(files).map((el) => {
      console.log("el", el);
    });
    ctx.status = 200;
    ctx.body = "success!!";
  }
);

module.exports = router;
