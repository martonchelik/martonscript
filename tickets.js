document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        chrome.storage.local.get('checkboxStates', function(result) {
            if(result.checkboxStates.ticketSet){
                let paymentAction = document.getElementsByClassName('row-action')[0].getElementsByTagName('td')[0].textContent
                let userEmailRow = document.getElementsByClassName('row-user')[0].getElementsByTagName('div')[0]
                let paymentID = parseInt(window.location.href.split("/")[5]);
                let projectName = window.location.href.split(".")[2]
                let externalKey = document.getElementsByClassName('row-external_id')[0].getElementsByTagName('td')[0].textContent
                let paymentKey = document.getElementsByClassName('row-source_id')[0].getElementsByTagName('td')[0].textContent
                let paymentSystem = document.getElementsByClassName('row-payment_system')[0].getElementsByTagName('td')[0].textContent
                const externalPaySys = ["Black Rabbit", "Platcore", "Expay", "Aifory", "Cypix", "Accentpay", "Sgate", "TranZex", "Gogetaway"];
                let ticketClip

                if (paymentAction == "Депозит" || paymentAction == "Deposit"){
                    if(externalPaySys.some(payments=> paymentSystem.includes(payments))){
                        ticketClip = externalKey + " "
                    }else{
                        ticketClip = paymentKey + " "
                    }
                }else if (paymentAction == "Выплата" || paymentAction == "Cashout"){
                    if(paymentKey.toLowerCase().includes('пусто')){
                        ticketClip = externalKey + " "
                    }else{
                        ticketClip = paymentKey + " "
                    }
                }
                console.log(paymentAction)

                ticketClip += projectName + " " + paymentID

                if(paymentSystem.includes("Star2Pay")){
                    ticketClip = "Проверьте сделку\n id: " + externalKey + "\n @Star2HelperBot"
                }

                userEmailRow.innerHTML +=`<div><button id="ticketInfoButton">`+ "Скопировать инфо по платежу" +`</button></div>`
                document.getElementById("ticketInfoButton").addEventListener('click', ()=>{
                    navigator.clipboard.writeText(ticketClip).then(() =>{console.log(ticketClip)});
                })
            }
        })
    }
});

