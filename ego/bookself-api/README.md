# Bookshelf REST API

A small Node + Express API that stores books in `data/books.json`.

## Run

```bash
npm run dev
```

The server starts at `http://localhost:3000`.

## Routes

| Method | URL | What it does |
| --- | --- | --- |
| GET | `/` | Shows available routes |
| GET | `/books` | Lists all books |
| GET | `/books/:id` | Gets one book |
| POST | `/books` | Adds a book |
| PUT | `/books/:id` | Updates a book |
| DELETE | `/books/:id` | Deletes a book |

## Example POST body

```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt and David Thomas",
  "year": 1999,
  "genre": "Programming",
  "isRead": false
}
```

## Example PUT body

You can send the full book or just the fields you want to change.

```json
{
  "isRead": true
}
```
