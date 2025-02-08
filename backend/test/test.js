const autocannon = require('autocannon');

const url = 'http://localhost:4000';

const routes = [
  { path: '/', method: 'GET' },
  { path: '/login', method: 'POST' },
  { path: '/signup', method: 'POST' },
  { path: '/logout', method: 'POST' },
  { path: '/verify-email', method: 'POST' },
  { path: '/forgot-password', method: 'POST' },
  { path: '/reset-password/some-token', method: 'POST' },
  { path: '/check-auth', method: 'GET' }
];

routes.forEach(route => {
  try {
    autocannon({
      url: `${url}${route.path}`,
      method: route.method,
      connections: 10, // default
      duration: 30 // 30 seconds
    }, (err, result) => {
      if (err) {
        console.error(`Error testing ${route.path}:`, err);
      } else {
        console.log(`Tested ${route.path} with method ${route.method}`);
        console.log(`Duration: ${result.duration} seconds`);
        console.log(`Total Requests: ${result.requests.total}`);
      }
    });
  } catch (error) {
    console.error(`Exception testing ${route.path}:`, error);
  }
});