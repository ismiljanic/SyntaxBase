import http from 'k6/http';
import { sleep, check } from 'k6';
import { BASE_URL, USER_ID, TOKEN, defaultHeaders, checkResponse } from './utils.js';

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

export default function () {
    const res = http.get(BASE_URL, { headers: defaultHeaders });
    check(res, { 'GET /api/courses status 200': (r) => checkResponse(r, 200, 'GET /api/courses') });
}
