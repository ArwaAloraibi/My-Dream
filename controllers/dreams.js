const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render('dreams/index.ejs', {
      currentUser: currentUser,         
      dreams: currentUser.dream,  
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/new', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render('dreams/new.ejs', { currentUser });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


// with this route, dreams will be added to the database though it wont be shown to the user
router.post('/', async (req, res)=>{

     try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);

    currentUser.dream.push(req.body);
    // Save changes to the user
    await currentUser.save();
    // Redirect back to the dreams index view
    res.redirect(`/users/${currentUser._id}/dreams`);
  } 
  catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');
  }

});



module.exports = router;