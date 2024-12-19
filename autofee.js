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
function waitForElementInNode(parentNode, selector, callback) {
    const observerInNode = new MutationObserver((mutations, obs) => {
        const element = parentNode.querySelector(selector);
        if (element) {
            obs.disconnect();
            callback(element);
        }
    });

    observerInNode.observe(document.body, {
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
        let unverifiedPaymentsSet
        let authAutoSubmitSet

        function applyCheckboxStates(states) {
            tickSet = states.tickSet
            warningSet = states.warningSet
            cancelSet = states.cancelSet
            obvTicksSet = states.obvTicksSet
            notPlayedSet = states.notPlayedSet
            unverifiedPaymentsSet = states.unverifiedPaymentsSet
            authAutoSubmitSet = states.authAutoSubmitSet

        }

        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'local' && changes.checkboxStates) {
                location.reload();
            }
        });
        if (window.location.href.indexOf("payments/") != -1) {
            let IBAN = document.getElementsByClassName('row-bank_transfer')[0]
                ? document.getElementsByClassName('row-bank_transfer')[0].getElementsByTagName('td')[0].textContent : null
            if (!IBAN){
                IBAN = document.getElementsByClassName('row-bank_bill')[0]
                    ? document.getElementsByClassName('row-bank_bill')[0].getElementsByTagName('td')[0].textContent : null
            }
            const bannedIBANS = [
                "IE08PFSR99107016633568",
                "IE13PFSR99107016636000",
                "IE13PFSR99107016636291",
                "IE14PFSR99107016641026",
                "IE24PFSR99107016632116",
                "IE35PFSR99107016633761",
                "IE39PFSR99107016634562",
                "IE56PFSR99107016642695",
                "IE57PFSR99107016609794",
                "IE64PFSR99107016632269",
                "IE65PFSR99107016636422",
                "IE75PFSR99107016634787",
                "IE77PFSR99107016642220",
                "IE81PFSR99107016642342",
                "IE88PFSR99107016636105",
                "IE89PFSR99107016506204",
                "IE91PFSR99107016636536",
                "IE95PFSR99107016642575"
            ];
            const isIBANBanned = bannedIBANS.includes(IBAN)



            let wagerPlayedSide = null;
            if (document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0] != undefined) {
                wagerPlayedSide = document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0].getElementsByTagName('span')[0] === undefined ?
                    document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0] :
                    document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0].getElementsByTagName('span')[0];
            }
            const wagerPlayedMain = document.getElementsByClassName("row-deposit_turnover")[0] ? document.getElementsByClassName("row-deposit_turnover")[0].getElementsByTagName("span")[0] : null


            const feeAgreement = document.getElementsByClassName("row-cashout_fee_agreement")[0] ? 1 : null

            let isOk = -10;
            if(!wagerPlayedSide){
                isOk = 0
            } else if (!wagerPlayedSide.classList.contains('green') && wagerPlayedMain.classList.contains("red") && feeAgreement != null) {
                isOk = 1
            } else if (!wagerPlayedSide.classList.contains('green') && wagerPlayedMain.classList.contains("red") && feeAgreement == null) {
                isOk = -1
            } else isOk = 0



            chrome.storage.local.get('checkboxStates', (result) => {
                if (result.checkboxStates.paymentSet) {
                    applyCheckboxStates(result.checkboxStates);
                    const checkbox = document.getElementById('payment_fees');
                    if (!document.getElementsByClassName('payment-player-tags')[0].getElementsByClassName("player-tag-gambling_addict")[0]) {
                        switch (isOk) {
                            case 1:
                                if (checkbox && tickSet) {
                                    checkbox.click();
                                }
                                ;
                                break;
                            case -1:
                                if (notPlayedSet) {
                                    noFeeNoBlock();

                                }
                                break;
                            case 0:
                                break;
                            default:
                                console.log("smth vent wrong");
                        }
                    }
                    let wasAlreadySet = 0
                    waitForElement('payment_deposit_not_wagered', (element) => {
                        if (cancelSet && (isOk == 1 || isOk == -1) && !wasAlreadySet) {
                            element.click();
                            wasAlreadySet = 1;
                        }
                    });
                    waitForElement('payment_without_reason', (element) => {
                        if (obvTicksSet && element.click) {
                            if (!document.getElementById('payment_send_to_email').checked) document.getElementById('payment_send_to_email').click()
                            if (!document.getElementById('payment_send_to_messenger').checked) document.getElementById('payment_send_to_messenger').click()
                        }
                        if (obvTicksSet) {
                            element.addEventListener("change", () => {
                                if (element.checked) {
                                    if (!document.getElementById('payment_send_to_email').checked) document.getElementById('payment_send_to_email').click()
                                    if (!document.getElementById('payment_send_to_messenger').checked) document.getElementById('payment_send_to_messenger').click()
                                }
                            })
                        }

                    });

                    if(unverifiedPaymentsSet){
                        const sbp =  document.getElementsByClassName('row-sbp')[0]
                            ? document.getElementsByClassName('row-sbp')[0].getElementsByTagName('td')[0].textContent.split(',')[0] : null
                        const cardMask =  document.getElementsByClassName('row-card_mask')[0]
                            ? document.getElementsByClassName('row-card_mask')[0].getElementsByTagName('td')[0].textContent : null
                        const cryptoWallet =  document.getElementsByClassName('row-crypto')[0]
                            ? document.getElementsByClassName('row-crypto')[0].getElementsByTagName('td')[0].textContent : null
                        const paymentOptionsTable = document.getElementById('payment_option_sidebar_section')
                        const paymentVerified = paymentOptionsTable.innerHTML.includes('status_tag yes')
                        const paymentUsed = paymentOptionsTable.innerText.includes(IBAN) || paymentOptionsTable.innerText.includes(cardMask) || paymentOptionsTable.innerText.includes(cryptoWallet) || paymentOptionsTable.innerText.includes(sbp)

                        let sbpPaste = 0
                        let cardMaskPaste = 0
                        let IBANPaste = 0
                        let cryptoWalletPaste = 0

                        waitForElement('payment_bank_account', (element) =>{
                            if(element.click && (!paymentVerified||!paymentUsed)){
                                document.getElementById('payment_id_bank_account').value = IBAN;
                                IBANPaste = 1
                            }
                        })
                        waitForElement('payment_payment', (element) =>{
                            if(element.click && (!paymentVerified||!paymentUsed)){
                                document.getElementById('payment_card_mask').value = cardMask;
                                cardMaskPaste = 1
                            }
                        })
                        waitForElement('payment_crypto', (element) =>{
                            if(element.click && (!paymentVerified||!paymentUsed)){
                                console.log('not used or verified')
                                document.getElementById('payment_wallet_mask').value = cryptoWallet;
                                cryptoWalletPaste = 1
                            }
                        })
                        waitForElement('payment_SBP_number', (element) =>{
                            if(element.click && (!paymentVerified||!paymentUsed)){
                                document.getElementById('payment_phone_number').value = sbp;
                                sbpPaste = 1
                            }
                        })
                    }
                    if(authAutoSubmitSet){
                        waitForElement('payment_fees', (checkbox) => {
                            try {
                                const paymentForm = checkbox.closest('form'); // Simplify DOM traversal
                                if (!paymentForm) {
                                    console.error('Payment form not found');
                                    return;
                                }

                                const authCodeInput = paymentForm.querySelector('#payment_authentication_code');
                                if (!authCodeInput) {
                                    console.error('Authentication code input not found');
                                    return;
                                }

                                console.log(paymentForm);
                                console.log(authCodeInput);

                                const handleInput = () => {
                                    if (authCodeInput.value.length === 6) {
                                        paymentForm.submit();
                                        authCodeInput.removeEventListener('input', handleInput); // Clean up event listener
                                    }
                                };

                                authCodeInput.addEventListener('input', handleInput);
                            } catch (error) {
                                console.error('An error occurred:', error);
                            }
                        });
                    }
                }
            })
            const bitcoinColumn = document.getElementsByClassName('bitcoin-column')[0] === undefined ? null : document.getElementsByClassName('bitcoin-column')[0];
            const payPanel = document.getElementsByClassName('panel')[2].getElementsByClassName('panel_contents')[0];
            if (isIBANBanned) bannedIBANWarning();
            console.log(isIBANBanned)


            function bannedIBANWarning() {
                document.getElementsByClassName('row-bank_transfer')[0].getElementsByTagName('td')[0].innerHTML +=`<b class="text-attention" style="padding-left: 20px"> Данный IBAN находится в списке запрещенных, отправьте выплату в check_players</b>`;
                bitcoinColumn ? bitcoinColumn.style.display = 'none' : console.log("панель выплаты отсутствует")
                payPanel.innerHTML +=
                    `<div id="noFees"><h2 class="text-attention">Данный IBAN находится в списке запрещенных, отправьте выплату в check_players</h2><button id="noFeesConfirm" type="submit">Ок</buttonid></div>`;
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
    }
});