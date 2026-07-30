const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication
} = require("../controllers/applicationController");

router.get("/", verifyToken, getApplications);

router.post("/", verifyToken, createApplication);

router.put("/:id", verifyToken, updateApplication);

router.delete("/:id", verifyToken, deleteApplication);

module.exports = router;