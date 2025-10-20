import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from '../../common/summary.js';

export const options = {
  vus: 10,
  duration: '10s',
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const USER_ID = __ENV.USER_ID || 'demo-user';
const TOKEN = __ENV.TOKEN;

if (!TOKEN) {
  throw new Error('No TOKEN provided. Use -e TOKEN="..." when running k6.');
}

export default function () {
  const headers = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

  const resGet = http.get(`${BASE_URL}/api/user-courses/user/${USER_ID}`, { headers });
  check(resGet, { 'GET /user 200': (r) => r.status === 200 });

  const payload = JSON.stringify({ auth0UserId: USER_ID, courseId: 1 });
  const resPost = http.post(`${BASE_URL}/api/user-courses/startCourse`, payload, { headers });
  check(resPost, { 'POST /startCourse handled': (r) => [200, 400, 403, 409].includes(r.status) });

  sleep(1);
}

export { handleSummary };