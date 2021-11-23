var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const meettingRoom = new Schema({
  RoomName: { type: String, required: true },
  Owner: { type: Schema.Types.ObjectId, ref: "User" },
  Member: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("meettingRoom", meettingRoom);
