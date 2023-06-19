const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const Controller = require("./Controller")
const jwtDecoder = require("../jwtDecoder")

const Router = express();
Router.use(cors());
Router.use(bodyParser.urlencoded({extended: true}))
Router.use(express.json())

Router.get("/getUserInfo", jwtDecoder, Controller.getUserInfo)

module.exports = Router