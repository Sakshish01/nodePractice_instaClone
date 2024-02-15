const cron = require("node-cron");
const Story = require("./models/story");
const User = require("./models/user");
const Archive = require("./models/archive");

// Define a cron job to run every minute
cron.schedule("* * * * *", async () => {
  console.log("Running task to check for user stories...");
  try {
   // Find stories completed more than 24 hours ago for each user
   const users = await User.find({});
   for (const user of users) {
     const userStories = await Story.find({
       user: user._id,
       createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
     });

     for (const story of userStories) {
       // Check if the current time is greater than 24 hours after story creation
       const twentyFourHoursAfterCreation = new Date(
         story.createdAt.getTime() + 24 * 60 * 60 * 1000
       );

       if (Date.now() > twentyFourHoursAfterCreation) {
         if (story.deleted_status === false) {
           // Archive the story
           const archive = await Archive.findOne({ user: user._id });
           if (archive) {
             archive.storyIds.push(story._id);
             await archive.save();
           } else {
             await Archive.create({ user: user._id, storyIds: [story._id] });
           }
         }
       }

       // Mark the story as deleted
       story.deleted_status = true;
       await story.save();
     }

     console.log(`${userStories.length} user stories updated for user ${user.name}.`);
   }
  } catch (error) {
    console.error("Error checking for expired stories:", error);
  }
});

console.log("Cron job scheduled to check for user stories every minute.");
