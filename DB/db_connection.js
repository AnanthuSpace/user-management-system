const mongoose = require("mongoose");
const dbconnect = mongoose.connect("mongodb://localhost:27017/UserDB");

dbconnect
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err.message));
