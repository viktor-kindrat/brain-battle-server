require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtsecret = process.env.JWTSECRET;
let fs = require("fs");

const UserSchema = require("../Database/Schema/User");
const User = require("../Database/Schema/User");

// const UserSchema = new Schema({
//     googleId : {type: String},
//     name: {type: String, required: true},
//     photo: {type: String},
//     email: {type: String, required: true},
//     photoFile: {data: Buffer, contentType: String}
//     password
// })

class Controller {
    callbackGoogle(req, res) {
        const data = { id: req.user._id }
        const token = jwt.sign(data, jwtsecret, { expiresIn: "1d" }) 
        const redirectURL = "https://brainbattle.pp.ua/?token=" + token;
        res.redirect(redirectURL);
    }
    async login(req, res) {
        const data = req.body;
        if (data.email && data.password) {
            const User = await UserSchema.findOne({ email: data.email })
            if (User) {
                if (User.password = data.password) {
                    res.json({ status: "ok", token: jwt.sign({ id: User._id }, jwtsecret, { expiresIn: "1d" }) })
                } else {
                    res.json({ status: "Password incorrect. Try again" })
                }
            } else {
                res.json({ status: "User not found. Register new account" })
            }
        } else {
            res.json({ status: "Invalid data" })
        }
    }
    async register(req, res) {
        const image = req.file;
        const data = req.body;

        const exist = await UserSchema.findOne({ email: data.email });

        if (exist) {
            res.json({ status: "exists", exist: true })
        } else {
            let newUser;
            if (image) {
                newUser = await new UserSchema({
                    photoFile: {
                        data: fs.readFileSync(image.path),
                        contentType: image.mimetype,
                    },
                    name: data.name,
                    email: data.email,
                    password: data.password,
                })
            } else {
                newUser = await new UserSchema({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                })
            }
            newUser.save()
            res.json({ status: "ok", exist: false, token: jwt.sign({ id: newUser._id }, jwtsecret, { expiresIn: "1d" }) })
        }
    }
    async changeParametr(req, res) {
        let data = req.jwtResult.id;
        let changes = req.body;
        if (data) {
            const User = await UserSchema.findOne({ _id: data });
            if (data.email) {
                const exists = UserSchema.findOne({ email: data.email });
                if (exists) {
                    res.json({ status: "User with the same email already exist" })
                } else {
                    await Object.keys(changes).forEach(key => {
                        User[key] = changes[key]
                    })
                    User.save()
                    res.json({ status: "ok" })
                }
            } else {
                await Object.keys(changes).forEach(key => {
                    User[key] = changes[key]
                })
                User.save()
                res.json({ status: "ok" })
            }
        } else {
            res.json({ status: "token invalid" })
        }
    }
    async changePhoto(req, res) {
        let data = req.jwtResult.id;
        let image = req.file;
        if (data && image) {
            const User = await UserSchema.findOne({ _id: data })
            User.photoFile = {
                data: fs.readFileSync(image.path),
                contentType: image.mimetype,
            },
                User.save()
            res.json({ status: "ok" })
        } else {
            res.json({ status: "token or image invalid" })
        }
    }
}

module.exports = new Controller