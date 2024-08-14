'use strict';

chrome.runtime.onInstalled.addListener(function() {

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        hostEquals: ''
                    },
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        hostContains: 'admin.crimson.'
                    },
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "CSL") {
        sendChecks();
        console.log('CSL received')
    }
});



let tickSet = chrome.storage.local.get('tickSet').then(onOk)
let warningSet = chrome.storage.local.get('warningSet').then(onOk)

function onOk(item){
    console.log(item);
}
function onErr(err){
    console.log(err)
}


/*
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.message ) {
        case "tickSet":
            console.log('Received tickSet states:', request.checked);
            tickSet = request.checked
            chrome.storage.local.set({tickSet}).then(onOk,onErr)
            break;
        case "warningSet":
            console.log('Received warningSet states:', request.checked);
            warningSet = request.checked
            chrome.storage.local.set({warningSet}).then(onOk,onErr)
            break;
    }
});
*/


function sendChecks() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { message: 'tickSet', checked: tickSet });
            chrome.tabs.sendMessage(tabs[0].id, { message: 'warningSet', checked: warningSet });
        });
        console.log("sended")
}