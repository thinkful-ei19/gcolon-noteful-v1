// /* global */
// // eslint-disable-next-line no-unused-vars
// Jacob code read gist https://gist.github.com/cklanac/c721c8121f6880fff3aa72e96ebc047d
'use strict';

const express = require('express');
const app = express();
const morgan = require('morgan');

const notesRouter = require('./router/notes.router');

console.log('This is George!');

// INSERT EXPRESS APP CODE HERE...

const { PORT } = require('./config');
app.use('/api', notesRouter);

// Log all requests
app.use(morgan('dev'));
// Create a static webserver
app.use(express.static('public'));
app.use(express.json());

// function requestLogger(req, res, next) {
//   const date = new Date();
//   console.log(
//     `${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${req.method} ${req.url}`);
//   next();
// }

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
