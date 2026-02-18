import request from "supertest";
import { createApp } from "../appFactory";
import { connectTestDb, clearTestDb, disconnectTestDb } from "./testDb";

const app = createApp();

function uniqueEmail() {
  return `user_${Date.now()}@clinic.com`;
}

describe("Core flow", () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  it("register -> token", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: uniqueEmail(), password: "SenhaForte123" });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
  });

  it("create appointment and conflict 409", async () => {
    const email = uniqueEmail();

    const reg = await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email, password: "SenhaForte123" });

    const token = reg.body.token as string;

    const date = "2026-02-20";
    const time = "15:00";

    const created = await request(app)
      .post("/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send({ date, time });

    expect(created.status).toBe(201);

    const conflict = await request(app)
      .post("/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send({ date, time });

    expect(conflict.status).toBe(409);
  });
});
