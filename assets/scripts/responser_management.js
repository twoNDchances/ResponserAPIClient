import { callAPI, checker, convertFormToJSON, fetchData, notificator } from "./general.js";

checker()

$(document).ready(function () {
    fetchData(
        '/api/iptables/list',
        'GET',
        null,
        function () {
            $('#iptablesManagement').empty().append(`
                <div class="small-item-center">
                    <div class="loader"></div>
                </div>
            `)
        },
        function (data) {
            $('#iptablesManagement').empty().append(`
                <table class="mb-0 table table-striped ruleManagementTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Responser Name</th>
                            <th>Is Enabled</th>
                            <th>Target IP Field</th>
                            <th>Is Ruthless</th>
                            <th>Limit Minutes</th>
                            <th>Block Minutes</th>
                            <th>Advanced</th>
                            <th>View Details</th>
                            <th>Errorlogs</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody id="iptablesManagementTable">
                    </tbody>
                </table>
            `)
            for (let index = 0; index < data.data.length; index++) {
                const element = data.data[index];
                console.log(element);
                $('#iptablesManagementTable').append(`
                    <tr id="iptablesResponser_${element.id}">
                        <th>${element.id}</th>
                        <td>${element.responser_name}</td>
                        <td>${element.is_enabled == true ? 'Yes' : 'No'}</td>
                        <td>${element.target_ip_field}</td>
                        <td>${element.is_ruthless == true ? 'Yes' : 'No'}</td>
                        <td>${element.limit_duration_minutes}</td>
                        <td>${element.block_duration_minutes}</td>
                        <td>${element.advanced == true ? 'Yes' : 'No'}</td>
                        <td>
                            <button class="mb-2 mr-2 btn btn-light" data-toggle="modal" data-target="#responserDetailsModal" data-id="${element.id}" onclick=showIPTables(this)>
                                <i class="fa fa-eye"></i>
                            </button>
                        </td>
                        <td>
                            <button class="mb-2 mr-2 btn btn-light" data-toggle="modal" data-target="#errorLogsModal" data-id="${element.id}" data-responser-name="${element.responser_name}" onclick=showIPTablesErrorLogs(this)>
                                <i class="fa fa-eye"></i>
                            </button>
                        </td>
                        <td>
                            <button class="mb-2 mr-2 btn btn-danger" data-toggle="modal" data-target="#responserDeleteModal" data-id="${element.id}" data-responser-name="${element.responser_name}" onclick=removeIPTablesResponser(this)>
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `)
            }
        },
        function (status) {
            if (status == 404) {
                $('#iptablesManagement').empty().append(`
                    <div class="item-center">
                        Empty
                    </div>
                `)
            }
            else {
                $('#iptablesManagement').empty().append(`
                    <div class="item-center">
                        Error
                    </div>
                `)
                notificator('Error', 'Can\'t fetch IPTables', 'error')
            }
        }
    )

    fetchData(
        '/api/modsecurity/list',
        'GET',
        null,
        function () {
            $('#modsecurityManagement').empty().append(`
                <div class="small-item-center">
                    <div class="loader"></div>
                </div>
            `)
        },
        function (data) {
            $('#modsecurityManagement').empty().append(`
                <table class="mb-0 table table-striped ruleManagementTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Responser Name</th>
                            <th>Is Enabled</th>
                            <th>IP Address</th>
                            <th>Payload</th>
                            <th>Advanced</th>
                            <th>View Details</th>
                            <th>Errorlogs</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody id="modsecurityManagementTable">
                    </tbody>
                </table>
            `)
            for (let index = 0; index < data.data.length; index++) {
                const element = data.data[index];
                $('#modsecurityManagementTable').append(`
                    <tr id="modsecurityResponser_${element.id}">
                        <th>${element.id}</th>
                        <td>${element.responser_name}</td>
                        <td>${element.is_enabled == true ? 'Yes' : 'No'}</td>
                        <td>${element.ip_address == true ? 'Yes' : 'No'}</td>
                        <td>${element.payload == true ? 'Yes' : 'No'}</td>
                        <td>${element.advanced == true ? 'Yes' : 'No'}</td>
                        <td>
                            <button class="mb-2 mr-2 btn btn-light" data-toggle="modal" data-target="#modsecurityDetailsModal" data-id="${element.id}" onclick=showModSecurity(this)>
                                <i class="fa fa-eye"></i>
                            </button>
                        </td>
                        <td>
                            <button class="mb-2 mr-2 btn btn-light" data-toggle="modal" data-target="#modsecurityErrorLogsModal" data-id="${element.id}" data-responser-name="${element.responser_name}" onclick=showModSecurityErrorLogs(this)>
                                <i class="fa fa-eye"></i>
                            </button>
                        </td>
                        <td>
                            <button class="mb-2 mr-2 btn btn-danger" data-toggle="modal" data-target="#modsecurityDeleteModal" data-id="${element.id}" data-responser-name="${element.responser_name}" onclick=removeModSecurityResponser(this)>
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `)
            }
        },
        function (status) {
            if (status == 404) {
                $('#modsecurityManagement').empty().append(`
                    <div class="item-center">
                        Empty
                    </div>
                `)
            }
            else {
                $('#modsecurityManagement').empty().append(`
                    <div class="item-center">
                        Error
                    </div>
                `)
                notificator('Error', 'Can\'t fetch Mod Security', 'error')
            }
        }
    )

    $('#updateButton').on('click', function () {
        const id = document.getElementById('updateButton').getAttribute('data-id')
        const formJSON = {
            responserName: document.getElementById('responserName').value,
            responserConfiguration: JSON.parse(document.getElementById('responserConfiguration').value)
        }
        callAPI(
            'PUT',
            '/api/iptables/update/' + id,
            function () {
                $('#updateButton').empty().append(`
                    <div class="loader"></div>
                `).attr('disabled', true)
            },
            function (data) {
                $('#updateButton').empty().text('Update').removeAttr('disabled')
                notificator('Success', 'Update successfully', 'success')
                $('#responserDetailsModalCloseButton').click()
                const responseData = JSON.parse(data.responseText)
                $(`#iptablesResponser_${responseData.data.id}`).empty().append(`
                    <th>${responseData.data.id}</th>
                    <td>${responseData.data.responser_name}</td>
                    <td>${responseData.data.is_enabled == true ? 'Yes' : 'No'}</td>
                    <td>${responseData.data.target_ip_field}</td>
                    <td>${responseData.data.is_ruthless == true ? 'Yes' : 'No'}</td>
                    <td>${responseData.data.limit_duration_minutes}</td>
                    <td>${responseData.data.block_duration_minutes}</td>
                    <td>${responseData.data.advanced == true ? 'Yes' : 'No'}</td>
                    <td>
                        <button class="mb-2 mr-2 btn btn-light" data-toggle="modal" data-target="#responserDetailsModal" data-id="${responseData.data.id}" onclick=showIPTables(this)>
                            <i class="fa fa-eye"></i>
                        </button>
                    </td>
                    <td>
                        <button class="mb-2 mr-2 btn btn-light" data-toggle="modal" data-target="#errorLogsModal" data-id="${responseData.data.id}" data-responser-name="${responseData.data.responser_name}" onclick=showIPTablesErrorLogs(this)>
                            <i class="fa fa-eye"></i>
                        </button>
                    </td>
                    <td>
                        <button class="mb-2 mr-2 btn btn-danger" data-toggle="modal" data-target="#responserDeleteModal" data-id="${responseData.data.id}" data-responser-name="${responseData.data.name}" onclick=removeIPTablesResponser(this)>
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                `)
            },
            function (error) {
                $('#updateButton').empty().text('Update').removeAttr('disabled')
                const responseError = JSON.parse(error.responseText)
                notificator('Error', responseError.reason, 'error')
            },
            JSON.stringify(formJSON)
        )
    })

    $('#emptyButton').on('click', function () {
        const responserName = document.getElementById('emptyButton').getAttribute('data-responser-name')
        callAPI(
            'DELETE',
            '/api/iptables/empty-errorlogs/' + responserName,
            function () {
                $('#emptyButton').empty().append(`
                    <div class="loader"></div>
                `).attr('disabled', true)
            },
            function () {
                $('#emptyButton').empty().text('Empty Logs').removeAttr('disabled')
                notificator('Success', 'Empty Errorlogs successfully', 'success')
                $('#errorLogsModalBody').empty().append(`
                    <div class="item-center">
                        Empty
                    </div>
                `)
            },
            function (error) {
                $('#emptyButton').empty().text('Empty Logs').removeAttr('disabled')
                const responseError = JSON.parse(error.responseText)
                notificator('Error', responseError.reason, 'error')
            }
        )
    })

    $('#removeButton').on('click', function () {
        const responserName = document.getElementById('removeButton').getAttribute('data-responser-name')
        const id = document.getElementById('removeButton').getAttribute('data-id')
        callAPI(
            'DELETE',
            '/api/iptables/delete/' + responserName,
            function () {
                $('#removeButton').empty().append(`
                    <div class="loader"></div>
                `).attr('disabled', true)
            },
            function () {
                $('#removeButton').empty().text('Remove').removeAttr('disabled')
                $('#responserDeleteModalCloseButton').click()
                $(`#iptablesResponser_${id}`).remove()
                notificator('Success', 'Remove Responser successfully', 'success')
            },
            function (error) {
                $('#removeButton').empty().text('Remove').removeAttr('disabled')
                const responseError = JSON.parse(error.responseText)
                notificator('Error', responseError.reason, 'error')
            }
        )
    })

    $('#updateModSecurityButton').on('click', function () {
        const id = document.getElementById('updateModSecurityButton').getAttribute('data-id')
        const formJSON = {
            responserName: document.getElementById('modsecurityResponserName').value,
            responserConfiguration: JSON.parse(document.getElementById('modsecurityResponserConfiguration').value)
        }
        callAPI(
            'PUT',
            '/api/modsecurity/update/' + id,
            function () {
                $('#updateModSecurityButton').empty().append(`
                    <div class="loader"></div>
                `).attr('disabled', true)
            },
            function (data) {
                $('#updateModSecurityButton').empty().text('Update').removeAttr('disabled')
                notificator('Success', 'Update successfully', 'success')
                $('#modsecurityDetailsModalCloseButton').click()
                const responseData = JSON.parse(data.responseText)
                $(`#modsecurityResponser_${responseData.data.id}`).empty().append(`
                    <th>${responseData.data.id}</th>
                    <td>${responseData.data.responser_name}</td>
                    <td>${responseData.data.is_enabled == true ? 'Yes' : 'No'}</td>
                    <td>${responseData.data.ip_address == true ? 'Yes' : 'No'}</td>
                    <td>${responseData.data.payload == true ? 'Yes' : 'No'}</td>
                    <td>${responseData.data.advanced == true ? 'Yes' : 'No'}</td>
                    <td>
                        <button class="mb-2 mr-2 btn btn-light" data-toggle="modal" data-target="#modsecurityDetailsModal" data-id="${responseData.data.id}" onclick=showModSecurity(this)>
                            <i class="fa fa-eye"></i>
                        </button>
                    </td>
                    <td>
                        <button class="mb-2 mr-2 btn btn-light" data-toggle="modal" data-target="#modsecurityErrorLogsModal" data-id="${responseData.data.id}" data-responser-name="${responseData.data.responser_name}" onclick="">
                            <i class="fa fa-eye"></i>
                        </button>
                    </td>
                    <td>
                        <button class="mb-2 mr-2 btn btn-danger" data-toggle="modal" data-target="#modsecurityDeleteModal" data-id="${responseData.data.id}" data-responser-name="${responseData.data.name}" onclick=removeModSecurityResponser(this)>
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                `)
            },
            function (error) {
                $('#updateModSecurityButton').empty().text('Update').removeAttr('disabled')
                const responseError = JSON.parse(error.responseText)
                notificator('Error', responseError.reason, 'error')
            },
            JSON.stringify(formJSON)
        )
    })

    $('#emptyModSecurityErrorlogButton').on('click', function () {
        const responserName = document.getElementById('emptyModSecurityErrorlogButton').getAttribute('data-responser-name')
        callAPI(
            'DELETE',
            '/api/modsecurity/empty-errorlogs/' + responserName,
            function () {
                $('#emptyModSecurityErrorlogButton').empty().append(`
                    <div class="loader"></div>
                `).attr('disabled', true)
            },
            function () {
                $('#emptyModSecurityErrorlogButton').empty().text('Empty Logs').removeAttr('disabled')
                notificator('Success', 'Empty Errorlogs successfully', 'success')
                $('#modsecurityErrorLogsModalBody').empty().append(`
                    <div class="item-center">
                        Empty
                    </div>
                `)
            },
            function (error) {
                $('#emptyModSecurityErrorlogButton').empty().text('Empty Logs').removeAttr('disabled')
                const responseError = JSON.parse(error.responseText)
                notificator('Error', responseError.reason, 'error')
            }
        )
    })

    $('#removeModSecurityButton').on('click', function () {
        const responserName = document.getElementById('removeModSecurityButton').getAttribute('data-responser-name')
        const id = document.getElementById('removeModSecurityButton').getAttribute('data-id')
        callAPI(
            'DELETE',
            '/api/modsecurity/delete/' + responserName,
            function () {
                $('#removeModSecurityButton').empty().append(`
                    <div class="loader"></div>
                `).attr('disabled', true)
            },
            function () {
                $('#removeModSecurityButton').empty().text('Remove').removeAttr('disabled')
                $('#modsecurityDeleteModalCloseButton').click()
                $(`#modsecurityResponser_${id}`).remove()
                notificator('Success', 'Remove Responser successfully', 'success')
            },
            function (error) {
                $('#removeModSecurityButton').empty().text('Remove').removeAttr('disabled')
                const responseError = JSON.parse(error.responseText)
                notificator('Error', responseError.reason, 'error')
            }
        )
    })
})