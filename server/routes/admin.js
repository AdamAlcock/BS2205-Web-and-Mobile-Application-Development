const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;


// Multer config
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
    destination: './public/img/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}


// Check login middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user; // Attach user to req object
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};




// Get the admin page
router.get('/admin', async (req, res) => {


    try {
        const locals = {
            title: "Admin",
            description: "Admin permissions"
        }

        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }

});


router.post('/admin', async (req, res) => {


    try {

        const { username, password } = req.body;
        
        const user = await User.findOne( { username } );
        
        if(!user) {
            return res.status(401).json( {message: 'Invalid credentials' } );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json( {message: 'Invalid credentials' } );
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret);
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard')
        
    } catch (error) {
        console.log(error);
    }

});


// Admin dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: "Dashboard",
            description: "Admin interface",
            user: req.user
        }

        const data = await Post.find({ user: req.user._id }).populate('user');
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});


// admin create new post

router.get('/add-post', authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: "Add Post",
            description: "Admin posting"
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});


// POST create new post
router.post('/add-post', authMiddleware, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            res.redirect('/add-post');
        } else {
            if (req.file == undefined) {
                console.log('No file selected');
                res.redirect('/add-post');
            } else {
                try {
                    const newPost = new Post({
                        title: req.body.title,
                        body: req.body.body,
                        image: `/img/${req.file.filename}`,
                        user: req.user._id
                    });

                    await Post.create(newPost);
                    res.redirect('/dashboard');
                } catch (error) {
                    console.log(error);
                }
            }
        }
    });
});



// GET create new post

router.get('/edit-post/:id', authMiddleware, async (req, res) => {

    try {


        const locals = {
            title: "Edit post",
            description: "Post Management"
        };

        const data = await Post.findOne({ _id: req.params.id});

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })


    } catch (error) {
        console.log(error);
    }

});


// PUT admin create new post

router.put('/edit-post/:id', authMiddleware, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            res.redirect(`/edit-post/${req.params.id}`);
        } else {
            try {
                const updateData = {
                    title: req.body.title,
                    body: req.body.body,
                    updatedAt: Date.now()
                };

                if (req.file) {
                    updateData.image = `/img/${req.file.filename}`;
                }

                await Post.findByIdAndUpdate(req.params.id, updateData);

                res.redirect('/dashboard');
            } catch (error) {
                console.log(error);
            }
        }
    });
});





router.post('/register', async (req, res) => {


    try {

        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword })
            res.status(201).json({ message: 'User created', user });

        } catch (error) {
            if(error.code === 11000) {
                res.status(409).json({ message: 'User already in use', user });
            }
            res.status(500).json({ message: 'Internal server error'})
        }
    } catch (error) {
        console.log(error);
    }

});


// DELETE post

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            // Delete the image file
            const imagePath = path.join(__dirname, '../../public', post.image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(`Failed to delete image file: ${err}`);
                } else {
                    console.log(`Image file deleted: ${imagePath}`);
                }
            });

            // Delete the post from the database
            await Post.findByIdAndDelete(req.params.id);
        }

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.redirect('/dashboard');
    }
});


/**
 * GET admin logout
 */ 
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful'});
    res.redirect('/');
})




module.exports = router;