require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtsecret = process.env.JWTSECRET;

class Controller {
    callbackGoogle(req, res) {
        const data = { data: { ...req.user } }
        const token = jwt.sign(data, jwtsecret, { expiresIn: "1h" })
        const redirectURL = "http://localhost:5555/?token=" + token; // Include the JWT in the redirect URL
        res.redirect(redirectURL);
    }
}

module.exports = new Controller