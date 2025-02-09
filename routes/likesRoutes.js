const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");

router.get("/likes/:projectName", likeController.getLikes);
router.post("/likes/:projectName", likeController.toggleLike);

module.exports = router;
