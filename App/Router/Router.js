require("dotenv").config()

const express = require("express");
const cors = require("cors")
const cookieSession = require('cookie-session');

const Controller = require("../Controller/Controller");

const Router = express();

const passport = require('passport');
Router.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000, // 1 day 
        keys: [process.env.COOKIESSECRET],
    })
);
Router.use(passport.initialize());
Router.use(passport.session());
Router.use(cors())

Router.get("/", Controller.pageSend)
Router.get("/api", Controller.retrieveData)

module.exports = Router