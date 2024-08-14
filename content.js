document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        chrome.runtime.sendMessage({ message: "CSL" });

        let tickSet
        let warningSet

        let tickSetsy = chrome.storage.local.get('tickSet').then(onOk)

        function onOk(item){
            console.log(item);
        }

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.message ) {
                case "tickSet":
                    console.log('Received tickSet states:', request.checked);
                    tickSet = request.checked
                    break;
                case "warningSet":
                    console.log('Received warningSet states:', request.checked);
                    warningSet = request.checked
                    break;
            }
        });

        const bitcoinColumn = document.getElementsByClassName('bitcoin-column')[0] === undefined ? null : document.getElementsByClassName('bitcoin-column')[0];

        const payPanel = document.getElementsByClassName('panel')[2].getElementsByClassName('panel_contents')[0];

        const wagerPlayedSide = document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0].getElementsByTagName('span')[0] === undefined ?
            document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0]:
            document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0].getElementsByTagName('span')[0];

        const wagerPlayedMain = document.getElementsByClassName("row-deposit_turnover")[0].getElementsByTagName("span")[0];

        let feeAgreement = null
        if (document.getElementsByClassName("row-cashout_fee_agreement")[0]) {
            feeAgreement = 1
        }

        let isOk = -10;
        if (!wagerPlayedSide.classList.contains('green')&&wagerPlayedMain.classList.contains("red")&&feeAgreement != null){
            isOk = 1

        }else if(!wagerPlayedSide.classList.contains('green')&&wagerPlayedMain.classList.contains("red")&&feeAgreement == null) {
            isOk = -1
        }else isOk = 0

        const checkbox = document.getElementById('payment_fees');

        function noFeeHover(){

            bitcoinColumn ? bitcoinColumn.style.display = 'none' : console.log("панель выплаты отсутствует")
            payPanel.innerHTML +=
                `<div id="noFees"><h2 class="text-attention">Отсутсвует соглашение на комиссию, продолжить?</h2><button id="noFeesConfirm" type="submit">ДА</buttonid></div>`;
            const noFees = document.getElementById('noFees');
            const noFeesConfirm = document.getElementById('noFeesConfirm');
            noFeesConfirm.addEventListener("click", () => {
                document.getElementsByClassName('bitcoin-column')[0].style.removeProperty('display');
                noFees.remove();
                console.log(bitcoinColumn.style.display, getComputedStyle(bitcoinColumn).display)
            })
        }

        switch (isOk) {

            case 1:
                if (checkbox) {
                    checkbox.checked = true;
                    console.log("checked");
                };
                break;
            case -1:
                if (bitcoinColumn){
                    noFeeHover();
                    console.log("no fee");
                }
                break;
            case 0:
                console.log("played");
                break;
            default:
                console.log("smth vent wrong");
        }
    }
});