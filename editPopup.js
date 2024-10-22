document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        if (window.name == 'editPlayerInfoPopup') {
            window.addEventListener("onbeforeunload", (e) => {
                window.close()
            })
            window.addEventListener("onunload", (e) => {
                window.close()
            })
            window.onbeforeunload = (e) => {
                window.close()
            }
            window.onunload = (e) => {
                window.close()
            }
            const userid = window.location.pathname.slice(15).split("/")[0]
            document.getElementById('header').style.display = 'none'
            const playerEditForm = document.getElementById('edit_user_' + userid)
            playerEditForm.scrollIntoView()
        }
    }
});