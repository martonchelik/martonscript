document.addEventListener('readystatechange', () => {
    function loadValues() {
        chrome.storage.local.get('checkboxStates', function(result) {
            if (result.checkboxStates){
                const themeSet = result.checkboxStates.themeSet
                console.log(themeSet)
                if (themeSet){
                    chrome.runtime.sendMessage({ action: "injectCSS" }).then(() => console.log('injectCSS sent'));
                }
            }
        });

    }
    if (document.readyState === 'complete') {
        loadValues();
    }
});