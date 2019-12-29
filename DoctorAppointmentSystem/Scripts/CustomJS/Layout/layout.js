let saveAvailableTime = () => {
    let startTime = $("#time-start").val()
    let endTime = $("#time-end").val()
    if (isFormValid(startTime, endTime) == true) {
        $.ajax({
            type: "POST",
            url: "/Doctors/Appointments",
            data: { 'startTime': startTime, 'endTime': endTime },
            success: function (response) {
                renderResponse(response)
            }
        })
    }
}
let isFormValid = (startTime, endTime) => {
    if (startTime == "") { showError("Start time is required", ".error"); return false }
    else if (endTime == "") { showError("End time is required", ".error"); return false }
    return true;
}
let showError = (msg, selector) => {
    $(selector).addClass('alert alert-danger').html(msg);
    setTimeout(function () {
        $(selector).removeClass('alert alert-danger').html("");
    }, 2000);
}
let renderResponse = (response) => {
    if (response == false) {
        $.notify("You already created time slot for today", "warn");
        $("#myModal1").modal("hide")
        $("#time-start").val("")
        $("#time-end").val("")
    }
    else {
        $.notify("Time slot created successfully", "success");
        $("#myModal1").modal("hide")
        $("#time-start").val("")
        $("#time-end").val("")
    }
}

let loadAvailableTimemodel = () => {
    $("#myModal1").modal('show');

    $('#time-start').bootstrapMaterialDatePicker({
        date: false,
        shortTime: false,
        format: 'HH:mm',
        minDate: new Date(),
    });
    $('#time-end').bootstrapMaterialDatePicker({
        date: false,
        shortTime: false,
        format: 'HH:mm',
        minDate: new Date(),
       
    });
}

