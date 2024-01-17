import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);
      console.log(`MongoDB Connected at host: ${conn.connection.host}`);
    } catch (error:any) {
      console.error(error.message);
      process.exit(1);
    }
  }

export default connectDB