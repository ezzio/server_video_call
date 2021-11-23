var User_Schema = require("../db/schema/User_Schema");

module.exports = () => {
  const findUser = async (idUser) => {
    let userName = await User_Schema.find({ _id: idUser }).lean();
    return userName;
  };
};
