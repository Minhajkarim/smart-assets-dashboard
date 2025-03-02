const express = require("express");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Video = require("../models/Video");
const ExcelJS = require("exceljs"); // For generating Excel reports
const objectMetadata = require("../models/ObjectMetadata");


const router = express.Router();
router.get("/consolidated", authMiddleware, async (req, res) => {
  const filter = req.query.filter; // Extract filter from query params

  try {
    const videos = await Video.find({ status: "Approved" })
    if (!videos) return res.status(204).json({ error: "No Videos" });

    let filterdObjects = [];
    
    for (let video of videos){
      for (let detectedObject of video.detectedObjects){
        if (detectedObject.label === filter){
          filterdObjects.push(detectedObject);

        }
      }
    }
    res.json(filterdObjects);

    // Aggregation pipeline to get filtered objects
    // const videos = await Video.aggregate([
    //   {
    //     $match: { status: "Approved" },
    //   },
    //   {
    //     $unwind: "$detectedObjects",
    //   },
    //   {
    //     $match: filter ? { "detectedObjects.label": filter } : {}, // Apply filter if provided
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       label: "$detectedObjects.label",
    //       x: "$detectedObjects.x",
    //       y: "$detectedObjects.y",
    //       width: "$detectedObjects.width",
    //       height: "$detectedObjects.height",
    //       name: "$detectedObjects.name",
    //       id: "$detectedObjects.id",
    //     },
    //   },
    // ]);

    // console.log("Consolidated Data:", videos);
    // res.json(videos); // Return an array of objects

  } catch (error) {
    console.error("Error fetching consolidated data:", error);
    res.status(500).json({ error: "Failed to fetch consolidated data" });
  }
});

// ✅ Get Profile (Only Authenticated Users)
router.get("/", authMiddleware,authorize("admin", "superadmin"), async (req, res) => {

  try {
    const query = {};
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    await new Promise((resolve) => setTimeout(resolve, 500));
    const totalVideos = await Video.countDocuments({status: "uploaded"});

    // count total videos

    const totalPages = Math.ceil(totalVideos / limit);

    if (page > totalPages){
      page = totalPages;
    }

    const skip = (page - 1) * limit;

     
    if (req.query){
      if (req.query.status){
        query["status"] = req.query.status;
      }
    }
    const videos = await Video.find(query, null, { limit:limit, skip: skip }).sort({ uploadedAt: -1 });


    if (!videos) return res.status(204).json({ error: "No Videos" });
    const data={
      videos: videos,
      totalVideos: totalVideos,
      totalPages: totalPages,
      currentPage: page
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:user_id", authMiddleware, async (req, res) => {
    try {
    const query = {uploadUserId: req.params.user_id};
    const limit = parseInt(req.query.limit) || 10;
    if (req.query.status){
        query.status = req.query.status;
    }




    const videos = await Video.find(query, null, { limit:limit }).sort({ uploadedAt: -1 });
      if (!videos) return res.status(204).json({ error: "No Videos" });
  
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

// ✅ Update Video metadata i.e filename and status (Only the logged-in user)
router.put("/update/:video_id", authMiddleware, async (req, res) => {
    try {
        const { filename, status } = req.body;
        const updatedVideo = await Video.findByIdAndUpdate(
        req.params.video_id,
        { filename, status },
        { new: true, runValidators: true }
        ).select("-password");


        for (const object of updatedVideo.detectedObjects){
          const urlSafeLabel = object.label
          .toLowerCase() // Convert to lowercase
          .replace(/\s+/g, "_") // Replace spaces with underscores
          .replace(/[^a-z0-9_-]/g, ""); 

          let metadata = await objectMetadata.findOneAndUpdate(
            { label: urlSafeLabel },
            { $inc: { approvedCount: 1 } }, // ✅ Correct usage of $inc
            { upsert: true, new: true }
          );

          if (!metadata) {
            throw new Error("Failed to get metadata");
          }
        }
    
        res.json({ message: "Video updated successfully", video: updatedVideo });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Admin-only Route Example
router.get(
  "/admin",
  authMiddleware,
  authorize("admin", "superadmin"),
  (req, res) => {
    res.json({ message: "Welcome, Admin!" });
  }
);

router.get("/report/:id", async (req, res) => {
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




module.exports = router;
