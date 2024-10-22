document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        chrome.storage.local.get('checkboxStates', function(result) {
            console.log(result.checkboxStates.checkPSSet)
            console.log(window.location.href.includes('user_email'))

            if(result.checkboxStates.checkPSSet && window.location.href.includes('user_email')){
                checkPaymentSystem();
            }
        })
    }
})

function checkPaymentSystem() {
    waitForPaymentTable((paymentTable) => {
        const rows = paymentTable.querySelectorAll(".ant-table-row");
        let today = new Date(Date.now());
        today = new Date(today.toISOString().split('T')[0])
        rows.forEach((row) =>{
            const paymentSystem = row.querySelectorAll(".ant-table-cell")[5].textContent.toLowerCase()
            const payDay = new Date(row.querySelectorAll(".ant-table-cell")[8].textContent.substring(0,10));
            const daysDifference = Math.round((today.getTime() - payDay.getTime()) / (1000 * 3600 * 24));
            if ((paymentSystem.includes('instadebit')||paymentSystem.includes('idebit')) && daysDifference <= 10){
                row.querySelectorAll(".ant-table-cell")[5].style.backgroundColor = '#ff8383'
                console.log('found insta')
            }else if(paymentSystem.includes('instadebit')||paymentSystem.includes('idebit')){
                row.querySelectorAll(".ant-table-cell")[5].style.backgroundColor = '#eed202'
            }

        })
        document.querySelectorAll('ul.ant-pagination')[0].parentElement.addEventListener('click',()=>{
            checkPaymentSystem();
        })
    });
}


function waitForPaymentTable(callback, intervalTime = 200, timeout = 5000) {
    const startTime = Date.now();
    const interval = setInterval(() => {
        const paymentTable = document.evaluate("//tbody[contains(., 'Логи')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
        if (paymentTable) {
            clearInterval(interval);
            callback(paymentTable);
        } else if (Date.now() - startTime >= timeout) {
            clearInterval(interval);
            console.error('Timeout: Payment table with text "Логи" not found within', timeout, 'ms');
        }
    }, intervalTime);
}


