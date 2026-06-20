const express = require('express');
const fs = require('fs/promises');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const BOOKS_FILE = path.join(DATA_DIR, 'books.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


console.log(DATA_DIR)
console.log(BOOKS_FILE)


async function ensureBooksFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(BOOKS_FILE);
  } catch {
    await fs.writeFile(BOOKS_FILE, '[]', 'utf8');
  }
}

async function readBooks() {
  await ensureBooksFile();
  const data = await fs.readFile(BOOKS_FILE, 'utf8');
  return JSON.parse(data);
}

async function writeBooks(books) {
  await ensureBooksFile();
  await fs.writeFile(BOOKS_FILE, JSON.stringify(books, null, 2), 'utf8');
}

function buildBookFromBody(body) {
  return {
    title: body.title?.trim(),
    author: body.author?.trim(),
    year: body.year === undefined ? null : Number(body.year),
    genre: body.genre?.trim() || null,
    isRead: Boolean(body.isRead),
  };
}

function validateBook(book) {
  if (!book.title) return 'title is required';
  if (!book.author) return 'author is required';
  if (book.year !== null && !Number.isInteger(book.year)) {
    return 'year must be a whole number';
  }

  return null;
}

app.get('/', (req, res) => {
  res.json({
    message: 'Bookshelf API is running',
    routes: {
      listBooks: 'GET /books',
      getBook: 'GET /books/:id',
      addBook: 'POST /books',
      updateBook: 'PUT /books/:id',
      deleteBook: 'DELETE /books/:id',
    },
  });
});

app.get('/books', async (req, res, next) => {
  try {
    const books = await readBooks();
    res.json(books);
  } catch (error) {
    next(error);
  }
});

app.get('/books/:id', async (req, res, next) => {
  try {
    const books = await readBooks();
    const book = books.find((item) => item.id === Number(req.params.id));

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    next(error);
  }
});

app.post('/books', async (req, res, next) => {
  try {
    const books = await readBooks();
    const newBook = {
      id: Date.now(),
      ...buildBookFromBody(req.body),
    };
    const validationError = validateBook(newBook);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    books.push(newBook);
    await writeBooks(books);
    res.status(201).json({ message: 'Book added', book: newBook });
  } catch (error) {
    next(error);
  }
});

app.put('/books/:id', async (req, res, next) => {
  try {
    const books = await readBooks();
    const bookIndex = books.findIndex((book) => book.id === Number(req.params.id));

    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const updatedBook = {
      ...books[bookIndex],
      ...buildBookFromBody({ ...books[bookIndex], ...req.body }),
      id: books[bookIndex].id,
    };
    const validationError = validateBook(updatedBook);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    books[bookIndex] = updatedBook;
    await writeBooks(books);
    res.json({ message: 'Book updated', book: updatedBook });
  } catch (error) {
    next(error);
  }
});

app.delete('/books/:id', async (req, res, next) => {
  try {
    const books = await readBooks();
    const bookIndex = books.findIndex((book) => book.id === Number(req.params.id));

    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const [deletedBook] = books.splice(bookIndex, 1);
    await writeBooks(books);
    res.json({ message: 'Book deleted', book: deletedBook });
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
