import http from 'k6/http';
import { sleep, check } from 'k6';
import { BASE_URL, USER_ID, TOKEN, defaultHeaders, checkResponse } from '../utils.js';

export let options = {
    stages: [
        { duration: '30s', target: 100 },
        { duration: '1m', target: 500 },
        { duration: '30s', target: 100 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
        'checks': ['rate>0.95'],
    },
};

export default function () {
    const res = http.get(BASE_URL, { headers: defaultHeaders });
    check(res, { 'GET /api/courses status 200': (r) => checkResponse(r, 200, 'GET /api/courses') });
    sleep(Math.random() * 2 + 1);
}

export function handleSummary(data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return {
    [`./tests/performance/results/summary_load_get_all_courses_${timestamp}.json`]: JSON.stringify(data, null, 2),
  };
}