document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Function to save checkbox states
    function saveCheckboxStates() {
        const checkboxStates = {};

        checkboxes.forEach((checkbox) => {
            checkboxStates[checkbox.id] = checkbox.checked;
        });

        // Save the checkbox states to chrome.storage.local
        chrome.storage.local.set({ checkboxStates }, () => {
            console.log('Checkbox states saved:', checkboxStates);
        });
    }

    // Add event listeners to each checkbox
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', saveCheckboxStates);
    });

    // Initial load: get the current checkbox states from chrome.storage.local
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
