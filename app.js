const express = require("express");
const userRoutes = require("./routes/usersRoutes");
const postRoutes = require("./routes/postsRoutes");
const storyRoutes = require("./routes/storyRoutes");
// const cronJob = require("./cronJob");
// const testRoutes = require("./routes/testRoute");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/instadb");

const app = express();
require("dotenv").config(); //dotenv config
app.use(express.json());
// app.use(express.multipart());


// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

app.get("/", (req, res) => {
    res.send("API is running..");
});
//user routes
app.use('/api/users', userRoutes);

//post routes
app.use('/api/posts', postRoutes);

//activity controller routes
app.use('/api/story', storyRoutes);

//test routes
// app.use('/api/test', testRoutes)