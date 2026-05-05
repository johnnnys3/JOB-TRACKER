import assert from 'node:assert/strict';

const backendUrl = (process.env.E2E_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002').replace(/\/$/, '');
const requestCount = Number(process.env.LOAD_SMOKE_REQUESTS || 25);

await run('backend health endpoint handles repeated requests', async () => {
  const startedAt = Date.now();
  const responses = await Promise.all(
    Array.from({ length: requestCount }, () => fetch(`${backendUrl}/health`)),
  );
  const durationMs = Date.now() - startedAt;

  assert.equal(responses.every(response => response.ok), true);
  assert.equal(durationMs < 5000, true, `Expected ${requestCount} health requests under 5s, got ${durationMs}ms`);
});

async function run(name, assertion) {
  try {
    await assertion();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}
