document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const toggleCoefficientSettings = document.getElementById('toggleCoefficientSettings');
    const addGames = document.getElementById('addGames');
    const profile = document.getElementById('profile');
    const payments = document.getElementById('payments');
    const closeAddGamesMenu = document.getElementById('closeAddGamesMenu');
    const togglePaymentSettings = document.getElementById('togglePaymentSettings')
    const toggleProfileSettings = document.getElementById('toggleProfileSettings')
    const closePaymentMenu = document.getElementById('closePaymentMenu')
    const closeProfileMenu = document.getElementById('closeProfileMenu')

    toggleCoefficientSettings.addEventListener("click", () =>{addGames.classList.toggle('hidden'); scrollbarsHandler()})
    togglePaymentSettings.addEventListener("click", () =>{payments.classList.toggle('hidden')})
    toggleProfileSettings.addEventListener("click", () =>{profile.classList.toggle('hidden')})
    closeAddGamesMenu.addEventListener("click", () =>{addGames.classList.toggle('hidden')})
    closePaymentMenu.addEventListener("click", () =>{payments.classList.toggle('hidden')})
    closeProfileMenu.addEventListener("click", () =>{profile.classList.toggle('hidden')})

    function scrollbarsHandler() {
        const rouletteTextarea = document.getElementById('roulette_custom')
        const instantTextarea = document.getElementById('instant_custom')
        const baccaratTextarea = document.getElementById('baccarat_custom')
        console.log(287 + scrollbarWidth() +'px')
        if (hasScrollbar(rouletteTextarea)){
            rouletteTextarea.style.width = 287 + scrollbarWidth() +'px'
        }
        if (hasScrollbar(instantTextarea)){
            instantTextarea.style.width = 287 + scrollbarWidth() +'px'
        }
        if (hasScrollbar(baccaratTextarea)){
            baccaratTextarea.style.width = 287 + scrollbarWidth() +'px'
        }
    }
    function scrollbarsChangeHandler(element) {
        if (hasScrollbar(element)){
            element.style.width = 287 + scrollbarWidth() +'px'
        }else{
            element.style.width = '287px'
        }
    }

    function hasScrollbar(element) {
        return element.scrollHeight > element.clientHeight;
    }
    function scrollbarWidth() {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);
        const inner = document.createElement('div');
        outer.appendChild(inner);
        const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
        outer.parentNode.removeChild(outer);
        return scrollbarWidth;
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
        chrome.storage.local.get(['roulette_custom', 'instant_custom', 'baccarat_custom']).then((result) =>{
            if(result.roulette_custom && result.instant_custom && result.baccarat_custom){
                document.getElementById('roulette_custom').value = result.roulette_custom || '';
                document.getElementById('instant_custom').value = result.instant_custom || '';
                document.getElementById('baccarat_custom').value = result.baccarat_custom || '';
            }
        })
    }

    document.getElementById('roulette_custom').addEventListener('change',saveValues);
    document.getElementById('instant_custom').addEventListener('change',saveValues);
    document.getElementById('baccarat_custom').addEventListener('change',saveValues);
    document.getElementById('roulette_custom').addEventListener('keydown',()=>{scrollbarsChangeHandler(document.getElementById('roulette_custom'))});
    document.getElementById('instant_custom').addEventListener('keydown',()=>{scrollbarsChangeHandler(document.getElementById('instant_custom'))});
    document.getElementById('baccarat_custom').addEventListener('keydown',()=>{scrollbarsChangeHandler(document.getElementById('baccarat_custom'))});


    window.addEventListener('load', loadValues);

    chrome.storage.local.get('checkboxStates', (result) => {
        if (result.checkboxStates) {
            Object.keys(result.checkboxStates).forEach((id) => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = result.checkboxStates[id];
                }
            });
        }
    })
});
