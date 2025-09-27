const express =require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
try {
const currentUser = await User.findById(req.session.user._id);
const users = await User.find({});
res.render('users/index.ejs', {
    users: users,
    currentUser: currentUser,
});
} catch(error){
    console.log(error);
    res.redirect('/');
}
});

// to show specific dream's details
router.get('/:id', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const user = currentUser.dream.id(req.params.dreamId);
    res.render('users/show.ejs', { user, currentUser });
  } 
  catch (err) {
    console.log(err);
    res.redirect(`/users/${req.params.userId}/users`);
  }
});


module.exports = router;