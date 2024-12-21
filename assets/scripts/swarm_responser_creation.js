import { checker, notificator, callAPI } from "./general.js";

checker()

function updateJsonPreview() {
    const formData = {
        responser_name: $('#responserName').val(),
        responser_configuration: JSON.parse($('#responserConfiguration').val())
    }
    const jsonString = JSON.stringify(formData, null, 4)

    $('#jsonPreview').text(jsonString)
}

$('#swarmResponserCreationForm input, #swarmResponserCreationForm textarea').on('input', updateJsonPreview)

$(document).ready(function () {
    updateJsonPreview()
    $('#responserCreationButton').on('click', function (event) {
        event.preventDefault()
        let isResponserNameError = false;
        let isResponserConfigurationError = false;
        if (String($('#responserName').val()).length == 0) {
            isResponserNameError = true
        }
        if (String($('#responserConfiguration').val()).length == 0) {
            isResponserConfigurationError = true
        }
        if (isResponserNameError == true || isResponserConfigurationError == true) {
            if (isResponserNameError == true) {
                $('#responserNameErrorField').empty().append(`<p class="error-text">Responser Name is required</p>`)
            }
            if (isResponserConfigurationError == true) {
                $('#responserConfigurationErrorField').empty().append(`<p class="error-text">Responser Configuration is required</p>`)
            }
            notificator('Error', 'Form validation fail!', 'error');
            return
        }
        const swarmResponserCreationJSONForm = {
            "responserName": $('#responserName').val(),
            "responserConfiguration": JSON.parse($('#responserConfiguration').val())
        }
        callAPI(
            'POST',
            '/api/swarm/create',
            function () {
                $('#responserCreationButton').empty().append(`
                    <div class="loader"></div>
                `).attr('disabled', true)
            },
            function () {
                notificator('Success', 'Create action successfully', 'success')
                setTimeout(function () {
                    location.href = 'responser_management.html'
                }, 1000)
            },
            function (error) {                
                $('#responserCreationButton').empty().text('Create').removeAttr('disabled')
                const responseError = JSON.parse(error.responseText)
                notificator('Error', responseError.reason, 'error')
            },
            JSON.stringify(swarmResponserCreationJSONForm)
        )
    })
})