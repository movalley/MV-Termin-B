var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ msg: "GET TERMIN" });
});

// create termin
router.post("/", (req, res) => {
  res.status(200).json({ msg: "Loged in user", profile: req.decoded });
});

module.exports = router;
