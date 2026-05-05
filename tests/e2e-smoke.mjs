import assert from 'node:assert/strict';

const frontendUrl = process.env.E2E_FRONTEND_URL || 'http://localhost:3000';
const backendUrl = process.env.E2E_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

await run('frontend home page is reachable', async () => {
  const response = await fetch(frontendUrl);
  assert.equal(response.ok, true, `Expected ${frontendUrl} to respond successfully`);
});

await run('backend health endpoint is reachable', async () => {
  const response = await fetch(`${backendUrl.replace(/\/$/, '')}/health`);
  assert.equal(response.ok, true, `Expected backend health endpoint to respond successfully`);
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
