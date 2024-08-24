function waitForElement(selector, callback) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            callback(element);
        }
    }, 100);
}

function clickPosts(index = 0) {
    const posts = document.querySelectorAll('article');

    if (index >= posts.length) {
        console.log("Finished clicking all posts on the page.");
        return;
    }

    const post = posts[index];
    post.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
        post.click();
        
        setTimeout(() => {
            // Wait for the post to load before taking a screenshot
            chrome.runtime.sendMessage({ action: 'takeScreenshot', postIndex: index }, (response) => {
                if (response.success) {
                    console.log(`Screenshot taken for post ${index}`);
                }
            });

            setTimeout(() => {
                window.history.back();
                setTimeout(() => clickPosts(index + 1), 2000);
            }, 3000);
        }, 2000); // Increased delay to ensure post is fully loaded
    }, 1000);
}

waitForElement('article', () => clickPosts());
