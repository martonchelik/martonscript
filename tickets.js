document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        chrome.storage.local.get('checkboxStates', function(result) {
            function filter(input) {
                return input.replace(/[^\d.]/g, '');
            }
            let externalPaySys
            let externalPaySysDep
            chrome.storage.local.get(['exPaySysCashOut', 'exPaySysDep'], function(result) {
                externalPaySys = result.exPaySysCashOut.split(',');
                externalPaySysDep = result.exPaySysDep.split(',');
            })
            if(result.checkboxStates.ticketSet){
                let paymentAction = document.getElementsByClassName('row-action')[0].getElementsByTagName('td')[0].textContent
                let userEmailRow = document.getElementsByClassName('row-user')[0].getElementsByTagName('div')[0]
                let paymentID = parseInt(window.location.href.split("/")[5]);
                let projectName = window.location.href.split(".")[2]
                let externalKey = document.getElementsByClassName('row-external_id')[0].getElementsByTagName('td')[0].textContent
                let paymentKey = document.getElementsByClassName('row-source_id')[0].getElementsByTagName('td')[0].textContent
                let paymentSystem = document.getElementsByClassName('row-payment_system')[0].getElementsByTagName('td')[0].textContent
                let amount = parseInt(filter(document.getElementsByClassName('row-amount')[0].getElementsByTagName('td')[0].textContent))
                let ticketClip = ""

                if (paymentAction == "Депозит" || paymentAction == "Deposit"){
                    if(externalPaySys.some(payments=> paymentSystem.includes(payments))){
                        ticketClip = externalKey + " "
                    }else {
                        ticketClip = paymentKey + " "
                    }
                    ticketClip += projectName + " " + paymentID
                    if(paymentSystem.includes("Forta")){
                        ticketClip = "@ArbitrageC2CBot\n" + externalKey + "\n" + amount

                    }else if(paymentSystem.includes("Star2Pay")){
                        ticketClip = "Проверьте сделку\n id: " + externalKey + "\n @Star2HelperBot"
                    }else if(paymentSystem.includes("Aifory")){
                        ticketClip = paymentKey + "\n" + projectName + " " + paymentID
                    }
                }else if (paymentAction == "Выплата" || paymentAction == "Cashout"){
                    if(externalPaySysDep.some(payments=> paymentSystem.includes(payments))){
                        ticketClip = externalKey + " "
                    }else if (paymentKey.toLowerCase() == "пусто") {
                    }else{
                        ticketClip = paymentKey + " "
                    }
                    ticketClip += projectName + " " + paymentID
                    if(paymentSystem.includes("Star2Pay")) {
                        ticketClip = "Не поступила выплата\n id: " + externalKey + "\n @PIQ_Support"
                    }
                }
                userEmailRow.innerHTML +=`<div><button id="ticketInfoButton">`+ "Скопировать инфо по платежу" +`</button></div>`
                document.getElementById("ticketInfoButton").addEventListener('click', ()=>{
                    navigator.clipboard.writeText(ticketClip).then(() =>{console.log(ticketClip)});
                })
            }
        })
    }
});

