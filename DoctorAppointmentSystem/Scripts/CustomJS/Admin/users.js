let getUserData = (roleid) => {
    $.ajax({
        url: '/Admin/GetAllUsers',
        type: 'Get',
        data: { 'roleId': roleid },
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            loadData(response.result.Users)
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
    arg_data.map((row,index) => {
        renderRow(row,index)
    })
}

let renderRow = (row,index) => {
    let Getuser="Doctor"
    const {FirstName, LastName, UserName,IsActive,UserId} = row;
    let status = checkStatus(IsActive)
    let renderActionHtml = '<div class="row"><div class="col-md-3 col-3 text-right" title="Delete"> <button class="btn btn-sm btn-outline-danger btn-icon" onclick="deleteUser('+ UserId +','+Getuser+')"><i class="nc-icon nc-simple-delete"></i></button></div><div style="margin-left:10px">'+getButtonAccordingToUserStatus(IsActive,UserId)+'</div></div>'
    let dataRow = $("#dataRow").clone();
    dataRow.removeAttr('hidden')
    dataRow.removeAttr('id')
    dataRow.find('#No').text(index+1)
    dataRow.find('#firstName').text(FirstName)    
    dataRow.find('#lastName').text(LastName)
    dataRow.find('#userName').text(UserName)   
    
    dataRow.find('#status').html(status)
    dataRow.find('#action').html(renderActionHtml)    

    $("#tbody").append(dataRow)
}

let checkStatus = (IsActive) =>{
    let statusHtml = ''
    if(IsActive == true)
    {
        statusHtml = '<label class="btn btn-primary">Active</label>'
    }else{
        statusHtml = '<label class="btn btn-warning btn-default">Blocked</label>'
    }
    return statusHtml
}

let getButtonAccordingToUserStatus = (IsActive,id) => {
    let buttonHtml = ''
    if(IsActive == true)
    {
        buttonHtml = "<button title='Block' class='btn btn-sm btn-outline-warning btn-icon' onclick='enableDisable(" + id + ")'><i class='nc-icon nc-button-power'></i></button>"
    }else{
        buttonHtml = "<button title='Active' class='btn btn-sm btn-outline-success btn-icon' onclick='enableDisable(" + id + ")'><i class='nc-icon nc-button-power'></i></button>"
    }
    return buttonHtml
}

