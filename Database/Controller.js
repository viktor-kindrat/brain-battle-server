const UserSchema = require("./Schema/User")

class Controller {
    getJwtInfo(req, res) {
        const data = req.jwtResult;
        res.json({ data })
    }
    async getUserInfo(req, res) {
        const data = req.jwtResult.id;
        console.log(data)
        if (data) {
            const User = await UserSchema.findOne({ _id: data })
            if (User) {
                console.log(User)
                const UserClone = await (User.photoFile.data) ? {
                    ...User,
                    photoFile: {
                        contentType: User.photoFile.contentType,
                        data: await User.photoFile.data.toString("base64")
                    }
                } : { ...User }
                res.json({ status: "ok", data: { UserClone }, code: 200 })
            } else {
                res.json({ status: "invalid token. user not found", code: 405 })
            }
        } else {
            res.json({ status: "invalid token", code: 405 })
        }
    }

    async recordTest(req, res) {
        const userId = req.jwtResult.id;
        if (userId) {
            let user = await UserSchema.findOne({ _id: userId });
            if (user) {
                const test = req.body;
                const testExist = [...user.tests].filter(item=>item.id === test.id)
                if (testExist.length === 0) {
                    user.tests = await [...user.tests, test];
                    user.save();
                    res.json({status: "ok", code: 200})
                } else {
                    res.json({status: "Test with the same id already exist", code: 401})
                }
            } else {
                res.json({ status: "invalid token. user not found", code: 404 })
            }
        } else {
            res.json({ status: "invalid token", code: 405 })
        }
    }

    async removeTest(req, res) {
        const userId = req.jwtResult.id;
        if (userId) {
            let user = await UserSchema.findOne({ _id: userId });
            if (user) {
                const testId = req.body.id;
                user.tests = await [...user.tests].filter(item => item.id !== testId);
                user.save().then(()=>{
                    res.json({status: "ok", code: 200})
                }).catch(e=>{
                    console.log(e)
                    res.json({status: "unexpected errror, " + e, code: 500})
                })
            } else {
                res.json({ status: "invalid token. user not found", code: 404 })
            }
        } else {
            res.json({ status: "invalid token", code: 405 })
        }
    }
}

module.exports = new Controller()