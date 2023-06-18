const path = require("path")

class Controller {
    pageSend(req, res){
        res.sendFile(path.resolve("public/index.html"))
    }
}

module.exports = new Controller