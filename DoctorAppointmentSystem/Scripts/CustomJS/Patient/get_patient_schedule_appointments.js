$(() => {
    GetAppointmentList()
   
})

let GetAppointmentList = () => {
    $.ajax({
        url: '/Patient/GetPatientScheduleAppointments',
        type: 'Get',
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            loadData(response.result.PatientAppointments)
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
    let statusHtml=checkforStatus(Status)
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
let checkforStatus=(status)=>{
    switch(status)
    {
        case true:
            return '<label class="btn btn-success btn-default">Approved</label>'
            break
        case false:
            return '<label class="btn btn-danger btn-default">Rejected</label>'
            break 
        default:
            return '<label class="btn btn-info btn-default">Prnding</label>'
            break

    }
    
}
let renderActionHtml = (PatientId) =>{
    return '<div class="col-md-3 col-3 text-right" title="View Prescription"><btn class="btn btn-sm btn-outline-success btn-icon" onclick="ViewPrescription('+PatientId+')" data-toggle="modal" data-target="#myModal"><i class="nc-icon nc-tile-56"></i></btn></div>'
}

let ViewPrescription =(patientId)=>{
    $.ajax({
        type: 'POST',
        url: '/Patient/GetPatientPrescriptionDetail',
        data:{'patientId':patientId},
        success: function (response) {
            renderPrescriptionResponse(response.result.Prescription)
          
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }

    });
}
let renderPrescriptionResponse = (data) => {
    $( "#prescriptionDetail").html("")
    $.each(data, function( index, val ) {
        $( "#prescriptionDetail").append('<label>'+(index+1)+' : '+val.PrescriptionDetail+'</label><br/>');
    });
}