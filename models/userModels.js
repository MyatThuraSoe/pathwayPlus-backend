const mongoose = require('mongoose');
const bcrypt = require("bcrypt")

// schemas
const userSchema = mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },  
    profile : {
        type: String,
        default: "https://profile.com/default.png"
    },
    phone : {
        type: String,
    },
    dob : {
        type: Date
    },
    city : {
        type: String
    },
    password : {
        type: String,
        required: true
    },
    isAdmin: {
        type : Boolean,
        default: false
    }
})
userSchema.pre("saves", async function(next){
    if(!this.password){
        const salt = await bcrypt.genSalt()
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})
userSchema.statics.checkPassword = async function(psw){
    return await bscript.compare(this.password, psw)
}


// models
let User = mongoose.model('user', userSchema);


// exports
module.exports = {
    User
}
