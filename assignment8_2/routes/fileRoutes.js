const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
    uploadFile,
    getFiles,
    downloadFile,
    deleteFile
} = require("../controllers/fileController");

router.post("/upload", auth, upload.single("file"), uploadFile);
router.get("/", auth, getFiles);
router.get("/:id", auth, downloadFile);
router.delete("/:id", auth, deleteFile);

module.exports = router;
