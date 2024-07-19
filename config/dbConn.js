const mongoose = require("mongoose");

// mongoose is async. Will have a try and catch
const connectDB = async () => {
  try {
    // async await. We need to bring in the db uri to connect to mongodb
    await mongoose.connect(
      process.env.DATABASE_URI,
    );
  } catch (err) {
    console.error(err.message);
    process.exit(1)
  }
};

module.exports = connectDB;
