import request from "supertest";
import app from "@server/index";
import "../setupTests";

const getUniqueEmail = (base: string) => `${base}+${Date.now()}@example.com`;

describe("AuthController - Integration tests", () => {
	it("POST /api/auth/register - success", async () => {
		const testUser = {
			name: "TestUser",
			email: getUniqueEmail("test"),
			password: "123456",
			confirmPassword: "123456",
		};

		const res = await request(app)
			.post("/api/auth/register")
			.send(testUser)
			.expect(201);

		expect(res.body).toHaveProperty("userId");
	});

	it("POST /api/auth/register - fail if email already taken", async () => {
		const testUser = {
			name: "TestUserDup",
			email: getUniqueEmail("duplicate"),
			password: "123456",
			confirmPassword: "123456",
		};

		await request(app).post("/api/auth/register").send(testUser).expect(201);

		const res = await request(app)
			.post("/api/auth/register")
			.send(testUser)
			.expect(500);

		expect(res.body.message).toMatch(/вже існує/i);
	});

	it("POST /api/auth/register - fail if required fields missing", async () => {
		const res = await request(app)
			.post("/api/auth/register")
			.send({
				email: getUniqueEmail("nofield"),
				password: "123456",
				confirmPassword: "123456",
			})
			.expect(400);

		expect(res.body.message).toMatch(/Required/i);
	});

	it("POST /api/auth/login - fail with wrong password", async () => {
		const testUser = {
			name: "LoginFailUser",
			email: getUniqueEmail("loginfail"),
			password: "123456",
			confirmPassword: "123456",
		};

		await request(app).post("/api/auth/register").send(testUser).expect(201);

		const res = await request(app)
			.post("/api/auth/login")
			.send({ email: testUser.email, password: "wrongpassword" })
			.expect(401);

		expect(res.body.message).toMatch(/Невірний email або пароль/i);
	});

	it("POST /api/auth/login - success", async () => {
		const testUser = {
			name: "LoginSuccessUser",
			email: getUniqueEmail("loginsuccess"),
			password: "123456",
			confirmPassword: "123456",
		};

		await request(app).post("/api/auth/register").send(testUser).expect(201);

		const res = await request(app)
			.post("/api/auth/login")
			.send({ email: testUser.email, password: testUser.password })
			.expect(200);

		expect(res.body).toHaveProperty("token");
		expect(res.body.user).toHaveProperty("email", testUser.email);
	});
});
