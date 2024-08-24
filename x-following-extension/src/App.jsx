import React, { useState } from 'react';

function App() {
  const [following, setFollowing] = useState([]);
  const [screenshots, setScreenshots] = useState([]);

  const getFollowing = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: scrapeFollowing,
      },
      (results) => {
        setFollowing(results[0].result);
      }
    );
  };

  const scrapeFollowing = () => {
    const UserCell = document.querySelectorAll('[data-testid="UserCell"]');
    const followingUsers = [...UserCell].map((user) => {
      const username = user.querySelector('a').href.split('/').pop();
      const name = user.querySelector('span').textContent;

      const isFollowing = [...user.querySelectorAll('span')].some(
        (span) => span.innerText === 'Following'
      );

      if (isFollowing) {
        return { name, username };
      }

      return null;
    });

    return followingUsers.filter((user) => user !== null);
  };

  const takeScreenshot = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, (dataUrl) => {
      setScreenshots((prevScreenshots) => [...prevScreenshots, dataUrl]);
    });
  };

  

  return (
    <div>
      <h1>Following List</h1>
      <button onClick={getFollowing}>Scrape Following List</button>
      <button onClick={takeScreenshot}>Take Screenshot</button>
      {following.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {following.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {screenshots.length > 0 && (
        <div>
          <h2>Screenshots</h2>
          {screenshots.map((screenshot, index) => (
            <img
              key={index}
              src={screenshot}
              alt={`Screenshot ${index + 1}`}
              style={{ maxWidth: '100%' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
