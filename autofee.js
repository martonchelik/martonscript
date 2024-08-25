function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutations, obs) => {
        const element = document.getElementById(selector);
        if (element) {
            obs.disconnect();
            callback(element);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}


document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {

        let warningSet
        let tickSet
        let cancelSet
        let obvTicksSet
        let notPlayedSet

        function applyCheckboxStates(states) {
            tickSet = states.tickSet
            warningSet = states.warningSet
            cancelSet = states.cancelSet
            obvTicksSet = states.obvTicksSet
            notPlayedSet = states.notPlayedSet
        }
            chrome.storage.onChanged.addListener((changes, areaName) => {
                if (areaName === 'local' && changes.checkboxStates) {
                    location.reload();
                }
            });

        chrome.storage.local.get('checkboxStates', (result) => {
            if (result.checkboxStates.paymentSet) {
                applyCheckboxStates(result.checkboxStates);
                const checkbox = document.getElementById('payment_fees');
                if (!document.getElementsByClassName('payment-player-tags')[0].getElementsByClassName("player-tag-gambling_addict")[0]) {
                    switch (isOk) {
                        case 1:
                            if (checkbox && tickSet) {
                                checkbox.checked = true;
                                console.log("checked");
                            }
                            ;
                            break;
                        case -1:
                            if (bitcoinColumn && warningSet) {
                                noFeeHover();
                                console.log("no fee");
                            } else if (notPlayedSet){
                                noFeeNoBlock();

                            }
                            break;
                        case 0:
                            console.log("played");
                            break;
                        default:
                            console.log("smth vent wrong");
                    }
                }
                waitForElement('payment_deposit_not_wagered', (element) => {
                    if(cancelSet && (isOk == 1 || isOk == -1)){
                        element.click();
                        console.log("canceled");
                    }
                });
                waitForElement('payment_without_reason', (element) => {
                    if(obvTicksSet && element.checked){
                        if (!document.getElementById('payment_send_to_email').checked) document.getElementById('payment_send_to_email').click()
                        if (!document.getElementById('payment_send_to_messenger').checked) document.getElementById('payment_send_to_messenger').click()
                    }
                });
            }
        })
        const bitcoinColumn = document.getElementsByClassName('bitcoin-column')[0] === undefined ? null : document.getElementsByClassName('bitcoin-column')[0];

        const payPanel = document.getElementsByClassName('panel')[2].getElementsByClassName('panel_contents')[0];

        const wagerPlayedSide = document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0].getElementsByTagName('span')[0] === undefined ?
            document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0]:
            document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0].getElementsByTagName('span')[0];

        const wagerPlayedMain = document.getElementsByClassName("row-deposit_turnover")[0].getElementsByTagName("span")[0];

        const feeAgreement = document.getElementsByClassName("row-cashout_fee_agreement")[0] ? 1 : null

        let isOk = -10;
        if (!wagerPlayedSide.classList.contains('green')&&wagerPlayedMain.classList.contains("red")&&feeAgreement != null){
            isOk = 1
        }else if(!wagerPlayedSide.classList.contains('green')&&wagerPlayedMain.classList.contains("red")&&feeAgreement == null) {
            isOk = -1
        }else isOk = 0

        function noFeeHover(){
            bitcoinColumn ? bitcoinColumn.style.display = 'none' : console.log("панель выплаты отсутствует")
            payPanel.innerHTML +=
                `<div id="noFees"><h2 class="text-attention">Отсутсвует соглашение на комиссию, продолжить?</h2><button id="noFeesConfirm" type="submit">ДА</buttonid></div>`;
            const noFees = document.getElementById('noFees');
            const noFeesConfirm = document.getElementById('noFeesConfirm');
            noFeesConfirm.addEventListener("click", () => {
                document.getElementsByClassName('bitcoin-column')[0].style.removeProperty('display');
                noFees.remove();
            })
        }
        function noFeeNoBlock() {
            document.getElementsByClassName('dangerzone panel')[0].getElementsByClassName('panel_contents')[0].innerHTML +=
                `<div id="noFees"><h2 class="text-attention">Отсутсвует соглашение на комиссию, продолжить?</h2>`;
        }
    }
});