import assert from "node:assert/strict";
import test from "node:test";
import worker from "../worker/src/index.js";

const env = {
  GITHUB_CLIENT_ID: "Ov23liI3g6T2kLJCpYso",
  GITHUB_CLIENT_SECRET: "not-used-by-start",
  APP_ORIGIN: "https://raul-s-c.github.io"
};

test("el Worker inicia OAuth con state protegido en cookie", async () => {
  const response = await worker.fetch(new Request("https://example.workers.dev/auth/start"), env);
  const location = new URL(response.headers.get("Location"));

  assert.equal(response.status, 302);
  assert.equal(location.origin, "https://github.com");
  assert.equal(location.pathname, "/login/oauth/authorize");
  assert.equal(location.searchParams.get("client_id"), env.GITHUB_CLIENT_ID);
  assert.equal(location.searchParams.get("scope"), "gist");
  assert.ok(location.searchParams.get("state"));
  assert.match(response.headers.get("Set-Cookie"), /HttpOnly; Secure; SameSite=Lax/);
});

test("el Worker expone un health check sin secretos", async () => {
  const response = await worker.fetch(new Request("https://example.workers.dev/health"), env);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "ok");
});
