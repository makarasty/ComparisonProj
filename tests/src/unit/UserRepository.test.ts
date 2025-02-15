import { mock } from "jest-mock-extended";
import UserRepository from "@server/repositories/UserRepository";
import UserModel, { IUserDocument } from "@server/models/UserModel";

// Мокаем модель
jest.mock("@server/models/UserModel");

describe("UserRepository - Unit tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("findByEmail() should return user if found", async () => {
		const mockUser = mock<IUserDocument>();
		mockUser.email = "test@example.com";

		(UserModel.findOne as jest.Mock).mockReturnValue({
			exec: jest.fn().mockResolvedValue(mockUser),
		});

		const found = await UserRepository.findByEmail("test@example.com");
		expect(found?.email).toBe("test@example.com");
		expect(UserModel.findOne).toHaveBeenCalledWith({
			email: "test@example.com",
		});
	});

	it("createUser() should create a new user", async () => {
		const mockUser = mock<IUserDocument>();
		mockUser.email = "newuser@example.com";

		(UserModel.create as jest.Mock).mockResolvedValue(mockUser);

		const newUser = await UserRepository.createUser({
			name: "NewUser",
			email: "newuser@example.com",
			password: "123456",
			role: "user",
		});

		expect(newUser.email).toBe("newuser@example.com");
		expect(UserModel.create).toHaveBeenCalledTimes(1);
	});

	it("findById() should return user by id", async () => {
		const mockUser = mock<IUserDocument>();
		mockUser.email = "findbyid@example.com";

		(UserModel.findById as jest.Mock).mockReturnValue({
			exec: jest.fn().mockResolvedValue(mockUser),
		});

		const found = await UserRepository.findById("someId");
		expect(found?.email).toBe("findbyid@example.com");
	});

	it("updateUser() should return updated user", async () => {
		const mockUser = mock<IUserDocument>();
		mockUser.email = "update@example.com";

		(UserModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
			select: jest.fn().mockReturnValue({
				exec: jest
					.fn()
					.mockResolvedValue({ ...mockUser, name: "Updated Name" }),
			}),
		});

		const updated = await UserRepository.updateUser("someId", {
			name: "Updated Name",
		});
		expect(updated?.name).toBe("Updated Name");
	});

	it("deleteUser() should delete a user", async () => {
		const mockUser = mock<IUserDocument>();
		mockUser.email = "delete@example.com";

		(UserModel.findByIdAndDelete as jest.Mock).mockReturnValue({
			exec: jest.fn().mockResolvedValue(mockUser),
		});

		const deleted = await UserRepository.deleteUser("someId");
		expect(deleted?.email).toBe("delete@example.com");
	});
});
