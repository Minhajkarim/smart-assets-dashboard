const mongoose = require("mongoose");
const Video = require("./models/Video");
const ObjectMetadata = require("./models/ObjectMetadata");
const User = require("./models/User");



const db = mongoose.connect("mongodb+srv://minhaj:karim@cluster03.7jpgd.mongodb.net/"); // Change to your DB name

const addVideoIds = async () => {
    try {
        const metadata = await ObjectMetadata.find();
        if (!metadata) {
          throw new Error("Failed to fetch metadata");
        }

        for (const object of metadata) {
          if (!object.approvedCount) {
            object.approvedCount = 0;
          }

          await object.save();

        }


      // const videos = await Video.find({status:"Approved"}); // Get all videos  
      // for (const video of videos) {
      //     for (const object of video.detectedObjects) {
      //       const urlSafeLabel = object.label
      //                       .toLowerCase() // Convert to lowercase
      //                       .replace(/\s+/g, "_") // Replace spaces with underscores
      //                       .replace(/[^a-z0-9_-]/g, ""); 
    
  
      //         let metadata = await ObjectMetadata.findOneAndUpdate(
      //           { label: urlSafeLabel },
      //           { $inc: { approvedCount: 1 } }, // ✅ Correct usage of $inc
      //           { upsert: true, new: true }
      //         );
      //         if (!metadata) {
      //           throw new Error("Failed to get metadata");
      //         }     
      //     }
      //   }
  
      console.log("✅ All metadata updated successfully");
    }
        catch (error) {
      console.error("Error updating meta:", error);
    } finally {
      mongoose.connection.close(); // Close the database connection
    }
  };

  const updateUser = async () => {
    try {
      const users = await User.find();
      if (!users) {
        throw new Error("Failed to fetch users");
      }

     for (const user of users) {
       if (!user.approved) {
          user.approved = true;        
       }



       await user.save();
     }
      console.log("✅ All users updated successfully");
    }
    catch (error) {
      console.error("Error updating users:", error);
    } finally {
      mongoose.connection.close(); // Close the database connection
    }
  }

const addVideoObjectImage = async () => {
  try{
    const videos = await Video.find();
    if (!videos) {
      throw new Error("Failed to fetch videos");
    }

    for (const video of videos) {
      for (const object of video.detectedObjects) {
        object.image_path = `/videos/images/video-011cd96e-cf72-4a43-b7b8-7f5dda16d9f6-cJKAIA0KVzuqIRDNAAFG-1738394902127/MAXIMUM SPEED LIMIT SIGN 344-60_25.7627258_55.9583313.jpg`;
      }
      await video.save();
    }
    console.log("✅ All videos updated successfully"); 
  }

  catch (error) {
    console.error("Error updating videos:", error);
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
}
  // Run the function
  // addVideoIds();
  // updateUser();
  addVideoObjectImage();