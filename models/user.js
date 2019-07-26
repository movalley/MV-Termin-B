// get an instance of mongoose and mongoose.Schema
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

// set up mongoose model and pass it using module.exports
// module.exports = mongoose.model('User', new Schema({
//     username: String,
//     password: String,
// }))

const userSchema = new Schema({
    username: String,
    password: String,
})

userSchema.pre("save", function (next) {

    if(!this.isModified("password")) {
        return next();
    }
    
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
})

userSchema.methods.comparePassword = function(plaintext) {
    return new Promise((resolve, reject) => {
        resolve(bcrypt.compareSync(plaintext, this.password))
    })
    // return callback(null, bcrypt.compareSync(plaintext, this.password));
};

module.exports = mongoose.model('User', userSchema)