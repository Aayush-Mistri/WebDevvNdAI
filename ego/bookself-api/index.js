const express = require('express');
const app = express();

app.use(express.json());


let books = []

app.get('/', (req, res) => {
    res.json({ message: "Bookshelf API working" })
})

app.get('/books', (req, res) => {
    res.json(books)
})

app.post('/books', (req, res) => {
    const book = req.body;
    book.id = Date.now()
    books.push(book);
    res.json({ message: "Book added", book })
})


// the server is listening on port 3000 hello
app.listen(3000, () => {
    console.log("Server running on port 3000")
})