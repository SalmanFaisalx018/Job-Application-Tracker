const express = require("express");

const router = express.Router();

const {
    signup,
    login
} = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Protected Route Accessed Successfully!",
        user: req.user
    });
});

module.exports = router;