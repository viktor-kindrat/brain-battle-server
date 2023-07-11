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
let testingModel = require("./Database/Schema/Test");

let removeTest = async (testingCode) => {
    try {
        let testing = await testingModel.findOne({code: testingCode});
        if (testing?.code) {
            testingModel.deleteOne({code: testingCode})
        } else {
            console.log("testing already does not exist")
        }
    } catch (e) {
        console.log(e)
    }
}

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

    socket.on("create-testing-room", (roomId) => {
        socket.join(roomId);
        console.log(`Created room with id ${roomId}`);
        io.to(roomId).emit("created-testing-room", `Testing room with id ${roomId}`);

        socket.on("switch-question", (roomId)=>{
            console.log("question was switched")
            io.to(roomId).emit("question-switched", roomId)
        })
    
        socket.on("test-ended", (roomId)=>{
            io.to(roomId).emit("test-finished", roomId)
            console.log(`finished at roomid ${roomId}`)
            socket.leave(roomId)
        })
        
        socket.on("disconnect", ()=>{
            removeTest(roomId)
            io.to(roomId).emit("test-broken", roomId)
            socket.leave(roomId)
        })
    });
    
    socket.on("join-testing-room", (roomId) => {
        socket.join(roomId);
        
        socket.on("set-username", (username) => {
            socket.username = username;
            console.log(`Username set for socket ID ${socket.id}: ${username}`);
        });

        socket.on("leave", (roomId)=>{
            socket.leave(roomId)
        })
    
        socket.on("disconnect", () => {
            let disconnectedUser = "Anonymous"; 
    
            if (socket.username) {
                disconnectedUser = socket.username;
            }
    
            io.to(roomId).emit("user-disconnected", disconnectedUser);
    
            console.log(`User ${disconnectedUser} disconnected`);
        });
    });

    
    socket.on("set-answer", (roomId)=>{
        io.to(roomId).emit("answer-setted", roomId)
    })

    socket.on("joined-new-user", (roomId) => {
        io.to(roomId).emit("joined-testing-room", `Someone has joined testing room with id ${roomId}`);
    });
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
