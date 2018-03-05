// 'use strict';
// /* global */

// // eslint-disable-next-line no-unused-vars

// const data = require('./db/notes');
// const simDB = require('./db/simDB');
// const notes = simDB.initialize(data);

// const express = require('express');
// const app = express();
// app.use(express.static('public'));

// // TEMP: Simple In-Memory Database

// console.log('My name is George!');

// // INSERT EXPRESS APP CODE HERE...
// app.get('/api/notes', (req, res) => {
//   const searchTerm = req.query.searchTerm;
//   console.log(searchTerm);
//   res.json(data);
// });

// app.get('/api/notes/:id', (req, res) => {
//   console.log(req.params.id);
//   res.json(data.find(item => item.id === Number(req.params.id)));
// });

// app.listen(8080, function () {
//   console.info(`Server listening on ${this.address().port}`);
// }).on('error', err => {
//   console.error(err);
// });
// Jacob 

'use strict';

// TEMP: Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const app = express();
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {

	const searchTerm = req.query.searchTerm;
  console.log(searchTerm);
  const searchArray = data.filter(element => { 
    //element.includes(searchTerm); 
    console.log();
    const searchTitle = element.title;
    const searchContent = element.content;
    if (searchContent.includes(searchTerm) || searchTitle.includes(searchTerm)){
      return true;
    } else {
      return false;
    }

	});
	console.log(searchArray);
  res.json(searchArray);
});

app.get('/api/notes/:id', (req, res) => {
  res.json(data.find(item => item.id === Number(req.params.id)));
});

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});


