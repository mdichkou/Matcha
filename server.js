const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const path = require("path");

const app = express();

// Cors
app.use(cors());

// Init Middleware
app.use(express.json({ extended: false, limit: "50mb" }));

app.use("/images", express.static("images"));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/forget", require("./routes/api/forget"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/match", require("./routes/api/match"));
app.use("/api/visit", require("./routes/api/visit"));
app.use("/api/images", require("./routes/api/images"));
app.use("/api/conversation", require("./routes/api/conversation"));
app.use("/api/notification", require("./routes/api/notification"));
app.use("/api/chat", require("./routes/api/chat"));

// Set static folder
app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT);

// Init Socket
const io = socketIo(server);

require("./Utils/Socket")(io);
