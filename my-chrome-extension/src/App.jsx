import React from 'react';

function App() {
    const handleClick = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['contentScript.js']
            });
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>posts-scraper</h1>
            <button onClick={handleClick}>Click All Posts</button>
        </div>
    );
}

export default App;
