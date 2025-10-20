import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from '../../common/summary.js';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '30s', target: 300 },
    { duration: '30s', target: 500 },
    { duration: '1m', target: 1000 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    'checks': ['rate>0.95'],
    http_req_duration: ['p(95)<1000']
  }
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const USER_ID = __ENV.USER_ID || 'demo-user';
const TOKEN = __ENV.TOKEN;

export default function () {
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };

  const payload = JSON.stringify({
    auth0UserId: USER_ID,
    courseId: Math.floor(Math.random() * 10) + 1,
  });

  const res = http.post(`${BASE_URL}/api/user-courses/startCourse`, payload, { headers });

  check(res, { 'status is 2xx or handled': (r) => r.status >= 200 && r.status < 500 });

  sleep(0.2);
}

export { handleSummary };