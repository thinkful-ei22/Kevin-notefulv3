'use strict';

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const {PORT, MONGODB_URI } = require('../config');
  
const Note = require('../models/note');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      const searchTerm = req.query.searchTerm;
      if (searchTerm) {
        return Note.find(
          {$or:
            [
              {title: {$regex: searchTerm, $options: 'i'}},
              {content: {$regex: searchTerm, $options: 'i'}}
            ]
          })
          .sort('_id');
      }
      return Note.find({}).sort('_id');
    })
    .then(results => {
      if(results){
        res.json(results);
      }
      else{
        next();
        console.log('hmmm');
      }
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  mongoose.connect(MONGODB_URI)
    .then(() => {
      if(id){
        return Note.findById(id);
      }
      else{
        next();
      }
    })    
    .then(results => {
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      next(err);
    });

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {title, content}= req.body;

  const newItem = {
    title, content
  };

  if(!title){
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  mongoose.connect(MONGODB_URI)
    .then(() => {
      return Note.create(newItem);
    })    
    .then(results => {
      res.location(`${req.originalUrl}/${req.params.id}`).status(201).json(results);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  let upObj;

  if(id){
    upObj= {
      id, 
      title: req.body.title, 
      content: req.body.content
    };
  }
  else{
    next();
  }

  mongoose.connect(MONGODB_URI)
    .then(() => {
      return Note.findByIdAndUpdate(id, {$set: upObj});
    })    
    .then(results => {
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  
  mongoose.connect(MONGODB_URI)
    .then(() => {
      if(id){
        return Note.findByIdAndRemove(id);
      }
      else{
        next();
      }
    })    
    .then(() => {
      res.status(204).end();
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;

  


  

  

