require("dotenv").config()

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const passport = require('passport');
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const Controller = require("./Controller");
const UserModel = require("../Database/Schema/User");

const Router = express();
Router.use(cors());
Router.use(bodyParser.urlencoded({ extended: true }))
Router.use(express.json());

Router.get("/login")

// Configure session cookies
Router.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000, // 1 day 
        keys: [process.env.COOKIESSECRET],
    })
);

// Initialize Passport.js
Router.use(passport.initialize());
Router.use(passport.session());

// Configure Passport.js Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLECLIENTID,
            clientSecret: process.env.GOOGLECLIENTSECRET,
            callbackURL: '/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            UserModel.findOne({ googleId: profile.id }).then((existingUser) => {
                if (existingUser) {
                    done(null, existingUser);
                } else {
                    new UserModel({
                        googleId: profile.id,
                        displayName: profile.displayName,
                    })
                        .save()
                        .then((user) => done(null, user));
                }
            });
        }
    )
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id).then((user) => {
        done(null, user);
    });
});

Router.get("/google", passport.authenticate('google', {
    scope: ['profile'], // Add additional scopes as needed
}))


Router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Authentication successful, redirect or respond as needed
    res.redirect('/');
});

module.exports = Router