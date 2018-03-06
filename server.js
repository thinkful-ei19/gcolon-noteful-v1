// 'use strict';
// /* global */
// // eslint-disable-next-line no-unused-vars
// Jacob code
'use strict';

const { PORT } = require('./config');

// TEMP: Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

console.log('This is George!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const app = express();
app.use(express.static('public'));

function requestLogger(req, res, next) {
  const date = new Date();
	console.log(
    `${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
}

app.get('/api/notes', requestLogger, (req, res) => {

  const searchTerm = req.query.searchTerm;
  if (searchTerm){
    let filteredList = data.filter(function (item){
      return item.title.includes(searchTerm);
    });
    res.json(filteredList);
  } else {
    res.json(data);
  }
});

app.get('/api/notes/:id', (req, res) => {
  res.json(data.find(item => item.id === Number(req.params.id)));
});

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

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


