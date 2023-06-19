require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5555;
const appRouter = require("./App/Router/Router");
const dbRouter = require("./Database/Router")
const authRouter = require("./Auth/Router")

let app = express();
app.use("/", appRouter);
app.use("/database", dbRouter);
app.use("/auth", authRouter);
app.use(express.static(path.join(__dirname, "/", "public")));

let start = async()=>{
    try{
        await mongoose.connect(`mongodb+srv://root:${process.env.MONGOPASSWORD}@cluster0.ogztjlm.mongodb.net/?retryWrites=true&w=majority`);
        app.listen(PORT, ()=>console.log(`Listening server on adress http://localhost:${PORT}`));
    } catch(e){
        console.log(e)
    }
}

start()
