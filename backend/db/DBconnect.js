import mongoose from "mongoose";

export const DBconnect = async () => {
    try {
       const DB = await mongoose.connect(process.env.MONGO_URI);
        console.log(`DB connected ${DB.connection.host}`);
    } catch (error) {
        console.log('DB connection error:', error.message);
    }
}