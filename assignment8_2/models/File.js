const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: String,
    originalname: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("File", fileSchema);
