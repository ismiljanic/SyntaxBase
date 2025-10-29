import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from '../../common/summary.js';

export const options = {
  stages: [
    { duration: '1m', target: 400 },
    { duration: '3m', target: 400 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'],
   'checks': ['rate>0.95'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const USER_ID = __ENV.USER_ID || 'demo-user';
const TOKEN = __ENV.TOKEN;

export default function () {
  const headers = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

  const payload = JSON.stringify({ auth0UserId: USER_ID, courseId: Math.floor(Math.random() * 10) + 1 });
  const resPost = http.post(`${BASE_URL}/api/user-courses/startCourse`, payload, { headers });
  check(resPost, { 'POST /startCourse <800ms': (r) => r.timings.duration < 800 });

  const resGet = http.get(`${BASE_URL}/api/user-courses/user/${USER_ID}`, { headers });
  check(resGet, { 'GET /user <800ms': (r) => r.timings.duration < 800 });

  sleep(1);
}
export { handleSummary };