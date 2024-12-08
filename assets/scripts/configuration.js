import { notificator, setCookie } from "./general.js";

$(document).ready(function () {
    $('#connectionButton').on('click', function (event) {
        event.preventDefault()
        let responser = String(document.getElementById('responserURL').value)
        if (responser.length == 0) {            
            responser = 'http://localhost:9948'
        }
        else {            
            responser = responser.replace(/\/$/, "")
        }
        let xhr = new XMLHttpRequest()
        xhr.timeout = 3000
        xhr.onreadystatechange = function () {
            if (this.readyState == 0 || this.readyState == 1 || this.readyState == 2 || this.readyState == 3) {
                $('#connectionButton').empty().append(`<div class="loader"></div>`).attr('disabled', true)
                
            }
            else if (this.readyState == 4 && this.status == 200) {                
                notificator('Success', 'Connect successfully', 'success')
                setCookie('backendAPI', responser)
                setTimeout(function () {
                    location.href = 'responser_management.html'
                }, 1000)
            }
            else {                
                $('#connectionButton').empty().text('Connect').removeAttr('disabled')
                notificator('Error', 'Can\'t connect to Responser backend!', 'error')
            }
        }        
        xhr.open('GET', responser);
        xhr.send();
    })
})