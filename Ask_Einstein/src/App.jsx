import { useEffect, useState } from "react";

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

    // Bound the enter key submit whatever is in input box
    // Bound backspace to clearing the chat
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            MessageHandler()
        }
        if (e.key === "Delete") {
            setHistory([])
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

            <div className="w-2/3 flex gap-10 py-2">
                <input 
                className="border-2 grow max-w-2/3" type="search" 
                placeholder="Ask Question" value={message} 
                onChange={(e)=>{setMessage(e.target.value)}}
                onKeyDown={handleKeyDown}
                />
                <div className=" jusrobject-right flex gap-2">
                    <button className="p-2 border-2 rounded-2xl hover:bg-blue-50" onClick={MessageHandler}>Enter</button>
                    <button className="p-2 border-2 rounded-2xl hover:bg-blue-50" onClick={()=>{setHistory([])}}>Clear</button>
                </div>
            </div>
        </div>

    </>
    );
};

export default App