const { Schema, model } = require("mongoose");

const TestSchema = new Schema({
    code: {type: String, required: true, unique: true},
    questions: {type: Array, required: true},
    initiatorId: {type: String, required: true},
    respondents: {type: Array},
    questionId: {type: String},
    testIdInUser: {type: String, required: true}
})

module.exports = new model("Test", TestSchema)