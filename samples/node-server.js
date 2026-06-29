const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Hello World');
});

server.listen(3000);

// const server = http.createServer((req, res) => {
//   if (req.method === 'GET' && req.url === '/users') {
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ message: 'Users fetched' }));
//   }
// });
