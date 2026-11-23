import { useState } from "react";

function App() {

    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([]);

    const MessageHandler = (e) => {
        e.preventDefault()
        setHistory([...history, message])
        setMessage("")
    };

    return(
    <>
        <h1>AskEinstein?</h1>
        <h2>Messages:</h2>

        <ul>
            {history.map((item, index)=>(
                <p key={index}>You: {item}</p>
            ))}
        </ul>

        <div>
            <input type="search" placeholder="Ask Question" value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
            <button onClick={MessageHandler}>Enter</button>
            <button onClick={()=>{setHistory([])}}>Clear</button>
        </div>

    </>
    );
};

export default App