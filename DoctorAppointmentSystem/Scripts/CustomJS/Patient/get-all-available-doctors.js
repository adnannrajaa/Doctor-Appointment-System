var data = []
var filterData = []
let getAvailableDoctors = () => {
    $.ajax({
        url: '/Patient/GetAllTodaysAvailableDoctors',
        type: 'Get',
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            data = response.result.AvailableDoctors
            loadData(data)
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

let renderRow = (row,index) => {
    const {fullName, startTime, endTime,docId} = row;
    let actionHtml = renderActionHtml(docId)
    let dataRow = $("#dataRow").clone();
    dataRow.removeAttr('hidden')
    dataRow.removeAttr('id')
    dataRow.find('#No').text(index+1)
    dataRow.find('#fullName').text(fullName)    
    dataRow.find('#startTime').text(startTime)
    dataRow.find('#endTime').text(endTime)   
    dataRow.find('#action').html(actionHtml)    

    $("#tbody").append(dataRow)
}

let renderActionHtml = (docId) =>{
    return '<div class="col-md-3 col-3 text-right" title="Request Appointment"><btn class="btn btn-sm btn-outline-success btn-icon" onclick="loadmodel('+docId+','+'this'+')"><i class="nc-icon nc-check-2"></i></btn></div>'
     
}

let makeAppointment =()=>{
    let timeStart = $("#startTimeReq").val()
    let TimeEnd = $("#endTimeReq").val()
    let docId= $("#myRequestDoctorId").text()
    if(IsFormValidate(timeStart,TimeEnd)==true){isTimeSlotAlreadyBooked(timeStart,TimeEnd,docId)}
}
let IsFormValidate = (timeStart,TimeEnd) =>{

    if(timeStart == ""){ showErrorMsg("Start time is required", ".error1"); return false}
    else if(TimeEnd == ""){showErrorMsg("End time is required", ".error1"); return false}
    return true
}
let isTimeSlotAlreadyBooked=(timeStart,TimeEnd,docId)=>{
    $.ajax({
        url: '/Patient/verifyTimeSlot',
        type: 'Post',
        data:{'startTime':timeStart,'endtime':TimeEnd,'docId':docId},
        success: function (response) {
            switch(response.result)
            {
                case true:
                    showNotification("Time slot already reserved", "warn")
                    break
                case false:
                    saveNewAppointment(timeStart,TimeEnd,docId)
                    break
            }
        }
    });
}
let saveNewAppointment = (timeStart,TimeEnd,docId) =>{
    $.ajax({
        type: 'POST',
        url: '/Patient/saveNewAppointment',
        data:{'timeStart':timeStart,'TimeEnd':TimeEnd,'docId':docId},
        success: function (response) {
            if(response.result==true)
            {
                showNotification("Time slot reserved successfully", "success")
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}
let showNotification = (msg,msgtype)=>{
    $("#startTimeReq").val("")
    $("#endTimeReq").val("")
    $("#myRequestDoctorId").text("")
    $("#apiontmentModel").modal('hide');
    $.notify(msg,msgtype);
}

let showErrorMsg = (msg, selector) => {
    $(selector).addClass('alert alert-danger').html(msg);
    setTimeout(function () {
        $(selector).removeClass('alert alert-danger').html("");
    }, 2000);
}
let loadmodel = (_id, ele) =>{
    $("#apiontmentModel").modal('show');
    var endtime = $(ele).closest("tr").find('td:eq(3)').text();
    $("#myRequestDoctorId").text("")
    $("#myRequestDoctorId").text(_id)
    docID = _id;
    var ed = new Date();
    ed.setHours(endtime.substr(0, 2));
    ed.setMinutes(endtime.substr(3, 2));
    $('#startTimeReq').bootstrapMaterialDatePicker({
       date: false,
       shortTime: false,
       format: 'HH:mm',
       minDate: new Date(),
       maxDate:ed
   });
    $('#endTimeReq').bootstrapMaterialDatePicker({
      date: false,
      shortTime: false,
      format: 'HH:mm',
      minDate: new Date(),
      maxDate:ed
  });
}
let handleTextBoxChange = () => {
    $("#search-doctor").on('keyup', (e) => {
        applyFilter($("#search-doctor").val());
    })
   
}
let applyFilter = (doctorName) => {
    filterData = data.filter(x => (doctorName == '' || x.fullName.toLowerCase().includes(doctorName.toLowerCase())))
    loadData(filterData)
}
$(() => {
    getAvailableDoctors()
    handleTextBoxChange()
})

