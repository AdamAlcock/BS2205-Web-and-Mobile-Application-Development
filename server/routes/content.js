const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');

const adminLayout = '../views/layouts/admin';

// Community page - Display all published posts

router.get('/community', authMiddleware, async (req, res) => {
    try {
        const data = await Post.find().populate('user');

        const locals = {
            title: "Community",
            description: "All published posts",
            currentRoute: '/community',
            user : req.user
        }

        res.render('web-content/community', { locals, data, layout: adminLayout, currentRoute: '/community' });
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;