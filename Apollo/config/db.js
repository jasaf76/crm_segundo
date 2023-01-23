const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const connectDB = async () => {
 mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });

    console.log("DB connected 🚀 💎 🚀 with mongoose");
  } catch (error) {
    console.log(error);
    process.exit(1); // Stop the app
  }
};

module.exports = connectDB;
