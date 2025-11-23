import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from '../../../common/summary.js';
import { BASE_URL, USER_ID, TOKEN } from '../../../common/env.js';

export const options = {
  vus: 50,
  duration: '1h',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  const headers = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };
  const resGet = http.get(`${BASE_URL}/api/user-courses/user/${USER_ID}`, { headers });
  check(resGet, { 'GET /user stable': (r) => r.status === 200 });
  sleep(1);
}
export { handleSummary };