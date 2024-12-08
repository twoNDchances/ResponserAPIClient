import { checker, callAPI, convertFormToJSON, notificator } from "./general.js";

checker()

$(document).ready(function () {
    $('#resetElasticsearchButton').on('click', function () {
        const form = document.getElementById('authenticationForm')
        const formData = new FormData(form)
        const formJSON = convertFormToJSON(formData)
        callAPI(
            'POST',
            '/reset-elasticsearch',
            function () {
                $('#resetElasticsearchButton').empty().append(`
                    <div class="loader"></div>
                `).attr('disabled', true)
            },
            function () {
                $('#resetElasticsearchButton').empty().text('Reset').removeAttr('disabled')
                notificator('Success', 'Reset Elasticsearch successfully', 'success')
                $('#resetElasticsearchModalCloseButton').click()
            },
            function (event) {
                $('#resetElasticsearchButton').empty().text('Reset').removeAttr('disabled')
                const responseError = JSON.parse(event.responseText)
                notificator('Error', responseError.reason, 'error')
            },
            formJSON
        )
    })
})