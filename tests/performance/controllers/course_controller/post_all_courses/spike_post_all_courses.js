import http from 'k6/http';
import { sleep, check } from 'k6';
import { BASE_URL, USER_ID, TOKEN, checkResponse } from '../utils.js';

export let options = {
  stages: [
    { duration: '2s', target: 0 },
    { duration: '3s', target: 2000 },
    { duration: '10s', target: 2000 },
    { duration: '2s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'],
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
  });

  const res = http.post(BASE_URL, payload, { headers: defaultHeaders });

  check(res, {
    'POST /api/courses → status 201': (r) =>
      checkResponse(r, 201, 'POST /api/courses'),
  });
}