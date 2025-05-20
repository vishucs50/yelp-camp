const mongoose=require('mongoose');
const PassportLocalMongoose=require('passport-local-mongoose')
const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})
UserSchema.plugin(PassportLocalMongoose);
module.exports=mongoose.model('User',UserSchema);