document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        chrome.storage.local.get('checkboxStates', function(result) {
            if(result.checkboxStates.duplicateCheckerSet && result.checkboxStates.profileSet){
                setTimeout(injectDuplicatesBlock, 200)
            }
            if (result.checkboxStates.forbiddenCountriesSet && result.checkboxStates.profileSet){
                enhanceUserEvents()
            }
        })
    }
});



function injectDuplicatesBlock(){
    if (window.location.href.split("/")[5] != undefined && !window.location.href.includes('edit')){
        let userid = parseInt(window.location.href.split("/")[5].split("?")[0]);
        let debugMode = 0;
        let projectName = window.location.href.split("/")[2].split(".")[0].split("-")[1];
        let duplicatesBlock = document.getElementById("duplications_sidebar_section");
        let emailRegex = /([+a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
        let duplicateLinksRegex =/\/admin\/players\/\d{5,8}$/gi;

        const aTags = document.querySelectorAll('#duplications_sidebar_section a')
        const hrefValues = Array.from(aTags)
            .filter(aTag => aTag.href.match(duplicateLinksRegex))
            .map(aTag => aTag.href);
        const duplicateLinkSet = [...new Set(hrefValues)];


        let userEmail = document.getElementById('page_title').innerText.match(emailRegex)
        let commentsList = document.getElementById("active_admin_comments_for_user_"+userid)? document.getElementById("active_admin_comments_for_user_"+userid).querySelectorAll(".active_admin_comment"):'bebra';
        let commentsBlock = document.getElementById("active_admin_comments_for_user_"+userid);
        if(debugMode == 1){console.log(commentsList);}
        let inactiveEmails = []
        duplicatesBlock.querySelectorAll('a.disabled').forEach((email)=>{
            inactiveEmails.push(email.textContent)
        })
        let inactiveEmailsSet = [...new Set(inactiveEmails)]
        let duplicatesEmails = [...new Set(duplicatesBlock.innerText.match(emailRegex))];
        for(let i=0; i < duplicatesEmails.length; i++)
        {
            if (duplicatesEmails[i]==userEmail){
                duplicatesEmails.splice(i, 1)
            }
        }
        if(debugMode == 1){console.log(duplicatesEmails);}
        if(debugMode == 1){console.log(commentsList);}
        if(duplicatesEmails.length == 0){return;} // если дублей нет - блок и не нужен
        var duplicatesWithoutComments = [];
        if(duplicatesEmails){
            var duplicatesList = "";
            for(let i=0; i < duplicatesEmails.length; i++)
            {
                let duplicateComment = 0;
                let neededStyle = "";
                let neededText = "";
                if(commentsBlock.innerHTML.match(duplicatesEmails[i]) || duplicatesEmails[i].includes('+duplicate') || (inactiveEmailsSet.length > 0 && inactiveEmailsSet.includes(duplicatesEmails[i]))){
                    duplicateComment = 1;
                    neededStyle = "player-tag player-tag-verified";
                    neededText = "";
                    if(debugMode == 1){console.log(duplicatesEmails[i] + duplicateComment);}
                    commentsBlock.innerHTML = commentsBlock.innerHTML.replaceAll(duplicatesEmails[i], `<a style='color:green' href="${duplicateLinkSet[i]}">${duplicatesEmails[i]}</a>`);

                }
                else
                {
                    neededStyle = "player-tag player-tag-Не_выводить";
                    duplicateComment = 0;
                    neededText = "Нет";
                    duplicatesWithoutComments.push(duplicatesEmails[i]);
                    commentsBlock.innerHTML = commentsBlock.innerHTML.replaceAll(duplicatesEmails[i], `<a style='color:green' href="${duplicateLinkSet[i]}">${duplicatesEmails[i]}</a>`);
                    if(debugMode == 1){console.log(duplicatesWithoutComments);}
                }
                let duplicateRow = `<tr>
															<td><span id="enhancerDuplicateAccountComment" class="${neededStyle}" style="display:inline-block">${neededText}</span></td>
															<td><a id="enhancerDuplicateAccount"><a target="_blank" href="${duplicateLinkSet[i]}" >${duplicatesEmails[i]}</a></td>
														</tr>
														`;
                //if(debugMode==1){console.log(duplicateRow);}
                duplicatesList += duplicateRow;
            }
        }


        // <tr>
        // 	<td><span id="enhancerDuplicateAccountComment" class="player-tag" style="display:inline-block">Нет комментария</span></td>
        // 	<td><a id="enhancerDuplicateAccount">Дубликат</a></td>
        // </tr>
        var duplicatesBlockElement ;
        duplicatesBlockElement = document.createElement( 'div' );
        //<td><a id="enhancerDuplicateAccount">Тест</a></td>
        duplicatesBlockElement.innerHTML = `
									<div class="sidebar_section panel" id="sdt_duplicates_panel" ${false ? "hidden" : ""}>
										<h3>Дубликаты игрока</h3>
										<div class="panel_contents">
										<div class="attributes_table">
											<table>
											${duplicatesList}
											<tr>
											<td><a id="enhancerDuplicateAccountScript">Скрипт</a></td>
											</tr>
											</table>
										</div>
												</div>
											</div>
										</div>
									 </div>
								` ;
        var duplicatesWithoutCommentsScript = "";

        let duplicatesScript = "";
        let duplicatesEmailsSet = [...new Set(duplicatesEmails)];
        let duplicatesListScript = "";

        switch(duplicatesWithoutComments.length)
        {
            // акк один
            case 1:
                duplicatesScript = `Уточните, пожалуйста, вам знаком аккаунт ${duplicatesWithoutComments[0]}?`;
                break;
            // аккаунтов две штуки
            case 2:
                duplicatesScript = `Уточните, пожалуйста, вам знакомы аккаунты ${duplicatesWithoutComments[0]} и ${duplicatesWithoutComments[1]}?`;
                break;
            // аккаунтов больше
            default:
                duplicatesList = "";
                for(let value of duplicatesWithoutComments)
                {
                    duplicatesList = duplicatesList+value+", ";
                }
                duplicatesList = duplicatesList.slice(0,-2);
                duplicatesScript = `Уточните, пожалуйста, вам знакомы данные аккаунты: ${duplicatesList}?`;
                break;
        }

        if(debugMode ==1) {console.log(duplicatesScript);}
        let eElement = document.getElementById( 'sidebar' );; // элемент, в которой вкидывает, ставит первым наследником этого объекта
        let newFirstElement = duplicatesBlockElement; // код, который мы инжектим
        eElement.insertBefore(newFirstElement, eElement.firstChild.nextSibling); // инжект
        document.getElementById("enhancerDuplicateAccountScript").addEventListener("click", function(){
            navigator.clipboard.writeText(duplicatesScript);
            document.getElementById("enhancerDuplicateAccountScript").style.color = "red";
        });



    }
}


function enhanceUserEvents(){
    var tableToObj = function(table) { // переделывает таблицу в архив, нужно для работы 3х чекера и т.д.
        var trs = table.rows,
            trl = trs.length,
            i = 0,
            j = 0,
            keys = [],
            obj, ret = [];

        for (; i < trl; i++) {
            if (i == 0) {
                for (; j < trs[i].children.length; j++) {
                    keys.push(trs[i].children[j].innerHTML);
                }
            } else {
                obj = {};
                for (j = 0; j < trs[i].children.length; j++) {
                    obj[keys[j]] = trs[i].children[j].innerHTML;
                }
                ret.push(obj);
            }
        }

        return ret;
    };
    let phone = ""


    if(document.getElementById('phones_sidebar_section')){
        phone = document.getElementById('phones_sidebar_section').getElementsByTagName('li')[0] ?
            document.getElementById('phones_sidebar_section').getElementsByTagName('li')[0].getElementsByTagName('div')[0].textContent :
            "bebra";
    }


    const userEventsPanel = document.evaluate("//table[contains(., 'Тип события')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext()
    let eventsList = tableToObj(userEventsPanel);
    let countriesList = [];
    let country = phone.split("Страна: ")[1];
    checkRegionRestrictions(country);
    for(let value of eventsList){
        countriesList.push(value["Страна"]);
    }
    let uniqueCountries = [...new Set(countriesList)];
    for(let value of uniqueCountries){
        checkRegionRestrictions(value);
    }






    function checkRegionRestrictions(region){
        let isAlreadyNotifiedRegion = 0;
        let isAlreadyNotifiedCountry = 0;
        let country = region;
        let restrictedCountries = ["Американское Самоа", "Аруба", "Афганистан", "Беларусь", "Ливан", "Бона́йре, Синт-Эста́тиус и Са́ба", "Великобритания","Виргинские острова",
            "Внешние малые острова", "Гваделупа", "Гренландия", "Гуам", "Гуам", "Зимбабве", "Израиль", "Иордания", "Иран", "Ирак", "Испания", "Йемен",
            "ДР Конго", "Кипр", "КНДР", "Кот-д’Ивуар", "Китай", "Кюрасао", "Майотта", "Макао", "Мальта", "Нидерланды", "Объединенные Арабские Эмираты",
            "Оман", "Пакистан", "Ливан", "Пуэрто-Рико", "Ливия", "Сен-Мартен", "Мали", "Мьянма", "Никарагуа", "Реюньон", "Сомали",
            "Сирия", "Словакия", "США", "Франция", "Эфиопия", "Соединенные Штаты Америки", "Судан", "Франция", "Французская Гвиана", "Центральноафриканская Республика"];
        let forbiddenCountries = [
            "AS", // Американское Самоа (American Samoa)
            "AW", // Аруба
            "AF", // Афганистан
            "BY", // Беларусь
            "BQ", // Бонайре (Bonaire)
            "SX", // Синт-Эстатиус и Саба (Sint Eustatius and Saba)
            "GB", // Великобритания
            "VE", // Венесуэла
            "VG", // Виргинские острова (США) (British Virgin Islands)
            "VI", // Внешние малые острова (США) (U.S. Virgin Islands)
            "GP", // Гваделупа
            "GL", // Гренландия
            "GY", // Гайана
            "ZW", // Зимбабве
            "IL", // Израиль
            "JO", // Иордания
            "IR", // Иран
            "IQ", // Ирак
            "ES", // Испания
            "YE", // Йемен
            "CY", // Кипр
            "KP", // КНДР (North Korea)
            "CD", // ДР Конго (Democratic Republic of the Congo)
            "CI", // Кот-д'Ивуар
            "CN", // Китай
            "CU", // Куба
            "CW", // Кюрасао
            "LB", // Ливан
            "LY", // Ливия
            "YT", // Майотта
            "MO", // Макао
            "ML", // Мали
            "MT", // Мальта
            "MQ", // Мартиника
            "MM", // Мьянма
            "NL", // Нидерланды
            "NI", // Никарагуа
            "AE", // ОАЭ (United Arab Emirates)
            "OM", // Оман
            "PK", // Пакистан
            "PR", // Пуэрто-Рико
            "RE", // Реюньон
            "MF", // Сен-Мартен (Франция) (Saint Martin)
            "SY", // Сирия
            "SK", // Словакия
            "SD", // Судан
            "US", // США
            "FR", // Франция
            "GF", // Французская Гвиана
            "CF", // Центральноафриканская Республика
            "ET"  // Эфиопия
        ];
        let isCountryBlocked;
        if(restrictedCountries.includes(country) && !isAlreadyNotifiedRegion){
            console.log(`чекаем `+ region);
            isAlreadyNotifiedRegion = 1;
            if(document.getElementById("titlebar_right").getElementsByClassName('restr')[0]){
                document.getElementById("titlebar_right").innerHTML += `<b class="restr" style="color:red; font-size: 1rem"> [ЗАПРЕЩЁННЫЙ РЕГИОН]</b>`;
            }else{
                document.getElementById("titlebar_right").innerHTML += `<br><b class="restr" style="color:red; font-size: 1rem"> [ЗАПРЕЩЁННЫЙ РЕГИОН]</b>`;
            }
        }
        if(forbiddenCountries.includes(country) && !isAlreadyNotifiedCountry){
            console.log(`чекаем `+ region);
            console.log("++");
            isCountryBlocked = 1;
            isAlreadyNotifiedCountry = 1;
            if(document.getElementById("titlebar_right").getElementsByClassName('restr')[0]){
                document.getElementById("titlebar_right").innerHTML += `<b class="restr" style="color:red; font-size: 1rem"> [ЗАПРЕЩЕННЫЙ ВХОД]</b>`;
            }else{
                document.getElementById("titlebar_right").innerHTML += `<br><b class="restr" style="color:red; font-size: 1rem"> [ЗАПРЕЩЕННЫЙ ВХОД]</b>`;
            }
        }
        return isCountryBlocked;
    }
}
