import mongoose from "mongoose";

async function connectDB(): Promise<void> {
	const uri = process.env.MONGO_URI;
	if (!uri) {
		throw new Error("MONGO_URI is not defined in .env");
	}
	await mongoose.connect(uri);
	console.log("MongoDB connected");
}

export default connectDB;
