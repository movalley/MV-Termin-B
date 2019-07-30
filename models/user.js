// get an instance of mongoose and mongoose.Schema
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

// set up mongoose model and pass it using module.exports
// module.exports = mongoose.model('User', new Schema({
//     username: String,
//     password: String,
// }))

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function(v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: [true, "Password is requried"],
    minlength: 4
    // COMMENTED FOR DEV PURPOSES
    // validate: {
    //   validator: function(v) {
    //     return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(v);
    //   },
    //   message: props =>
    //     `Password needs at least one number, one lowercase and one uppercase letter!`
    // }
  }
});

userSchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function(plaintext) {
  return new Promise((resolve, reject) => {
    resolve(bcrypt.compareSync(plaintext, this.password));
  });
  // return callback(null, bcrypt.compareSync(plaintext, this.password));
};

module.exports = mongoose.model("User", userSchema);
