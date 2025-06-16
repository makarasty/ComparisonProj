import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

jest.setTimeout(15000);

beforeAll(async () => {
	const uri = process.env.MONGO_URI;
	if (!uri) {
		throw new Error("MONGO_URI is not defined in environment variables");
	}

	await mongoose.disconnect();

	await mongoose.connect(uri);
});

afterAll(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.disconnect();

	await new Promise((resolve) => setTimeout(resolve, 500));
});
