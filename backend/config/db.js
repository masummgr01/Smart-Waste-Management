import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('\nPlease check:');
    console.error('1. MONGODB_URI is set correctly in .env file');
    console.error('2. MongoDB Atlas cluster is running');
    console.error('3. Your IP address is whitelisted in MongoDB Atlas');
    console.error('4. Database user credentials are correct');
    console.error('\nExample MONGODB_URI format:');
    console.error('mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
    process.exit(1);
  }
};

export default connectDB;

