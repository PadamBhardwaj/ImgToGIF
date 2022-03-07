const express = require("express");

const ffmpeg = require("fluent-ffmpeg");

const bodyParser = require("body-parser");

const fs = require("fs");

const fileUpload = require("express-fileupload");

const app = express();

const PORT = process.env.PORT || 5000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

ffmpeg.setFfmpegPath("ffmpeg/bin/ffmpeg.exe");

ffmpeg.setFfprobePath("ffmpeg/bin");

// ffmpeg.setFlvtoolPath("flvtool");

// console.log(ffmpeg);

app.get("/", (req, res) => {
  
  res.sendFile(__dirname+'/index.html')
});

app.post("/convert", (req, res) => {
  
  let to = req.body.to;
  let file = req.files.file;
  let fileName = `output.${to}`;
  console.log();
  // console.log(file);
  res.contentType(`video/${to}`);
  res.attachment(`output.${to}`);

  file.mv("tmp/" + file.name, function (err) {
    if (err) return res.sendStatus(500).send(err);
    console.log("File Uploaded successfully");
  });

  ffmpeg("tmp/" + file.name)
    .withOutputFormat(to)
    .on("end", function (stdout, stderr) {
      console.log("Finished");
      res.download(__dirname + fileName, function (err) {
        if (err) throw err;

        fs.unlink(__dirname + fileName, function (err) {
          if (err) throw err;
          console.log("File deleted");
        });
      });
      fs.unlink("tmp/" + file.name, function (err) {
        if (err) throw err;
        console.log("File deleted");
      });
    })
    .on("error", function (err) {
      console.log("an error happened: " + err.message);
      fs.unlink("tmp/" + file.name, function (err) {
        if (err) throw err;
        console.log("File deleted");
      });
    })
    .saveToFile(__dirname + fileName);
  //.pipe(res, { end: true });
});

app.listen(process.env.PORT || 8080,function(err){
  if(err){
    console.log(err);
  }
  else{
    console.log("Server started at port 8080")
  }
});
