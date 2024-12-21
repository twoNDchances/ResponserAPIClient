import { checker, callAPI, notificator } from './general.js';

checker()

$(document).ready(function () {
    callAPI(
        'GET',
        '/api/swarm/list-executions',
        function () {
            $('#executionManagement').empty().append(`
                <div class="small-item-center">
                    <div class="loader"></div>
                </div>
            `)
        },
        function (data) {
            $('#executionManagement').empty().append(`
                <table class="mb-0 table table-striped" id="swarmExecutionTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Responser Name</th>
                            <th>Status</th>
                            <th>Replicas</th>
                            <th>Last Action</th>
                            <th>Last Logs</th>
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
                            element.status == 'up' ?
                            '<div class="mb-2 mr-2 badge badge-alternate">' + element.status + '</div>' :
                            element.status == 'down' ?
                            '<div class="mb-2 mr-2 badge badge-dark">' + element.status + '</div>' :
                            '<div class="mb-2 mr-2 badge badge-secondary">Waiting</div>'
                        }</td>
                        <td><strong>${element.replicas}</strong></td>
                        <td>${
                            element.last_action == 'success' ? 
                            '<div class="mb-2 mr-2 badge badge-success">' + element.last_action + '</div>' :
                            '<div class="mb-2 mr-2 badge badge-danger">' + element.last_action + '</div>'
                        }</td>
                        <td>
                            <button class="mb-2 mr-2 btn btn-light" data-toggle="modal" data-target="#lastLogsModal" data-id="${element.id}" onclick=viewLastLogs(this)>
                                <i class="fa fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `)
            }
        },
        function () {
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
})