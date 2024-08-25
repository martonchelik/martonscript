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

let userid = parseInt(window.location.href.split("/")[5].split("?")[0]);
let debugMode = 0;
let projectName = window.location.href.split("/")[2].split(".")[0].split("-")[1];


function injectDuplicatesBlock(){// сама функция инжекта


    // сюда функцию коллекта дублей есть есть
    let duplicatesBlock = document.getElementById("duplications_sidebar_section");
    let duplicatesLabel = duplicatesBlock.querySelector("h3");
    let duplicatesEmailsBlock = document.querySelector(".duplicates_table_container");
    let emailRegex = /([+a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

    let commentsList = document.getElementById("active_admin_comments_for_user_"+userid).querySelectorAll(".active_admin_comment");
    let commentsBlock = document.getElementById("active_admin_comments_for_user_"+userid);
    if(debugMode == 1){console.log(commentsList);}

    let duplicatesEmails = [...new Set(duplicatesBlock.innerText.match(emailRegex))];
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
            if(commentsBlock.innerHTML.match(duplicatesEmails[i])){
                duplicateComment = 1;
                neededStyle = "player-tag player-tag-verified";
                neededText = "";
                if(debugMode == 1){console.log(duplicatesEmails[i] + duplicateComment);}
                commentsBlock.innerHTML = commentsBlock.innerHTML.replaceAll(duplicatesEmails[i], `<a style='color:green' href="https://marketing${projectName}.lux-casino.co/backend/players/find_user?filters[id_or_email]=${duplicatesEmails[i].replace(/\+/, "%2b")}">${duplicatesEmails[i]}</a>`);
            }
            else
            {
                neededStyle = "player-tag player-tag-Не_выводить";
                duplicateComment = 0;
                neededText = "Нет";
                duplicatesWithoutComments.push(duplicatesEmails[i]);
                commentsBlock.innerHTML = commentsBlock.innerHTML.replaceAll(duplicatesEmails[i], `<a style='color:green' href="https://marketing${projectName}.lux-casino.co/backend/players/find_user?filters[id_or_email]=${duplicatesEmails[i].replace(/\+/, "%2b")}">${duplicatesEmails[i]}</a>`);
                if(debugMode == 1){console.log(duplicatesWithoutComments);}
            }

            let duplicateLink = document.getElementById('duplications_sidebar_section').getElementsByClassName('duplicates_table_container')[0].getElementsByTagName('a')[i].href
            let duplicateRow = `<tr>
															<td><span id="enhancerDuplicateAccountComment" class="${neededStyle}" style="display:inline-block">${neededText}</span></td>
															<td><a id="enhancerDuplicateAccount"><a target="_blank" href="${duplicateLink}" >${duplicatesEmails[i]}</a></td>
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



// Чеккер запрещенных стран

const phone = document.getElementById('phones_sidebar_section').getElementsByTagName('li')[0] ?
    document.getElementById('phones_sidebar_section').getElementsByTagName('li')[0].getElementsByTagName('div')[0].textContent :
    "bebra";
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
let isAlreadyNotifiedRegion = 0;
let isAlreadyNotifiedCountry = 0;
function checkRegionRestrictions(region){
    let country = region;
    let restrictedCountries = ["Американское Самоа", "Аруба", "Афганистан", "Беларусь", "Ливан", "Бона́йре, Синт-Эста́тиус и Са́ба", "Великобритания","Виргинские острова",
        "Гонконг", "Гренландия", "Греция", "Гуам", "Дания", "Израиль", "Иордания", "Иран", "Ирак", "Испания", "Италия",
        "Йемен", "Кипр", "КНДР", "Кот-д’Ивуар", "Кувейт", "Кюрасао", "Майотта", "Макао", "Мальта", "Нидерланды", "Объединенные Арабские Эмираты",
        "Оман", "Пакистан", "Португалия", "Пуэрто-Рико", "Саудовская Аравия", "Сен-Мартен (Французская часть)", "Сингапур",
        "Сирия", "Словакия", "США", "Франция", "Швеция", "Эфиопия", "Соединенные Штаты Америки"];
    let forbiddenCountries = ["AS", "WS", "AW", "AF", "BY", "LB", "NL", "GB", "VI", "VG",
        "HK", "GL", "GR", "GU", "DK", "IL", "JO", "IR", "IQ", "ES", "IT",
        "YE", "CY", "KP", "CI", "KW", "CW", "KM", "MO", "MT", "SX", "AE",
        "OM", "PK", "PT", "PR", "SA", "MF", "SG",
        "SY", "SK", "US", "FR", "SE", "ET"];
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



const userEventsPanel = document.evaluate("//table[contains(., 'Тип события')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext()
function enhanceUserEvents(){
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
}
