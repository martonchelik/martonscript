document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        chrome.storage.local.get('checkboxStates', function(result) {
            if (result.checkboxStates && result.checkboxStates.documentsSet) {
                displayDocs();
            }
        });
    }
});

function displayDocs() {
    const docPanel = document.getElementById('document_panel')
    const phone = document.getElementById('phones_sidebar_section').getElementsByTagName('li')[0].getElementsByTagName('div')[0].textContent
    const emailConfirmed = document.getElementById('player_info_sidebar_section').getElementsByTagName('td')[12].textContent.toLowerCase()
    const paymentOptions  = document.getElementsByClassName('panel')[9]
    const paymentOptionsCopy  = paymentOptions.cloneNode(true)
    let phoneVerified = document.createElement("span");
    let nameEmail = document.createElement("span");
    let birthday = document.createElement("span");
    let locale = document.createElement("span")
    let containerH3 = document.createElement("h3")
    let email = document.createElement("span")
    let container = document.createElement("div");
    container.setAttribute('class', 'doc-container')
    birthday.textContent = document.getElementById('player_details_sidebar_section').getElementsByTagName('td')[4].textContent
    birthday.setAttribute('class', 'player-tag')
    birthday.style.backgroundColor = '#7e6afe'
    locale.textContent = document.getElementById('player_info_sidebar_section').getElementsByTagName('td')[7].textContent
    locale.setAttribute('class', 'player-tag')
    nameEmail.textContent = document.getElementById('page_title').textContent
    nameEmail.setAttribute('class', 'player-tag')
    nameEmail.style.backgroundColor = '#025fac'
    if (!emailConfirmed.includes('never')){
        email.textContent = 'подтверждённая почта'
        email.setAttribute('class', 'player-tag player-tag-verified')
    }else{
        email.textContent = 'неподтверждённая почта'
        email.setAttribute('class', 'player-tag player-tag-Не_выводить')
    }
    if (phone.includes('(Активный, Подтвержденный)')){
        phoneVerified.textContent = 'тел. подтверждён'
        phoneVerified.setAttribute('class', 'player-tag player-tag-verified')
    }else{
        phoneVerified.textContent = 'тел. не подтверждён'
        phoneVerified.setAttribute('class', 'player-tag player-tag-Не_выводить')
    }
    container.append(nameEmail, birthday, phoneVerified, email, locale)
    containerH3.appendChild(container.cloneNode(true))
    docPanel.getElementsByTagName('h3')[0].appendChild(container)
    docPanel.appendChild(containerH3)
    document.getElementById('main_content').appendChild(paymentOptionsCopy)
    docPanel.after(paymentOptionsCopy)
}