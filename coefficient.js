document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        setTimeout(() => changeTable(), 0)
        function changeTable() {
            const betTable = document.getElementById('index_table_bets');
            const headerRow = betTable.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];
            const newHeaderCell = document.createElement('th');
            newHeaderCell.textContent = 'Коэфициент';
            newHeaderCell.className = "col";
            headerRow.insertBefore(newHeaderCell, headerRow.childNodes[16]);
            const rows = betTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {
                const newDataCell = document.createElement('td');
                const SS = parseFloat(rows[i].childNodes[13].textContent.replace(/,/, '.'));
                const SV = parseFloat(rows[i].childNodes[15].textContent.replace(/,/, '.'));
                const coefficient = (SV/SS).toFixed(2)
                const coefficientSpan = document.createElement('span');
                coefficientSpan.className = 'status_tag';
                coefficientSpan.style.color = 'black';
                coefficientSpan.style.fontSize = '1em';
                coefficientSpan.textContent = coefficient;
                if (coefficient == 0.00){
                    console.log();
                } else if (coefficient < 2){
                    coefficientSpan.classList.add('red');
                } else if (coefficient > 3){
                    coefficientSpan.classList.add('green');
                } else{
                    coefficientSpan.classList.add('warn');
                }
                newDataCell.appendChild(coefficientSpan)
                newDataCell.className = "col";
                rows[i].insertBefore(newDataCell, rows[i].childNodes[16]);
            }
        }

    }
});