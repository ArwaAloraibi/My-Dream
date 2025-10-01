const {dream} = require('express');
const {category} = require('express');
const mongoose = require('mongoose');



const dreamSchema = new mongoose.Schema({

  dream: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

   status: {
    type: String,
    enum: ['Working_On', 'Done'],
  },

  //  categoryId: {
  //   type: mongoose.Schema.Types.ObjectId, 
  //   required: true,
  // },


});

const categorySchema = new mongoose.Schema({

  name: {
    type: String,
    required: true

  },
  
    dream: [dreamSchema],

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

  category: [categorySchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
