const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const checkAuth = require('../middleware/checkAuth');

router.get('', checkAuth, async (req, res) => {

    if (req.user) {
        return res.redirect('/dashboard');
    }

    const locals = {
        title: "Blog",
        description: "Sample blog"
    }

    try {
        const data = await Post.find().populate('user');
        res.render('index', { locals, data, currentRoute: '/' });
    } catch (error) {
        console.log(error);
    }

});


router.get('/post/:id', async (req, res) => {


    try {

        let slug = req.params.id;

        const data = await Post.findById({ _id: slug }).populate('user');

        const locals = {
            title: data.title,
            description: "Sample blog",
            currentRoute: `/post/$(slug)`
        }

        res.render('post', { locals, data, currentRoute: '/' });
    } catch (error) {
        console.log(error);
    }

});




// About page

router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    });
});

module.exports = router;