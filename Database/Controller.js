const UserSchema = require("./Schema/User")

class Controller {
    async getUserInfo (req, res){
        try {
            let id = req.body.id;
            let data = await UserSchema.findOne({_id: id})
            res.json(data)
        } catch(e){
            console.log(e)
        }
    }
}

module.exports = new Controller()