function signup() {
    let name = document.getElementById("signupName").value;
    let email = document.getElementById("signupEmail").value;
    let password = document.getElementById("signupPassword").value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    let user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem(email, JSON.stringify(user));
    alert("Signup successful!");
    window.location.href = "login.html";
}

function login() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let user = localStorage.getItem(email);

    if (user === null) {
        alert("User not found!");
        return;
    }

    let data = JSON.parse(user);

    if (data.password === password) {

        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "dashboard.html"; // create this next
    } else {
        alert("Incorrect password!");
    }
}
