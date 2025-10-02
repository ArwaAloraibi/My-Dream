const express = require('express');
const router = express.Router();

const User = require('../models/user.js');


// home page router for dreams in the category
router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const category = currentUser.category.id(req.params.id);
    const dreams = category.dream
    if (!category) {
      return res.redirect(`/users/${currentUser._id}/categories`);
    }
    res.render('dreams/new.ejs', { dreams, category, currentUser });
  } catch (err) {
    console.log(err);
    res.redirect(`/users/${req.session.user._id}/categories`);
  }
});

// to add new dream router
router.get('/new', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render(`/categories/${req.body.categoryId}/dreams/new.ejs`, { currentUser });
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

    currentUser.dream.push(req.session);
    // Save changes to the user
    await currentUser.save();
    // Redirect back to a specific category  
res.redirect(`/users/${currentUser._id}/categories/${req.body.categoryId}/dreams`);
  } 
  catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');
  }

});


// to delete a dream
router.delete('/:dreamId', async (req,res)=>{
try{
const currentUser = await User.findById(req.session.user._id);
currentUser.dream.id(req.params.dreamId).deleteOne();
await currentUser.save();
res.redirect(`/users/${currentUser._id}/dreams`);

}catch(error) {
    console.log(error);
    res.redirect('/');
}
});

// Edit route
router.get('/:dreamId/edit', async (req, res) => {
try{
const currentUser = await User.findById(req.session.user._id);
const dream = currentUser.dream.id(req.params.dreamId);
res.render('dreams/edit.ejs',{
    dream: dream,
});
}catch(error) {
    console.log(error);
    res.redirect('/');
}
});


// show the update on the page
router.put('/:dreamId', async (req, res) => {
try{
const currentUser = await User.findById(req.session.user._id);
const dream = currentUser.dream.id(req.params.dreamId);
dream.set(req.body);
await currentUser.save();
res.redirect(`/users/${currentUser._id}/dreams`);
}catch(error){
console.log(error);
res.redirect('/');
}
});

// show dream's details
router.get('/:dreamId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const dream = currentUser.dream.id(req.params.dreamId);
    res.render('dreams/show.ejs', { dream, currentUser });
  } 
  catch (err) {
    console.log(err);
    res.redirect(`/dreams/${req.params.userId}/dreams`);
  }
});


module.exports = router;