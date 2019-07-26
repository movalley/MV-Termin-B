// get an instance of mongoose and mongoose.Schema
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// set up mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    username: String,
    password: String,
}))