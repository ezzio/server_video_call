var express = require("express");
var router = express.Router();
const functionAutho = require("../public/javascripts/CheckAutho");
var User_Schema = require("../public/db/Schema/User_Schema");
/* GET home page. */
router.get("/",(req, res) => {
  console.log("register");
});

router.post("/", async (req, res) => {
  let User = new User_Schema(req.body);
  await User.save(function (err, result) {
    if (err) {
      res.send({ redirect: "/register" });
    } else {
      console.log(result);
    }
  });
  res.send({ isSuccess: true });
});
module.exports = router;
