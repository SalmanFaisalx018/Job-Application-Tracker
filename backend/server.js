const express = require("express");
const cors = require("cors");

const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("🚀 Job Application Tracker Backend is Running!");
});

app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});