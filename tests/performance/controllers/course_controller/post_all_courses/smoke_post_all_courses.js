import http from 'k6/http';
import { sleep, check } from 'k6';
import { BASE_URL, USER_ID, TOKEN, checkResponse } from '../utils.js';

export let options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 500 },
    { duration: '30s', target: 100 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    checks: ['rate>0.95'],
  },
};

const defaultHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

export default function () {
  const payload = JSON.stringify({
    userId: USER_ID,
  });

  const res = http.post(BASE_URL, payload, { headers: defaultHeaders });

  check(res, {
    'POST /api/courses → status 200 or 201': (r) =>
      checkResponse(r, [200, 201], 'POST /api/courses'),
  });

  sleep(Math.random() * 2 + 1);
}