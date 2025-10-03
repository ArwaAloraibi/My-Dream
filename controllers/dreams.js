const express = require('express');
const router = express.Router();

const User = require('../models/user.js');



// delete dream
router.delete('/:dreamId', async (req,res)=>{
try{
const currentUser = await User.findById(req.session.user._id);
currentUser.dream.id(req.params.dreamId).deleteOne();
 const category = currentUser.category.id(req.params.id);

    // if there is no category go out
    if (!category) {
      return res.redirect(`/users/${currentUser._id}/categories`);
    }

await currentUser.save();
res.redirect(`/users/${currentUser._id}/dreams`);

}catch(error) {
    console.log(error);
    res.redirect('/');
}
});

// Edit dream
router.get('/:dreamId/edit', async (req, res) => {
try{
const currentUser = await User.findById(req.session.user._id);
const category = currentUser.category.id(req.params.id);

// fetch the dream 
const dream = category.dream.id(req.params.dreamId);
const dreams = category.dream

if (!category) {
      return res.redirect(`/users/${currentUser._id}/categories`);
    }


res.render('dreams/edit.ejs', { dream, category, currentUser });

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



module.exports = router;