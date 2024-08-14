const checkboxes = document.querySelectorAll('input[type="checkbox"]');

function saveCheckboxStates() {
    checkboxes.forEach((checkbox) => {
        localStorage.setItem(checkbox.id, checkbox.checked);
        chrome.runtime.sendMessage({ message: checkbox.id, checked: checkbox.checked })
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { message: checkbox.id, checked: checkbox.checked });
        });
        switch (checkbox.id) {
            case 'tickSet':
                chrome.storage.local.set({[checkbox.id]: checkbox.checked}).then(onOk,onErr);
                break;
            case 'warningSet':
                chrome.storage.local.set({'warningSet': checkbox.checked}).then(onOk,onErr);
                break;
        }
    });
}

function onOk(item){
    console.log(item);
}
function onErr(err){
    console.log(err)
}

    chrome.runtime.onStartup.addListener(function () {
        chrome.runtime.sendMessage({ message: checkbox.id, checked: checkbox.checked })
    })

function loadCheckboxStates() {
    checkboxes.forEach((checkbox) => {
        const savedState = localStorage.getItem(checkbox.id);
        console.log(checkbox.id)
        if (savedState !== null) {
            checkbox.checked = savedState === 'true';
        }
    });
}


checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', saveCheckboxStates);
});

document.addEventListener('DOMContentLoaded', loadCheckboxStates);


