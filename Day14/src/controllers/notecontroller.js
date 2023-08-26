//1.create an api fetch a single document by id

const Note=require('../models/note');
exports.findOne=(req,res)=>{
    Note.find({_id:req.params.noteId}).then((res1)=>res.send({status:200,msg:res1}))
    .catch((err)=>res.send({status:400,msg:err}))
}