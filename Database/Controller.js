const UserSchema = require("./Schema/User")

class Controller {
    getJwtInfo (req, res){
        const data = req.jwtResult;
        res.json({data})
    }
    async getUserInfo (req, res) {
        const data = req.jwtResult.id;
        console.log(data)
        if (data) {
            const User = await UserSchema.findOne({_id: data})
            if (User) {
                const UserClone = await (User.photofile) ? {...User,
                    photoFile: {
                        contentType: User.photoFile.contentType,
                        data: User.photoFile.data.toString("base64")
                    }
                } : {...User}
                res.json({status: "ok", data: {UserClone}})
            }
        } else {
            res.json("Invalid token")
        }
    }
}

module.exports = new Controller()