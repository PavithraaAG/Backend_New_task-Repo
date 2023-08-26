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













