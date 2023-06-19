const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    googleId : {type: String},
    name: {type: String}
})

module.exports = new model("User", UserSchema)