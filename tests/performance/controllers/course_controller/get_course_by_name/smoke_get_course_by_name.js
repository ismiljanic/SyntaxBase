import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, defaultHeaders, checkResponse } from '../utils.js';

export let options = {
  vus: 5,
  duration: '10s',
};

export default function () {
  const courseName = encodeURIComponent("beginner web course");

  const res = http.get(`${BASE_URL}/name/${courseName}`, { headers: defaultHeaders });
  check(res, { 'GET /api/courses/name/{name} returns 200': (r) => checkResponse(r, 200) });
  sleep(1);
}