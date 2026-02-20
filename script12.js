// Toggle Profile Panel
function toggleProfile() {
    document.getElementById("profilePanel").classList.toggle("active");
}


// Upload Profile Pic
document.getElementById("uploadPic")?.addEventListener("change", function () {

    let file = this.files[0];

    if (file) {
        let reader = new FileReader();

        reader.onload = function () {

            localStorage.setItem("profilePic", reader.result);

            document.getElementById("profilePic").src = reader.result;
            document.getElementById("panelPic").src = reader.result;
        }

        reader.readAsDataURL(file);
    }
});


// Load Profile Pic
window.addEventListener("load", function () {

    let pic = localStorage.getItem("profilePic");

    if (pic) {
        document.getElementById("profilePic").src = pic;
        document.getElementById("panelPic").src = pic;
    }
});


// Change Password
function changePassword() {

    let newPass = prompt("Enter New Password");

    if (newPass) {
        localStorage.setItem("password", newPass);
        alert("Password Changed!");
    }
}


// Logout
function logoutUser() {

    localStorage.removeItem("user");

    window.location.href = "login.html";
}