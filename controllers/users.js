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

router.get('/:id', async (req, res) => {
try {
    const currentUser = await User.findById(req.session.user._id);
    const user = await User.findById(req.params.id);
    res.render('users/show.ejs',{
        user,
        currentUser,
    });
} catch(error){
    console.log(error);
    res.redirect('/');
}
});

module.exports = router;