// import mongoose coz with the help of mongoose modal is created
const mongoose = require('mongoose')



// user schema/structure to store data in db
const userSchema = new mongoose.Schema( {
    username : {
        type: String,
        required : true
    },
    email : {
        type : String ,
        required : true
    },
    password : {
        type : String ,
        required : true
    },
    bio : {
        type :String ,
        default : ""
    },
    profile : {
        type : String,
        default : ""
    }
})


// ee schema ne base cheythittanu users nnu paranja collectionilekk in mongo atlas data add cheyyan 
const users = mongoose.model('users' , userSchema)

module.exports = users 
/* eth controllerkk pass akkanam coz controllerilanu req vernnath avide aanu save cheyyanulla logic verunne*/

