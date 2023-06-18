require("dotenv").config()
const express = require("express");
const path = require("path")
const PORT = process.env.PORT || 5555;
const appRouter = require("./App/Router/Router")

let app = express();
app.use("/", appRouter)
app.use(express.static(path.join(__dirname, "/", "public")))

app.listen(PORT, ()=>console.log(`Listening server on adress http://localhost:${PORT}`))