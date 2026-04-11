const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const http = require('http');
const { Server } = require("socket.io");
const initializeSocket = require("./socket");

// Models
const Message = require("./Models/messageModel");
const User = require("./Models/userModel");
const Document = require("./Models/documentModel");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static Folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Import Routes ---
const loginRoutes = require("../server/Routes/loginRoutes");
const studentRoutes = require("./Routes/studentRoutes");
const teacherRoutes = require("./Routes/teacherRoutes");
const alumniRoutes = require("./Routes/alumniRoute");
const resetpasswordRoutes = require("./Routes/resetpasswordRoutes");
const verifyEmailRoutes = require("../server/Routes/verifyEmailRoutes");
const departmentRouter = require("./Routes/departmentRouter");
const studentDetailsRoutes = require("./Routes/studentDetailsRoutes");
const getDetailsRoute = require("./Routes/getDetailsRoute");
const getUserDataRoutes = require("./Routes/getUserDataRoutes");
const generateUserDataPDF = require("./Routes/generateUserDataPDF");
const sendNotificationRoute = require("./Routes/sendNotificationRoute");
const changePasswordRoute = require("./Routes/changePasswordRoute");
const statusRoute = require("./Routes/statusRoute");
const chartsRoute = require("./Routes/chartsRoute");
const examRoute = require("./Routes/examRoute");
const resumeRoute = require("./Routes/resumeRoute");
const feedbackRoute = require("./Routes/feedbackRoute");
const workshopRoute = require("./Routes/workshopRoute");

// --- UPDATED ROUTE MOUNTING ---

// 1. TEACHER ROUTES
app.use("/teacher", teacherRoutes);

// 2. STUDENT DATA ROUTES
app.use("/", getUserDataRoutes);

// 3. BASE STUDENT/USER ROUTES
app.use("/get-students", getDetailsRoute);
app.use("/student/register", studentRoutes);

// Other Auth Routes
app.use("/alumni", alumniRoutes);
app.use("/user/login", loginRoutes);
app.use("/user/reset-password", resetpasswordRoutes);
app.use("/verify-email", verifyEmailRoutes);

// Metadata Routes
app.use("/departments", departmentRouter);
app.use("/get-department-name", getDetailsRoute);

// Notification & Status
app.use("/send-notification", sendNotificationRoute);
app.use("/update-student-status", statusRoute);

// Features
app.use("/teacher-change-password", changePasswordRoute);
app.use("/placed-students", chartsRoute);
app.use("/exams", examRoute);
app.use("/feedback", feedbackRoute);
app.use("/workshop", workshopRoute);
app.use("/resume-ats-checker", resumeRoute);
app.use("/generate-userdata-pdf", generateUserDataPDF);

// --- Chat & Socket API ---
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().sort({ timestamp: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Notes Sharing (Multer) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: storage });

app.post("/notesshare/notesshare", upload.single("file"), async (req, res) => {
    try {
        const newDocument = new Document({
            title: req.body.title,
            description: req.body.description,
            name: req.body.author,
            email: req.body.email,
            filepath: req.file.path,
        });
        await newDocument.save();
        res.status(201).json({ message: "Document uploaded successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/get-pdfs", async (req, res) => {
    try {
        const documents = await Document.find();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/notes/download/:id", async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ error: "Document not found" });
        res.download(document.filepath, document.title);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// --- Server Initialization ---
const server = http.createServer(app);
initializeSocket(server);

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});