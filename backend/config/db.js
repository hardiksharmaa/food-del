import mongoose from "mongoose";

export const  connectDB = async () =>{
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
        console.error("ERROR: MONGO_URI environment variable is not set");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoURI);
        console.log("DB Connected");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
}

