// routes/contacts.js
const express = require('express');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });
router.use(auth);

// GET contacts with search and pagination
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = {
        userId: req.userId,
        $or: [
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') }
        ]
    };
    const contacts = await Contact.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    const count = await Contact.countDocuments(query);
    res.json({ contacts, totalPages: Math.ceil(count / limit) });
});

// POST create contact
router.post('/', async (req, res) => {
    const contact = new Contact({ ...req.body, userId: req.userId });
    await contact.save();
    res.status(201).json(contact);
});

// PUT update contact
router.put('/:id', async (req, res) => {
    const contact = await Contact.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true }
    );
    res.json(contact);
});

// DELETE contact
router.delete('/:id', async (req, res) => {
    await Contact.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Contact deleted' });
});

// EXPORT contacts to CSV
router.get('/export', async (req, res) => {
    const contacts = await Contact.find({ userId: req.userId });
    const csvStream = csv.format({ headers: true });
    res.setHeader('Content-Disposition', 'attachment; filename=\"contacts.csv\"');
    res.set('Content-Type', 'text/csv');
    csvStream.pipe(res);
    contacts.forEach(contact => csvStream.write(contact));
    csvStream.end();
});

// IMPORT contacts from CSV
router.post('/import', upload.single('file'), async (req, res) => {
    const contacts = [];
    fs.createReadStream(req.file.path)
        .pipe(csv.parse({ headers: true }))
        .on('data', row => contacts.push({ ...row, userId: req.userId }))
        .on('end', async () => {
            await Contact.insertMany(contacts);
            fs.unlinkSync(req.file.path);
            res.json({ message: 'Contacts imported' });
        });
});

module.exports = router;
