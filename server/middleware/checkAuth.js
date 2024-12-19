const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = process.env.JWT_SECRET;

const checkAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, jwtSecret);
            const user = await User.findById(decoded.userId);
            if (user) {
                req.user = user;
                return res.redirect('/dashboard');
            }
        }
        next();
    } catch (error) {
        console.log(error);
        next();
    }
};

module.exports = checkAuth;