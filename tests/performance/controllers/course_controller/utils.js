export const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api/courses';
export const USER_ID = __ENV.USER_ID || 'demo-user';
export const TOKEN = __ENV.TOKEN || '';

export const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(TOKEN ? { 'Authorization': `Bearer ${TOKEN}` } : {}),
};

//export function checkResponse(res, expectedStatus, description) {
//    const result = res.status === expectedStatus;
//    if (!result) {
//        console.error(`${description} failed: status=${res.status} body=${res.body}`);
//    }
//    return result;
//}
export function checkResponse(res, expected, label = '') {
  if (Array.isArray(expected)) {
    return expected.includes(res.status);
  }
  return res.status === expected;
}