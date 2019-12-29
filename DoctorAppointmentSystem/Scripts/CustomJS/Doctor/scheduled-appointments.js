$(() => {
    GetAppointmentList()
})

let GetAppointmentList = () => {
    $.ajax({
        url: '/Doctors/GetAppointmentList',
        type: 'Get',
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        data:{'status':true},
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
    let statusHtml='<label class="btn btn-success btn-default">Approved</label>'
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
    return '<div class="row"><div class="col-md-3 col-3 text-right" title="Add Prescription"><btn class="btn btn-sm btn-outline-success btn-icon" onclick="addPrescription('+PatientId+')" data-toggle="modal" data-target="#myModal"><i class="nc-icon nc-tile-56"></i></btn></div><div class="col-md-3 col-3 text-right" title="View Prescription"><btn class="btn btn-sm btn-outline-info btn-icon" onclick="ViewPrescription('+PatientId+')" data-toggle="modal" data-target="#myModalPrescription"><i class="nc-icon nc-bullet-list-67"></i></btn></div><div>'
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
    $( "#viewAddedPrescreption").html("")
    $.each(data, function( index, val ) {
        $( "#viewAddedPrescreption").append('<label>'+(index+1)+' : '+val.PrescriptionDetail+'</label><br/>');
    });
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

let addPrescription =(PatientId)=>{
    $("#myPrescriptionId").text("")
    $("#myPrescriptionId").text(PatientId)

}
let savePrescriptionDetail = () =>{
    if($("#prescriptionDetail").val()!=""){
        let patientId=$("#myPrescriptionId").text()
        let perscription = $("#prescriptionDetail").val()
        $("#showError").attr("hidden","")
        $.ajax({
            type: "POST",
            url: "/Doctors/AddPrescription",
            data: { 'id': patientId , 'perscription' : perscription},
            success: function (response) {
                $.notify("Perscription added successfully", "success");
                $("#myModal").modal("hide")
                $("#prescriptionDetail").val("")
                GetAppointmentList()
            }
        })
    }else{
        $("#showError").removeAttr('hidden')
    }
}