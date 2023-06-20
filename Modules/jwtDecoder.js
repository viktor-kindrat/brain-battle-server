require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtsecret = process.env.JWTSECRET;

const verifyJWT = (req, res, next) => {
    // Retrieve the token from the request headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }

    try {
        // Verify and decode the JWT
        const decoded = jwt.verify(token, jwtsecret);

        // Attach the decoded user information to the request object
        req.jwtResult = decoded;

        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};


module.exports = verifyJWT