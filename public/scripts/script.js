function menuToggle() {
    const toggleMenu = document.querySelector(".menu");
    toggleMenu.classList.toggle("active");
}

const profile = document.querySelector(".profile");

profile.addEventListener("click", menuToggle);

//click anywher to close menu
window.onclick = function (event) {
    if (!event.target.matches(".profile-img")) {
        const menu = document.querySelector(".menu");
        if (menu.classList.contains("active")) {
            menu.classList.remove("active");
        }
    }
    if (event.target.matches("#loginPopup")) {
        document.getElementById("loginPopup").style.display = "none";
        document.getElementById("login-form").reset();
    }
    if (event.target.matches("#registerPopup")) {
        document.getElementById("registerPopup").style.display = "none";
        document.getElementById("register-form").reset();
    }
}

const loginButton = document.getElementById("loginButton");
const signupButton = document.querySelector(".join");

// Event listener to show the login popup when clicking on the "Login" link
document.querySelector(".login a").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("register-form").reset();
    document.getElementById("registerPopup").style.display = "none";
    document.getElementById("loginPopup").style.display = "block";
});

// Event listener to show the register popup when clicking on the "Register" link
document.querySelector(".register a").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("login-form").reset();
    document.getElementById("loginPopup").style.display = "none";
    document.getElementById("registerPopup").style.display = "block";
});

// Event listener to show the login popup when clicking on the "Login" link
loginButton.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("loginPopup").style.display = "block";
    document.getElementById("registerPopup").style.display = "none";
});

// Event listener to show the register popup when clicking on the "Register" link
signupButton.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("registerPopup").style.display = "block";
    document.getElementById("loginPopup").style.display = "none";
});

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

export const setupUI = (user) => {
    console.log('setupUI');
    if (user) {
        //toggle user UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        //toggle user elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
};