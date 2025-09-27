const {dream} = require('express');
const mongoose = require('mongoose');

const dreamSchema = new mongoose.Schema({

  dream: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  category:{
    type: String,
    enum: ["Academic_Star", "Job_Star", "Language_star", "Matrialistic_Star", "Skills_Star"],
  },

   status: {
    type: String,
    enum: ['Working_On', 'Done'],
  },

});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  dream: [dreamSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
