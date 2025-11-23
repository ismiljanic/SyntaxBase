import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const USER_ID = __ENV.USER_ID || 'demo-user';
const TOKEN = __ENV.TOKEN;

export let options = {
    stages: [
        { duration: '2s', target: 0 },
        { duration: '3s', target: 2000 },
        { duration: '5s', target: 2000 },
        { duration: '2s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        'checks': ['rate>0.95'],
    },
};

export default function () {
    const headers = {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
    };

    const payload = JSON.stringify({
        auth0UserId: USER_ID,
        courseId: Math.floor(Math.random() * 20) + 1,
    });

    const res = http.post(`${BASE_URL}/api/user-courses/startCourse`, payload, { headers });

    check(res, {
        'status is 2xx or handled': (r) => r.status >= 200 && r.status < 500,
    });
}
