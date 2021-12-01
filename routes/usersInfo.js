var express = require("express");
var router = express.Router();
var User_Schema = require("../public/db/Schema/User_Schema");
const functionAutho = require("../public/javascripts/CheckAutho");
/* GET users listing. */
router.post("/", async (req, res) => {
  let request = req.body;
  let infoUser = await User_Schema.find({ _id: request.owner }).lean().exec();
  res.send({
    isSuccess: true,
    username: infoUser[0].username,
    avatar: infoUser[0].avatar,
  });
});

module.exports = router;
