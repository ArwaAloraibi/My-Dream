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

router.get('/:categoryId/dreams/new', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render(`dreams/new.ejs`, { currentUser });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


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



// update on the page
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


// Show category by id
router.get('/:id', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const category = currentUser.category.id(req.params.id);
    if (!category) {
      return res.redirect(`/users/${currentUser._id}/categories`);
    }
    res.render('categories/show.ejs', { category, currentUser });
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${req.session.user._id}/categories`);
  }
});

// show dream inside category by dream id and category id
router.get('/:id/dreams/:dreamId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const category = currentUser.category.id(req.params.id);

    // if there is no category go out
    if (!category) {
      return res.redirect(`/users/${currentUser._id}/categories`);
    }
    //fetch the dream by id 
    const dream = category.dream.id(req.params.dreamId);
    
    // now render the page where the dream's details
    res.render('dreams/show.ejs', { dream, category, currentUser });
  } catch (err) {
    console.log(err);
    res.redirect(`/users/${req.session.user._id}/categories`);
  }
});



// add dreams in a category
router.get('/:id/dreams', async (req, res) => {
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


// update the newly added dream
router.post('/:id/dreams', async (req, res) => {
     try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    const category = currentUser.category.id(req.params.id);
    const dreams = category.dream;

    if (!category) {
      return res.redirect(`/users/${currentUser._id}/categories`);
    }

      //  after i add this now i can see the added dream inside the category 
      category.dream.push(req.body);

    // Save changes to the user
    await currentUser.save();
    // Redirect back to categories/show.ejs to view dreams in the category
    res.redirect(`/users/${currentUser._id}/categories/${category._id}`);
  } 
  catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect(`/users/${req.session.user._id}/categories`);
  }

});

// edit a dream inside a category
router.get('/:categoryId/dreams/:dreamId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const category = currentUser.category.id(req.params.categoryId);

    if (!category) {
      return res.redirect(`/users/${currentUser._id}/categories`);
    }

    const dream = category.dream.id(req.params.dreamId);

    if (!dream) {
      return res.redirect(`/users/${currentUser._id}/categories/${category._id}`);
    }

    res.render('dreams/edit.ejs', { dream, category, currentUser });

  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// update the edited dream's details
router.put('/:categoryId/dreams/:dreamId', async(req, res) => {

    try {
    const currentUser = await User.findById(req.session.user._id);
    const category = currentUser.category.id(req.params.categoryId);

    if (!category) {
      return res.redirect(`/users/${currentUser._id}/categories`);
    }

    // fetch the dream that you want to edit
    const dream = category.dream.id(req.params.dreamId);
 
    if (!dream) {
      return res.redirect(`/users/${currentUser._id}/categories/${category._id}`);
    }
     dream.set({
      dream: req.body.dream,
      description: req.body.description,
      status: req.body.status
    });

    // Save changes to the user
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/categories/${category._id}/dreams/${dream._id}`);
  } 
  catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect(`/users/${req.session.user._id}/categories`);
  }

});


// delete a dream that is inside a category
router.delete('/:categoryId/dreams/:dreamId', async (req,res)=>{
try{
 const currentUser = await User.findById(req.session.user._id);
 const category = currentUser.category.id(req.params.categoryId);

    if (!category) {
      return res.redirect(`/users/${currentUser._id}/categories`);
    }

    // fetch the dream that you want to edit
    const dream = category.dream.id(req.params.dreamId);
 
    if (!dream) {
      return res.redirect(`/users/${currentUser._id}/categories/${category._id}`);
    }

dream.deleteOne();
await currentUser.save();
res.redirect(`/users/${currentUser._id}/categories/${category._id}`);

}catch(error) {
    console.log(error);
    res.redirect('/');
}
});



module.exports = router;