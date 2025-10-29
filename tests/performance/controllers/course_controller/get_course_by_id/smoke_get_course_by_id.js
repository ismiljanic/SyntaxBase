import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, TOKEN, defaultHeaders, checkResponse } from '../utils.js';

export let options = {
    vus: 5,
    duration: '10s',
};

const COURSE_ID = __ENV.COURSE_ID || '1';

export default function () {
    const res = http.get(`${BASE_URL}/${COURSE_ID}`, { headers: defaultHeaders });
    check(res, { 'GET /api/courses/{id} status 200': (r) => checkResponse(r, 200, 'GET /api/courses/{id}') });
}