import { useState } from "react";

function App() {

    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([]);

    const MessageHandler = async () => {
        if (!message.trim()) return;

        // Add user's message to chat, using the rest operator to copy existing messages
        setHistory((prev) => [...prev, { sender: "user", text: message }]);

        // Send to backend through the API route /api/message which has an endpoint set up
        const response = await fetch("http://localhost:3000/api/message", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({text:message}),
        });

        //Get the response data, await means it is an asynchronous operation
        const data = await response.json();

        // Add server reply, again we are using the spread operator to copy existing messages
        // then we are using the data from the server response which tells us who the sender is and the message
        setHistory((prev) => [...prev, { sender: "bot", text: data.message }])

        //this clears the input box after sending
        setMessage("");
    };

    return(
    <>
        <h1>AskEinstein?</h1>
        <h2>Messages:</h2>

        <div className="message-container">
            {history.map((m, i) => (
                <div key={i}>
                    <strong>{m.sender === "user" ? "You" : "Bot"}:</strong> {m.text}
                </div>
            ))}
        </div>

        <div>
            <input type="search" placeholder="Ask Question" value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
            <button onClick={MessageHandler}>Enter</button>
            <button onClick={()=>{setHistory([])}}>Clear</button>
        </div>

    </>
    );
};

export default App