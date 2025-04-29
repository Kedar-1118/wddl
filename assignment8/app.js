// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

// Book model
const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    year: Number
});
const Book = mongoose.model('Book', BookSchema);

// User model
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

// Auth middleware
const authenticateToken = (req, res, next) => {
    const { authHeader } = req.body;
    const token = authHeader;
    console.log(token);
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'SECRET_KEY', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Register
app.post('/register', async (req, res) => {
    console.log("registering");
    console.log(req.params)
    console.log(req.body);
    if (!req.body) return res.status(400).send("No request body");
    const { username, password } = req.body;
    existingUser = await User.findOne({ username: username });
    if (existingUser) {
        return res.status(400).send("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username: username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
});

// Login
app.post('/login', async (req, res) => {
    // console.log(req.body);
    console.log(req.body.username, "  ", req.body.password);

    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ username: user.username }, 'SECRET_KEY');
    res.status(200).json({ token: token, message: "Login successful" });
});

// Add book
app.post('/books', authenticateToken, async (req, res) => {
    const bookBody = req.body["book"]
    console.log(bookBody);
    const book = new Book(bookBody);
    await book.save();

    res.status(201).json({
        book,
        message: "book added"
    });
});

// Update book
app.put('/books/:id', authenticateToken, async (req, res) => {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.send('Book updated');
});

// Delete book
app.delete('/books/:id', authenticateToken, async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.send('Book deleted');
});

// Fetch books with pagination and filtering
app.get('/books', async (req, res) => {
    const { page = 1, limit = 10, genre, author } = req.query;
    const filter = {};
    if (genre) filter.genre = genre;
    if (author) filter.author = author;

    const books = await Book.find(filter)
        .limit(limit * 1)
        .skip((page - 1) * limit);
    res.json(books);
});

// get particular book
app.get('/book/:id')

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
