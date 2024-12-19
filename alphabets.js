const ukrainianAlphabet = [
    'А', 'а',
    'Б', 'б',
    'В', 'в',
    'Г', 'г',
    'Ґ', 'ґ',
    'Д', 'д',
    'Е', 'е',
    'Є', 'є',
    'Ж', 'ж',
    'З', 'з',
    'И', 'и',
    'І', 'і',
    'Ї', 'ї',
    'Й', 'й'
];
const kazakhAlphabet = [
    'Ә', 'ә',
    'Ғ', 'ғ',
    'Қ', 'қ',
    'Ң', 'ң',
    'Ө', 'ө',
    'Ұ', 'ұ',
    'Ү', 'ү',
    'Һ', 'һ',
    'І', 'і'
];

function createSymbolsMenu(inputId) {

    const inputField = document.getElementById(inputId);
    const container = document.createElement('div');
    container.id = `${inputId}-container`;
    container.style.position = 'relative';
    inputField.parentNode.insertBefore(container, inputField);
    container.appendChild(inputField);
    console.log(inputField)


    const symbolsButton = document.createElement('div');
    symbolsButton.className = 'symbols-button';
    symbolsButton.textContent = 'Символы';
    symbolsButton.onclick = () => toggleSymbolsMenu(inputId);
    container.insertBefore(symbolsButton, inputField);

    const symbolsMenu = document.createElement('div');
    symbolsMenu.className = 'symbols-menu';
    symbolsMenu.id = `${inputId}-menu`;
    container.appendChild(symbolsMenu);

    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    symbolsMenu.appendChild(tabs);

    const commonTab = document.createElement('div');
    commonTab.className = 'tab active';
    commonTab.textContent = 'UA';
    commonTab.onclick = (event) => switchTab(event, 'common-symbols', inputId);
    tabs.appendChild(commonTab);

    const mathTab = document.createElement('div');
    mathTab.className = 'tab';
    mathTab.textContent = 'KAZ';
    mathTab.onclick = (event) => switchTab(event, 'math-symbols', inputId);
    tabs.appendChild(mathTab);

    const commonSymbolsContent = document.createElement('div');
    commonSymbolsContent.className = 'tab-content active';
    commonSymbolsContent.id = 'common-symbols';
    symbolsMenu.appendChild(commonSymbolsContent);

    ukrainianAlphabet.forEach(symbol => {
        const symbolTile = document.createElement('div');
        symbolTile.className = 'symbol-tile';
        symbolTile.textContent = symbol;
        symbolTile.onclick = () => insertSymbol(symbol, inputId);
        commonSymbolsContent.appendChild(symbolTile);
    });

    const mathSymbolsContent = document.createElement('div');
    mathSymbolsContent.className = 'tab-content';
    mathSymbolsContent.id = 'math-symbols';
    symbolsMenu.appendChild(mathSymbolsContent);

    kazakhAlphabet.forEach(symbol => {
        const symbolTile = document.createElement('div');
        symbolTile.className = 'symbol-tile';
        symbolTile.textContent = symbol;
        symbolTile.onclick = () => insertSymbol(symbol, inputId);
        mathSymbolsContent.appendChild(symbolTile);
    });


}

function toggleSymbolsMenu(inputId) {
    const menu = document.getElementById(`${inputId}-menu`);
    menu.classList.toggle('open');
}

function switchTab(event, tabName, inputId) {
    const menu = document.getElementById(`${inputId}-menu`);
    const tabs = menu.querySelectorAll('.tab');
    const tabContents = menu.querySelectorAll('.tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    event.currentTarget.classList.add('active');
    menu.querySelector(`#${tabName}`).classList.add('active');
}

function insertSymbol(symbol, inputId) {
    const inputField = document.getElementById(inputId);
    const startPos = inputField.selectionStart;
    const endPos = inputField.selectionEnd;

    inputField.value = inputField.value.substring(0, startPos) + symbol + inputField.value.substring(endPos);
    inputField.focus();
    inputField.selectionStart = inputField.selectionEnd = startPos + symbol.length;
}



document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        if (window.location.href.includes('/edit')) {
            chrome.storage.local.get('checkboxStates', function(result) {
                if (result.checkboxStates && result.checkboxStates.alphabetSet) {
                    createSymbolsMenu('user_profile_attributes_first_name');
                    createSymbolsMenu('user_profile_attributes_last_name');
                    const lastNameMenu = document.getElementById(`user_profile_attributes_last_name-menu`);
                    const firstNameMenu = document.getElementById(`user_profile_attributes_first_name-menu`);
                    document.addEventListener('click', function(event) {
                        if(!(lastNameMenu.contains(event.target)||firstNameMenu.contains(event.target)||document.getElementsByClassName('symbols-button')[0]==event.target||document.getElementsByClassName('symbols-button')[1]==event.target)){
                            if (lastNameMenu.classList.contains('open')){
                                lastNameMenu.classList.toggle('open')
                            }
                            if (firstNameMenu.classList.contains('open')){
                                firstNameMenu.classList.toggle('open')
                            }
                        }else{
                            console.log('a menu')
                        }

                    });
                }
            });
        }
    }
});