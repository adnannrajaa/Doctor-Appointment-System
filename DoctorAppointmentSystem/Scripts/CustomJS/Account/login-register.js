let showRegisterForm =()=>{
    $('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('Register with');
    }); 
    $('.error').removeClass('alert alert-danger').html('');
       
}
let showLoginForm=()=>{
    $('#loginModal .registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');    
        });
        
        $('.modal-title').html('Login with');
    });       
     $('.error').removeClass('alert alert-danger').html(''); 
}

let openLoginModal=()=>{
    showLoginForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}
let openRegisterModal=()=>{
    showRegisterForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}

let loginAjax = () =>{
    let userName = $("#userName").val();
    let password = $("#password").val();
    if (isFormValid(userName, password) == true)
    {
        $.ajax({
            type: "POST",
            url: "/Account/Login",
            data: { "userName": userName, "password": password },
            success: function (response) {
                performActionAccordingToResponse(response)
            }
        });

    }
   


}
let performActionAccordingToResponse = (response) => {
    switch (response.result) {
        case 1:
            showPageAccordingToRole(response.UserRole)
            break
        case 2:
            verifyMe("Click to activate your account <button class='btn btn-sm btn-success' onclick='VerifyUserbyUserName()'>Activate</button", ".verifyMyLogin")
            break
        case 3:
            shakeModal("Your account is deleted by admin", '.error')
            break
        case 4:
            shakeModal("Your account is blocked by admin", '.error')
            break
        case 5:
            shakeModal("Invalid username/password combination", '.error')
            break
    }
}
let isFormValid = (userName, password) => {
    if (userName == "")
    { shakeModal("username is required", '.error'); return false }
    else if (password == "") { shakeModal("password is required", '.error'); return false }
   return true
}

let showPageAccordingToRole = (role) => {
    switch(role)
    {
        case 'Admin':
            window.location = "/Admin/GetAllDoctorUsers"
            break
        case 'Doctor':
            window.location = "/Doctors/Deshboard"
            break
        case 'Patient':
            window.location = "/Patient/Deshboard"
            break
    }
}
let shakeModal=(msg,selector)=>{
    $('#loginModal .modal-dialog').addClass('shake');
    $(selector).addClass('alert alert-danger').html(msg);
             setTimeout( function(){ 
                $('#loginModal .modal-dialog').removeClass('shake'); 
    }, 1000 ); 
}

let registerUser = () => {
    if (isFormValidated() == true) {
        if(IsUserExist()==false)
        {
            let param = {
                RoleId: $("#userRole option:selected").val(),
                UserName: $("#userNameR").val(),
                Password: $("#passwordR").val(),
                FirstName: $("#firstName").val(),
                LastName: $("#lastName").val(),
                IsDeleted: false,
                IsActive: true,
                IsVerified:false
            }
            $.ajax({
                type: "POST",
                url: "/Account/registerUser",
                data: param,
                success: function (response) {
                    if (response.result) {
                        resetDatafeilds();
                        verifyMe("Click to activate your account <button class='btn btn-sm btn-success' onclick='VerifyUser()'>Activate</button", ".verifyMyLoginR")
                    }
                }
            });
        }
        else { shakeModal("User name already exist", '.errorRegister') }
       
    }

}
let resetDatafeilds = () => {
    $("#userRole").val("0")
    $("#firstName").val("")
    $("#lastName").val("")
    $("#userNameR").val("")
    $("#passwordR").val("")
    $("#password_confirmation").val("")
    $(".errorRegister").removeClass('alert alert-danger').html("");
}
let isFormValidated = () => {
    let RoleId = $("#userRole option:selected").val()
    let firstName = $("#firstName").val()
    let lastName = $("#lastName").val()
    let userName = $("#userNameR").val()
    let password = $("#passwordR").val()
    let confirmPassword = $("#password_confirmation").val()
    if (firstName == "") { shakeModal("First name is required", '.errorRegister'); return false }
    else if (lastName == "") { shakeModal("Last name is required", '.errorRegister'); return false }
    else if (userName == "") { shakeModal("User name is required", '.errorRegister'); return false }
    else if (RoleId == 0) { shakeModal("Please select role", '.errorRegister'); return false }
    else if (password == "") { shakeModal("password is required", '.errorRegister'); return false }
    else if (confirmPassword == "") { shakeModal("confirm password is required", '.errorRegister'); return false }
    else if (confirmPassword != password) { shakeModal("password not match", '.errorRegister'); return false }
    return true
}

let IsUserExist = () => {
        $.ajax({
            type: "POST",
            url: "/Account/isUserExist",
            data: { 'UserName': $("#userNameR").val() },
            success: function (response) {
                if (response.result) {
                    shakeModal("User name already exist", '.errorRegister')
                    return true;
                }
            }
        });
        return false;
    }

let verifyMe=(msg,selector)=>{
    $(selector).addClass('alert alert-success').html(msg);
}

let VerifyUser = () => {
    $.ajax({
        type: "POST",
        url: "/Account/VerifyUser",
        success: function (response) {
            if(response.result==true)
            {
                verifyMe("Your account is verified successfully", ".verifyMyLoginR")
                setTimeout(function () {
                    $('.verifyMyLoginR').removeClass('alert alert-success').html("");
                }, 2000);
            }

        }
    });
}
let VerifyUserbyUserName = () => {
    $.ajax({
        type: "POST",
        url: "/Account/VerifyUserbyUserName",
        data: {'UserName':$("#userName").val()},
        success: function (response) {
            if (response.result == true) {
                verifyMe("Your account is verified successfully", ".verifyMyLogin")
                setTimeout(function () {
                    $('.verifyMyLogin').removeClass('alert alert-success').html("");
                }, 2000);
            }

        }
    });
}