const { promises, createReadStream, createWriteStream } = require("fs");
const FormData = require("form-data");
const archiver = require("archiver");

const read = () => {
  const output = createReadStream("Screen Shot 2565-05-31 at 13.22.58.png");
  const form = new FormData();
  form.append("files", output);
  console.log("data", form);
};
read()

const write = async (dir = "1234") => {
  const zipFileName = `${dir}.zip`;
  const output = createWriteStream(zipFileName);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });
  archive.pipe(output);
  archive.file("1234.txt", { name: "file4.txt" });
  archive.file("1234.png", { name: "file4.pang" });
  // archive.directory(dir, dir.replace('1', ''))
  archive.finalize();

  output.on("close", () => {
    console.log(`close Zipfile size: ${archive.pointer() / 1024} kilobytes`);
    del()
  });
  output.on("finish", () => {
    console.log(`finish Zipfile size: ${archive.pointer() / 1024} kilobytes`);
  });
  output.on("error", (error) => {
    console.log("error", error);
  });

  const del = () => {
    promises.unlink(zipFileName, (err) => {
      console.log("file", err);
      if (err) {
        console.log("err", err);
        throw err;
      }
    });
  };
};

// write();

// await fsPromises.mkdir(tempDirectory)
