var express = require("express");
var router = express.Router();

let Termin = require("../models/termin");

router.get("/", async (req, res) => {
  try {
    let query = Termin.find({ creator: req.decoded._id });
    let results = await query.exec();

    res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    res.status(200).json({ error });
  }
});

// create termin
router.post("/", async (req, res) => {
  try {
    let newTermin = new Termin({
      title: req.body.title,
      location: req.body.location,
      playersNumber: req.body.playersNumber,
      dateOfTermin: req.body.dateOfTermin,
      creator: req.decoded._id
    });

    if (req.body.includeMe)
      newTermin.playersList = [
        { _id: req.decoded._id, name: req.decoded.username, team: "white" }
      ];

    let results = await newTermin.save();
    res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    res.status(200).json({ error });
  }
});

module.exports = router;
