var express = require("express");
var router = express.Router();
var RoomMeeting = require("../public/db/Schema/MeetingRoom_Schema");
router.post("/CreateMeetingRoom", async (req, res) => {
  let request = req.body;
  let newMeeting = new RoomMeeting({
    RoomName: request.RoomName,
    owner: request.owner,
  });
  await newMeeting.save((err, modal) => {
    if (err) {
      res.send({ isSuccess: false });
    } else {
      res.send({ isSuccess: true, roomId: modal.RoomName });
    }
  });
});
router.post("/CheckMeetingRoom", async (req, res) => {
  let request = req.body;
  await RoomMeeting.find({ _id: request.RoomName }, (error) => {
    if (error) {
      res.send("Room is not exist");
    } else {
      res.send({ isSuccess: true });
    }
  });
});

router.post("/inviteToRoom", async (req, res) => {
  let request = req.body;
  
  
})

module.exports = router;
