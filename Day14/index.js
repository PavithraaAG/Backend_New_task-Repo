// 1.create an api fetch a single document by id.
// 2.upload file using postman. Validate it by checking the size of the file and the extension. size should not be more than 1mb and extension should be only pdf.

var express = require('express');
const app= express();
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const routes=require('./src/routes/app');
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended:true}));

mongoose.connect('mongodb://0.0.0.0:27017/mydb',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db=mongoose.connection;
db.once('open',function(){
    console.log('mongoose connection')
})
app.use('/',routes)

app.listen(8000,()=>{
    console.log("working")
})













