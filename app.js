require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors module
const PORT = process.env.PORT || 5555;
const appRouter = require("./App/Router/Router");
const dbRouter = require("./Database/Router");
const authRouter = require("./Auth/Router");
const testerRouter = require("./Tester/Router");
const http = require("http");

let app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

app.use(cors()); // Enable CORS for all routes
app.use("/", appRouter);
app.use("/db", dbRouter);
app.use("/auth", authRouter);
app.use("/tester", testerRouter);
app.use(express.static(path.join(__dirname, "/", "public")));

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("create-testing-room", (roomId)=>{
        socket.join(roomId)
        socket.emit("created-testing-room", `Testing room with id ${roomId} created`)
    })
});

io.on("disconnect", (socket) => {
    console.log("Client disconnected");
});

let start = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://root:${process.env.MONGOPASSWORD}@cluster0.ogztjlm.mongodb.net/?retryWrites=true&w=majority`
        );
        server.listen(PORT, () =>
            console.log(`Listening server on address http://localhost:${PORT}`)
        );
    } catch (e) {
        console.log(e);
    }
};

start();
