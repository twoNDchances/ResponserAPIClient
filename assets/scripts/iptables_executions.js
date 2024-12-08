import { checker, callAPI, notificator } from './general.js';

checker()

$(document).ready(function () {
    $('#stateController').on('change', function() {
        const searchTerm = $(this).val().toLowerCase()
        $('#iptablesExecutionTable').each(function() {
            $(this).find('tbody tr').each(function() {
                let rowContainsTerm = false
                $(this).find('td').each(function() {
                    const cellText = $(this).text().toLowerCase()
                    if (cellText.includes(searchTerm)) {
                        rowContainsTerm = true
                        return false
                    }
                });

                if (rowContainsTerm) {
                    $(this).show()
                } else {
                    $(this).hide()
                }
            });
        });
    });

    callAPI(
        'GET',
        '/api/iptables/list-executions',
        function () {
            $('#executionManagement').empty().append(`
                <div class="small-item-center">
                    <div class="loader"></div>
                </div>
            `)
        },
        function (data) {
            $('#executionManagement').empty().append(`
                <table class="mb-0 table table-striped" id="iptablesExecutionTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Responser Name</th>
                            <th>Target IP Field</th>
                            <th>State</th>
                            <th>Start</th>
                            <th>Finish</th>
                            <th>Expired</th>
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
                        <td>${element.expired == true ? '<s>' + element.responser_name +  '</s>' : element.responser_name}</td>
                        <td>${element.expired == true ? '<s>' + element.target_ip_field +  '</s>' : element.target_ip_field}</td>
                        <td>${element.expired == true ? '<s>' + element.state +  '</s>' : element.state}</td>
                        <td>${element.expired == true ? '<s>' + element.start +  '</s>' : element.start}</td>
                        <td>${element.expired == true ? '<s>' + element.finish +  '</s>' : element.finish}</td>
                        <td>${element.expired}</td>
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
            '/api/iptables/delete-execution/' + id,
            function () {
                $('#deleteButton').empty().append(`
                    <div class="loader"></div>
                `).attr('disabled', true)
            },
            function () {
                $('#deleteButton').empty().text('Delete').removeAttr('disabled')
                $('#executionDeleteModalCloseButton').click()
                $(`#execution_${id}`).remove()
                notificator('Success', 'Delete Execution successfully', 'success')
            },
            function (error) {
                $('#deleteButton').empty().text('Delete').removeAttr('disabled')
                const responseError = JSON.parse(error.responseText)
                notificator('Error', responseError.reason, 'error')
            }
        )
    })
})