// 2.Using multer store the file by checking the type of file.If the file type is image then upload the file in images folder otherwise upload it in files folder. Your image file type should be only png. Save all the files in mongodb.

// ===============> answer 2<==================
const express = require('express');
const multer=require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient
const ObjectId=require("mongodb").ObjectId
const client=new MongoClient("mongodb://0.0.0.0:27017/mydb");
client.connect()
.then(()=>{
  console.log("connected");
})

const app = express();
const db=client.db("mydb");
var coll=db.collection("multer");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, '/src/public/','views'));

const multerStorage=multer.diskStorage({
  destination:(req,file,cb)=>{
    if (path.extname(file.originalname)==='.png') {
      console.log(file.originalname);
      cb(null, 'fileuploads');
    }
    else if (path.extname(file.originalname)==='.jpeg'){
      cb(new Error("invalid file",false))
    }
    else if (path.extname(file.originalname)==='.jpg'){
      cb(new Error("invalid file",false))
    }
    else{
      cb(null,'uploadfolder')
    }
    
  },
  filename:(req,file,cb)=>{
    cb(null,`${file.originalname}.${Date.now()}`);
  }
});
const upload=multer({storage:multerStorage})

app.get("/",(req,res)=>{
  res.render("index_Day10")
})

app.post("/upload",upload.single("myfile"),(req,res)=>{
  console.log(req.file)
  coll.insertOne({files:req.file})
    .then(() => {
      console.log("inserted successfully")
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
  res.send("File uploaded")
})


app.listen(8080,() => {
  console.log("server is running");
});