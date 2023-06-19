const UserSchema = require("./Schema/User")

class Controller {
    getUserInfo (req, res){
        const user = req.user.data._doc;
        res.json({user})
    }
}

module.exports = new Controller()