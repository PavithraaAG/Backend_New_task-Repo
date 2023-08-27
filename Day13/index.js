const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient
const ObjectId = require("mongodb").ObjectId
const multer = require('multer')
const client = new MongoClient("mongodb://0.0.0.0:27017/mydb");
client.connect()
  .then(() => {
    console.log("connected");
  })



app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, '/src/public/', 'views'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = client.db("mydb");
var coll2 = db.collection("user");
var coll1 = db.collection("blogs");
app.get("/home", (req, res) => {

  coll1.find({}).toArray()
    .then((data) => {
      res.render("home", { data: data })
    }).catch((err) => {
      console.log(err)
    });
});
app.get("/", (req, res) => {
  res.render("page")
})

app.get("/signin", (req, res) => {
  res.render("signin")
})
app.post('/signin_save', (req, res) => {
  const obj = { name: req.body.username, password: req.body.password }
  coll2.find(obj).toArray()
    .then((data) => {
      res.redirect("/home")
    }).catch((err) => {
      res.redirect("/signup")
      console.log(err)
    });
});
app.get("/signup", (req, res) => {
  res.render("signup")
})
app.post('/signup_save', (req, res) => {

  const users = { name: req.body.username, password: req.body.password }
  coll2.insertOne(users)
    .then(() => {
      res.redirect("/")
    }).catch((err) => {
      console.log(err)
    })
});



// app.use(express.json());


app.listen(8000, () => {
  console.log('listening on')
})