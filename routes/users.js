let express = require('express');
let router = express.Router();
const bcrypt = require("bcryptjs");


let jwt = require('jsonwebtoken');

let User = require('../models/user');

// Register user
router.post('/register', async (req, res) => {
  try {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password,
    })
    
    let results = await newUser.save();
    res.status(200).json({ results });

  } catch (error) {
    res.status(500).json({ error });
  }

});

// Login user
router.post('/login', async (req, res) => {
  try {
    let user = await  User.findOne({ username: req.body.username }).exec()

    if(!user) {
      return res.status(404).json({ message: 'Authentication failed. User not found.'});
    }

    isMatch = await user.comparePassword(req.body.password);

    if(!isMatch) {
      return res.status(400).json({ message: 'Authentication failed. Wrong password'});
    } else {

      let newUser = {
        _id: user._id,
        username: user.username,
        admin: user.admin
      }

      let token = jwt.sign(newUser, process.env.SuperSecret, {
        expiresIn: 1440
      });
      
      res.status(200).json({ token, user: newUser });
    }

  } catch (error) {
    res.status(500).json({ error });    
  }
})

module.exports = router;
