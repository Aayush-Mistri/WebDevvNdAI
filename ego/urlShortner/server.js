import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

const store = {};

app.post('/shorten', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }

  const code = crypto.randomBytes(4).toString('hex');
  store[code] = url;
  console.log(code)

  res.json({
    shortCode: code,
    shortUrl: `http://localhost:3000/${code}`
  });
});


app.get('/:code', (req, res) => {
  const code  = req.params.code;
  const url = store[code];

  console.log(code)
  console.log(url)
  console.log(store)

  if (!url) {
    return res.status(404).json({ error: 'URL not found' });
  }

  res.redirect(url);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});