const Story = require("../models/story");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const postedTime = require("../extras/functions");
const StoryHighlights = require("../models/storyHighlights");

//story 

const addStory = asyncHandler(async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.userId);
        const storyExpiresHours = parseInt(process.env.STORY_EXPIRY);
        const StoryExpirationTime = Date.now() + storyExpiresHours * 60 * 60 * 1000;
      
        if (!req.body.text) {
          res.status(404).json({
            message: "Text is required",
          });
        }
      
        const storyData = {
          user: currentUser._id,
          expiresAt: StoryExpirationTime,
          text: req.body.text,
          files: [],
          tags: [],
        };
      
        if (req.files || req.body.shareWith || req.body.location || req.body.tags) {
          if (req.files) {
            for (const file of req.files) {
              const filePath = file.path;
              //   console.log(file, req.files, filePath);
              storyData.files.push(filePath);
            }
          }
          if (req.body.shareWith) {
            storyData.shareWith = req.body.shareWith;
          }
          if (req.body.location) {
            storyData.location = req.body.location;
          }
          if (req.body.tags) {
            for (const tagUser of tags) {
              storyData.tags.push(tagUser);
            }
          }
        }
        const storyInstance = new Story(storyData);
        await storyInstance.save();
        res.status(200).json({
          message: "Story added",
          data: storyInstance,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Internal server error",
        });
    }

});

const deleteStory = asyncHandler(async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id,
            user: req.user.userId,
          });
          if (!story) {
            res.status(404).json({
              message: "Story not found",
            });
          }
          story.deletedAt = Date.now();
          story.deleteStatus = true;
          await story.save();

          res.status(200).json({
            message: "Story deleted",
          });
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Internal server error",
        });
    }

});

const viewStory = asyncHandler(async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        // const currentUser = await User.findById(req.user.userId);
        const postedAgoTime = postedTime(story.createdAt);
        if (!story) {
          res.status(404).json({
            message: "Story not found",
          });
        }
      
        if (Date.now() > story.expiresAt || story.deleteStatus === true) {
          res.status(404).json({
            message: "No longer visible",
          });
        }
      
        story.views.push(req.user.userId);
      
        res.status(200).json({
          message: "Story viewed",
          data: {
            story, postedAgoTime
          }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Internal server error",
        });
    }

});

const likeStory = asyncHandler(async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
          res.status(404).json({
            message: "Story not found",
          });
        }
        if (Date.now() > story.expiresAt || story.deleteStatus === true) {
          res.status(404).json({
            message: "No longer visible",
          });
        }
      
        story.likes.push(req.user.userId);
      
        res.status(200).json({
          message: "Story liked",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Internal server error",
        });
    }

});

const UnlikeStory = asyncHandler(async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      res.status(404).json({
        message: "Story not found",
      });
    }
    if (Date.now() > story.expiresAt || story.deleteStatus === true) {
      res.status(404).json({
        message: "No longer visible",
      });
    }

    story.likes.remove(req.user.userId);

    res.status(200).json({
      message: "Story UnLiked",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

const addComment = asyncHandler(async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      res.status(404).json({
        message: "Story not found",
      });
    }

    if (Date.now() > story.expiresAt || story.deleteStatus === true) {
      res.status(404).json({
        message: "No longer visible",
      });
    }

    if (!req.body.text) {
      res.status(400).json({
        message: "Text is required",
      });
    }

    story.comments.push({
      userId: req.user.userId,
      content: req.body.text,
    });

    res.status(200).json({
      message: "Comment done",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

const addReaction = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) {
    res.status(404).json({
      message: "Story not found",
    });
  }

  if (Date.now() > story.expiresAt || story.deleteStatus === true) {
    res.status(404).json({
      message: "No longer visible",
    });
  }

  if (!req.body.reactions || !req.body.avatars) {
    res.status(400).json({
      message: "Reactions or avatars is required",
    });
  }

  if (req.body.reactions) {
    // Update the reactions
    if (req.body.reactions.thumbsUp) {
      story.reactions.thumbsUp = req.body.reactions.thumbsUp;
    }
    if (req.body.reactions.hearts) {
      story.reactions.hearts = req.body.reactions.hearts;
    }
  }

  if (req.body.avatars) {
    // Update the avatars
    if (req.body.avatars.happy) {
      story.avatars.happy = req.body.avatars.happy;
    }
    if (req.body.avatars.sad) {
      story.avatars.sad = req.body.avatars.sad;
    }
  }

  await story.save();
  res.status(200).json({
    message: "Reaction added",
  });
});

//highlights

const addHighlight = asyncHandler(async (req, res) => {
    const currentUser = await User.findById(req.user.userId);

    if (!Array.isArray(req.body.storyIds) || !req.body.storyIds.length || !req.body.name) {
        return res.status(400).json({
            message: "Both storyIds (as an array) and name are required"
        });
    }

    const stories = await Story.find({_id: {$in: req.body.storyIds} });

    if (!stories.length) {
        return res.status(404).json({
            message: "No valid stories found"
        });
    }
    const storyIds = stories.map(story => story._id);

    const highlightData = {
        user: currentUser._id,
        name: req.body.name,
        storyIds: storyIds
    }

    if(req.file){
        highlightData.coverImage = req.file.path;
    }

    const highlightInstance = new StoryHighlights(highlightData);

    await highlightInstance.save();
    res.status(200).json({
        message: `Story added to  ${req.body.name} highlights.`
    })
});

const deleteHighlight = asyncHandler(async(req, res) => {
    const highlight = await StoryHighlights.findById(req.params.id);
    if(!highlight){
        res.status(404).json({
            message: "Highlight not found"
        });
    }

    await highlight.deleteOne();
    res.status(200).json({
        message: "Highlight deleted successfully"
    });

});

const viewHighlight = asyncHandler(async (req, res) => {
    const highlight = await StoryHighlights.findById(req.params.id);
    if(!highlight){
        res.status(404).json({
            message: "Highlight not found"
        });
    }
    res.status(200).json({
        message: "Highlight retrieved successfully",
        data: highlight
    });
});

const removeStoryfromHighlight = asyncHandler(async(req, res) => {
    if(!req.body.storyId){
        res.status(404).json({
            message: "Story is required"
        });
    }
    const highlight = await StoryHighlights.findById(req.params.id);
    if(!highlight){
        res.status(404).json({
            message: "Highlight not found"
        });
    }

    if(!highlight.storyIds.includes(req.body.storyId)){
        res.status(404).json({
            message: `Story not found in ${highlight.name} highlights`
        });
    }

    highlight.storyIds.remove(req.body.storyId);
    await highlight.save();

    res.status(200).json({
        message: `Story removed from ${highlight.name} highlights`
    })
});

const editHighlight = asyncHandler(async(req, res) => {
  const highlight = await StoryHighlights.findById(req.params.id);
  if(!highlight){
      res.status(404).json({
          message: "Highlight not found"
      });
  }
  if(req.file || req.body.name){
    if(req.file){
      highlight.coverImage = req.file.path;
    }
    if(req.body.name){
      highlight.name = req.body.name
    }
    await highlight.save();
  }

  res.status(200).json({
    message: "Highlight updated"
  });
});


module.exports = { addStory, deleteStory, viewStory, likeStory, UnlikeStory, addComment, addReaction, addHighlight,  deleteHighlight, viewHighlight, removeStoryfromHighlight, editHighlight};
