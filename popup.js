document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const coefficientSet = document.getElementById('coefficientSet');
    const alias = document.getElementById('alias');
    coefficientSet.addEventListener('change',showAlias)
    function showAlias(){
        switch (coefficientSet.checked) {
            case true:
                if (alias.classList.contains('nvslideout')){
                    alias.classList.toggle('nvslideout')
                }
                break;
            case false:
                if (!alias.classList.contains('nvslideout')){
                    alias.classList.toggle('nvslideout')
                }
                break;
        }
    }

    function saveCheckboxStates() {
        const checkboxStates = {};
        checkboxes.forEach((checkbox) => {
            checkboxStates[checkbox.id] = checkbox.checked;
        });
        chrome.storage.local.set({ checkboxStates }, () => {
            console.log('Checkbox states saved:', checkboxStates);
        });
    }
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', saveCheckboxStates);
    });

    function saveValues() {
        const rouletteCustom = document.getElementById('roulette_custom').value;
        const instantCustom = document.getElementById('instant_custom').value;
        const baccaratCustom = document.getElementById('baccarat_custom').value;

        chrome.storage.local.set({
            roulette_custom: rouletteCustom,
            instant_custom: instantCustom,
            baccarat_custom: baccaratCustom
        }, function() {
            console.log('Values saved');
        });
    }

    function loadValues() {
        chrome.storage.local.get(['roulette_custom', 'instant_custom', 'baccarat_custom'], function(result) {
            document.getElementById('roulette_custom').value = result.roulette_custom || '';
            document.getElementById('instant_custom').value = result.instant_custom || '';
            document.getElementById('baccarat_custom').value = result.baccarat_custom || '';
            console.log('Values loaded');
        });
    }

    document.getElementById('roulette_custom').addEventListener('change', saveValues);
    document.getElementById('instant_custom').addEventListener('change', saveValues);
    document.getElementById('baccarat_custom').addEventListener('change', saveValues);

    window.addEventListener('load', loadValues);

    chrome.storage.local.get('checkboxStates', (result) => {
        if (result.checkboxStates) {
            Object.keys(result.checkboxStates).forEach((id) => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = result.checkboxStates[id];
                }
            });
            showAlias()
        }
    })
});
