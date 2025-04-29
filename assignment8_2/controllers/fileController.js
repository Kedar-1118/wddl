const File = require("../models/File");
const fs = require("fs");

exports.uploadFile = async (req, res) => {
    const file = new File({ ...req.file, uploadedBy: req.user });
    await file.save();
    res.json({ msg: "File uploaded", file });
};

exports.getFiles = async (req, res) => {
    const files = await File.find({ uploadedBy: req.user });
    res.json(files);
};

exports.downloadFile = async (req, res) => {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: "File not found" });

    res.download(file.path, file.originalname);
};

exports.deleteFile = async (req, res) => {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: "File not found" });

    fs.unlinkSync(file.path);
    await file.deleteOne();
    res.json({ msg: "File deleted" });
};
