const express = require('express');
const app = express();

// Middleware to parse JSON (optional if you're using POST later)
app.use(express.json());

// Home Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Home Page' });
});

// About Route
app.get('/about', (req, res) => {
    res.status(200).json({ message: 'This is the About Page' });
});

// Contact Route
app.get('/contact', (req, res) => {
    res.status(200).json({ contact: 'email@example.com' });
});

// Dynamic Route: /users/:id
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.status(200).json({ userId });
});

// Dynamic Route: /products/:category/:productId
app.get('/products/:category/:productId', (req, res) => {
    const { category, productId } = req.params;
    res.status(200).json({ category, productId });
});

// 404 Route (Catch All)
app.use((req, res) => {
    res.status(404).json({ error: 'Page Not Found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
