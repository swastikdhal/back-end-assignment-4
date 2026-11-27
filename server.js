require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const http = require("http");
const { Server } = require("socket.io");
const EventEmitter = require("events");
const events = new EventEmitter();
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let users;
let notes;

// Event listeners
events.on("signup", (email) => {
    console.log("New user registered:", email);
});

events.on("login", (email) => {
    console.log("User logged in:", email);
});

app.get("/", (req, res) => {
    res.send("Secure Connect Server is Running");
});
// Signup route
app.post("/api/auth/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const existingUser = await users.findOne({ email });

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
        username,
        email,
        password: hashedPassword,
        role: "user"
    });

    events.emit("signup", email);

    res.status(201).json({
        message: "User registered successfully"
    });
});
// Login route
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const user = await users.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        {
            id: user._id.toString(),
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    events.emit("login", email);

    res.json({
        message: "Login successful",
        token
    });
});

// Protected profile route
app.get("/api/profile", auth, (req, res) => {
    res.json({
        message: "Welcome to your profile",
        user: req.user
    });
});

// Admin route
app.get("/api/admin", auth, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied"
        });
    }

    res.json({
        message: "Welcome Admin"
    });
});

// Create note
app.post("/api/notes", auth, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required"
        });
    }

    const result = await notes.insertOne({
        title,
        content,
        owner: req.user.id
    });

    res.status(201).json({
        message: "Note created",
        id: result.insertedId
    });
});

// Read notes
app.get("/api/notes", auth, async (req, res) => {
    const data = await notes.find({
        owner: req.user.id
    }).toArray();

    res.json(data);
});

// Update note
app.put("/api/notes/:id", auth, async (req, res) => {
    const { title, content } = req.body;

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Invalid note ID"
        });
    }

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required"
        });
    }

    const result = await notes.updateOne(
        {
            _id: new ObjectId(req.params.id),
            owner: req.user.id
        },
        {
            $set: { title, content }
        }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    res.json({ message: "Note updated" });
});

// Delete note
app.delete("/api/notes/:id", auth, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Invalid note ID"
        });
    }

    const result = await notes.deleteOne({
        _id: new ObjectId(req.params.id),
        owner: req.user.id
    });

    if (result.deletedCount === 0) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    res.json({ message: "Note deleted" });
});

// Chat page
app.get("/chat", (req, res) => {
    res.sendFile(__dirname + "/chat.html");
});

// Chat authentication
io.use((socket, next) => {
    try {
        socket.user = jwt.verify(
            socket.handshake.auth.token,
            process.env.JWT_SECRET
        );
        next();
    } catch (error) {
        next(new Error("Invalid token"));
    }
});

// Real-time chat
io.on("connection", (socket) => {
    console.log("User connected:", socket.user.username);

    socket.join("general");

    socket.on("chatMessage", (message) => {
        if (typeof message !== "string" || !message.trim()) {
            return;
        }

        const text = socket.user.username + ": " + message;

        console.log(text);

        io.to("general").emit("chatMessage", text);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.user.username);
    });
});

async function start() {
    try {
        await client.connect();

        const db = client.db("secure_connect");

        users = db.collection("users");
        notes = db.collection("notes");
        await users.createIndex({ email: 1 }, { unique: true });

        console.log("MongoDB Connected");

        server.listen(process.env.PORT, () => {
            console.log("Server running on port 5000");
        });
    } catch (error) {
        console.log(error.message);
    }
}

start();