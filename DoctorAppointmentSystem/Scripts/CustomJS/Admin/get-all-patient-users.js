const patients = 3

$(() => {
    getUserData(patients)
    
})
let deleteUser = (id, action) => {
    bootbox.confirm("Are you sure to delete user?", function (result) {
        if (result == true) {
            $.ajax({
                type: "POST",
                url: "/Admin/DeleteUser",
                data: { 'id': id },
                success: function (response) {
                    $.notify("Deleted successfully", "warn");
                    getUserData(patients)
                }
            })
        }
    })

}
let enableDisable = (id) => {
    $.ajax({
        type: "POST",
        url: "/Admin/EnableDisable",
        data: { 'id': id },
        success: function (response) {
            getUserData(patients)
        }
    })
}
