var express = require("express");
var router = express.Router();
var RoomMeeting = require("../public/db/Schema/MeetingRoom_Schema");
router.post("/CreateMeetingRoom", async (req, res) => {
  let request = req.body;
  let newMeeting = new RoomMeeting({
    RoomName: request.RoomName,
    owner: request.owner,
  });
  await newMeeting.save(async (err, modal) => {
    if (err) {
      res.send({ isSuccess: false });
    } else {
      RoomMeeting.updateOne(
        { _id: modal._id },
        { $push: { Member: request.owner } }
      );
      res.send({ isSuccess: true, roomId: modal.RoomName });
    }
  });
});
// router.post("/CheckMeetingRoom", async (req, res) => {
//   let request = req.body;
//   await RoomMeeting.find({ _id: request.RoomName }, (error) => {
//     if (error) {
//       res.send("Room is not exist");
//     } else {
//       res.send({ isSuccess: true });
//     }
//   });
// });
router.post("/ListAllMeetingRoom", async (req, res) => {
  let request = req.body;
  let allRoomMeeting = await RoomMeeting.find({ owner: request.owner })
    .lean()
    .exec();
  if (allRoomMeeting.length > 0) {
    res.send({allRoomMeeting, isSuccess: true});
  } else {
    res.send([{
      
    }]);
  }
});
router.post("/deleteMeetingRoom", async (req, res) => {
  let request = req.body;
  await RoomMeeting.deleteOne({ _id: request.idRoon }, (error) => {
    if (error) {
      res.send({ isSuccess: false });
    } else {
      res.send({ isSuccess: true });
    }
  });
});
router.post("/CheckMeetingRoom", async (req, res) => {
  let request = req.body;
  let checkInRoom = await RoomMeeting.find({ RoomName: request.roomName });
  if (checkInRoom.length > 0) {
    res.send({ isSuccess: true });
  } else {
    res.send({ isSuccess: false });
  }
});

module.exports = router;
