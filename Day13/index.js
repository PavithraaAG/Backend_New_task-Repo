const express= require('express');
const path = require('path');
const bodyParser=require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient
const ObjectId=require("mongodb").ObjectId
const client=new MongoClient("mongodb://0.0.0.0:27017/mydb");
client.connect()
.then(()=>{
  console.log("connected");
})



app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, '/src/public/','views'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res)=>{
    const db=client.db("mydb");
var coll=db.collection("Blogs");
      coll.find({}).toArray()
      .then((data)=>{
        res.render("home",{data:data})
      }).catch((err)=>{
        console.log(err)
      });
});

  

// app.use(express.json());


app.listen(8000,()=>{
  console.log('listening on')
})