import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, USER_ID, TOKEN, defaultHeaders, checkResponse } from '../utils.js';

export let options = {
    vus: 5,
    duration: '10s',
};

export default function () {
    const res = http.get(BASE_URL, { headers: defaultHeaders });
    check(res, { 'GET /api/courses status 200': (r) => checkResponse(r, 200, 'GET /api/courses') });
    sleep(1);
}