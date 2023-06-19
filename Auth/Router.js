require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const passport = require('./passportConfig');
const Controller = require('./Controller');
const UserModel = require('../Database/Schema/User');

const Router = express();
Router.use(cors());
Router.use(bodyParser.urlencoded({ extended: true }));
Router.use(express.json());
Router.get('/login');

Router.use(
    require('cookie-session')({
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        keys: [process.env.COOKIESSECRET],
    })
);

Router.use(passport.initialize());
Router.use(passport.session());

Router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

Router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Authentication successful, redirect or respond as needed
        res.redirect('/');
    }
);

module.exports = Router;
