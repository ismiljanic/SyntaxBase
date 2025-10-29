import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, TOKEN, defaultHeaders, checkResponse } from '../utils.js';

export let options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 10 },
    ],
    thresholds: {
       http_req_duration: ['p(95)<500'],
       'checks': ['rate>0.95'],
   },
};

const COURSE_ID = __ENV.COURSE_ID || '1';

export default function () {
    const res = http.get(`${BASE_URL}/${COURSE_ID}`, { headers: defaultHeaders });
    check(res, { 'GET /api/courses/{id} status 200': (r) => checkResponse(r, 200, 'GET /api/courses/{id}') });
}