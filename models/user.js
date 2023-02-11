const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetcode: {
    type: String,
    default: "",
  },
});
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.checkPassword = async function (psw) {
  return await bcrypt.compare(psw, this.password);
};

let User = mongoose.model("User", userSchema);

module.exports = User;
