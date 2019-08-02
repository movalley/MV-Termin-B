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
    const terminID = req.params.id;

    let player = {
      _id: req.decoded._id,
      name: req.decoded.username,
      team: "white"
    };

    // get termin instace for aditional checks
    let playerCheck = await Termin.findById(terminID).exec();

    // checking is there any room left for other players to join
    if (playerCheck.playersList.length == playerCheck.playersNumber) {
      throw { message: "Termin is full!" };
    }

    // checking does current player already exists in termin
    let playeAlrdyJoined = playerCheck.playersList.filter(
      player => player._id == req.decoded._id
    ).length;

    if (playeAlrdyJoined > 0) {
      throw { message: "You are already in this termin!" };
    }

    let query = Termin.updateOne(
      { _id: terminID },
      { $push: { playersList: player } }
    );
    let results = await query.exec();

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error(error);
    res.status(200).json({ error });
  }
});

module.exports = router;
