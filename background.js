'use strict';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "injectCSS") {
        async function getCurrentTab() {
            let queryOptions = { active: true, lastFocusedWindow: true };
            let [tab] = await chrome.tabs.query(queryOptions);
            return tab;
        }

        (async () => {
            const currentTab = await getCurrentTab();
            chrome.scripting.insertCSS({
                files: ['simple.css'],
                target: {tabId: currentTab.id},
            }).then(() => console.log(currentTab));
        })();
    }
});

