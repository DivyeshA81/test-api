const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI; 
    const dbName = process.env.DB_NAME;
    
    if (!uri) {
      throw new Error("MongoDB URI is not defined");
    }
    const conn = await mongoose.connect(uri, {
      dbName: dbName, 
    });
    
    console.log(`Connected to the ${dbName} database successfully`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;