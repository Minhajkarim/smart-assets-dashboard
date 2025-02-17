require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { PythonShell } = require("python-shell");
const { hostname } = require("os");
const Video = require("./models/Video");
const User = require("./models/User");

let clients = {};

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
// set up socket.io
const server = http.createServer(app);
// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://psd.smartassets.ae/"], // Replace with your frontend domains
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// Middleware
app.use(express.json()); // Parse JSON body
app.use(
  cors({
    origin: ["http://localhost:3000", "https://psd.smartassets.ae/"], // Replace with your frontend domains
    credentials: true,
  })
); // Enable CORS

// Serve static files
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));
app.use(
  "/processed",
  express.static(path.resolve(__dirname, "uploads", "processed"))
);
app.use("/videos", express.static(path.resolve(__dirname, "videos"))); // Expose videos folder

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user/profile", require("./routes/profileRoutes"));
app.use("/api/admin/profile", require("./routes/profileRoutes"));
app.use("/api/superadmin/profile", require("./routes/profileRoutes"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

// Protected Route Example
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "Protected data accessed successfully", user: req.user });
});

// 🛡 Middleware to Verify JWT Token
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
}

app.get("/api/videos/:id/report", async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Generate Excel report using ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Video Report");

    // Add header row
    worksheet.columns = [
      { header: "Field", key: "field", width: 30 },
      { header: "Value", key: "value", width: 50 },
    ];

    // Add video details
    worksheet.addRow({ field: "Filename", value: video.filename });
    worksheet.addRow({ field: "Processed Path", value: video.processedPath });
    worksheet.addRow({ field: "Processed At", value: video.processedAt });

    // add detected objects as a new sheet
    const detectedObjectsSheet = workbook.addWorksheet("Detected Objects");
    detectedObjectsSheet.columns = [
      { header: "Label", key: "label", width: 20 },
      { header: "X", key: "x", width: 10 },
      { header: "Y", key: "y", width: 10 },
      { header: "Width", key: "width", width: 10 },
      { header: "Height", key: "height", width: 10 },
    ];

    video.detectedObjects.forEach((object) => {
      detectedObjectsSheet.addRow({
        label: object.label,
        x: object.x,
        y: object.y,
        width: object.width,
        height: object.height,
      });
    });

    // Send Excel file as response
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-${id}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report." });
  }
});

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.clientId = socket.id;
  socket.emit("clientId", { clientId: socket.id });

  // add client to clients object

  clients[socket.id] = {
    socket: socket,
    videos: {},
    locations: [],
  };

  // Listen for frame data and simulate object detection (for testing)
  socket.on("frameData", (data) => {
    // console.log("Frame data received:", data);

    // check data for video id and client id

    if (data.videoId && data.clientId) {
      // send the frame data to the client

      // check if client exists in clients object
      if (clients[data.clientId]) {
        // check if video exists in client object
        if (clients[data.clientId].videos[data.videoId]) {
          // send the frame data to the client
          clients[data.clientId].videos[data.videoId].frames.push(data);
        } else {
          // create video object in client object
          clients[data.clientId].videos[data.videoId] = {
            frames: [data],
          };
        }
      } else {
        // create client object in clients object
        clients[data.clientId] = {
          socket: socket,
          videos: {
            [data.videoId]: {
              frames: [data],
            },
          },
        };
      }
    }

    // Define the options for PythonShell
    // const pythonScriptPath = path.join(__dirname, "processRecording.py");
    // const options = {
    //   mode: "json",
    //   pythonOptions: ["-u"], // Unbuffered output to stream data immediately
    //   scriptPath: __dirname,
    //   args: [], // You can pass additional arguments if needed
    // };

    // // Input to the Python script
    // const base64Data = Buffer.from(data.data).toString("base64");

    // const inputData = data;

    // inputData.data = base64Data;

    // // Run the Python script
    // const pyshell = new PythonShell("processRecording.py", options);

    // // Send input to the Python script
    // pyshell.send(inputData);

    // // Collect output from Python script
    // let output = [];

    // pyshell.on("message", (message) => {
    //   output.push(message);
    // });

    // pyshell.end((err, code, signal) => {
    //   if (err) {
    //     console.error("PythonShellError:", err);
    //   }

    //   // Send the Python script result as a response
    //   if (output.length > 0) {
    //     console.log(output[0]);
    //   } else {
    //     console.log("THERE WAS AN ERROR");
    //   }
    // });
    // // Emit a simulated object detection result (replace with actual logic)
    // // socket.emit("objectDetection", {
    // //   objects: [{ label: "Person", x: 100, y: 150, width: 50, height: 100 }],
    // // });
  });

  socket.on("locationData", (data) => {
    // check data for video id and client id

    // check if client exists in clients object
    if (clients[socket.id]) {
      // append the location data to the client object
      clients[socket.id].locations.push(data);
    } else {
      // create client object in clients object
      clients[socket.id] = {
        socket: socket,
        videos: {},
        locations: [data],
      };
    }
  });

  socket.on("stopRecording", (data) => {
    // get the client id and video id from the data

    console.log("server.stopRecording.data", data);

    if (data.videoId && data.clientId) {
      // check if client exists in clients object
      if (clients[data.clientId]) {
        // check if video exists in client object
        if (clients[data.clientId].videos[data.videoId]) {
          // send the frame data to the client
          const baseFilename = `video-${data.videoId}-${
            data.clientId
          }-${Date.now()}`;
          const ext = ".webm";

          const metadataFilename = `video-${data.videoId}-${data.clientId}.json`;

          const videoPath = path.join(__dirname, "uploads", baseFilename + ext);

          const processedPath = path.join(
            __dirname,
            "videos",
            baseFilename + "-output.mp4"
          );

          const metadataPath = path.join(
            __dirname,
            "uploads",
            metadataFilename
          );

          const publicProcessedPath = `/videos/${baseFilename}-output.mp4`;

          const writeStream = fs.createWriteStream(videoPath);

          // save the video file to the uploads folder
          let frameMetadata = [];
          let locationMetadata = [];

          for (let frame of clients[data.clientId].videos[data.videoId]
            .frames) {
            writeStream.write(Buffer.from(frame.data));
            frameMetadata.push({
              timestamp: frame.timestamp,
              frameId: frame.frameId,
            });
          }

          for (let location of clients[data.clientId].locations) {
            locationMetadata.push({
              timestamp: location.timestamp,
              latitude: location.latitude,
              longitude: location.longitude,
            });
          }

          let video_metadata = {
            frames: frameMetadata,
            locations: locationMetadata,
          };
          // 162f4df0-aec2-48ba-aac5-ff2eb8d44aca

          fs.writeFileSync(metadataPath, JSON.stringify(video_metadata));

          writeStream.end();

          // socket.emit("videoSaved", {
          //   videoId: data.videoId,
          //   clientId: data.clientId,
          //   filename: baseFilename,
          //   metadata: metadataFilename,
          // });

          console.log("Video saved successfully");

          // // delete the video data from the client object
          // delete clients[data.clientId].videos[data.videoId];

          // // delete the location data from the client object
          // clients[data.clientId].locations = [];

          console.log("Calling python script");
          // call the python script to process the video
          const options = {
            mode: "text",
            pythonOptions: ["-u"],
            scriptPath: __dirname,
            args: [videoPath, metadataPath],
          };
          let detectedObjects = [];
          const pyshell = new PythonShell("processRecording.py", options);

          // call the python script to process the video
          pyshell.on("message", (message) => {
            console.log("Python script message:", message);
            try {
              const update = JSON.parse(message);

              if (update.progress) {
                socket.emit("processingProgress", update);
              }
              if (update.detectedObjects) {
                detectedObjects = update.detectedObjects; // Collect detected objects
              }
            } catch (err) {
              console.error("Failed to parse progress update:", err);
            }
          });

          // Handle errors from the Python script
          pyshell.on("stderr", (stderr) => {
            console.error("Python script error output:", stderr);
          });

          // End of Python script execution

          pyshell.end(async (err) => {
            if (err) {
              console.error("Error during video processing:", err);
            } else {
              console.log("Video processing completed successfully");
              console.log("Python Script ended");

              console.log("Saving video data to the database");
              // save the video data to the database

              const video = new Video({
                filename: baseFilename + ext,
                uploadPath: videoPath.replace(/\\/g, "/"),
                status: "uploaded",
                processedAt: new Date(),
                detectedObjects: detectedObjects,
                processedPath: publicProcessedPath,
                uploadUserId: data.userId,
              });
              video.save();
            }
          });
        }
      }
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
// Start Server
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
