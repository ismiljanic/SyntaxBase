import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, defaultHeaders, checkResponse } from '../utils.js';

export let options = {
  vus: 5,
  duration: '10s',
};

export default function () {

  const res = http.get(`${BASE_URL}/1/lessons`, { headers: defaultHeaders });
  check(res, { 'GET /api/courses/1/lessons returns 200': (r) => checkResponse(r, 200) });
  sleep(1);
}