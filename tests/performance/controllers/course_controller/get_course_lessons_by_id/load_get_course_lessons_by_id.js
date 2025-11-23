import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, defaultHeaders, checkResponse } from '../utils.js';

export let options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '30s', target: 50 },
    { duration: '10s', target: 10 },
  ],
};

export default function () {

   const res = http.get(`${BASE_URL}/1/lessons`, { headers: defaultHeaders });
   check(res, { 'GET /api/courses/1/lessons returns 200': (r) => checkResponse(r, 200) });
  sleep(0.5);
}