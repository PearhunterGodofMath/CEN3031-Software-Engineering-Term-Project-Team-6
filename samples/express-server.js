const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000);

// app.get('/users', (req, res) => {
//   res.json({ message: 'Users fetched' });
// });