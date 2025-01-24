import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
	try {
		const mongoURI = process.env.MONGO_URI;

		await mongoose.connect(mongoURI);

		console.log("MongoDB connected");
	} catch (error) {
		console.error("MongoDB connection error:", error);
	}
};

export default connectDB;
