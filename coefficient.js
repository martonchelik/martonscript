document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        loadValues();
    }
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes.checkboxStates) {
            location.reload();
        }
    });

    function loadValues() {
        chrome.storage.local.get(['roulette_custom', 'instant_custom', 'baccarat_custom','checkboxStates'], function(result) {
            const roulette_custom = result.roulette_custom;
            const instant_custom = result.instant_custom;
            const baccarat_custom = result.baccarat_custom;
            const coefficientSet = result.checkboxStates.coefficientSet
            if (coefficientSet){
                checkCoefs(roulette_custom, instant_custom, baccarat_custom)
            }
        })
    }
    function checkCoefs(roulette_custom, instant_custom, baccarat_custom){
        const betTable = document.getElementById('index_table_bets');
        const headerRow = betTable.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];
        const newHeaderCell = document.createElement('th');
        newHeaderCell.textContent = 'Коэфициент';
        newHeaderCell.className = "col";
        headerRow.insertBefore(newHeaderCell, headerRow.childNodes[16]);
        const rows = betTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        const roulette = roulette_custom.split(",").map(function (value) {
            return value.trim().toLowerCase();
        });
        const instant = instant_custom.split(",").map(function (value) {
            return value.trim().toLowerCase();

        });
        const baccarat = baccarat_custom.split(",").map(function (value) {
            return value.trim().toLowerCase();
        });

        function checkGame(gameName){
            switch (true) {
                case roulette.includes(gameName.toLowerCase()):
                case gameName.toLowerCase().includes('roulette'):
                case gameName.toLowerCase().includes('roleta'):
                case gameName.toLowerCase().includes('rulet'):
                case gameName.toLowerCase().includes('ruleta'):
                    return 'roulette';
                    break;
                case instant.includes(gameName.toLowerCase()):
                    return 'instant';
                    break;
                case baccarat.includes(gameName.toLowerCase()):
                case gameName.toLowerCase().includes('baccarat'):
                    return 'baccarat';
                    break;
                default:
                    return 'Something else'
            }
        }

        function filter(input) {
            return input.replace(/[^\d.]/g, '');
        }
        for (let i = 0; i < rows.length; i++) {
            const newDataCell = document.createElement('td');
            const SS = parseFloat(filter(rows[i].childNodes[13].textContent.replace(/,/, '.')));
            const SV = parseFloat(filter(rows[i].childNodes[15].textContent.replace(/,/, '.')));
            const BB = parseFloat(filter(rows[i].childNodes[9].textContent.replace(/,/, '.')))

            const coefficient = SS !=0 ? (SV/SS).toFixed(2) : 0;
            const BBSS = (BB/SS).toFixed(2)
            const coefficientSpan = document.createElement('span');
            coefficientSpan.className = 'status_tag';
            coefficientSpan.style.color = 'black';
            coefficientSpan.style.fontSize = '1em';
            coefficientSpan.textContent = coefficient;
            switch (checkGame(rows[i].childNodes[3].textContent)) {
                case 'instant':
                    if (coefficient <= 1.4 && coefficient >= 1){
                        coefficientSpan.classList.add('red');
                    } else {
                        coefficientSpan.classList.add('green');
                    }
                    break;
                case 'roulette':
                    if (coefficient == 2 || coefficient == 3){
                        coefficientSpan.classList.add('red');
                    } else if ((coefficient <= 1.3 && coefficient >= 1) || BBSS <= 1.1){
                        coefficientSpan.classList.add('warn');
                    }else{
                        coefficientSpan.classList.add('green');
                    }
                    break;
                case 'baccarat':
                    if (coefficient == 1 || BBSS <= 1.2){
                        coefficientSpan.classList.add('warn');
                    }else{
                        coefficientSpan.classList.add('green');
                    }break;
                default:
                    if (coefficient >= 1000){
                        coefficientSpan.classList.add('red');
                    }
                    break;
            }
            newDataCell.appendChild(coefficientSpan)
            newDataCell.className = "col";
            rows[i].insertBefore(newDataCell, rows[i].childNodes[16]);
        }
    }

});