import request from "supertest";
import app from "@server/index";
import UserModel from "@server/models/UserModel";
import "../setupTests";

const nonExistingId = "000000000000000000000000";

describe("UserController - Integration tests", () => {
	let adminToken: string;
	let createdUserId: string;

	beforeAll(async () => {
		await UserModel.deleteOne({ email: "admintester@example.com" });
		await UserModel.create({
			name: "AdminTester",
			email: "admintester@example.com",
			password: "123123",
			role: "admin",
		});

		const loginRes = await request(app)
			.post("/api/auth/login")
			.send({ email: "admintester@example.com", password: "123123" });
		adminToken = loginRes.body.token;
	});

	it("GET /api/users - admin can see user list", async () => {
		const res = await request(app)
			.get("/api/users")
			.set("Authorization", `Bearer ${adminToken}`)
			.expect(200);

		expect(Array.isArray(res.body.data)).toBe(true);
	});

	it("PUT /api/users/:id - update a user", async () => {
		const newUser = await UserModel.create({
			name: "UserToUpdate",
			email: `updateuser+${Date.now()}@example.com`,
			password: "123456",
			role: "user",
		});
		createdUserId = newUser._id.toHexString();

		const res = await request(app)
			.put(`/api/users/${createdUserId}`)
			.set("Authorization", `Bearer ${adminToken}`)
			.send({ name: "Updated User" })
			.expect(200);

		expect(res.body.data).toHaveProperty("name", "Updated User");
	});

	it("PUT /api/users/:id - fail update with invalid data", async () => {
		const res = await request(app)
			.put(`/api/users/${createdUserId}`)
			.set("Authorization", `Bearer ${adminToken}`)
			.send({ name: "" })
			.expect(400);

		expect(res.body.message).toMatch(/Required/i);
	});

	it("DELETE /api/users/:id - delete a user", async () => {
		const res = await request(app)
			.delete(`/api/users/${createdUserId}`)
			.set("Authorization", `Bearer ${adminToken}`)
			.expect(200);

		expect(res.body.message).toMatch(/успішно видалено/i);
	});

	it("DELETE /api/users/:id - fail delete for non-existent user", async () => {
		const res = await request(app)
			.delete(`/api/users/${nonExistingId}`)
			.set("Authorization", `Bearer ${adminToken}`)
			.expect(404);

		expect(res.body.message).toMatch(/Користувача не знайдено/i);
	});
});
