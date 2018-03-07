// /* global */
// // eslint-disable-next-line no-unused-vars
// Jacob code read gist https://gist.github.com/cklanac/c721c8121f6880fff3aa72e96ebc047d
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
app.use(express.json());

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

app.put('/api/notes/:id', requestLogger, (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

app.get('/api/notes/:id', requestLogger, (req, res, next) => {
  const id = req.params.id;

  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    else{
      res.json(item);
    }
  });
});  


app.get('/api/notes', requestLogger, (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

// WORK ON THIS LATER
// app.patch('/api/notes/:title', requestLogger, (req, res, next) => {
//   return console.log(req.query.title);
//   // next();
// });

// app.get('/boom', (req, res, next) => {
//   throw new Error('Boom!!');
// });

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
