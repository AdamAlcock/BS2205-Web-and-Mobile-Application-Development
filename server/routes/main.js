const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('', async (req, res) => {
    const locals = {
        title: "Blog",
        description: "Sample blog"
    }

    try {
        const data = await Post.find();
        res.render('index', { locals, data, currentRoute: '/' });
    } catch (error) {
        console.log(error);
    }

});


router.get('/post/:id', async (req, res) => {


    try {

        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });

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









router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    });
});

module.exports = router;