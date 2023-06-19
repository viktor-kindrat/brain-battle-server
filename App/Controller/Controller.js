const path = require("path")

class Controller {
    pageSend(req, res) {
        res.sendFile(path.resolve("public/index.html"))
    }
    retrieveData(req, res) {
        const user = req.session.user;

        if (user) {
            res.json(user);
        } else {
            res.status(401).json({ error: 'User data not available' });
        }
    }
}

module.exports = new Controller