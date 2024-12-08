import { checker, callAPI, notificator } from './general.js';

checker()

$(document).ready(function () {
    callAPI(
        'GET',
        '/api/modsecurity/list-executions',
        function () {
            $('#executionManagement').empty().append(`
                <div class="small-item-center">
                    <div class="loader"></div>
                </div>
            `)
        },
        function (data) {
            $('#executionManagement').empty().append(`
                <table class="mb-0 table table-striped" id="modsecurityExecutionTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Responser Name</th>
                            <th>Status</th>
                            <th>SecRule ID</th>
                            <th>Type</th>
                            <th>For</th>
                            <th>Start</th>
                            <th>Relationship</th>
                            <th>Payloads</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody id="executionManagementTable">
                    </tbody>
                </table>
            `)
            const responseData = JSON.parse(data.responseText)
            for (let index = 0; index < responseData.data.length; index++) {
                const element = responseData.data[index];
                $('#executionManagementTable').append(`
                    <tr id="execution_${element.id}">
                        <th>${element.id}</th>
                        <td>${element.responser_name}</td>
                        <td>${
                            element.status == 'running' ?
                            '<div class="mb-2 mr-2 badge badge-success">' + element.status + '</div>' :
                            element.status == 'error' ?
                            '<div class="mb-2 mr-2 badge badge-danger">' + element.status + '</div>' :
                            element.status == 'duplicated' ?
                            '<div class="mb-2 mr-2 badge badge-info">' + element.status + '</div>' :
                            '<div class="mb-2 mr-2 badge badge-secondary">Waiting</div>'
                        }</td>
                        <td>${element.secrule_id}</td>
                        <td>${element.type}</td>
                        <td>${element.for}</td>
                        <td>${element.start}</td>
                        <td>${element.relationship}</td>
                        <td>
                            <button class="mb-2 mr-2 btn btn-light" data-toggle="modal" data-target="#payloadsModal" data-id="${element.id}" onclick=viewPayloads(this)>
                                <i class="fa fa-eye"></i>
                            </button>
                        </td>
                        <td>
                            <button class="mb-2 mr-2 btn btn-danger" data-toggle="modal" data-target="#executionDeleteModal" data-id="${element.id}" onclick=deleteExecutions(this)>
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `)
            }
        },
        function (error) {
            if (error.status) {
                $('#executionManagement').empty().append(`
                    <div class="item-center">
                        Empty
                    </div>
                `)
            }
            else {
                $('#executionManagement').empty().append(`
                    <div class="item-center">
                        Error
                    </div>
                `)
                const responseError = JSON.parse(error.responseText)
                notificator('Error', responseError.reason, 'error')
            }
        }
    )
    
    $('#deleteButton').on('click', function () {
        const id = document.getElementById('deleteButton').getAttribute('data-id')
        callAPI(
            'DELETE',
            '/api/modsecurity/delete-execution/' + id,
            function () {
                $('#deleteButton').empty().append(`
                    <div class="loader"></div>
                `).attr('disabled', true)
            },
            function (data) {
                $('#deleteButton').empty().text('Delete').removeAttr('disabled')
                $('#executionDeleteModalCloseButton').click()
                const responseData = JSON.parse(data.responseText)
                for (let index = 0; index < responseData.data.length; index++) {
                    const element = responseData.data[index];
                    $(`#execution_${element.id}`).remove()
                }
                notificator('Success', 'Delete Execution successfully', 'success')
            },
            function (error) {
                $('#deleteButton').empty().text('Delete').removeAttr('disabled')
                const responseError = JSON.parse(error.responseText)
                if (error.status == 404) {
                    if (responseError.data != null) {
                        for (let index = 0; index < responseError.data.length; index++) {
                            const element = responseError.data[index];
                            $(`#execution_${element.id}`).remove()
                        }
                    }
                }
                else {
                    notificator('Error', responseError.reason, 'error')
                }
            }
        )
    })

    $('#deleteAllErrorButton').on('click', function () {
        callAPI(
            'DELETE',
            '/api/modsecurity/delete-execution/error',
            function () {
                $('#deleteAllErrorButton').empty().append(`
                    <div class="loader"></div>
                `).attr('disabled', true)
            },
            function (data) {
                $('#deleteAllErrorButton').empty().text('Delete').removeAttr('disabled')
                $('#deleteAllErrorModalCloseButton').click()
                const responseData = JSON.parse(data.responseText)
                for (let index = 0; index < responseData.data.length; index++) {
                    const element = responseData.data[index];
                    $(`#execution_${element}`).remove()
                }
                notificator('Success', 'Delete All Error Execution successfully', 'success')
            },
            function (error) {
                $('#deleteAllErrorButton').empty().text('Delete').removeAttr('disabled')
                const responseError = JSON.parse(error.responseText)
                notificator('Error', responseError.reason, 'error')
            }
        )
    })

    $('#deleteAllDuplicatedButton').on('click', function () {
        callAPI(
            'DELETE',
            '/api/modsecurity/delete-execution/duplicated',
            function () {
                $('#deleteAllDuplicatedButton').empty().append(`
                    <div class="loader"></div>
                `).attr('disabled', true)
            },
            function (data) {
                $('#deleteAllDuplicatedButton').empty().text('Delete').removeAttr('disabled')
                $('#deleteAllDuplicatedModalCloseButton').click()
                const responseData = JSON.parse(data.responseText)                
                for (let index = 0; index < responseData.data.length; index++) {
                    const element = responseData.data[index];
                    $(`#execution_${element}`).remove()
                }
                notificator('Success', 'Delete All Duplicated Execution successfully', 'success')
            },
            function (error) {
                $('#deleteAllDuplicatedButton').empty().text('Delete').removeAttr('disabled')
                const responseError = JSON.parse(error.responseText)
                notificator('Error', responseError.reason, 'error')
            }
        )
    })
})