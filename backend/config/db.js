import mongoose from "mongoose";


const connectDB = async () => {
   try {
       const conn = await mongoose.connect(process.env.MONGO_URI);
       return console.log(
         `mongodb connected${conn.connection.host}`.bgMagenta);
   } catch (error) {
       console.log(`Error:${error.message}`)
       process.exit(1);
   }

}
export default connectDB
