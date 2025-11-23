import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, USER_ID, TOKEN, checkResponse } from '../utils.js';

export let options = {
    vus: 1,
    duration: '5s',
};

const defaultHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

const COURSE_ID = __ENV.COURSE_ID || '1';

export default function () {
    const res = http.del(`${BASE_URL}/${COURSE_ID}`, null, { headers: defaultHeaders });
    console.log(`DELETE Status: ${res.status}`);
    console.log(`DELETE Body: ${res.body}`);
    check(res, {
        'DELETE /api/courses/{id} status 200/204/404/500': (r) => [200, 204, 404, 500].includes(r.status)
    });
}