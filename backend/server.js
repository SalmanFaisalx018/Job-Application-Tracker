const express = require("express");
const cors = require("cors");

const applicationRoutes = require("./routes/applicationRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("🚀 Job Application Tracker Backend is Running!");
});

app.use("/api/applications", applicationRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});