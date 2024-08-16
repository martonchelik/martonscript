document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {

        let warningSet
        let tickSet
        let cancelSet

        function applyCheckboxStates(states) {
            tickSet = states.tickSet
            warningSet = states.warningSet
            cancelSet = states.cancelSet
        }
            chrome.storage.onChanged.addListener((changes, areaName) => {
                if (areaName === 'local' && changes.checkboxStates) {
                    location.reload();
                }
            });

        chrome.storage.local.get('checkboxStates', (result) => {
            if (result.checkboxStates) {
                applyCheckboxStates(result.checkboxStates);
                const checkbox = document.getElementById('payment_fees');
                const cancelNotWagered = document.getElementById('payment_deposit_not_wagered')
                switch (isOk) {
                    case 1:
                        if (checkbox && tickSet) {
                            checkbox.checked = true;
                            console.log("checked");
                        };
                        break;
                    case -1:
                        if (bitcoinColumn && warningSet){
                            noFeeHover();
                            console.log("no fee");
                        }else{
                            noFeeNoBlock();
                            console.log(bitcoinColumn);
                            console.log(warningSet);

                        }
                        if(cancelSet && cancelNotWagered){
                            cancelNotWagered.checked = true;
                            console.log("canceled");
                        }
                        break;
                    case 0:
                        console.log("played");
                        break;
                    default:
                        console.log("smth vent wrong");
                }
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