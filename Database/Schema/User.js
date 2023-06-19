const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    googleId : {type: String},
    name: {type: String, required: true},
    photo: {type: String, required: true}
})

module.exports = new model("User", UserSchema)