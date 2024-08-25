document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        chrome.storage.local.get('checkboxStates', function(result) {
            if(result.checkboxStates.checkPS){
                checkPaymentSystem();
            }
        })
    }
})
function waitForElement(selector, callback) {
    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        let element = document.evaluate("//tbody[contains(., 'Логи')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
        if (element) {
            callback(element);

            // Create a new MutationObserver to watch for changes in the element
            const elementObserver = new MutationObserver((mutationsList, elementObserver) => {
                let newElement = document.evaluate("//tbody[contains(., 'Логи')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
                if (newElement && newElement !== element) {
                    element = newElement;
                    callback(element);
                }
            });

            // Start observing the element for changes
            elementObserver.observe(element, {
                childList: true,
                subtree: true
            });

            // Disconnect the original observer once the element is found
            observer.disconnect();
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}



function checkPaymentSystem() {
    waitForElement('ant-table-tbody', (element) => {
        console.log('Element found or changed:', element);
    });

}


const paymentTable = document.evaluate("//tbody[contains(., 'Логи')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
