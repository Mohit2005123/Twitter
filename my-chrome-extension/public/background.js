chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension Installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'takeScreenshot') {
        chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: 'png' }, (dataUrl) => {
            const filename = `screenshot_${message.postIndex}.png`;
            downloadScreenshot(dataUrl, filename);

            sendResponse({ success: true });
        });

        // Return true to indicate that response will be sent asynchronously
        return true;
    }
});

function downloadScreenshot(dataUrl, filename) {
    chrome.downloads.download({
        url: dataUrl,
        filename: filename,
        conflictAction: 'uniquify',
        saveAs: false
    });
}

