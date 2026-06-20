import express from "express"
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const app = express()
const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/' , (req , res)=>{
    console.log("sever running")
    
})



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
