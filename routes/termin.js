var express = require("express");
var router = express.Router();

let Termin = require("../models/termin");

// get all termins from loged in user
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
router.post("/create", async (req, res) => {
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

// get specific termin
router.get("/:id", async (req, res) => {
  try {
    let query = Termin.findById(req.params.id);
    let results = await query.exec();

    res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    res.status(200).json({ error });
  }
});

// join specific termin
router.post("/join/:id", async (req, res) => {
  try {
    let player = {
      _id: req.decoded._id,
      name: req.decoded.username,
      team: "white"
    };

    let query = Termin.update(
      { _id: req.params.id },
      { $push: { playersList: player } }
    );
    let results = await query.exec();

    res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    res.status(200).json({ error });
  }
});

module.exports = router;
