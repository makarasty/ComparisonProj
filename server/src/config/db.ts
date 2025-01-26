import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
	try {
		const m = process.env.MONGO_URI;

		await mongoose.connect(m);

		console.log("MongoDB connected");
	} catch (e) {
		console.error("MongoDB connection error:", e);
	}
};

export default connectDB;
