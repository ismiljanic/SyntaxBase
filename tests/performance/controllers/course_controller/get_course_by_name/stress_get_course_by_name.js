import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, TOKEN, defaultHeaders, checkResponse } from '../utils.js';

export let options = {
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

export default function () {
    const courseName = encodeURIComponent("beginner web course");

    const res = http.get(`${BASE_URL}/name/${courseName}`, { headers: defaultHeaders });
    check(res, { 'GET /api/courses/name/{name} returns 200': (r) => checkResponse(r, 200) });
}

export function handleSummary(data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return {
    [`./tests/performance/results/summary_stress_get_courses_by_name_${timestamp}.json`]: JSON.stringify(data, null, 2),
  };
}