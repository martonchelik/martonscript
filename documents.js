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

const cancelDocs = [
    "повторная загрузка документа не требуется",
    "не требуется",
    "нечитабельно",
    "документ загружен по ошибке",
    "документ виден не полностью",
    "документ не требуется для верификации",
    "данные на банковской карте нечитабельны",
    "фамилия и имя на банковской карте нечитабельны",
    "данные на фото нечитабельны",
    "качество фото не соответствует требованиям верификации",
    "не соответствует требованиям верификации. На фотографии банковской карты должны быть открыты первые 6 цифр, последние 4, срок действия карты и фамилия-имя владельца",
    "не соответствует требованиям верификации. Необходимо загрузить полный разворот паспорта. Серию и номер паспорта можно закрыть",
    "банковская карта не использовалась",
    "нет номера карты",
    "нет имени владельца карты",
    "скрыт срок действия банковской карты",
    "скрыт срок действия и данные владельца карты",
    "срок действия карты истек",
    "необходима фотография паспорта, а не скан",
    "необходима фотография паспорта, а не скриншот",
    "оборотная сторона банковской карты не требуется",
    "банковская карта принадлежит другому человеку",
    "данные на фото в документе не совпадают с данными в профиле ",
    "срок действия документа истек",
    "необходимо загрузить оборотную сторону документа",
    "не соответствует требованиям верификации",
    "использован фоторедактор",
    "необходима фотография, а не скриншот",
    "не соответствует требованиям верификации. Лицо не видно полностью",
    "не соответствует требованиям верификации, необходимо фото физического документа"
]
const cancelDocsEN =[
    "you do not need to upload the document again",
    "not required",
    "unreadable",
    "your document has been uploaded in error",
    "your document is not fully visible",
    "document is not required for verification",
    "your card details are unreadable",
    "the card owner’s first and last name are unreadable",
    "the data on the photo is unreadable",
    "the quality of the photo does not meet verification requirements",
    "fails to meet verification requirements. The photo on your card should show the first 6 digits, last 4 digits, expiration date, and owner’s first and last name",
    "fails to meet verification requirements. Upload a full-spread photo of the first two pages of your passport. You may choose not to show your passport number",
    "your bank card has not been used",
    "the photo fails to show your card number",
    "the photo fails to show the card owner’s name",
    "the photo fails to show the card expiry date",
    "the photo fails to show the card expiry date and card owner’s information",
    "your card has expired",
    "you must provide a photo of your ID instead of a scanned image",
    "you must provide a passport photo, not a screenshot",
    "the reverse of the card is not required",
    "the card belongs to a different person",
    "the information in the photo in the document does not match the data in the profile",
    "the document has expired",
    "it is necessary to download the reverse side of the document",
    "does not meet verification requirements",
    "used photo editor",
    "A photo is required, not a screenshot",
    "does not meet the verification requirements. The face is not fully visible",
    "does not meet verification requirements, a photo of the physical document is required"
]
const cancelDocsDE =[
    "erneutes Hochladen des Dokuments nicht erforderlich",
    "nicht erforderlich",
    "unleserlich",
    "Dokument fälschlich hochgeladen",
    "Dokument nicht vollständig sichtbar",
    "Dokument für Verifizierung nicht erforderlich",
    "Daten auf der Karte unleserlich",
    "Vor- und Nachname auf der Karte unleserlich",
    "Daten auf dem Foto unleserlich",
    "Qualität des Fotos entspricht nicht den Anforderungen der Verifizierung",
    "entspricht nicht den Anforderungen der Verifizierung. Auf dem Foto der Karte müssen die ersten 6 Ziffern, die letzten 4, die Gültigkeitsdauer der Karte und Vor- und Nachname des Inhabers sichtbar sein",
    "entspricht nicht den Anforderungen der Verifizierung. Die ganze Doppelseite des Ausweisdokuments muss hochgeladen werden. Die Ausweisnummer kann verdeckt werden",
    "Bankkarte wurde nicht benutzt",
    "Kartennummer fehlt",
    "Name des Karteninhabers fehlt",
    "Gültigkeitsdauer der Karte verdeckt",
    "Gültigkeitsdauer und Daten des Karteninhabers verdeckt",
    "Gültigkeitsdauer der Karte abgelaufen",
    "es wird nur ein Foto des Ausweisdokuments akzeptiert, kein Scan",
    "Sie benötigen ein Passfoto, keinen Screenshot",
    "rückseite der Karte nicht erforderlich",
    "die Karte gehört einer anderen Person",
    "die Daten auf dem Foto im Dokument stimmen nicht mit den Daten im Profil überein",
    "das Dokument ist abgelaufen",
    "sie müssen die Rückseite des Dokuments einlegen",
    "Erfüllt nicht die Verifizierungsanforderungen",
    "Verwendeter Fotoeditor",
    "Es wird ein Foto benötigt, kein Screenshot",
    "erfüllt nicht die Verifizierungsanforderungen. Das Gesicht ist nicht vollständig sichtbar",
    "Keine Überprüfung erforderlich, kein Fotodokument"
]
const cancelDocsPT =[
    "você não precisa enviar o documento novamente",
    "não requerido",
    "ilegível",
    "houve um erro no envio do se documento",
    "seu documento não está totalmente visível",
    "documento não é necessário para verificação",
    "os dados do seu cartão estão ilegíveis",
    "o primeiro e último nome do proprietário do cartão estão ilegíveis",
    "os dados na imagem estão ilegíveis",
    "a qualidade da foto não cumpre o requisito de verificação",
    "falha no cumprimento dos requisitos de verificação. A foto do seu cartão deve mostrar os 6 primeiros dígitos, os últimos 4, a data de validade e o primeiro e último nome do proprietário",
    "falha no cumprimento dos requisitos de verificação. Envie uma imagem larga das duas primeiras páginas do seu passaporte. Você pode escolher não exibir seu número do passaporte",
    "seu cartão bancário não foi utilizado",
    "a foto não exibe seu número do cartão",
    "a foto não exibe o nome do proprietário",
    "a foto não exibe a data de validade do cartão",
    "a foto não exibe a data de validade do cartão nem as informações do proprietário",
    "seu cartão expirou",
    "você deve fornecer uma foto do seu ID em vez de uma imagem digitalizada",
    "Você precisa de uma foto de passaporte, não de uma captura de tela",
    "não é necessário mostrar a parte de trás do cartão",
    "o cartão pertence a outra pessoa",
    "os dados da foto no documento não correspondem aos dados do perfil",
    "o documento expirou",
    "é necessário carregar o verso do documento",
    "Não atende aos requisitos de verificação",
    "Editor de fotos usado",
    "Preciso de uma foto, não de uma captura de tela",
    "não atende aos requisitos de verificação. O rosto não está completamente visível",
    "não atende aos requisitos de verificação, é necessária uma foto do documento físico"
]
const cancelDocsUA =[
    "повторне завантаження документа не вимагається",
    "не вимагається",
    "нечитабельне",
    "документ завантажено помилково",
    "документ не видно повністю",
    "документ не вимагається для верифікації",
    "дані банківської картки нечитабельні",
    "прізвище та ім’я на банківській картці нечитабельні",
    "дані на фото нечитабельні",
    "якість фото не відповідає вимогам верифікації",
    "не відповідає вимогам верифікації. На фотографії банківської картки повинні бути відкриті перші 6 цифр, останні 4, термін дії картки та прізвище-ім’я власника",
    "не відповідає вимогам верифікації. Необхідно завантажити повний розворот паспорта. Серію та номер паспорта можна закрити",
    "банківська картка не використовувалася",
    "немає номера картки",
    "немає ім’я власника на картці",
    "приховано термін дії банківської картки",
    "приховано термін дії та дані власника картки",
    "термін дії картки закінчився",
    "необхідна фотографія паспорта, а не скан",
    "потрібна фотографія паспорта, а не скріншот",
    "зворотний бік банківської картки не потрібен",
    "банківська картка належить іншій людині",
    "дані на фото в документі не збігаються з даними в профілі",
    "термін дії документа закінчився",
    "необхідно завантажити зворотний бік документа",
    "не відповідає вимогам верифікації",
    "використано фоторедактор",
    "потрібна фотографія, а не скріншот",
    "не відповідає вимогам верифікації. Обличчя видно не повністю",
    "не відповідає вимогам верифікації, потрібне фото фізичного документа"
]
const cancelDocsES =[
    "no es necesario volver a cargar el documento",
    "no requerido",
    "ilegible",
    "hubo un error en el envío de tu documento",
    "tu documento no es completamente visible",
    "el documento no es necesario para la verificación",
    "los datos de tu tarjeta son ilegibles",
    "el nombre y apellido del propietario de la tarjeta son ilegibles",
    "Los datos de la foto son ilegibles",
    "la calidad de la foto no cumple con los requisitos de verificación",
    "no cumple con los requisitos de verificación. La foto de tu tarjeta debe mostrar los primeros 6 dígitos, los últimos 4 dígitos, la fecha de vencimiento y el nombre y apellido del propietario",
    "no cumple con los requisitos de verificación. Carga una fotografía completa de las dos primeras páginas de tu pasaporte. Puedes optar por no mostrar tu número de pasaporte",
    "tu tarjeta bancaria no ha sido utilizada",
    "la foto no muestra tu número de tarjeta",
    "la foto no muestra el nombre del propietario de la tarjeta",
    "la foto no muestra la fecha de vencimiento de la tarjeta",
    "la foto no muestra la fecha de vencimiento de la tarjeta ni la información del propietario de la tarjeta",
    "tu tarjeta ha caducado",
    "Se requiere una foto de pasaporte, no un escaneo",
    "debes proporcionar una foto de tu identificación en lugar de una imagen escaneada",
    "no se requiere el reverso de la tarjeta",
    "la tarjeta pertenece a otra persona",
    "la información de la foto en el documento no coincide con los datos del perfil",
    "el documento ha caducado",
    "es necesario descargar el reverso del documento",
    "No cumple con los requisitos de verificación",
    "Editor de fotos utilizado",
    "Se necesita fotografía, no una captura de pantalla",
    "no cumple con los requisitos de verificación. La cara no es completamente visible.",
    ""
]
const cancelDocsFR =[
    "il n’est pas nécessaire de télécharger le document à nouveau",
    "non requis",
    "illisible",
    "le document a été téléchargé par erreur",
    "le document n’est pas visible dans son intégralité",
    "le document n’est pas nécessaire pour la vérification",
    "les informations de la carte bancaire sont illisibles",
    "le nom et le prénom du titulaire de la carte bancaire sont illisibles",
    "les informations sont illisibles sur la photo",
    "la qualité de la photo ne répond pas aux exigences de vérification",
    "ne répond pas aux exigences de vérification. Les informations suivantes doivent figurer sur la photo de votre carte bancaire : les 6 premiers chiffres, les 4 derniers chiffres, la date d’expiration, ainsi que le nom et le prénom du titulaire de la carte",
    "ne répond pas aux exigences de vérification. Vous devez télécharger une photo des deux premières pages de votre passeport, dans leur totalité. Si vous le souhaitez, vous pouvez cacher le numéro du passeport",
    "votre carte bancaire n’a pas été utilisée",
    "le numéro de votre carte bancaire n’est pas visible sur la photo",
    "le nom du titulaire de la carte bancaire n’est pas visible sur la photo",
    "la date d’expiration de la carte bancaire n’est pas visible sur la photo",
    "la date d’expiration et le nom du titulaire de la carte bancaire ne sont pas visibles sur la photo",
    "votre carte bancaire est expirée",
    "vous devez fournir une photo de votre passeport au lieu d’un scan",
    "Pas de photo de passeport, pas d’écran",
    "le verso de la carte bancaire n’est pas requis",
    "la carte bancaire appartient à quelqu’un d’autre",
    "les données de la photo dans le document ne correspondent pas à celles du profil",
    "le document a expiré",
    "vous devez télécharger le verso du document",
    "",
    "",
    "une photo est nécessaire, pas une capture d’écran",
    "",
    ""
]
const cancelDocsTR =[
    "belgeyi tekrar yüklemenize gerek yoktur",
    "gerekli değildir",
    "okunamaz",
    "belgeniz yanlışlıkla yüklendi",
    "belgeniz tam olarak görünmüyor",
    "belge doğrulama için gerekli değildir",
    "kart bilgileriniz okunamaz durumda",
    "kart sahibinin adı ve soyadı okunamaz durumda",
    "fotoğraf üzerindeki veriler okunamaz durumda",
    "fotoğraf kalitesi doğrulama gerekliliklerini karşılamıyor",
    "doğrulama gerekliliklerini karşılamıyor. Kartınızın üzerindeki fotoğraf ilk 6 haneyi, son 4 haneyi, son kullanma tarihini ve kart sahibinin adını ve soyadını göstermelidir",
    "doğrulama gerekliliklerini karşılamıyor. Kimlik belgenizin tam boy fotoğrafını yükleyin. Kimlik belgenizin numarasını göstermemeyi tercih edebilirsiniz",
    "banka kartınız kullanılmadı",
    "fotoğraf kart numaranızı göstermiyor",
    "fotoğraf kart sahibinin adını göstermiyor",
    "fotoğraf kartın son kullanma tarihini göstermiyor",
    "fotoğrafın kartın son kullanma tarihini ve kart sahibinin bilgilerini göstermiyor",
    "kartınızın son kullanma tarihi geçti",
    "taranmış bir görüntü yerine kimliğinizin fotoğrafını sağlamalısınız",
    "",
    "kartın arka yüzü gerekli değildir",
    "kart farklı bir kişiye aittir",
    "belgedeki fotoğrafta yer alan bilgilerin profildeki verilerle eşleşmiyor",
    "belgenin geçerlilik süresi doldu",
    "belgenin arka yüzünün yüklenmesi gereklidir",
    "",
    "",
    "",
    "",
    ""
]
const cancelDocsPL =[
    "ponowne przesłanie dokumentu nie jest wymagane",
    "nie jest wymagane",
    "nieczytelne",
    "dokument został przesłany przez pomyłkę",
    "dokument jest częściowo nieczytelny",
    "dokument nie jest wymagany do weryfikacji",
    "dane na karcie płatniczej są nieczytelne",
    "imię i nazwisko posiadacza karty są nieczytelne",
    "dane na zdjęciu są nieczytelne",
    "jakość zdjęć nie spełnia wymagań dotyczących weryfikacji",
    "nie spełnia wymagań dotyczących weryfikacji. Na zdjęciu karty muszą być widoczne: pierwsze 6 cyfr, ostatnie 4 cyfry, data ważności oraz imię i nazwisko posiadacza",
    "nie spełnia wymagań dotyczących weryfikacji. Musisz przesłać zdjęcie przedstawiające całe dwie pierwsze strony paszportu. Numer paszportu możesz zasłonić",
    "karta bankowa nie była używana",
    "na zdjęciu nie widać numeru karty",
    "na zdjęciu nie widać imienia i nazwiska posiadacza karty",
    "na zdjęciu nie widać terminu ważności karty",
    "na zdjęciu nie widać terminu ważności i danych posiadacza karty",
    "upłynął termin ważności karty",
    "wymagane jest zdjęcie paszportu, a nie skan",
    "",
    "tylna strona karty nie jest wymagana",
    "karta należy do innej osoby",
    "dane na zdjęciu w dokumencie nie pokrywają się z danymi w profilu",
    "dokument wygasł",
    "konieczne jest pobranie odwrotnej strony dokumentu",
    "",
    "",
    "",
    "",
    ""
]
const cancelDocsKZ =[
    "құжатты қайта жүктеп салу қажет емес",
    "талап етілмейді",
    "анық көрінбейді",
    "құжатыңыз қателікпен жүктеп салынған",
    "құжатыңыз толық көрінбейді",
    "тексеру үшін құжат талап етілмейді",
    "банк картасындағы деректер көрінбейді",
    "карта иесінің аты мен тегі көрінбейді",
    "фотодағы деректер көрінбейді",
    "фото сапасы тексеру талаптарына сай емес",
    "тексеру талаптарына сай емес. Картадағы фотодада алғашқы 6 және соңғы 4 сан, картаның жарамдылық мерзімі және иесінің аты-жөні анық болуы керек",
    "тексеру талаптарына сай емес. Төлқұжатыңыздың алғашқы екі бетінің толық фотосын жүктеп салыңыз. Төлқұжаттың нөмірін көрсетпеуді таңдауға болады",
    "банк картаңыз пайдаланылмаған",
    "фотода картаң нөмірі көрінбейді",
    "фотода карта иесінің аты-жөні көрінбейді",
    "фотода картаның жарамдылық мерзімі көрінбейді",
    "фотода картаның жарамдылық мерзімі мен карта иесінің деректері көрінбейді",
    "картаның мерзімі өткен",
    "төлқұжаттың сканерленген көшірмесі емес, фотосы қажет",
    "",
    "банк картасының артқы жағы қажет емес",
    "банк картасы басқа адамға тиесілі",
    "құжаттағы фотосуреттегі деректер профильдегі мәліметтермен сәйкес келмейді",
    "құжаттың мерзімі аяқталды",
    "құжаттың артқы жағын жүктеу қажет",
    "",
    "",
    "",
    "",
    ""
]
const cancelDocsFIN =[
    "asiakirjan uudelleenlähetystäei vaadita",
    "ei vaadita",
    "lukukelvoton",
    "asiakirja lähetettiin vahingossa",
    "asiakirja ei ole kokonaan nähtävissä",
    "asiakirjaa ei tarvitse vahvistaa",
    "pankkikortin tietoja ei voida lukea",
    "pankkikortissa olevat sukunimi ja etunimi eivät ole luettavissa",
    "valokuvan tietoja ei voi lukea",
    "valokuvan laatu ei täytä vahvistusvaatimuksia",
    "vahvistusvaatimukset eivät täyty. Pankkikortin valokuvassa on oltava ensimmäiset 6 ja viimeiset 4 numeroa, kortin viimeinen voimassaolopäivä ja omistajan etu- ja sukunimi",
    "ei vastaa vahvistusvaatimuksia. Lähetä koko aukeaman kuva passisi kahdesta ensimmäisestä sivusta. Passin sarjanumero ja numero voidaan peittää",
    "pankkikorttia ei käytetty",
    "kortin numero puuttuu kuvasta",
    "kortin omistajan nimi puuttuu kuvasta",
    "kortin voimassaoloaika puuttuu kuvasta",
    "kortin voimassaoloaika ja kortin haltijan tiedot eivät näy kuvasta",
    "kortti on vanhentunut",
    "vaaditaan valokuva passista, ei skannausta",
    "",
    "pankkikortin kääntöpuolta ei tarvita",
    "pankkikortti kuuluu toiselle henkilölle",
    "dokumentin kuvan tiedot eivät vastaa profiilin tietoja",
    "asiakirja on vanhentunut",
    "on tarpeen ladata asiakirjan kääntöpuoli",
    "",
    "",
    "",
    "",
    ""
]
const cancelDocsDA =[
    "genindlæsning af dokumentet kræves ikke",
    "kræves ikke",
    "ulæseligt",
    "dokumentet er indlæst ved en fejl",
    "dokumentet er ikke fuldt synligt",
    "dokumentet kræves ikke til verificering",
    "dine data på betalingskortet er ulæselige",
    "kortholderens fornavn og efternavn på betalingskortet er ulæselige",
    "data på billedet er ulæselige",
    "kvaliteten af billedet opfylder ikke verifikationskravene",
    "opfylder ikke verifikationskravene. På billedet af betalingskortet skal man kunne se de første 6 cifre, de sidste 4, kortets gyldighedsperiode samt kortholderens fornavn og efternavn",
    "opfylder ikke verifikationskravene.Overfør et foto af hele passets opslag. Serie- og pasnummer kan være skjult",
    "betalingskortet har ikke været i brug",
    "der mangler et kortnummer på billedet",
    "der mangler kortholderens navn på billedet",
    "betalingskortets gyldighedsperiode vises ikke på billedet",
    "kortets gyldighedsperiode og kortholderens data vises ikke på billedet",
    "kortets gyldighedsperiode er udløbet",
    "der kræves et billede af passet, ikke en scannet kopi",
    "",
    "bagsiden af betalingskortet kræves ikke",
    "betalingskortet tilhører en anden person",
    "dataene på billedet i dokumentet svarer ikke til dataene i profilen",
    "dokumentet er udløbet",
    "det er nødvendigt at hente bagsiden af dokumentet",
    "",
    "",
    "",
    "",
    ""
]
const cancelDocsNOR =[
    "du trenger ikke laste opp dokumentet på nytt",
    "ikke påkrevet",
    "ikke leselig",
    "feilopplastet dokument",
    "dokumentet er ikke fullt synlig",
    "dokumentet er ikke nødvendig for verifisering",
    "kortopplysningene  er ikke leselige",
    "kortholders for- og etternavn er ikke leselig",
    "data på bildet er ikke leselig",
    "bildekvaliteten tilfredsstiller ikke kravene til verifisering",
    "tilfredsstiller ikke krav til verifisering. Bildet av bankkortet skal vise de 6 første sifrene, de 4 siste sifrene, utløpsdato og kortholders for-/etternavn",
    "tilfredsstiller ikke krav til verifisering. Last opp et fullstendig bilde av de to første sidene i passet ditt.  Passnummeret kan skjules",
    "bankkortet har ikke blitt brukt",
    "bildet viser ikke  kortnummeret ditt",
    "bildet viser ikke kortholders  navn",
    "bildet viser ikke kortets utløpsdato",
    "bildet viser ikke kortets utløpsdato og informasjon om kortholder",
    "kortet er utløpt",
    "det trengs et bilde av passet i stedet for et  skannet bilde",
    "",
    "baksiden av bankkortet er ikke nødvendig",
    "bankkortet tilhører  en annen person",
    "dataene på bildet i dokumentet samsvarer ikke med dataene i profilen",
    "dokumentet er utløpt",
    "det er nødvendig å laste ned baksiden av dokumentet",
    "",
    "",
    "",
    "",
    ""
]

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

function autocompleteCancel(inp, displayArr, inputArr) {
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
            a.style.width = window.getComputedStyle(inp, null).getPropertyValue("width");
            displayArr.forEach((item, i) => {
                let index = item.toUpperCase().indexOf(val.toUpperCase());
                if (index !== -1) {
                    let b = createListItem(item, val, index, inputArr[i], i);
                    a.appendChild(b);
                }
            });
        }

        function onFocus() {
            let val = this.value;
            closeAllLists();
            currentFocus = -1;
            let a = createListContainer();
            a.style.width = window.getComputedStyle(inp, null).getPropertyValue("width");
            displayArr.forEach((item, i) => {
                let index = item.toUpperCase().indexOf(val.toUpperCase());
                if (index !== -1 || val === "") {
                    let b = createListItem(item, val, index, inputArr[i], i);
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
            a.setAttribute("class", "autocomplete-items-cancel");
            inp.parentNode.appendChild(a);
            return a;
        }

        function createListItem(item, val, index, inputValue, i) {
            let b = document.createElement("DIV");
            b.innerHTML = item.substr(0, index);
            b.innerHTML += "<strong>" + item.substr(index, val.length) + "</strong>";
            b.innerHTML += item.substr(index + val.length);
            if (inputValue === "") inputValue = cancelDocsEN[i]
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
            let x = document.getElementsByClassName("autocomplete-items-cancel");
            for (let i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        const cancelDocsEN =["your document has been uploaded in error", "not required", "document is not required for verification", "you do not need to upload the document again", "your document is not fully visible",
            "unreadable", "your card details are unreadable", "the card owner’s first and last name are unreadable", "the data on the photo is unreadable", "the quality of the photo does not meet verification requirements",
            "fails to meet verification requirements. The photo on your card should show the first 6 digits, last 4 digits, expiration date, and owner’s first and last name",
            "fails to meet verification requirements. Upload a full-spread photo of the first two pages of your passport. You may choose not to show your passport number", "your bank card has not been used",
            "the photo fails to show your card number", "the photo fails to show the card owner’s name", "the photo fails to show the card expiry date", "the photo fails to show the card expiry date and card owner’s information",
            "your card has expired", "you must provide a photo of your ID instead of a scanned image", "you must provide a passport photo, not a screenshot", "the reverse of the card is not required",
            "the card belongs to a different person", "the information in the photo in the document does not match the data in the profile", "the document has expired",
            "it is necessary to download the reverse side of the document", "does not meet verification requirements", "used photo editor", "A photo is required, not a screenshot",
            "does not meet the verification requirements. The face is not fully visible", "does not meet verification requirements, a photo of the physical document is required"];
        addEventListeners();
    }
}

function createButton(name){
    const button = document.createElement('a')
    button.textContent = name
    button.style.cursor = 'pointer'
    button.style.marginLeft = '2em'
    button.className = 'button toggle-approve'
    button.style.float = 'unset'
    button.style.width = 'auto'
    button.style.padding = '4px 16px 4px'
    return button
}

function addMultiCancelForm(language, waitingDocs){
    let multiCancelForm = document.createElement('div')
    multiCancelForm.innerHTML = `
    <div class="ui-widget-overlay ui-front" id='multicancel_background' style="z-index: 1100; display: none"></div>
    <div id='multicancel_form_dialog' tabindex="-1" role="dialog" class="ui-dialog ui-corner-all ui-widget ui-widget-content ui-front" aria-describedby="multicancel_sidebar_section" style="height: auto; width: auto; z-index: 1101; display: none" aria-labelledby="ui-id-50"><div class="ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix"><span id="ui-id-50" class="ui-dialog-title">&nbsp;</span><button type="button" id='multicancel_form_close' class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close" title="Close"><span class="ui-button-icon ui-icon ui-icon-closethick"></span><span class="ui-button-icon-space"> </span>Close</button></div><div class="sidebar_section panel ui-dialog-content ui-widget-content" id="multicancel_sidebar_section" style="width: auto; min-height: 120px; max-height: none; height: auto;">
    
    <h3>Unapprove Documents</h3>
    <div class="panel_contents"><form novalidate="novalidate" class="formtastic document" accept-charset="UTF-8" id="multicancel_form"><input type="hidden" name="authenticity_token" value="" autocomplete="off">
    </li>
        <div class="container">
            <div class="col-left">
                <li class="boolean input optional" id="document_unapprove_with_comment_input"><input type="hidden" name="document[multi_unapprove_with_comment]" value="0" autocomplete="off"><label for="document_unapprove_with_comment_multi" class=""><input type="checkbox" name="document[multi_unapprove_with_comment]" id="document_unapprove_with_comment_multi" value="1" class="reason-checkbox" checked="checked">Отклонить с комментарием</label>

                </li>
                <li class="boolean input optional" id="document_another_person_card_multi_input"><input type="hidden" name="document[multi_another_person_card]" value="0" autocomplete="off"><label for="document_another_person_card_multi" class=""><input type="checkbox" name="document[multi_another_person_card]" id="document_another_person_card_multi" value="1" class="reason-checkbox">карта другого человека</label>

                </li>
                <li class="boolean input optional" id="document_card_details_multi_input"><input type="hidden" name="document[multi_card_details]" value="0" autocomplete="off"><label for="document_card_details_multi" class=""><input type="checkbox" name="document[multi_card_details]" id="document_card_details_multi" value="1" class="reason-checkbox">данные карты</label>

                </li>
                <li class="boolean input optional" id="document_data_not_match_multi_input"><input type="hidden" name="document[multi_data_not_match]" value="0" autocomplete="off"><label for="document_data_not_match_multi" class=""><input type="checkbox" name="document[multi_data_not_match]" id="document_data_not_match_multi" value="1" class="reason-checkbox">данные не совпадают</label>

                </li>
                <li class="boolean input optional" id="document_expired_multi_input"><input type="hidden" name="document[multi_expired]" value="0" autocomplete="off"><label for="document_expired_multi" class=""><input type="checkbox" name="document[multi_expired]" id="document_expired_multi" value="1" class="reason-checkbox">срок истек</label>

                </li>
                <li class="boolean input optional" id="document_full_passport_spread_multi_input"><input type="hidden" name="document[multi_full_passport_spread]" value="0" autocomplete="off"><label for="document_full_passport_spread_multi" class=""><input type="checkbox" name="document[multi_full_passport_spread]" id="document_full_passport_spread_multi" value="1" class="reason-checkbox">полный разворот паспорта</label>

                </li>
                <li class="boolean input optional" id="document_not_completely_visible_multi_input"><input type="hidden" name="document[multi_not_completely_visible]" value="0" autocomplete="off"><label for="document_not_completely_visible_multi" class=""><input type="checkbox" name="document[multi_not_completely_visible]" id="document_not_completely_visible_multi" value="1" class="reason-checkbox">не виден полностью</label>

                </li>
                <li class="boolean input optional" id="document_not_needed_multi_input"><input type="hidden" name="document[multi_not_needed]" value="0" autocomplete="off"><label for="document_not_needed_multi" class=""><input type="checkbox" name="document[multi_not_needed]" id="document_not_needed_multi" value="1" class="reason-checkbox">не нужен</label>

                </li>
                <li class="boolean input optional" id="document_not_scan_multi_input"><input type="hidden" name="document[multi_not_scan]" value="0" autocomplete="off"><label for="document_not_scan_multi" class=""><input type="checkbox" name="document[multi_not_scan]" id="document_not_scan_multi" value="1" class="reason-checkbox">фото паспорта, а не скан</label>

                </li>
                <li class="boolean input optional" id="document_re_uploaded_multi_input"><input type="hidden" name="document[multi_re_uploaded]" value="0" autocomplete="off"><label for="document_re_uploaded_multi" class=""><input type="checkbox" name="document[multi_re_uploaded]" id="document_re_uploaded_multi" value="1" class="reason-checkbox">повторно загружен</label>

                </li>
                <li class="boolean input optional" id="document_reverse_side_multi_input"><input type="hidden" name="document[multi_reverse_side]" value="0" autocomplete="off"><label for="document_reverse_side_multi" class=""><input type="checkbox" name="document[multi_reverse_side]" id="document_reverse_side_multi" value="1" class="reason-checkbox">оборотная сторона</label>

                </li>
                <li class="boolean input optional" id="document_unreadable_data_multi_input"><input type="hidden" name="document[multi_unreadable_data]" value="0" autocomplete="off"><label for="document_unreadable_data_multi" class=""><input type="checkbox" name="document[multi_unreadable_data]" id="document_unreadable_data_multi" value="1" class="reason-checkbox">нечитабельные данные</label>

                </li>
            </div>
            <div class="col-right">
                <span>
                Язык
                </span>
                <span class="locale">
                    `+ language +`
                </span>
                <div id="waiting_docs">
                    <div class="image_select"></div>
                    <div class="image_select"></div>
                    <div class="image_select"></div>
                    <div class="image_select"></div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="col-left">
                <li class="text input required" id="document_comment_input_multi"><label for="document_comment_multi" class="label">Комментарий<abbr title="required">*</abbr></label><textarea rows="3" id="document_comment_multi" name="document[multi_comment]"></textarea>

                </li>        

            </div>
            <div class="col-right">
                <li class="boolean input optional" id="document_send_to_email_multi_input"><input type="hidden" name="document[multi_send_to_email]" value="0" autocomplete="off"><label for="document_send_to_email_multi" class=""><input type="checkbox" name="document[multi_send_to_email]" id="document_send_to_email_multi" value="1" class="send-checkbox" checked="checked">Отправить по Емейл</label>

                </li>
                <li class="boolean input optional" id="document_send_to_messenger_multi_input"><input type="hidden" name="document[multi_send_to_messenger]" value="0" autocomplete="off"><label for="document_send_to_messenger_multi" class=""><input type="checkbox" name="document[multi_send_to_messenger]" id="document_send_to_messenger_multi" value="1" class="send-checkbox" checked="checked">Отправить в мессенджер</label>

                </li>
            </div>
        </div>
        <fieldset class="actions"><ol><li class="action input_action"><input type="submit" name="commit" value="Сохранить" data-disable-with="Сохранить"></li>
        </ol></fieldset></form>
    </div>
</div></div>    
    `
    const dialogUI = multiCancelForm.querySelector('#multicancel_form_dialog')
    dialogUI.style.top = screen.height * 0.23 + 'px'
    dialogUI.style.left = (screen.width/2 - 330) + 'px'

    let submitButton = multiCancelForm.querySelector('input[type="submit"]');
    submitButton.disabled = 1
    submitButton.id = 'disabled_button'
    submitButton.title = 'Не указан комментарий отмены, не выбраны документы для отмены'
    let unapproveReason = 'document_unapprove_with_comment'
    let document_comment = multiCancelForm.querySelector('#document_comment_multi');
    function updateSubmitButtonState() {
        const checkedDocs = [...multiCancelForm.querySelectorAll('#waiting_docs input[type="checkbox"]:checked')];
        if (checkedDocs.length > 0){
            if (unapproveReason === 'document_unapprove_with_comment'){
                submitButton.disabled = document_comment.value?0:1;
                document_comment.value?submitButton.title = '':submitButton.title = 'Не указан комментарий отмены'
            }else{
                submitButton.disabled = unapproveReason?0:1;
                unapproveReason?submitButton.title = '':submitButton.title = 'Выберите причину отмены'
            }
        }else{
            submitButton.title = 'Не выбраны документы для отмены'
            submitButton.disabled = 1
        }
        //submitButton.disabled = 1
        submitButton.disabled?submitButton.id = 'disabled_button': submitButton.removeAttribute('id')
    }
    document_comment.addEventListener('change',()=>{
        updateSubmitButtonState()
    })

    let checkboxes = multiCancelForm.querySelectorAll('#multicancel_form .reason-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                unapproveReason = this.id.split('_multi')[0]

                checkboxes.forEach(function(otherCheckbox) {
                    if (otherCheckbox !== checkbox) {
                        otherCheckbox.checked = false;
                    }
                });
            }else{
                unapproveReason = null
            }
            console.log(unapproveReason)
            updateSubmitButtonState()
        });
    });
    function createCheckBox(documentId){
        let checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = documentId
        return checkbox;
    }
    document.body.appendChild(multiCancelForm)
    document.getElementById('multicancel_form_close').addEventListener('click', () => {
        document.getElementById('multicancel_background').style.display = 'none'
        document.getElementById('multicancel_form_dialog').style.display = 'none'
    })
    let wdArray = [...waitingDocs]
    for (let i = 0; i < 4; i++) {
        let nodeIndex = i+1
        let currentPreview = document.querySelector('#waiting_docs > div:nth-of-type('+ nodeIndex +')')
        if(wdArray[i]){
            currentPreview.appendChild(wdArray[i].querySelector('.preview').cloneNode(true))
            currentPreview.appendChild(createCheckBox(wdArray[i].querySelector('a.update-document').href.split('id=')[1]))
            currentPreview.querySelector('img')?currentPreview.querySelector('img').addEventListener('click', ()=>{
                wdArray[i].querySelector('.preview img').click()
            }):console.log('bebra')
        }
    }
    document.addEventListener('keydown',(event)=>{
        if(event.key == 'Escape'){
            if (document.getElementById('multicancel_form_dialog').style.display != 'none') document.getElementById('multicancel_form_close').click()
        }
    })
    const authToken = document.querySelector('meta[name="csrf-token"]').content
    function createUnapproveBody(documentId){
        const sendEmail = document.getElementById('document_send_to_email_multi')
        const sendMessenger = document.getElementById('document_send_to_messenger_multi')
        let bodyToken = 'authenticity_token='+ authToken
        bodyToken += '&document%5Bid%5D=' + documentId
        bodyToken += '&document%5Bunapprove_with_comment%5D=0' + (unapproveReason === 'document_unapprove_with_comment' ? '&document%5Bunapprove_with_comment%5D=1' : '')
        bodyToken += '&document%5Banother_person_card%5D=0' + (unapproveReason === 'document_another_person_card' ? '&document%5Banother_person_card%5D=1' : '')
        bodyToken += '&document%5Bcard_details%5D=0' + (unapproveReason === 'document_card_details' ? '&document%5Bcard_details%5D=1' : '')
        bodyToken += '&document%5Bdata_not_match%5D=0' + (unapproveReason === 'document_data_not_match' ? '&document%5Bdata_not_match%5D=1' : '')
        bodyToken += '&document%5Bexpired%5D=0' + (unapproveReason == 'document_expired' ? '&document%5Bexpired%5D=1' : '')
        bodyToken += '&document%5Bfull_passport_spread%5D=0' + (unapproveReason === 'document_full_passport_spread' ? '&document%5Bfull_passport_spread%5D=1' : '')
        bodyToken += '&document%5Bnot_completely_visible%5D=0' + (unapproveReason === 'document_not_completely_visible' ? '&document%5Bnot_completely_visible%5D=1' : '')
        bodyToken += '&document%5Bnot_needed%5D=0' + (unapproveReason === 'document_not_needed' ? '&document%5Bnot_needed%5D=1' : '')
        bodyToken += '&document%5Bnot_scan%5D=0' + (unapproveReason === 'document_not_scan' ? '&document%5Bnot_scan%5D=1' : '')
        bodyToken += '&document%5Bre_uploaded%5D=0' + (unapproveReason === 'document_re_uploaded' ? '&document%5Bre_uploaded%5D=1' : '')
        bodyToken += '&document%5Breverse_side%5D=0' + (unapproveReason === 'document_reverse_side' ? '&document%5Breverse_side%5D=1' : '')
        bodyToken += '&document%5Bunreadable_data%5D=0' + (unapproveReason === 'document_unreadable_data' ? '&document%5Bunreadable_data%5D=1' : '')
        bodyToken += '&document%5Bcomment%5D=' + (unapproveReason === 'document_unapprove_with_comment' ? encodeURI(document_comment.value) : '')
        bodyToken += '&document%5Bsend_to_email%5D=0&' + (sendEmail.checked? '&document%5Bsend_to_email%5D=1' : '')
        bodyToken += '&document%5Bsend_to_messenger%5D=0' + (sendMessenger.checked? '&document%5Bsend_to_messenger%5D=1' : '')
        bodyToken += '&commit=%D0%A1%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B8%D1%82%D1%8C'
        console.log(bodyToken)
        return bodyToken;
    }
    multiCancelForm.querySelectorAll('#waiting_docs input[type="checkbox"]').forEach((checkbox)=>{
        checkbox.addEventListener('change',()=>{
            updateSubmitButtonState()
            console.log(checkbox.checked)
        })
    })
    document.getElementById('multicancel_form').addEventListener('submit', (e)=>{
        e.preventDefault();
        let unapproveQueue = []
        const playerLink = window.location.href
        let checkboxes = document.querySelectorAll('#waiting_docs input[type="checkbox"]');
        checkboxes.forEach((checkbox)=> {
            if (checkbox.checked) {
                unapproveQueue.push(fetch(playerLink.split('#')[0] + '/unapprove_document',     {
                    referrer: playerLink.split('#')[0],
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: createUnapproveBody(checkbox.id),
                    method: "POST",
                    headers: {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "max-age=0",
                        "content-type": "application/x-www-form-urlencoded",
                        "priority": "u=0, i",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1"
                    },
                    mode: "cors",
                    credentials: "include"
                }).then())
                window.location.replace(playerLink.split('#')[0] + '#document_panel')
                window.location.reload()
            }
        });
    })
    const locale = document.getElementsByClassName('row-yazyk')[0].getElementsByTagName('td')[0].textContent.toUpperCase()
    const cancelDocComment = multiCancelForm.querySelector('#document_comment_multi')
    switch (locale) {
        case 'РУССКИЙ':case 'RU':
            autocompleteCancel(cancelDocComment, cancelDocs, cancelDocs);
            break;case 'EN':;case 'АНГЛИЙСКИЙ':autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsEN);
            break;case 'DE':case 'НЕМЕЦКИЙ':autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsDE);
            break;case 'PT':case 'ПОРТУГАЛЬСКИЙ':autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsPT);
            break;case 'UA':autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsUA);
            break;case 'ES':case 'ИСПАНСКИЙ':autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsES);
            break;case 'FR':case 'ФРАНЦУЗСКИЙ':autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsFR);
            break;case 'TR':case 'ТУРЕЦКЙ':autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsTR);
            break;case 'PL':case 'ПОЛЬСКИЙ':autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsPL);
            break;case 'KZ':case 'КАЗАХСКИЙ':autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsKZ);
            break;case 'FI':case 'ФИНСКИЙ':autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsFIN);
            break;case 'DA':case 'ДАТСКИЙ':autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsDA);
            break;case 'NOR':case 'NO':case 'NR':case 'НОРВЕЖСКИЙ':autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsNOR);
            break;default:console.log('what a  language?');
            autocompleteCancel(cancelDocComment, cancelDocs, cancelDocsEN)
            break;
    }
}

function displayDocs(askedTagSet, imgInfoSet) {
    function popup(url)
    {
        const width  = screen.width*0.2;
        const height = screen.height*0.5;
        const left   = screen.width - width - 50;
        const top    = screen.height*0.15;
        let params = 'width='+width+', height='+height;
        params += ', top='+top+', left='+left;
        params += ', directories=no';
        params += ', location=no';
        params += ', menubar=no';
        params += ', resizable=yes';
        params += ', scrollbars=yes';
        params += ', status=yes';
        params += ', toolbar=no';
        let newWin=window.open(url,'notApproveForm', params);
        if (window.focus) {
            newWin.focus()
        }
        return false;
    }
    //const docPanel = document.getElementById('document_panel')

    const docPanel = document.evaluate("//h3[contains(., 'Документы')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext().parentElement
    const phone = document.getElementById('phones_sidebar_section').getElementsByTagName('li')[0] ?
        document.getElementById('phones_sidebar_section').getElementsByTagName('li')[0].getElementsByTagName('div')[0].textContent :
        "bebra"
    const emailConfirmed = document.getElementById('player_info_sidebar_section').querySelector('.row-confirmed_at').textContent.toLowerCase()
    console.log(emailConfirmed)
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
    let language = document.getElementsByClassName('row-yazyk')[0].getElementsByTagName('td')[0].textContent.toUpperCase()

    let waitingDocsApproveAll = createButton('Одобрить все ожидающие')
    let waitingDocsApproveAllBottom
    let waitingDocs = document.querySelectorAll('#document_panel tr.document-pending:not(.document-removed)')
    let multiCancelButtonBottom
    let multiCancelButton = createButton('Множественная отмена')
    console.log(waitingDocs)


    switch (language) {
        case 'РУССКИЙ':
            language = 'RU'
            break;
        case 'АНГЛИЙСКИЙ':
            language = 'EN'
            break;
        case 'НЕМЕЦКИЙ':
            language = 'DE'
            break;
        case 'ПОРТУГАЛЬСКИЙ':
            language = 'DE'
            break;
        case 'ИСПАНСКИЙ':
            language = 'ES'
            break;
        case 'ТУРЕЦКЙ':
            language = 'TR'
            break;
        case 'ФРАНЦУЗСКИЙ':
            language = 'EN'
            break;
        case 'ПОЛЬСКИЙ':
            language = 'PL'
            break;
        case 'КАЗАХСКИЙ':
            language = 'KZ'
            break;
        case 'ФИНСКИЙ':
            language = 'FI'
            break;
        case 'ДАТСКИЙ':
            language = 'DA'
            break;
        case 'НОРВЕЖСКИЙ':
            language = 'NO'
            break;
        case 'ЯПОНСКИЙ':
            language = 'JA'
            break;
        case 'УКРАИНСКИЙ':
            language = 'UA'
            break;
        case 'ХИНДИ':
            language = 'HI'
            break;
    }
    addMultiCancelForm(language, waitingDocs)

    let waitingDocsButtons = []
    waitingDocs.forEach((doc)=>{
        waitingDocsButtons.push(doc.querySelectorAll('a[href$="approved"]')[0])
    })
    seenButtons.forEach((button)=> {
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
    const userTags = document.getElementById("user_tags").getAttribute("data-tags")?document.getElementById("user_tags").getAttribute("data-tags"):document.getElementById("user_tags").getAttribute("data-payload");

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
        document.addEventListener("beforeunload", (event) => {if (rtTimer == 1){
            removeTag()
        }});
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
        const verifyForm = document.getElementsByClassName('verify-user')[0]?document.getElementsByClassName('verify-user')[0].getElementsByTagName('form')[0]:null
        if (verifyForm){
            verifyForm.getElementsByTagName("button")[0].title = 'ALT + A'
            verifyForm.addEventListener('submit', (event) => {
                currentTags = tagPanel.getElementsByClassName('current-tags')[0]
                if(currentTags.innerHTML.includes('asked for docs')){
                    document.getElementById('docs-remove-tag').click()
                }
                if(currentTags.innerHTML.includes('asked for selfie')){
                    document.getElementById('selfie-remove-tag').click()
                }
            })
            document.addEventListener('keydown', function(event) {
                if (event.altKey && event.code == 'KeyA') {
                    verifyForm.submit()
                }
            });
        }
    }


    container.appendChild(editButton)
    containerBottom.appendChild(editButton.cloneNode(true))
    if(waitingDocs.length > 1){
        container.appendChild(waitingDocsApproveAll)
        waitingDocsApproveAllBottom = waitingDocsApproveAll.cloneNode(true)
        containerBottom.appendChild(waitingDocsApproveAllBottom)
        container.appendChild(multiCancelButton)
        multiCancelButtonBottom = multiCancelButton.cloneNode(true)
        containerBottom.appendChild(multiCancelButtonBottom)
        const multiCancelAllButtons = [multiCancelButton, multiCancelButtonBottom]
        multiCancelAllButtons.forEach((button)=>{
            button.addEventListener('click',()=>{
                document.getElementById('multicancel_form_dialog').style.display = 'unset'
                document.getElementById('multicancel_background').style.display = 'unset'
            })
        })
        const approveAllButtons = [waitingDocsApproveAll, waitingDocsApproveAllBottom]
        approveAllButtons.forEach((button)=>{
            button.addEventListener("click", function () {
                const authToken = document.querySelector('meta[name="csrf-token"]').content
                const approveAllFetchRequests = []
                waitingDocsButtons.forEach((button) => {
                    approveAllFetchRequests.push(fetch(button.href, {
                        referrer: button.href.split('/change')[0],
                        referrerPolicy: "strict-origin-when-cross-origin",
                        body: "_method=post&authenticity_token="+authToken,
                        method: "POST",
                        headers: {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                            "cache-control": "max-age=0",
                            "content-type": "application/x-www-form-urlencoded",
                            "priority": "u=0, i",
                            "sec-fetch-dest": "document",
                            "sec-fetch-mode": "navigate",
                            "sec-fetch-site": "same-origin",
                            "sec-fetch-user": "?1",
                            "upgrade-insecure-requests": "1"
                        },
                        mode: "cors",
                        credentials: "include"
                    }).then())
                    window.location.reload()
                })
            });
        })
    }
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
            observeDivContentChange(docTitle[0])
        })
    }

}

function cardCheck() {
    let cards = document.evaluate("//h3[contains(., 'Инструменты платежа')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext().parentElement;
    let depositsRow = document.querySelector("td.col.col-depozity");
    const depositsOverall = parseInt(depositsRow.textContent.replace(/[^\d]/g, '').slice(0, -2));
    let cashoutsRow = document.querySelector("td.col.col-vyplaty");
    const cashoutsOverall = parseInt(cashoutsRow.textContent.replace(/[^\d]/g, '').slice(0, -2));
    let holdRow = document.querySelector("td.col.col-vyplaty_v_holde");
    const holdOverall = parseInt(holdRow.textContent.replace(/[^\d]/g, '').slice(0, -2));
    const userCurrency = document.querySelector("td.col.col-valyuta > div > span").textContent;
    const userTags = document.getElementById("user_tags").getAttribute("data-tags")?document.getElementById("user_tags").getAttribute("data-tags"):document.getElementById("user_tags").getAttribute("data-payload");
    let isProfileVerified = userTags.indexOf("verified") == -1 ? 0 : 1;
    let emailRegex = /([+a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
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
    let table = cards.querySelector('table');
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
            console.log(card)
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
        //card.match(/\d{6}\*{6}\d{4}/g)
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
    const placeForButtons = document.evaluate("//h3[contains(., 'Инструменты платежа')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext();
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

let tagsList = document.querySelectorAll('#user_tags > div.current-tags > span')
tagsList.forEach((tag) => {
    console.log(encodeURI(tag.textContent))
})
