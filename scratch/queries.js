'use strict';
const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

//get all notes w/ or w/out a searchTerm
mongoose.connect(MONGODB_URI)
  .then(() => {
    let searchTerm;
    searchTerm = 'Lady Gaga';
    let filter = {};

    if (searchTerm) {
      filter = searchTerm;
    }

    return Note.find(
      {$or: 
            [
              {title: {$regex: filter}},{content: {$regex: filter}}
            ]
      }
    ).sort('_id');
  })    
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

//find by id
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const id = '000000000000000000000004';
//     return Note.findById(id);
//   })    
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

//post new note
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const newObj = {title: 'haha', content: 'asdfasdfasdfadsf'};
//     return Note.create(newObj);
//   })    
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

//update note
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const id = {_id: '000000000000000000000004'};
//     const upObj = {title: 'morty pride 2019', content: 'asdfasdfasdfadsf'};
//     return Note.findByIdAndUpdate(id, {$set: upObj});
//   })    
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// remove a note
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const id = {_id: '000000000000000000000006'};
//     return Note.findByIdAndRemove(id);
//   })    
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });