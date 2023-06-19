const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const Controller = require("./Controller")

const Router = express();
Router.use(cors());
Router.use(bodyParser.urlencoded({extended: true}))
Router.use(express.json())

module.exports = Router