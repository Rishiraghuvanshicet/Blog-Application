// routes/exportRoute.js
const express = require("express");
const router = express.Router();
const { exportPostToWord, exportAllPostsToExcel } = require("../controllers/exportController");

router.get("/word/:postId", exportPostToWord);
router.get("/excel", exportAllPostsToExcel);

module.exports = router;
