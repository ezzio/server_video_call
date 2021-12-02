var express = require("express");
var router = express.Router();
var User_Schema = require("../public/db/Schema/User_Schema");
const PORT = "http://localhost:4000"
// const functionAutho = require("../public/javascripts/CheckAutho");
var upload = require("../public/db/functionForDB/Upload");
/* GET users listing. */
router.post("/", async (req, res) => {
  let request = req.body;
  let infoUser = await User_Schema.find({ _id: request.owner }).lean().exec();
  if (infoUser.length > 0) {
    res.send({
      isSuccess: true,
      username: infoUser[0].username,
      avatar: infoUser[0].avatar,
    });
  } else {
    res.send({ isSuccess: false });
  }
});
router.post("/changeAvatar", upload.single("file"), async (req, res) => {
  let request = req.body;
  if (req.file === undefined) return res.send("you must select a file.");
  const imgUrl = `${PORT}/photo/${req.file.filename}`;
  await User_Schema.updateOne(
    { _id: request.owners },
    { $set: { avatar: imgUrl } }, (error)=> {
      if(!error){
        res.send({isSuccess: true})
      }
      else{
        res.send({isSuccess: false})
      }
    }
  );
});

module.exports = router;
