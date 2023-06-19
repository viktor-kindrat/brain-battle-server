require("dotenv").config()

const express = require("express");
const cors = require("cors")
const cookieSession = require('cookie-session');

const Controller = require("../Controller/Controller");

const Router = express();

Router.use(cors())

Router.get("/", Controller.pageSend)

module.exports = Router