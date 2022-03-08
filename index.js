const express = require('express')

const fs = require('fs')

const { exec } = require('child_process')

const path = require('path')

const multer = require('multer')

const bodyParser = require('body-parser')

const app = express()

var dir = 'public';
var subDirectory = 'public/uploads'

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);

    fs.mkdirSync(subDirectory)

}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({storage:storage})

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static('public'))

const PORT = process.env.PORT || 3000

app.get('/',(req,res) => {
    res.sendFile(__dirname +'/home.html')
})

app.post('/convert',upload.single('file'),(req,res,next) => {
    if(req.file){
        console.log(req.file.path)

        var output = Date.now() + "output.mp3"

        exec(`ffmpeg -i ${req.file.path} ${output}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            else{
                console.log("file is converted")
            res.download(output,(err) => {
                if(err) throw err
                
                fs.unlinkSync(req.file.path)
                fs.unlinkSync(output)

                next()

            })
        }
        })
    }
})

app.listen(PORT,() => {
    console.log(`App is listening on Port ${PORT}`)
})


// const express = require("express");

// const ffmpeg = require("fluent-ffmpeg");

// const bodyParser = require("body-parser");

// const fs = require("fs");

// const fileUpload = require("express-fileupload");

// const app = express();

// const PORT = process.env.PORT || 5000

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
// app.use(bodyParser.json());

// //support parsing of application/x-www-form-urlencoded post data

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );

// ffmpeg.setFfmpegPath("/ffmpeg/bin/ffmpeg.exe");

// ffmpeg.setFfprobePath("/ffmpeg/bin");

// // ffmpeg.setFlvtoolPath("flvtool");

// // console.log(ffmpeg);

// app.get("/", (req, res) => {
  
//   res.sendFile(__dirname+'/index.html')
// });

// app.post("/convert", (req, res) => {
  
//   let to = req.body.to;
//   let file = req.files.file;
//   let fileName = `output.${to}`;
//   console.log(fileName);
//   // console.log(file);
//   res.contentType(`video/${to}`);
//   res.attachment(`output.${to}`);

//   file.mv("/tmp/" + file.name, function (err) {
//     if (err) return res.sendStatus(500).send(err);
//     console.log("File Uploaded successfully");
//   });

//   ffmpeg("/tmp/" + file.name)
//     .withOutputFormat(to)
//     .on("end", function (stdout, stderr) {
//       console.log("Finished");
//       res.download(__dirname + fileName, function (err) {
//         if (err) throw err;

//         fs.unlink(__dirname + fileName, function (err) {
//           if (err) throw err;
//           console.log("File deleted");
//         });
//       });
//       fs.unlink("/tmp/" + file.name, function (err) {
//         if (err) throw err;
//         console.log("File deleted");
//       });
//     })
//     .on("error", function (err) {
//       console.log("an error happened: " + err.message);
//       fs.unlink("/tmp/" + file.name, function (err) {
//         if (err) throw err;
//         console.log("File deleted");
//       });
//     })
//     .saveToFile(__dirname + fileName);
//     res.send("success");
//   //.pipe(res, { end: true });
// });

// app.listen(process.env.PORT || 8080,function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("Server started at port 8080")
//   }
// });


