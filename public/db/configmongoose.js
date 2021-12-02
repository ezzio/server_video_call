const mongoose = require("mongoose");

module.exports = async function connection() {
  mongoose
    .connect(
      process.env.MONGODB_URL || "mongodb://localhost:27017/video_call_app",
      // "mongodb+srv://ezzio:*****@cluster0.zbyuh.mongodb.net/videoCall?authSource=admin&replicaSet=atlas-12znom-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .catch((err) => console.log(err));

  // mongoose.connection.on("connected", () => {
  //   console.log("Mongoose connected to db");
  // });
};
