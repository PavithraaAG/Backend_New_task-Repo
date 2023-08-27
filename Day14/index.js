// 1.create an api fetch a single document by id.
// 2.upload file using postman. Validate it by checking the size of the file and the extension. size should not be more than 1mb and extension should be only pdf.

const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const routes = require('./src/routes/app');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const DB = mongoose.connection;
DB.on('open', () => {
  console.log("Connected to the database");
});

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (path.extname(file.originalname) === '.pdf') {
      cb(null, 'data');
    } else {
      cb(new Error("This is not a PDF file"), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 1000000 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

app.post("/upload", upload.single("myfile"), (req, res) => {
  if (req.file) {
    res.send('File uploaded successfully');
  } else {
    res.status(400).send('File upload failed');
  }
});

app.use('/', routes);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
