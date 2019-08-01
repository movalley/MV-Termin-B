let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const terminSchema = new Schema(
  {
    title: String,
    location: String,
    playersNumber: Number,
    dateOfTermin: { type: Date, default: Date.now },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    playersList: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "User" },
        name: String,
        team: { type: String, enum: ["black", "white"] }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Termin", terminSchema);
