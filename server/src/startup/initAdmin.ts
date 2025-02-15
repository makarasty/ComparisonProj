import UserModel from "../models/UserModel";

export async function createAdminUserIfNotExists(): Promise<void> {
	try {
		const adminEmail = "ma@ka.rasty";
		const existingAdmin = await UserModel.findOne({ email: adminEmail }).exec();
		if (!existingAdmin) {
			await UserModel.create({
				name: "SuperAdmin",
				email: adminEmail,
				password: "123123",
				role: "admin",
			});
			console.log("Admin user created:", adminEmail);
		} else {
			console.log("Admin user already exists:", adminEmail);
		}
	} catch (error) {
		console.error("Error creating admin user:", error);
	}
}
