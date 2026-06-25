import express from "express"
import crypto from "crypto"
import path from "path";
import { fileURLToPath } from "url";

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const store = {} // ✅ object, not array

app.get('/pastes', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
})

app.post('/pastes', (req, res) => {
    const name = req.body.name   // ✅ scoped with const
    const email = req.body.email

    const code = crypto.randomBytes(4).toString('hex') // ✅ defined first
    store[code] = { name, email, content: req.body.content } // ✅ store the data

    res.json({
        shortCode: code,
        reUrl: `localhost:3000/pastes/${code}`
    })
})

app.get('/pastes/:code', (req, res) => {
    const code = req.params.code;
    const paste = store[code];

    if (!paste) {
        return res.status(404).send('<h1>404 - Paste not found</h1>')
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Paste by ${paste.name}</title></head>
        <body style="font-family: Arial; max-width: 600px; margin: 40px auto; padding: 0 20px;">
            <h2>Paste by ${paste.name}</h2>
            <p><strong>Email:</strong> ${paste.email}</p>
            <hr/>
            <pre style="background:#f4f4f4; padding:15px; border-radius:6px;">${paste.content}</pre>
        </body>
        </html>
    `)
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});