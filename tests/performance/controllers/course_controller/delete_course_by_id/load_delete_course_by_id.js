import http from 'k6/http';
import { sleep, check } from 'k6';
import { BASE_URL, defaultHeaders } from '../utils.js';

export let options = {
    stages: [
        { duration: '20s', target: 20 },
        { duration: '1m', target: 2000 },
        { duration: '20s', target: 0 },
    ],
};

export default function () {
    const courseId = Math.floor(Math.random() * 500) + 1;
    const res = http.del(`${BASE_URL}/${courseId}`, null, { headers: defaultHeaders });
    check(res, { 'DELETE load': (r) => [200, 204, 404].includes(r.status) });
    sleep(Math.random() * 5 + 2)
}
