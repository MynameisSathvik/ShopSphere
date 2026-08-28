const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
    res.json({
        message: "Protected profile accessed successfully",
        user: req.user
    });
});

router.get("/admin-test", protect, adminOnly, (req, res) => {
    res.json({
        message: "Welcome Admin! ??",
        user: req.user
    });
});

module.exports = router;
