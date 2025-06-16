import UserModel, { IUserDocument } from "../models/UserModel";

class UserRepository {
	async findByEmail(email: string): Promise<IUserDocument | null> {
		return UserModel.findOne({ email }).exec();
	}

	async createUser(userData: Partial<IUserDocument>): Promise<IUserDocument> {
		return UserModel.create(userData);
	}

	async findById(id: string): Promise<IUserDocument | null> {
		return UserModel.findById(id).exec();
	}

	async findAll(): Promise<IUserDocument[]> {
		return UserModel.find().select("-password").exec();
	}

	async updateUser(
		id: string,
		updateData: Partial<IUserDocument>,
	): Promise<IUserDocument | null> {
		return UserModel.findByIdAndUpdate(id, updateData, { new: true })
			.select("-password")
			.exec();
	}

	async deleteUser(id: string): Promise<IUserDocument | null> {
		return UserModel.findByIdAndDelete(id).exec();
	}
}

export default new UserRepository();
