document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        chrome.storage.local.get('checkboxStates', function(result) {
            if (result.checkboxStates.profileSet) {
                if(result.checkboxStates.cardsSet) cardCheck();
                if(result.checkboxStates.documentsSet) displayDocs(result.checkboxStates.askedTagSet, result.checkboxStates.imgInfoSet);
                if(result.checkboxStates.betsDublicateSet) betsDublicate();
            }

        });
    }
});


function waitForClass(selector, callback) {
    const observer = new MutationObserver((mutations, obs) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            obs.disconnect();
            callback(elements);

        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check in case elements are already present
    const initialElements = document.querySelectorAll(selector);
    if (initialElements.length > 0) {
        observer.disconnect();
        callback(initialElements);
    }
}


function displayDocs(askedTagSet, imgInfoSet) {
    //const docPanel = document.getElementById('document_panel')
    const docPanel = document.evaluate("//h3[contains(., 'Документы')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext().parentElement
    const phone = document.getElementById('phones_sidebar_section').getElementsByTagName('li')[0] ?
        document.getElementById('phones_sidebar_section').getElementsByTagName('li')[0].getElementsByTagName('div')[0].textContent :
        "bebra"
    const emailConfirmed = document.getElementById('player_info_sidebar_section').getElementsByTagName('td')[12].textContent.toLowerCase()
    const paymentOptions  = document.evaluate("//h3[contains(., 'Инструменты платежа')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext().parentElement;
    const paymentOptionsCopy  = paymentOptions.cloneNode(true)
    let phoneVerified = document.createElement("span");
    let nameEmail = document.createElement("span");
    let birthday = document.createElement("span");
    let locale = document.createElement("span")
    let containerH3 = document.createElement("h3")
    let playerInfoPreview = document.createElement("h3")
    let containerBottom = document.createElement("div");
    let email = document.createElement("span")
    let container = document.createElement("div");
    let editTags = document.querySelectorAll('a.user-tags-edit-mode-btn[href="#edit"]')[0]
    let tagPanel = document.getElementById('tag_template').parentElement;
    let saveTagsButton = tagPanel.querySelectorAll('input[value="Сохранить"]')[0]
    let currentTags = tagPanel.getElementsByClassName('current-tags')[0]
    let possibleTags = tagPanel.getElementsByClassName('possible-tags')[0]
    let editUrl = window.location.href.split('#')[0] + '/edit'
    let editButton = document.createElement('a')
    let seenButtons = document.querySelectorAll('a[href$="seen"]')
    console.log(seenButtons)
    seenButtons.forEach((button)=> {
        /*button.style.marginTop = '20px';
        button.style.marginBottom = '20px';*/
        let parDiv = button.parentElement
        let updDoc = parDiv.querySelectorAll('a[href*="update_document_widget"]')[0]
        parDiv.insertBefore(button, updDoc)
    })
    editButton.href = editUrl;
    editButton.textContent = 'Правка'
    editButton.style.paddingLeft = '2em'
    container.setAttribute('class', 'doc-container')
    containerBottom.setAttribute('class', 'doc-container')
    birthday.textContent = document.getElementById('player_details_sidebar_section').getElementsByTagName('td')[4].textContent
    birthday.setAttribute('class', 'player-tag')
    locale.textContent = document.getElementById('player_info_sidebar_section').getElementsByTagName('td')[7].textContent
    locale.setAttribute('class', 'player-tag')
    nameEmail.textContent = document.getElementById('page_title').textContent
    nameEmail.setAttribute('class', 'player-tag')
    nameEmail.style.backgroundColor = '#025fac'
    let birthdate = new Date(document
        .querySelector(".row.row-date_of_birth")
        .querySelector("td").innerText);

    let year = birthdate.getFullYear();
    const userTags = document
        .getElementById("user_tags")
        .getAttribute("data-tags");
    let isProfileVerified = userTags.indexOf("verified") == -1 ? 0 : 1;


    if(year >= 2003 && !isProfileVerified){
        document.getElementById(
            "page_title"
        ).innerHTML += `<b style="color:red"> ` + year + ` год`;
        birthday.style.backgroundColor = '#d55c54'
    }else if(year >= 2000 && !isProfileVerified){
        document.getElementById(
            "page_title"
        ).innerHTML += `<b style="color:#cccc00"> ` + year + ` год`;
        birthday.style.backgroundColor = '#d55c54'
    }else{
        birthday.style.backgroundColor = '#7e6afe'
    }
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
    playerInfoPreview.appendChild(container.cloneNode(true))
    playerInfoPreview.getElementsByClassName('doc-container')[0].id = 'canvasPlayerInfo'
    containerBottom = container.cloneNode(true)

    if (askedTagSet) {
        function stylesTagRemove(tag) {
            tag.style.padding = '2px 5px';
            tag.style.backgroundColor = '#e32400';
            tag.style.backgroundImage = 'none';
            tag.style.border = "none"
            tag.style.boxShadow = "0 2px 0 #747779"
        }
        let setTagsToRemove = new Set()
        let rtTimer = 0
        function removeTag(){
            editTags.click();
            function deleteTag(tag){
                possibleTags.querySelectorAll('div.player-tag').forEach((playertag) =>{
                    if (playertag.textContent.includes(tag)){
                        console.log(playertag.getElementsByTagName('a')[0])
                        console.log(playertag)
                        playertag.getElementsByTagName('a')[0].click();
                    }
                })
                document.getElementById(tag + '-remove-tag').remove()
                document.getElementById(tag + '-bottom-remove-tag').remove()
            }
            setTagsToRemove.forEach((tag) => deleteTag(tag));
            saveTagsButton.click()
            docPanel.scrollIntoView({behavior: 'instant', block: "center"});
            rtTimer = 0;
        }

        function removeTags(element, tag) {
            element.addEventListener('click', ()=>{
                if (!rtTimer){
                    setTagsToRemove.add(tag)
                    rtTimer = 1
                    setTimeout(removeTag, 1200)
                }else{
                    setTagsToRemove.add(tag)
                }
            })
        }
        function makeRemoveElement(tag, id) {
            let tagRemove = document.createElement('button')
            tagRemove.textContent = "asked for "+tag+" | x"
            tagRemove.id = id
            stylesTagRemove(tagRemove)
            removeTags(tagRemove, tag)
            return tagRemove;
        }
        if(currentTags.innerHTML.includes('asked for card')){
            const cardTagRemove = makeRemoveElement('card', 'card-remove-tag')
            const cardTagRemoveBottom = makeRemoveElement('card', 'card-bottom-remove-tag')
            container.appendChild(cardTagRemove)
            containerBottom.appendChild(cardTagRemoveBottom)
        }
        if(currentTags.innerHTML.includes('asked for docs')){
            const docsTagRemove = makeRemoveElement('docs', 'docs-remove-tag')
            const docsTagRemoveBottom = makeRemoveElement('docs', 'docs-bottom-remove-tag')
            container.appendChild(docsTagRemove)
            containerBottom.appendChild(docsTagRemoveBottom)
        }
        if(currentTags.innerHTML.includes('asked for selfie')){
            const selfieTagRemove = makeRemoveElement('selfie', 'selfie-remove-tag')
            const selfieTagRemoveBottom = makeRemoveElement('selfie', 'selfie-bottom-remove-tag')
            container.appendChild(selfieTagRemove)
            containerBottom.appendChild(selfieTagRemoveBottom)
        }
    }

    container.appendChild(editButton)
    containerBottom.appendChild(editButton.cloneNode(true))
    containerH3.appendChild(containerBottom)

    docPanel.getElementsByTagName('h3')[0].appendChild(container)
    docPanel.appendChild(containerH3)
    if (paymentOptions) {
        document.getElementById('main_content').appendChild(paymentOptionsCopy)
        docPanel.after(paymentOptionsCopy)
    }
    if(document.getElementsByClassName('document-removed')[0]){
        document.evaluate("//span[contains(., 'Показать удаленные')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext().textContent += ' (Есть удаленные)'
    }

    if(imgInfoSet){
        function observeDivContentChange(divElement) {
            const imageObserver = new MutationObserver((mutationsList, imageObserver) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        //console.log('Content of the div has changed!');
                        if (document.getElementById('canvasPlayerInfo') == null){
                            divElement.textContent = ''
                            divElement.appendChild(playerInfoPreview)
                        }
                    }
                }
            });

            const config = { childList: true, characterData: true, subtree: true };

            imageObserver.observe(divElement, config);

            return imageObserver;
        }


        waitForClass('.viewer-title', (docTitle) => {
            console.log(docTitle[0])
            observeDivContentChange(docTitle[0])
        })
    }

}

function cardCheck() {
    let depositsRow = document.querySelector("td.col.col-depozity");
    const depositsOverall = parseInt(depositsRow.textContent.replace(/[^\d]/g, '').slice(0, -2));
    let cashoutsRow = document.querySelector("td.col.col-vyplaty");
    const cashoutsOverall = parseInt(cashoutsRow.textContent.replace(/[^\d]/g, '').slice(0, -2));
    let holdRow = document.querySelector("td.col.col-vyplaty_v_holde");
    const holdOverall = parseInt(holdRow.textContent.replace(/[^\d]/g, '').slice(0, -2));
    const userCurrency = document.querySelector("td.col.col-valyuta > div > span").textContent;
    const userTags = document
        .getElementById("user_tags")
        .getAttribute("data-tags");
    let isProfileVerified = userTags.indexOf("verified") == -1 ? 0 : 1;
    const colorАttentive = "#d55c54";
    const colorVerified = "#A6F2A6";
    const colorNotVerified = "#C6C6C6";
    let maxLimits = {
        RUB: 30000,
        EUR: 300,
        USD: 300,
        UAH: 12000,
        KZT: 120000,
        NOK: 1200,
        PLN: 1200,
        TRY: 3600,
        CAD: 1200,
        AUD: 1200,
        NZD: 1200,
        BRL: 2400,
        Undefined: 400000000000000000000
    };
    let playerHasReachedLimitDeposits = depositsOverall >= maxLimits[userCurrency];
    let playerHasReachedLimitCashouts = cashoutsOverall >= maxLimits[userCurrency];
    let playerHasReachedLimitCashoutsWithHold = cashoutsOverall + holdOverall >= maxLimits[userCurrency];
    if (playerHasReachedLimitDeposits && !isProfileVerified) {
        depositsRow.style.backgroundColor = colorАttentive;
    }
    if (playerHasReachedLimitCashouts && !isProfileVerified) {
        cashoutsRow.style.backgroundColor = colorАttentive;
    }
    if (holdOverall > 0 && playerHasReachedLimitCashoutsWithHold && !isProfileVerified) {
        cashoutsRow.style.backgroundColor = colorАttentive;
        holdRow.style.backgroundColor = colorАttentive;
    }
    document.querySelector("#main_content > div:nth-child(8)").remove();
    let emb = document.querySelector("#main_content > div:nth-child(3)");
    if (emb.textContent.includes("Активные лимиты")) {
        emb.remove();
    }
    let table = document.querySelector("#main_content > div:nth-child(9) > div > table");
    table.rules = "none";
    const userid = window.location.pathname.slice(15);
    let commentsBlock = document.getElementById("active_admin_comments_for_user_" + userid);
    let unknownCards = [];
    for (var i = 1, row; row = table.rows[i]; i++) {

        let card = row.cells[3].textContent;
        let method = row.cells[2].textContent;
        let methodCurrency = row.cells[6]?row.cells[6].textContent:'Undefined';
        let deposits = parseInt(row.cells[7]?row.cells[7].textContent.slice(0, -2):0);
        let cashouts = parseInt(row.cells[8]?row.cells[8].textContent.slice(0, -2):0);
        let debt = parseInt(row.cells[9]?row.cells[9].textContent.slice(0, -2):0);
        let isVerified = 1
        if(row.cells[5]){
            isVerified = row.cells[5].textContent.indexOf("Да") == -1 ? 0 : 1;
        }
        //console.log('deps', deposits, 'cashouts', cashouts, 'limit for currency', maxLimits[methodCurrency], 'currency', methodCurrency, 'verified', isVerified)
        let methodHasReachedLimitDeposits = deposits >= maxLimits[methodCurrency];
        let methodHasReachedLimitCashouts = cashouts >= maxLimits[methodCurrency];
        let methodHasReachedLimitCashoutsWithHold = cashouts + holdOverall >= maxLimits[methodCurrency];
        if (isVerified){
            row.style.backgroundColor = colorVerified;
        }
        if (debt != 0){
            if (card.match(/\d{6}\*{6}\d{4}/g) && methodHasReachedLimitDeposits && !isVerified) {
                row.cells[7].style.backgroundColor = colorАttentive;
            }
            if (card.match(/\d{6}\*{6}\d{4}/g) && methodHasReachedLimitCashouts && !isVerified) {
                row.cells[8].style.backgroundColor = colorАttentive;
            }
            if (card.match(/\d{6}\*{6}\d{4}/g) && methodHasReachedLimitCashoutsWithHold && !isVerified) {
                let cashoutsRow = row.cells[8];
                cashoutsRow.style.backgroundColor = colorАttentive;
                cashoutsRow.innerHTML += " + HOLD"
            }
        }
        let cardMask;
        try {
            cardMask = row.cells[3].innerText.match(/\d{6}\*{6}\d{4}/g);
        } catch (e) {
            console.log(`не карта, ошибка ` + e);
        }
        if (!cardMask) continue;
        let cardMaskRegEx = new RegExp(
            `${cardMask[0].replaceAll("*", "\\*")}`,
            "gi"
        );
        if (commentsBlock.innerText.match(cardMaskRegEx)) {
            row.cells[3].innerHTML += " - комент";

        }
        if (!isVerified && card.match(/\d{6}\*{6}\d{4}/g) && debt != 0){
            row.style.backgroundColor = colorNotVerified;
        }
        if (!isVerified && card.match(/\d{6}\*{6}\d{4}/g) && !row.cells[3].textContent.includes('комент') && debt != 0){
            unknownCards.push(card);

        }
        commentsBlock.innerHTML = commentsBlock.innerHTML.replaceAll(
            cardMaskRegEx,
            `<a style="color:red">${cardMask}</a>`
        );
    }
    // добавление кнопок
    const placeForButtons = document.querySelector("#main_content > div:nth-child(9) > h3");
    placeForButtons.innerHTML = "Инструменты платежа";
    placeForButtons.innerHTML +=
        `
      <a id="zxc"> Копировать карты</a> | <a href="#" id="downScroll"> К коментам</a>
`;
    const upScrollPlace = document.querySelector("#active_admin_comments_for_user_" + userid + " > h3");
    upScrollPlace.innerHTML += '<a href="#" id="upScroll"> К картам </a> ';
// копирование неверифицированных карт
    document.getElementById("zxc").style.cursor = 'pointer'
    document.getElementById("zxc").addEventListener("click", function () {
        let scriptText = "";
        for (let i = 0; i < unknownCards.length; i++) {
            scriptText += unknownCards[i];
            if (i < unknownCards.length - 1) {
                scriptText += ", ";
            }
        }
        console.log(scriptText);
        if(scriptText != ""){
            document.getElementById("zxc").style.color =
                "red";
            navigator.clipboard.writeText(scriptText);
        }
    });
// быстрые переходы
    document.getElementById("downScroll").addEventListener("click", function(event) {
        event.preventDefault();
        commentsBlock.scrollIntoView({behavior: 'instant', block: "center"});
    });
    document.getElementById("upScroll").addEventListener("click", function(event) {
        event.preventDefault();
        placeForButtons.scrollIntoView({behavior: 'instant', block: "center"});
    });
}

function betsDublicate() {
    let bets = document.querySelector("#games_links_sidebar_section > div > div:nth-child(2)").innerHTML;
    let sportBets = document.querySelector("#sport_bets_sidebar_section > div > div:nth-child(1)").innerHTML;
    document.querySelector("#main_content > div:nth-child(3) > h3").innerHTML += " " + bets;
    document.querySelector("#main_content > div:nth-child(5) > h3").innerHTML += " " + sportBets;
    document.getElementById("page_title").innerHTML += `<br><b style="font-size: 1rem">` +bets + sportBets + `</b>`

}

