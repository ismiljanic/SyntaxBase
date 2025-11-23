import http from 'k6/http';
import { sleep, check } from 'k6';
import { BASE_URL, USER_ID, TOKEN, checkResponse } from '../utils.js';

export const options = {
  stages: [
    { duration: '5s', target: 100 },
    { duration: '5s', target: 300 },
    { duration: '5s', target: 500 },
    { duration: '5s', target: 1000 },
    { duration: '5s', target: 2000 },
    { duration: '5s', target: 1000 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.2'],
  },
};

const defaultHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

export default function () {
  const payload = JSON.stringify({
    userId: USER_ID,
    courseName: `LoadTestCourse-${__VU}-${__ITER}`,
    description: 'Automated load test course creation',
    category: 'testing',
    length: Math.floor(Math.random() * 10) + 1,
  });

  const res = http.post(BASE_URL, payload, { headers: defaultHeaders });

  check(res, {
    'POST /api/courses → status 200 or 201': (r) =>
      checkResponse(r, [200, 201], 'POST /api/courses'),
  });
  sleep(Math.random() * 5 + 2);
}