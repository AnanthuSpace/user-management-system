const mongoose=require('mongoose');


const userScema = mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    repassword: {
        type: String,
        required: true
    },
})


const User=mongoose.model('user',userScema)
module.exports={
    User
}