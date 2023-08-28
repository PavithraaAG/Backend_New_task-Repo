const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const client = new MongoClient('mongodb://0.0.0.0:27017/mydb');

client.connect().then(() => {
  console.log('Connected to MongoDB');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/public/', 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = client.db('mydb');
const userCollection = db.collection('user');
const blogCollection = db.collection('blogs');


app.get('/', (req, res) => {
  blogCollection
    .find({})
    .toArray()
    .then((data) => {
      res.render('home', { data });
    })
    .catch((err) => {
      console.log(err);
    });
});


app.get('/signin', (req, res) => {
  res.render('signin');
});


app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  userCollection
    .findOne({ username, password }) 
    .then((user) => {
      if (user) {
        res.redirect('/admin');
      } else {
        res.redirect('/signup');
      }
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/signin');
    });
});


app.get('/signup', (req, res) => {
  res.render('signup');
});


app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  userCollection
    .insertOne({ username, password }) 
    .then(() => {
      res.redirect('/signin');
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/signup');
    });
});


app.get('/admin', (req, res) => {
  blogCollection
    .find({})
    .toArray()
    .then((data) => {
      res.render('admin', { data });
    })
    .catch((err) => {
      console.log(err);
    });
});


app.get('/addblog', (req, res) => {
  res.render('addblog');
});


app.post('/addblog', (req, res) => {
  const { title, content} = req.body;
  blogCollection
    .insertOne({ title, content })
    .then(() => {
      res.redirect('/admin');
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/addblog');
    });
});


app.get('/editblog/:id', (req, res) => {
  const id = req.params.id;
  blogCollection
    .find({ _id: new ObjectId(id) }).toArray()
    .then((blog) => {
      res.render('editblog', { blog });
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/admin');
    });
});


app.post('/updateblog', (req, res) => {
  const id = req.body.id;
  const { title, content } = req.body;
  blogCollection
    .updateOne({ _id:new ObjectId(id) }, { $set: { title, content } })
    .then(() => {
      res.redirect('/admin');
    })
});


app.get('/deleteblog/:id', (req, res) => {
  const id = req.params.id;

  var o_id=new ObjectId(id);
  blogCollection
    .deleteOne({ _id:(o_id) })
    .then(() => {
      res.redirect('/admin');
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/admin');
    });
});


app.listen(8080, () => {
  console.log('Listening on port 8080');
});
