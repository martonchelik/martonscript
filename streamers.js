document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        chrome.storage.local.get('checkboxStates', function(result) {
            if(result.checkboxStates.streamerInfoSet){
                copyTicketInfo(result.checkboxStates.streamerCommSet);
            }
        })
    }
});

function copyTicketInfo(streamerCommSet) {
    let wagerPlayedSide = null;
    if (document.getElementById("deposit_turnover_sidebar_section") != undefined) {
        wagerPlayedSide = document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0].getElementsByTagName('span')[0] === undefined ?
            document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0] :
            document.getElementById("deposit_turnover_sidebar_section").getElementsByTagName("a")[0].getElementsByTagName('span')[0];
    }
    const wagerPlayedMain = document.getElementsByClassName("row-deposit_turnover")[0] ? document.getElementsByClassName("row-deposit_turnover")[0].getElementsByTagName("span")[0] : null

    let paymentAction = document.getElementsByClassName('row-action')[0].getElementsByTagName('td')[0].textContent
    let amount = document.getElementsByClassName('row-amount')[0].getElementsByTagName('td')[0].textContent
    let userEmailRow = document.getElementsByClassName('row-user')[0].getElementsByTagName('div')[0]
    let userEmail = document.getElementsByClassName('row-user')[0].getElementsByTagName('div')[0].getElementsByTagName('a')[0].textContent
    let projectName = window.location.href.split(".")[2].toUpperCase()
    let paymentSystem = document.getElementsByClassName('row-payment_system')[0].getElementsByTagName('td')[0].textContent
    const cryptoSys = ["CoinsPaid", "Cryptopay", "Binance"];

    if ((paymentAction == "Выплата" || paymentAction == "Cashout")&& userEmailRow.parentElement.innerHTML.includes('стример_согласование_выплаты')){
        let streamerInfo = projectName + " " + userEmail + " " + amount;
        if(cryptoSys.some(payments=> paymentSystem.includes(payments))){
            streamerInfo += " " + paymentSystem
        }
        if (!wagerPlayedSide.classList.contains('green') && wagerPlayedMain.classList.contains("red")) {
            streamerInfo += " " + "(не отыгран)"
        }
        userEmailRow.innerHTML +=`<div><button id="ticketInfoButton">`+ "Скопировать инфо по платежу стримера" +`</button></div>`
        document.getElementById("ticketInfoButton").addEventListener('click', ()=>{
            navigator.clipboard.writeText(streamerInfo).then(() =>{console.log(streamerInfo)});
            if(streamerCommSet){
                document.getElementById('active_admin_comment_body').value = "На согласовании"
                document.getElementById('active_admin_comment_submit_action').getElementsByTagName('input')[0].click()
            }
        })
    }







}