document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

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

    chrome.storage.local.get('checkboxStates', (result) => {
        if (result.checkboxStates) {
            Object.keys(result.checkboxStates).forEach((id) => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = result.checkboxStates[id];
                }
            });
        }
    });
});
