const assert = require("node:assert/strict");
const mongoose = require("mongoose");

process.env.JWT_SECRET = "test-secret";

const app = require("../src/app");
const { initializeDatabase } = require("../src/config/db");

async function run() {
  if (!process.env.MONGODB_URI) {
    console.log("Smoke test skipped: set MONGODB_URI to run API tests");
    return;
  }

  await initializeDatabase();

  const server = app.listen(0);

  await new Promise((resolve) => {
    server.on("listening", resolve);
  });

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthBody = await healthResponse.json();

    assert.equal(healthResponse.status, 200);
    assert.equal(healthBody.status, "ok");

    const email = `student_${Date.now()}@school.com`;

    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test Student",
        email,
        password: "123456",
        role: "student",
      }),
    });

    const registerBody = await registerResponse.json();

    assert.equal(registerResponse.status, 201);
    assert.ok(registerBody.token);
    assert.equal(registerBody.user.email, email);

    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: "123456",
      }),
    });

    const loginBody = await loginResponse.json();

    assert.equal(loginResponse.status, 200);
    assert.ok(loginBody.token);
    assert.equal(loginBody.user.email, email);

    console.log("Smoke test passed");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    await mongoose.connection.close();
  }
}

run().catch((error) => {
  console.error("Smoke test failed");
  console.error(error);
  process.exit(1);
});
