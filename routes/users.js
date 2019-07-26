let express = require('express');
let router = express.Router();
const bcrypt = require("bcryptjs");


let jwt = require('jsonwebtoken');

let User = require('../models/user');

// Register user
router.post('/register', (req, res) => {

  let newUser = new User({
    username: req.body.username,
    password: req.body.password,
  })

  newUser.save()
  .then(response => {
    res.status(200).json({ response });
  })
  .catch(e => {
    res.status(500).json({ e });
  })

});

// Login user
router.post('/login', (req, res) => {

  User.findOne({
    username: req.body.username
  }).exec()
  .then(response => {

    if(!response) {

      res.status(404).json({ message: 'Authentication failed. User not found.'});

    } else {

      // check password
      if(!bcrypt.compareSync(req.body.password, response.password)) {
        res.status(400).json({ success: false, message: 'Authentication failed. Wrong password'});
      } else {

        let user = {
          _id: response._id,
          username: response.username,
          admin: response.admin
        }

        let token = jwt.sign(user, process.env.SuperSecret, {
          expiresIn: 1440
        });

        res.status(200).json({ token });

      }

    }
  })
  .catch(e => {
    res.status(500).json({ e });
  })

})

module.exports = router;
