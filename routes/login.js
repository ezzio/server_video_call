var express = require("express");
var router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const functionAutho = require("../public/javascripts/CheckAutho");
var login = require("../public/db/Schema/User_Schema");
let user;
router.get(
  "/CheckLogin",
  // (req, res, next) => {
  //   console.log(req.body);
  //   next();
  // },
  functionAutho.checkNotAuthenticated,
  (req, res) => {
    //  console.log(true);
    res.send({ isSuccess: false });
  }
);

router.post("/", passport.authenticate("local"), function (req, res) {
  res.send({ id: user.ID, isSuccess: true });
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log(username, password);
    let DBfindUser = await login
      .find({ username: username, password: password })
      .lean()
      .exec();
    if (DBfindUser[0]) {
      user = {
        ID: DBfindUser[0]._id,
        username: DBfindUser[0].username,
        password: DBfindUser[0].password,
      };
      if (user && user.password == password) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.username);
});
passport.deserializeUser(async (username, done) => {
  let DBfindUser = await login.find({ username: username }).lean().exec();
  if (DBfindUser[0]) {
    let users = {
      username: DBfindUser[0].username,
      password: DBfindUser[0].password,
    };
    if (users) {
      return done(null, users);
    } else {
      return done(null, false);
    }
  }
});

module.exports = router;
