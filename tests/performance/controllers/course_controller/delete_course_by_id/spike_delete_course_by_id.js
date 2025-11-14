import http from 'k6/http';
import { sleep, check } from 'k6';
import { BASE_URL, defaultHeaders } from '../utils.js';

export let options = {
    stages: [
        { duration: '5s', target: 20 },
        { duration: '2s', target: 5000 },
        { duration: '5s', target: 200 },
        { duration: '2s', target: 5000 },
        { duration: '5s', target: 300 },
    ],
};

export default function () {
    const courseId = Math.floor(Math.random() * 1000) + 1;
    const res = http.del(`${BASE_URL}/${courseId}`, null, { headers: defaultHeaders });
    check(res, { 'DELETE spike': (r) => [200, 204, 404].includes(r.status) });
    sleep(Math.random() * 5 + 2)
}