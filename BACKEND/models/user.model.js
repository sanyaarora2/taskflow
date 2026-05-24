const mongoose=require('mongoose')
//Mongoose is a package used to connect Node.js and MongoDB, plus it lets you define rules and structure for your data (schema).
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type: String,
        required: true,
        minlength: 8
    },}, {timestamps: true}
)
const userModel=mongoose.model('User', userSchema);
module.exports=userModel;