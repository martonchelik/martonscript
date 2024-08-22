function waitForElement(selector, callback) {
    let observer = new MutationObserver((mutations, obs) => {
        const element = document.getElementById(selector);
        if (element) {
            callback(element);
        }
        function stopObserving() {
            obs.disconnect();
            console.log('disconnected')
        }

        function startObserving() {
            obs.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('focus', stopObserving);
            textarea.addEventListener('focusout', startObserving);
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });



    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    observer.onmutate = (mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'TEXTAREA') {
                        node.addEventListener('focus', stopObserving);
                        node.addEventListener('focusout', startObserving);
                    }
                });
            }
        });
    };
}

function autocomplete(inp, displayArr, inputArr) {
    if (inp) {
        let currentFocus;

        function addEventListeners() {
            inp.addEventListener("input", onInput);
            inp.addEventListener("focus", onFocus);
            inp.addEventListener("keydown", onKeydown);
            inp.addEventListener("focusout", onFocusout);
        }

        function onInput(e) {
            let val = this.value;
            closeAllLists();
            currentFocus = -1;
            let a = createListContainer();
            displayArr.forEach((item, i) => {
                let index = item.toUpperCase().indexOf(val.toUpperCase());
                if (index !== -1) {
                    let b = createListItem(item, val, index, inputArr[i]);
                    a.appendChild(b);
                }
            });
        }

        function onFocus(e) {
            let val = this.value;
            closeAllLists();
            currentFocus = -1;
            let a = createListContainer();
            a.style.width = window.getComputedStyle(inp, null).getPropertyValue("width");
            displayArr.forEach((item, i) => {
                let index = item.toUpperCase().indexOf(val.toUpperCase());
                if (index !== -1 || val === "") {
                    let b = createListItem(item, val, index, inputArr[i]);
                    a.appendChild(b);
                }
            });
        }

        function onKeydown(e) {
            let x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
                x[currentFocus].scrollIntoView()
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
                x[currentFocus].scrollIntoView()
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        }

        function onFocusout() {
            setTimeout(closeAllLists, 150);
        }

        function createListContainer() {
            let a = document.createElement("DIV");
            a.setAttribute("id", inp.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            inp.parentNode.appendChild(a);
            return a;
        }

        function createListItem(item, val, index, inputValue) {
            let b = document.createElement("DIV");
            b.innerHTML = item.substr(0, index);
            b.innerHTML += "<strong>" + item.substr(index, val.length) + "</strong>";
            b.innerHTML += item.substr(index + val.length);
            b.innerHTML += "<input type='hidden' value='" + inputValue + "'>";
            b.addEventListener("click", function (e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            return b;
        }

        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(x) {
            for (let i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        function closeAllLists(elmnt) {
            let x = document.getElementsByClassName("autocomplete-items");
            for (let i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }

        addEventListeners();
    }
}

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        chrome.storage.local.get('checkboxStates', function(result) {
            if (result.checkboxStates && result.checkboxStates.clipboardSet) {
                setupAutocomplete();
            }
        });
    }
});

function setupAutocomplete() {
    const comments = ["В чеке", "По лимиту", "После прохождения предыдущих", "Тест", "На согласовании в accounts-payments", "Проверен", "Не отыгран депозит",];
    const commentsForProfiles = ["Аккаунт заблокирован по п.п. 4.4", "Аккаунт заблокирован, т.к. игроку нет 18-ти лет", "Перед верификацией запросить местоположение",
        "Аккаунт заблокирован по п.п. 4.4 до возвращения в разрешённый регион", "Дубликат заблокирован. Основной - ", "Дубликат (почта) заблокирован",
        "Данные в профиле изменены в соответствии с данными в документе.", "Данные скорректированы."];
    const cancelDocs = ["документ загружен по ошибке", "не требуется", "документ не требуется для верификации", "повторная загрузка документа не требуется", "документ виден не полностью",
        "нечитабельно", "данные на банковской карте нечитабельны", "фамилия и имя на банковской карте нечитабельны", "данные на фото нечитабельны", "качество фото не соответствует требованиям верификации",
        "не соответствует требованиям верификации. На фотографии банковской карты должны быть открыты первые 6 цифр, последние 4, срок действия карты и фамилия-имя владельца",
        "не соответствует требованиям верификации. Необходимо загрузить полный разворот паспорта. Серию и номер паспорта можно закрыть", "банковская карта не использовалась", "нет номера карты", "нет имени владельца карты",
        "скрыт срок действия банковской карты", "скрыт срок действия и данные владельца карты", "срок действия карты истек", "необходима фотография паспорта, а не скан", "необходима фотография паспорта, а не скриншот",
        "оборотная сторона банковской карты не требуется", "банковская карта принадлежит другому человеку", "данные на фото в документе не совпадают с данными в профиле ", "срок действия документа истек",
        "необходимо загрузить оборотную сторону документа", "не соответствует требованиям верификации", "использован фоторедактор", "необходима фотография, а не скриншот",
        "не соответствует требованиям верификации. Лицо не видно полностью", "не соответствует требованиям верификации, необходимо фото физического документа"];
    const cancelDocsEN =["your document has been uploaded in error", "not required", "document is not required for verification", "you do not need to upload the document again", "your document is not fully visible",
        "unreadable", "your card details are unreadable", "the card owner’s first and last name are unreadable", "the data on the photo is unreadable", "the quality of the photo does not meet verification requirements",
        "fails to meet verification requirements. The photo on your card should show the first 6 digits, last 4 digits, expiration date, and owner’s first and last name",
        "fails to meet verification requirements. Upload a full-spread photo of the first two pages of your passport. You may choose not to show your passport number", "your bank card has not been used",
        "the photo fails to show your card number", "the photo fails to show the card owner’s name", "the photo fails to show the card expiry date", "the photo fails to show the card expiry date and card owner’s information",
        "your card has expired", "you must provide a photo of your ID instead of a scanned image", "you must provide a passport photo, not a screenshot", "the reverse of the card is not required",
        "the card belongs to a different person", "the information in the photo in the document does not match the data in the profile", "the document has expired",
        "it is necessary to download the reverse side of the document", "does not meet verification requirements", "used photo editor", "A photo is required, not a screenshot",
        "does not meet the verification requirements. The face is not fully visible", "does not meet verification requirements, a photo of the physical document is required"];
    const cancelDocsDE =["Dokument fälschlich hochgeladen", "nicht erforderlich", "Dokument für Verifizierung nicht erforderlich", "erneutes Hochladen des Dokuments nicht erforderlich", "Dokument nicht vollständig sichtbar",
        "unleserlich", "Daten auf der Karte unleserlich", "Vor- und Nachname auf der Karte unleserlich", "Daten auf dem Foto unleserlich", "Qualität des Fotos entspricht nicht den Anforderungen der Verifizierung",
        "entspricht nicht den Anforderungen der Verifizierung. Auf dem Foto der Karte müssen die ersten 6 Ziffern, die letzten 4, die Gültigkeitsdauer der Karte und Vor- und Nachname des Inhabers sichtbar sein",
        "entspricht nicht den Anforderungen der Verifizierung. Die ganze Doppelseite des Ausweisdokuments muss hochgeladen werden. Die Ausweisnummer kann verdeckt werden", "Bankkarte wurde nicht benutzt", "Kartennummer fehlt",
        "Name des Karteninhabers fehlt", "Gültigkeitsdauer der Karte verdeckt", "Gültigkeitsdauer und Daten des Karteninhabers verdeckt", "Gültigkeitsdauer der Karte abgelaufen",
        "es wird nur ein Foto des Ausweisdokuments akzeptiert, kein Scan", "Sie benötigen ein Passfoto, keinen Screenshot", "rückseite der Karte nicht erforderlich", "die Karte gehört einer anderen Person",
        "die Daten auf dem Foto im Dokument stimmen nicht mit den Daten im Profil überein", "das Dokument ist abgelaufen", "sie müssen die Rückseite des Dokuments einlegen",
        "Erfüllt nicht die Verifizierungsanforderungen", "Verwendeter Fotoeditor", "Es wird ein Foto benötigt, kein Screenshot", "erfüllt nicht die Verifizierungsanforderungen. Das Gesicht ist nicht vollständig sichtbar",
        "Keine Überprüfung erforderlich, kein Fotodokument"];
    const cancelDocsPT =["houve um erro no envio do se documento", "não requerido", "documento não é necessário para verificação", "você não precisa enviar o documento novamente", "seu documento não está totalmente visível",
        "ilegível", "os dados do seu cartão estão ilegíveis", "o primeiro e último nome do proprietário do cartão estão ilegíveis", "os dados na imagem estão ilegíveis", "a qualidade da foto não cumpre o requisito de verificação",
        "falha no cumprimento dos requisitos de verificação. A foto do seu cartão deve mostrar os 6 primeiros dígitos, os últimos 4, a data de validade e o primeiro e último nome do proprietário",
        "falha no cumprimento dos requisitos de verificação. Envie uma imagem larga das duas primeiras páginas do seu passaporte. Você pode escolher não exibir seu número do passaporte", "seu cartão bancário não foi utilizado",
        "a foto não exibe seu número do cartão", "a foto não exibe o nome do proprietário", "a foto não exibe a data de validade do cartão", "a foto não exibe a data de validade do cartão nem as informações do proprietário",
        "seu cartão expirou", "você deve fornecer uma foto do seu ID em vez de uma imagem digitalizada", "Você precisa de uma foto de passaporte, não de uma captura de tela", "não é necessário mostrar a parte de trás do cartão",
        "o cartão pertence a outra pessoa", "os dados da foto no documento não correspondem aos dados do perfil", "o documento expirou",
        "é necessário carregar o verso do documento", "Não atende aos requisitos de verificação", "Editor de fotos usado", "Preciso de uma foto, não de uma captura de tela",
        "não atende aos requisitos de verificação. O rosto não está completamente visível", "não atende aos requisitos de verificação, é necessária uma foto do documento físico"];
    const cancelDocsUA =["документ завантажено помилково", "не вимагається", "документ не вимагається для верифікації", "повторне завантаження документа не вимагається", "документ не видно повністю",
        "нечитабельне", "дані банківської картки нечитабельні", "прізвище та ім’я на банківській картці нечитабельні", "дані на фото нечитабельні", "якість фото не відповідає вимогам верифікації",
        "не відповідає вимогам верифікації. На фотографії банківської картки повинні бути відкриті перші 6 цифр, останні 4, термін дії картки та прізвище-ім’я власника",
        "не відповідає вимогам верифікації. Необхідно завантажити повний розворот паспорта. Серію та номер паспорта можна закрити", "банківська картка не використовувалася",
        "немає номера картки", "немає ім’я власника на картці", "приховано термін дії банківської картки", "приховано термін дії та дані власника картки",
        "термін дії картки закінчився", "необхідна фотографія паспорта, а не скан", "потрібна фотографія паспорта, а не скріншот", "зворотний бік банківської картки не потрібен",
        "банківська картка належить іншій людині", "дані на фото в документі не збігаються з даними в профілі", "термін дії документа закінчився",
        "необхідно завантажити зворотний бік документа", "не відповідає вимогам верифікації", "використано фоторедактор", "потрібна фотографія, а не скріншот",
        "не відповідає вимогам верифікації. Обличчя видно не повністю", "не відповідає вимогам верифікації, потрібне фото фізичного документа"];
    const cancelDocsES =["hubo un error en el envío de tu documento", "no requerido", "el documento no es necesario para la verificación", "no es necesario volver a cargar el documento", "tu documento no es completamente visible",
        "ilegible", "los datos de tu tarjeta son ilegibles", "el nombre y apellido del propietario de la tarjeta son ilegibles", "Los datos de la foto son ilegibles", "la calidad de la foto no cumple con los requisitos de verificación",
        "no cumple con los requisitos de verificación. La foto de tu tarjeta debe mostrar los primeros 6 dígitos, los últimos 4 dígitos, la fecha de vencimiento y el nombre y apellido del propietario",
        "no cumple con los requisitos de verificación. Carga una fotografía completa de las dos primeras páginas de tu pasaporte. Puedes optar por no mostrar tu número de pasaporte", "tu tarjeta bancaria no ha sido utilizada",
        "la foto no muestra tu número de tarjeta", "la foto no muestra el nombre del propietario de la tarjeta", "la foto no muestra la fecha de vencimiento de la tarjeta", "la foto no muestra la fecha de vencimiento de la tarjeta ni la información del propietario de la tarjeta",
        "tu tarjeta ha caducado", "Se requiere una foto de pasaporte, no un escaneo", "debes proporcionar una foto de tu identificación en lugar de una imagen escaneada", "no se requiere el reverso de la tarjeta",
        "la tarjeta pertenece a otra persona", "la información de la foto en el documento no coincide con los datos del perfil", "el documento ha caducado",
        "es necesario descargar el reverso del documento", "No cumple con los requisitos de verificación", "Editor de fotos utilizado", "Se necesita fotografía, no una captura de pantalla",
        "no cumple con los requisitos de verificación. La cara no es completamente visible.", ""];
    const cancelDocsFR =["le document a été téléchargé par erreur", "non requis", "le document n’est pas nécessaire pour la vérification", "il n’est pas nécessaire de télécharger le document à nouveau", "le document n'est pas visible dans son intégralité",
        "illisible", "les informations de la carte bancaire sont illisibles", "le nom et le prénom du titulaire de la carte bancaire sont illisibles", "les informations sont illisibles sur la photo", "la qualité de la photo ne répond pas aux exigences de vérification",
        "ne répond pas aux exigences de vérification. Les informations suivantes doivent figurer sur la photo de votre carte bancaire : les 6 premiers chiffres, les 4 derniers chiffres, la date d’expiration, ainsi que le nom et le prénom du titulaire de la carte",
        "ne répond pas aux exigences de vérification. Vous devez télécharger une photo des deux premières pages de votre passeport, dans leur totalité. Si vous le souhaitez, vous pouvez cacher le numéro du passeport", "votre carte bancaire n'a pas été utilisée",
        "le numéro de votre carte bancaire n'est pas visible sur la photo", "le nom du titulaire de la carte bancaire n'est pas visible sur la photo", "la date d’expiration de la carte bancaire n'est pas visible sur la photo", "la date d’expiration et le nom du titulaire de la carte bancaire ne sont pas visibles sur la photo",
        "votre carte bancaire est expirée", "vous devez fournir une photo de votre passeport au lieu d'un scan", "Pas de photo de passeport, pas d'écran", "le verso de la carte bancaire n'est pas requis",
        "la carte bancaire appartient à quelqu’un d’autre", "les données de la photo dans le document ne correspondent pas à celles du profil", "le document a expiré",
        "vous devez télécharger le verso du document", "", "", "une photo est nécessaire, pas une capture d'écran",
        "", ""];
    const cancelDocsTR =["belgeniz yanlışlıkla yüklendi", "gerekli değildir", "belge doğrulama için gerekli değildir", "belgeyi tekrar yüklemenize gerek yoktur", "belgeniz tam olarak görünmüyor",
        "okunamaz", "kart bilgileriniz okunamaz durumda", "kart sahibinin adı ve soyadı okunamaz durumda", "fotoğraf üzerindeki veriler okunamaz durumda", "fotoğraf kalitesi doğrulama gerekliliklerini karşılamıyor",
        "doğrulama gerekliliklerini karşılamıyor. Kartınızın üzerindeki fotoğraf ilk 6 haneyi, son 4 haneyi, son kullanma tarihini ve kart sahibinin adını ve soyadını göstermelidir",
        "doğrulama gerekliliklerini karşılamıyor. Kimlik belgenizin tam boy fotoğrafını yükleyin. Kimlik belgenizin numarasını göstermemeyi tercih edebilirsiniz", "banka kartınız kullanılmadı",
        "fotoğraf kart numaranızı göstermiyor", "fotoğraf kart sahibinin adını göstermiyor", "fotoğraf kartın son kullanma tarihini göstermiyor", "fotoğrafın kartın son kullanma tarihini ve kart sahibinin bilgilerini göstermiyor",
        "kartınızın son kullanma tarihi geçti", "taranmış bir görüntü yerine kimliğinizin fotoğrafını sağlamalısınız", "", "kartın arka yüzü gerekli değildir",
        "kart farklı bir kişiye aittir", "belgedeki fotoğrafta yer alan bilgilerin profildeki verilerle eşleşmiyor", "belgenin geçerlilik süresi doldu",
        "belgenin arka yüzünün yüklenmesi gereklidir", "", "", "",
        "", ""];
    const cancelDocsPL =["dokument został przesłany przez pomyłkę", "nie jest wymagane", "dokument nie jest wymagany do weryfikacji", "ponowne przesłanie dokumentu nie jest wymagane", "dokument jest częściowo nieczytelny",
        "nieczytelne", "dane na karcie płatniczej są nieczytelne", "imię i nazwisko posiadacza karty są nieczytelne", "dane na zdjęciu są nieczytelne", "jakość zdjęć nie spełnia wymagań dotyczących weryfikacji",
        "nie spełnia wymagań dotyczących weryfikacji. Na zdjęciu karty muszą być widoczne: pierwsze 6 cyfr, ostatnie 4 cyfry, data ważności oraz imię i nazwisko posiadacza",
        "nie spełnia wymagań dotyczących weryfikacji. Musisz przesłać zdjęcie przedstawiające całe dwie pierwsze strony paszportu. Numer paszportu możesz zasłonić", "karta bankowa nie była używana",
        "na zdjęciu nie widać numeru karty", "na zdjęciu nie widać imienia i nazwiska posiadacza karty", "na zdjęciu nie widać terminu ważności karty", "na zdjęciu nie widać terminu ważności i danych posiadacza karty",
        "upłynął termin ważności karty", "wymagane jest zdjęcie paszportu, a nie skan", "", "tylna strona karty nie jest wymagana",
        "karta należy do innej osoby", "dane na zdjęciu w dokumencie nie pokrywają się z danymi w profilu", "dokument wygasł",
        "konieczne jest pobranie odwrotnej strony dokumentu", "", "", "",
        "", ""];
    const cancelDocsKZ =["құжатыңыз қателікпен жүктеп салынған", "талап етілмейді", "тексеру үшін құжат талап етілмейді", "құжатты қайта жүктеп салу қажет емес", "құжатыңыз толық көрінбейді",
        "анық көрінбейді", "банк картасындағы деректер көрінбейді", "карта иесінің аты мен тегі көрінбейді", "фотодағы деректер көрінбейді", "фото сапасы тексеру талаптарына сай емес",
        "тексеру талаптарына сай емес. Картадағы фотодада алғашқы 6 және соңғы 4 сан, картаның жарамдылық мерзімі және иесінің аты-жөні анық болуы керек",
        "тексеру талаптарына сай емес. Төлқұжатыңыздың алғашқы екі бетінің толық фотосын жүктеп салыңыз. Төлқұжаттың нөмірін көрсетпеуді таңдауға болады", "банк картаңыз пайдаланылмаған",
        "фотода картаң нөмірі көрінбейді", "фотода карта иесінің аты-жөні көрінбейді", "фотода картаның жарамдылық мерзімі көрінбейді", "фотода картаның жарамдылық мерзімі мен карта иесінің деректері көрінбейді",
        "картаның мерзімі өткен", "төлқұжаттың сканерленген көшірмесі емес, фотосы қажет", "", "банк картасының артқы жағы қажет емес",
        "банк картасы басқа адамға тиесілі", "құжаттағы фотосуреттегі деректер профильдегі мәліметтермен сәйкес келмейді", "құжаттың мерзімі аяқталды",
        "құжаттың артқы жағын жүктеу қажет", "", "", "",
        "", ""];
    const cancelDocsFIN =["asiakirja lähetettiin vahingossa", "ei vaadita", "asiakirjaa ei tarvitse vahvistaa", "asiakirjan uudelleenlähetystäei vaadita", "asiakirja ei ole kokonaan nähtävissä",
        "lukukelvoton", "pankkikortin tietoja ei voida lukea", "pankkikortissa olevat sukunimi ja etunimi eivät ole luettavissa", "valokuvan tietoja ei voi lukea", "valokuvan laatu ei täytä vahvistusvaatimuksia",
        "vahvistusvaatimukset eivät täyty. Pankkikortin valokuvassa on oltava ensimmäiset 6 ja viimeiset 4 numeroa, kortin viimeinen voimassaolopäivä ja omistajan etu- ja sukunimi",
        "ei vastaa vahvistusvaatimuksia. Lähetä koko aukeaman kuva passisi kahdesta ensimmäisestä sivusta. Passin sarjanumero ja numero voidaan peittää", "pankkikorttia ei käytetty",
        "kortin numero puuttuu kuvasta", "kortin omistajan nimi puuttuu kuvasta", "kortin voimassaoloaika puuttuu kuvasta", "kortin voimassaoloaika ja kortin haltijan tiedot eivät näy kuvasta",
        "kortti on vanhentunut", "vaaditaan valokuva passista, ei skannausta", "", "pankkikortin kääntöpuolta ei tarvita",
        "pankkikortti kuuluu toiselle henkilölle", "dokumentin kuvan tiedot eivät vastaa profiilin tietoja", "asiakirja on vanhentunut",
        "on tarpeen ladata asiakirjan kääntöpuoli", "", "", "",
        "", ""];
    const cancelDocsDA =["dokumentet er indlæst ved en fejl", "kræves ikke", "dokumentet kræves ikke til verificering", "genindlæsning af dokumentet kræves ikke", "dokumentet er ikke fuldt synligt",
        "ulæseligt", "dine data på betalingskortet er ulæselige", "kortholderens fornavn og efternavn på betalingskortet er ulæselige", "data på billedet er ulæselige", "kvaliteten af billedet opfylder ikke verifikationskravene",
        "opfylder ikke verifikationskravene. På billedet af betalingskortet skal man kunne se de første 6 cifre, de sidste 4, kortets gyldighedsperiode samt kortholderens fornavn og efternavn",
        "opfylder ikke verifikationskravene.Overfør et foto af hele passets opslag. Serie- og pasnummer kan være skjult", "betalingskortet har ikke været i brug",
        "der mangler et kortnummer på billedet", "der mangler kortholderens navn på billedet", "betalingskortets gyldighedsperiode vises ikke på billedet", "kortets gyldighedsperiode og kortholderens data vises ikke på billedet",
        "kortets gyldighedsperiode er udløbet", "der kræves et billede af passet, ikke en scannet kopi", "", "bagsiden af betalingskortet kræves ikke",
        "betalingskortet tilhører en anden person", "dataene på billedet i dokumentet svarer ikke til dataene i profilen", "dokumentet er udløbet",
        "det er nødvendigt at hente bagsiden af dokumentet", "", "", "",
        "", ""];
    const cancelDocsNOR =["feilopplastet dokument", "ikke påkrevet", "dokumentet er ikke nødvendig for verifisering", "du trenger ikke laste opp dokumentet på nytt", "dokumentet er ikke fullt synlig",
        "ikke leselig", "kortopplysningene  er ikke leselige", "kortholders for- og etternavn er ikke leselig", "data på bildet er ikke leselig", "bildekvaliteten tilfredsstiller ikke kravene til verifisering",
        "tilfredsstiller ikke krav til verifisering. Bildet av bankkortet skal vise de 6 første sifrene, de 4 siste sifrene, utløpsdato og kortholders for-/etternavn",
        "tilfredsstiller ikke krav til verifisering. Last opp et fullstendig bilde av de to første sidene i passet ditt.  Passnummeret kan skjules", "bankkortet har ikke blitt brukt",
        "bildet viser ikke  kortnummeret ditt", "bildet viser ikke kortholders  navn", "bildet viser ikke kortets utløpsdato", "bildet viser ikke kortets utløpsdato og informasjon om kortholder",
        "kortet er utløpt", "det trengs et bilde av passet i stedet for et  skannet bilde", "", "baksiden av bankkortet er ikke nødvendig",
        "bankkortet tilhører  en annen person", "dataene på bildet i dokumentet samsvarer ikke med dataene i profilen", "dokumentet er utløpt",
        "det er nødvendig å laste ned baksiden av dokumentet", "", "", "",
        "", ""];

    const cancels = ["На карту", "На МК", "Переоформить корректно", "Обратная сторона id", "На карту или банковским переводом",
        "Документ с CPF", "На мифинити", "Дубликат", "По номеру телефона из профиля, почте или CPF", "На другую иконку", "Завершить бонусную ставку в игре",
        "На номер из профиля или скрин из ЛК", "Пластик", "Выписка по карте", "На карту или на другую иконку "];

    if (document.getElementById('active_admin_comment_body')) {
        const element = document.getElementById('active_admin_comment_body');
        if (window.location.href.indexOf("maxbit.private/admin/players/") != -1) {
            autocomplete(element, commentsForProfiles, commentsForProfiles);
        } else {
            autocomplete(element, comments, comments);
        }
    } else {
        waitForElement('active_admin_comment_body', (element) => {
            console.log('Element found:', element);
            autocomplete(element, comments, comments);
        });
    }

    waitForElement('cashout_cancel_sidebar_section', (element) => {
        console.log('Element found:', element);
        const cancelComment = element.getElementsByTagName('textarea')[0];
        autocomplete(cancelComment, cancels, cancels);
    });

    waitForElement('unapprove_document_sidebar_section', (element) => {
        console.log('Element found:', element);
        const cancelDocComment = element.getElementsByTagName('textarea')[0];
        const locale = element.getElementsByClassName('locale')[0].textContent.toUpperCase().trim();
        switch (locale) {
            case 'RU':
                autocomplete(cancelDocComment, cancelDocs, cancelDocs);
                break;
            case 'EN':
                autocomplete(cancelDocComment, cancelDocs, cancelDocsEN);
                break;
            case 'DE':
                autocomplete(cancelDocComment, cancelDocs, cancelDocsDE);
                break;
            case 'PT':
                autocomplete(cancelDocComment, cancelDocs, cancelDocsPT);
                break;
            case 'UA':
                autocomplete(cancelDocComment, cancelDocs, cancelDocsUA);
                break;
            case 'ES':
                autocomplete(cancelDocComment, cancelDocs, cancelDocsES);
                break;
            case 'FR':
                autocomplete(cancelDocComment, cancelDocs, cancelDocsFR);
                break;
            case 'TR':
                autocomplete(cancelDocComment, cancelDocs, cancelDocsTR);
                break;
            case 'PL':
                autocomplete(cancelDocComment, cancelDocs, cancelDocsPL);
                break;
            case 'KZ':
                autocomplete(cancelDocComment, cancelDocs, cancelDocsKZ);
                break;
            case 'FIN':
                autocomplete(cancelDocComment, cancelDocs, cancelDocsFIN);
                break;
            case 'DA':
                autocomplete(cancelDocComment, cancelDocs, cancelDocsDA);
                break;
            case 'NOR':
                autocomplete(cancelDocComment, cancelDocs, cancelDocsNOR);
                break;
            default:
                console.log('what a  language?');
                break;
        }
    });

}