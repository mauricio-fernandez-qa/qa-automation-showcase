// Load test for the catalog API with k6. Kept deliberately light: the target is a free public demo, not our server.
// Run: k6 run perf/products-load.js   (API_URL overrides the default)
import http from 'k6/http';
import { check, sleep } from 'k6';

const API_URL = __ENV.API_URL || 'https://api.practicesoftwaretesting.com';
const SEARCH_TERM = 'hammer';
const THINK_TIME_SECONDS = 1;

export const options = {
  stages: [
    { duration: '15s', target: 5 }, // ramp up
    { duration: '30s', target: 5 }, // steady load
    { duration: '10s', target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // less than 1% errors
    http_req_duration: ['p(95)<1500'], // 95% of requests under 1.5 s
    checks: ['rate>0.99'],
  },
};

export default function () {
  const list = http.get(`${API_URL}/products?page=1`, { tags: { name: 'GET /products' } });
  check(list, {
    'list: status 200': (r) => r.status === 200,
    'list: has products': (r) => r.json('data').length > 0,
  });

  const search = http.get(`${API_URL}/products/search?q=${SEARCH_TERM}`, { tags: { name: 'GET /products/search' } });
  check(search, { 'search: status 200': (r) => r.status === 200 });

  sleep(THINK_TIME_SECONDS);
}
