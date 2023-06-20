const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    googleId : {type: String},
    name: {type: String, required: true},
    photo: {type: String},
    email: {type: String, required: true},
    photoFile: {data: Buffer, contentType: String},
    password: {type: String}
})

module.exports = new model("User", UserSchema)