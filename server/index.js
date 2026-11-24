import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello I am Einstein!');
});

app.post('/api/message', (req, res) => {
    const {text} = req.body;
    console.log(text);
    return res.json({
        message: `Client typed "${text}". This is the server's default response`
    })
});

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});