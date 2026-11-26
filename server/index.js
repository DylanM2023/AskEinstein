import express from "express";
import cors from "cors";
import fs from "fs";

// Load the conversation flow as server starts
const convo = JSON.parse(
    fs.readFileSync(new URL("./data/einstein_conversation.json", import.meta.url), "utf-8")
);

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

// Transforms the nodeId into the shape the frontend needs
function buildReply(nodeId, prefix = "") {
    const node = convo.nodes[nodeId];
    return {
        nodeId,
        message: prefix ? `${prefix} ${node.text}` : node.text,
        options: node.options.map((o) => o.label),
        end: node.end ?? false,
    };
}

app.get('/', (req, res) => {
    res.send('Hello I am Einstein!');
});

// Start of the conversation, gives back the welcome node
app.get('/api/start', (req, res) => {
    res.json(buildReply(convo.start));
});

// Client sends which node its on and what the user picked
app.post('/api/message', (req, res) => {
    const {nodeId, text} = req.body;
    const current = convo.nodes[nodeId];

    // Unknown node
    if (!current) return res.json(buildReply(convo.start));

    const input = (text ?? "").trim().toLowerCase();

    // Match either label or number
    const choice = current.options.find(
        (o, i) => o.label.toLowerCase() === input || String(i + 1) === input
    );

    if (choice) return res.json(buildReply(choice.next));

    // No match, using the fallback
    return res.json(buildReply(convo.fallback.next, convo.fallback.text));
});

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});