const express = require("express");
const cors = require("cors")
const bodyParser = require('body-parser');
const controller = require("./Controller");

const jwtReader = require("../Modules/jwtDecoder")

const Router = express();

Router.use(cors())
Router.use(bodyParser.urlencoded({ extended: true }));
Router.use(express.json());

Router.post("/createTest", jwtReader, controller.createTest);
Router.post("/addRespondent", controller.addRespondent);
Router.post("/removeRespondent", controller.removeRespondent);
Router.post("/getFullTestingData", jwtReader, controller.getFullTestingData);
Router.post("/switchQuestion", jwtReader, controller.switchQuestion);
Router.post("/setAnswer", controller.setAnswer);
Router.post("/checkIfExist", controller.checkIfExist);
Router.post("/getQuestionsCount", controller.getQuestionsCount);
Router.post("/getResult", controller.getResult);
Router.post("/removeTest", jwtReader, controller.removeTest);

module.exports = Router
