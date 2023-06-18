const express = require("express");
const Controller = require("../Controller/Controller")

const Router = express();

Router.get("/", Controller.pageSend)

module.exports = Router