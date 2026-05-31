const express = require('express');
const app = express();
app.use(express.json());

let books = [];

// GET all books
app.get('/books', (req, res) => {
    res.json(books);
})

app.post('/books', (req, res) => {
    const book = req.body;
    book.id = Date.now();
    books.push(book);
    res.json({ message: "Book added", book });
})



app.put('/books/:id', (req, res) => {
    let index = books.findIndex((book) => book.id === Number(req.params.id));
    if (index === -1) return res.json({ message: "Book not found" });
    books[index] = { ...books[index], ...req.body };
    res.json({ message: "Book updated", book: books[index] });
})

app.delete('/books/:id', (req, res) => {
    let index = books.findIndex((book) => book.id === Number(req.params.id));
    if (index === -1) return res.json({ message: "Book not found" });
    books.splice(index, 1); 
    res.json({ message: "Book deleted" });
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})