const mongoose = require('mongoose');
const bcrypt = require("bcrypt")

// schemas
const userSchema = mongoose.Schema({
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
})
userSchema.pre("save", async function(next){
    // if(!this.password){
        const salt = await bcrypt.genSalt()
        this.password = await bcrypt.hash(this.password, salt)
    // }
    next()
})
userSchema.methods.checkPassword = async function(psw){
    return await bcrypt.compare(psw, this.password)
}


// models
let User = mongoose.model('user', userSchema);


// exports
module.exports = {
    User
}
