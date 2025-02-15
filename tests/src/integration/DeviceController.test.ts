import request from "supertest";
import app from "@server/index";
import UserModel from "@server/models/UserModel";
import DeviceModel from "@server/models/DeviceModel";
import "../setupTests";

const nonExistingId = "000000000000000000000000";

describe("DeviceController - Integration tests", () => {
	let adminToken: string;
	let createdDeviceId: string;

	beforeAll(async () => {
		await UserModel.deleteOne({ email: "admin@example.com" });
		await UserModel.create({
			name: "AdminUser",
			email: "admin@example.com",
			password: "123123",
			role: "admin",
		});

		const loginRes = await request(app)
			.post("/api/auth/login")
			.send({ email: "admin@example.com", password: "123123" });
		adminToken = loginRes.body.token;
	});

	afterAll(async () => {
		await DeviceModel.deleteMany({});
	});

	it("GET /api/devices - initially empty", async () => {
		const res = await request(app).get("/api/devices").expect(200);
		expect(Array.isArray(res.body.data)).toBe(true);
		expect(res.body.data).toHaveLength(0);
	});

	it("POST /api/devices (admin) - create a device", async () => {
		const devicePayload = {
			title: "Test Device",
			description: "A test device",
			price: 99.99,
		};

		const res = await request(app)
			.post("/api/devices")
			.set("Authorization", `Bearer ${adminToken}`)
			.send(devicePayload)
			.expect(201);

		expect(res.body.data).toHaveProperty("_id");
		expect(res.body.data.title).toBe(devicePayload.title);
		createdDeviceId = res.body.data._id;
	});

	it("GET /api/devices/:id - get created device", async () => {
		const res = await request(app)
			.get(`/api/devices/${createdDeviceId}`)
			.expect(200);

		expect(res.body.data).toHaveProperty("_id", createdDeviceId);
	});

	it("PUT /api/devices/:id - update a device", async () => {
		const updatePayload = {
			title: "Updated Test Device",
			price: 79.99,
		};

		const res = await request(app)
			.put(`/api/devices/${createdDeviceId}`)
			.set("Authorization", `Bearer ${adminToken}`)
			.send(updatePayload)
			.expect(200);

		expect(res.body.data.title).toBe(updatePayload.title);
		expect(res.body.data.price).toBe(updatePayload.price);
	});

	it("PUT /api/devices/:id - fail update for non-existent device", async () => {
		const res = await request(app)
			.put(`/api/devices/${nonExistingId}`)
			.set("Authorization", `Bearer ${adminToken}`)
			.send({ title: "No device" })
			.expect(404);

		expect(res.body.message).toMatch(/Device not found/i);
	});

	it("DELETE /api/devices/:id - delete a device", async () => {
		const res = await request(app)
			.delete(`/api/devices/${createdDeviceId}`)
			.set("Authorization", `Bearer ${adminToken}`)
			.expect(200);

		expect(res.body.message).toMatch(/Device deleted/i);
	});

	it("DELETE /api/devices/:id - fail delete for non-existent device", async () => {
		const res = await request(app)
			.delete(`/api/devices/${nonExistingId}`)
			.set("Authorization", `Bearer ${adminToken}`)
			.expect(404);

		expect(res.body.message).toMatch(/Device not found/i);
	});

	it("GET /api/devices/seed/devices - seed devices", async () => {
		const res = await request(app)
			.get("/api/devices/seed/devices")
			.set("Authorization", `Bearer ${adminToken}`)
			.expect(200);

		expect(res.body.message).toMatch(/Database seeded/i);
		expect(Array.isArray(res.body.data)).toBe(true);
	});
});
