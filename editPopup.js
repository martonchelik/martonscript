document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        if (window.name == 'editPlayerInfoPopup') {
            const userid = window.location.pathname.slice(15).split("/")[0]
            const playerEditForm = document.getElementById('edit_user_' + userid)
            playerEditForm.scrollIntoView()
            function fetchComm(){
                const authToken = document.querySelector('meta[name="csrf-token"]').content
                fetch(window.location.href.split('players/')[0]+'comments ', {
                    referrer: window.location.href.split('edit/')[0],
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: "_method=post&authenticity_token="+authToken+"&active_admin_comment%5Bresource_type%5D=User&active_admin_comment%5Bresource_id%5D="+window.location.href.split('players/')[1].split('/edit')[0]+"&active_admin_comment%5Bbody%5D=%D0%94%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5+%D0%B2+%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D0%B5+%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%8B+%D0%B2+%D1%81%D0%BE%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B8%D0%B8+%D1%81+%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC%D0%B8+%D0%B2+%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B5.&commit=%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%B8%D1%82%D1%8C+%D0%9A%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B9",
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
                }).then(window.close)
            }
            window.onbeforeunload = (e) => {
                if(autocommentCheck.checked){
                    fetchComm()
                }else {
                    window.addEventListener("onbeforeunload", (e) => {
                        window.close()
                    })
                    window.addEventListener("onunload", (e) => {
                        window.close()
                    })
                    window.onunload = (e) => {
                        window.close()
                    }
                    window.close()
                }
            }
            //console.log(window.location.href.split('players/')[1].split('/edit')[0])
            let playerCountry = document.getElementById('user_profile_attributes_country').value
            if (playerCountry == 'UA'){
                let month = document.querySelectorAll('#user_profile_attributes_date_of_birth_2i option')
                month[1].textContent += '/січня'
                month[2].textContent += '/лютого'
                month[3].textContent += '/березня'
                month[4].textContent += '/квітня'
                month[5].textContent += '/травня'
                month[6].textContent += '/червня'
                month[7].textContent += '/липня'
                month[8].textContent += '/серпня'
                month[9].textContent += '/вересня'
                month[10].textContent += '/жовтня'
                month[11].textContent += '/листопада'
                month[12].textContent += '/грудня'
            }
            let autocommentCheck = document.createElement('input')
            let acConainer = document.createElement('li')
            let acLabel = document.createElement('label')
            acLabel.setAttribute('for', 'autocomment')
            acLabel.style.width = '100%'
            acConainer.classList.add('action')
            acConainer.classList.add('input_action')
            autocommentCheck.style.verticalAlign = 'middle'
            autocommentCheck.type = 'checkbox'
            autocommentCheck.id = 'autocomment'
            autocommentCheck.style.zoom = '2'
            acLabel.innerText += 'Оставить комментарий о смене данных'
            acLabel.appendChild(autocommentCheck)

            acConainer.appendChild(acLabel)
            document.getElementById('user_submit_action').parentElement.appendChild(acConainer)

            document.getElementById('header').style.display = 'none'

        }
    }

});
