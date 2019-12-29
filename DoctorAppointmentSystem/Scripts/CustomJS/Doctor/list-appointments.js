$(() => {
    GetAppointmentList()
})

let GetAppointmentList = () => {
    $.ajax({
        url: '/Doctors/GetAppointmentList',
        type: 'Get',
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            loadData(response.result.appointments)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }

    });
}

let clearTable = () => {
    $("#tableData tbody").empty()
}

let loadData = (arg_data) => {
    clearTable()
    arg_data.map((row, index) => {
        renderRow(row, index)
    })
}

let renderRow = (row, index) => {
    const {PatientId,FullName, TimeStart,TimeEnd,Status} = row;
    let statusHtml='<label class="btn btn-warning btn-default">Pending</label>'
    let actionHtml = renderActionHtml(PatientId)
    let dataRow = $("#dataRow").clone();
    dataRow.removeAttr('hidden')
    dataRow.removeAttr('id')
    dataRow.find('#No').text(index+1)
    dataRow.find('#fullName').text(FullName)    
    dataRow.find('#startTime').text(moment(TimeStart).format("hh:mm"))
    dataRow.find('#endTime').text(moment(TimeEnd).format("hh:mm"))   
    dataRow.find('#status').html(statusHtml)
    dataRow.find('#action').html(actionHtml)    

    $("#tbody").append(dataRow)
}

let renderActionHtml = (PatientId) =>{
    return '<div class="row"><div class="col-md-3 col-3 text-right" title="Approve"> <button class="btn btn-sm btn-outline-success btn-icon" onclick="approveOrRejactAppointment('+ PatientId +','+ true +')"><i class="nc-icon nc-check-2"></i></button></div><div style="margin-left:20px"><button title="Reject" class="btn btn-sm btn-outline-warning btn-icon" onclick="approveOrRejactAppointment('+ PatientId +','+ false +')"><i class="nc-icon nc-simple-remove"></i></button></div></div>'
}

let approveOrRejactAppointment=(id,status)=>{
    $.ajax({
        type: "POST",
        url: "/Doctors/ApproveOrRejactAppointment",
        data: { 'id': id ,'status':status },
        success: function (response) {
            if(status==true)
                $.notify("Appointment approved successfully", "success");
            else
                $.notify("Appointment rejected successfully", "warn");
            GetAppointmentList()
        }
    })
}

