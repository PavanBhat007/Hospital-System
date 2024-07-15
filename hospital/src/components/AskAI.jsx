import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

function AskAI() {
    const [answer, setAnswer] = useState("");
    const [query, setQuery] = useState("");

    async function askAi(query) {
        console.log(`Fetching from ${import.meta.env.VITE_REACT_APP_BACKEND_URL}/query | ${query}`);
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': true
            },
            body: JSON.stringify({query: query})
        });

        const data = await response.json();
        setAnswer(data.response);
        console.log(data.response);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        askAi(query);
    }

    return (
        <div>
            <div className='wrapper ai'>
                <h2 className='page-header'>Ask <span className='green-text-header'>AI</span></h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        <p>Mention your symptoms</p>
                        <input type="text" onChange={(e) => setQuery(e.target.value)} />
                    </label>
                    <button className='btn btn-submit' type="submit">Ask</button>
                </form>
                <div className='answer'>
                    <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
            </div>
        </div>
    )
}

export default AskAI;
