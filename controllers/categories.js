const express = require('express');
const router = express.Router();

const User = require('../models/user.js');


// home page router
router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render('categories/index.ejs', {
      currentUser: currentUser,         
      categories: currentUser.category,  
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


// to add new dream router
router.get('/new', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render('categories/new.ejs', { currentUser });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


// with this route, dreams will be added to the database 
router.post('/', async (req, res)=>{

     try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    currentUser.category.push(req.body);
    // Save changes to the user
    await currentUser.save();
    // Redirect back to the dreams index view
    res.redirect(`/users/${currentUser._id}/categories`);
  } 
  catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');
  }

});


// to delete a dream
router.delete('/:categoryId', async (req,res)=>{
try{
const currentUser = await User.findById(req.session.user._id);
currentUser.category.id(req.params.categoryId).deleteOne();
await currentUser.save();
res.redirect(`/users/${currentUser._id}/categories`);

}catch(error) {
    console.log(error);
    res.redirect('/');
}
});

// Edit route
router.get('/:categoryId/edit', async (req, res) => {
try{
const currentUser = await User.findById(req.session.user._id);
const category = currentUser.category.id(req.params.categoryId);
res.render('categories/edit.ejs',{
    currentUser, 
    category,
});
}catch(error) {
    console.log(error);
    res.redirect('/');
}
});


// show the update on the page
router.put('/:categoryId', async (req, res) => {
try{
const currentUser = await User.findById(req.session.user._id);
const category = currentUser.category.id(req.params.categoryId);
category.set(req.body);
await currentUser.save();
res.redirect(`/users/${currentUser._id}/categories`);
}catch(error){
console.log(error);
res.redirect('/');
}
});

// show dream's details
router.get('/:categoryId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const category = currentUser.category.id(req.params.categoryId);

    res.render('categories/show.ejs', { 
      currentUser, 
      category,
      dreams: currentUser.dream.filter(d => d.categoryId?.toString() === category._id.toString())
    });
  } catch (err) {
    console.log(err);
    res.redirect(`/users/${currentUser._id}/categories`);
  }
});


module.exports = router;