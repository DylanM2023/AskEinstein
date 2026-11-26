import { useEffect, useState } from "react";

const API = "http://localhost:3000"

function App() {

    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([]);
    const [nodeId, setNodeId] = useState(null);
    const [options, setOptions] = useState([]);
    const [ended, setEnded] = useState(null);

    const startConversation = async () => {
        try {
            const response = await fetch(`${API}/api/start`);
            const data = await response.json();
            setNodeId(data.nodeId);
            setOptions(data.options);
            setEnded(false);
            setHistory([{sender: "bot", text: data.message}]);
        } catch (err) {
            setHistory([{sender: "bot", text: `Couldn't reach the server: ${err.message}`}]);
        }
    }

    // Run once on first load
    useEffect(() => {
        startConversation();
    }, []);

    // Sends a choice to the server
    const MessageHandler = async (text = message) => {
        if (!text.trim()) return;

        // Add user's message to chat, using the rest operator to copy existing messages
        setHistory((prev) => [...prev, { sender: "user", text: text }]);

        //this clears the input box after sending
        setMessage("");

        try {
            // Send current node and user's choice to backend
            const response = await fetch(`${API}/api/message`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({nodeId, text}),
            });

            const data = await response.json();

            // Move to next node and add bot's reply
            setNodeId(data.nodeId);
            setOptions(data.options);
            setEnded(data.end);
            setHistory((prev) => [...prev, {sender: "bot", text: data.message}]);
        } catch (err) {
            setHistory((prev) => [...prev, {sender: "bot", text: `Error: ${err.message}`}])
        }
    };

    // Bound the enter key submit whatever is in input box
    // Bound backspace to clearing the chat
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            MessageHandler()
        }
        if (e.key === "Delete") {
            startConversation()
        }
    };
    

    return(
    <>
        <h1 className="font-bold text-6xl">AskEinstein?</h1>
        <div className="flex-col w-full justify-items-center py-3">
            <h2 className="text-2xl">Messages</h2>

            <div className="message-container border-2 w-2/3 h-100 overflow-y-scroll">
                {history.map((m, i) => (
                    <div key={i}>
                        <strong>{m.sender === "user" ? "You" : "Bot"}:</strong> {m.text}
                    </div>
                ))}
            </div>

            {/* Options buttons for current node */}
            {!ended && (
                <div className="w-2/3 flex flex-wrap gap-2 py-2">
                    {options.map((label) => (
                        <button
                        key={label}
                        className="p-2 border-2 rounded-2xl hover:bg-blue-50"
                        onClick={() => MessageHandler(label)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            <div className="w-2/3 flex gap-10 py-2">
                <input 
                className="border-2 grow max-w-2/3" type="search" 
                placeholder={ended ? "Conversation ended, press Restart" : "Or type your answer"}
                value={message} 
                disabled ={ended}
                onChange={(e)=>{setMessage(e.target.value)}}
                onKeyDown={handleKeyDown}
                />
                <div className=" jusrobject-right flex gap-2">
                    <button className="p-2 border-2 rounded-2xl hover:bg-blue-50" onClick={() => MessageHandler()}>Enter</button>
                    <button className="p-2 border-2 rounded-2xl hover:bg-blue-50" onClick={startConversation}>Restart</button>
                </div>
            </div>
        </div>

    </>
    );
};

export default App