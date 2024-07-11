const mongoose = require("mongoose");

// mongoose is async. Will have a try and catch
const connectDB = async () => {
  try {
    // async await. We need to bring in the db uri to connect to mongodb
    await mongoose.connect(
      process.env.DATABASE_URI,
      // This is an object. Pass in options to prevent warnings from mongoDB otherwise
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
