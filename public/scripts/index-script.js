// backgroun image change
const bgImageElement = document.querySelector('.banner');

// List of background images you want to cycle through
const backgroundImageUrls = [
    '../img/background1.jpg',
    '../img/background2.jpg',
    '../img/background3.jpg',
    // Add more image paths as needed
];

let currentImageIndex = 0;

// Function to change the background image
function changeBackgroundImage() {
    currentImageIndex = (currentImageIndex + 1) % backgroundImageUrls.length;
    const nextImageUrl = backgroundImageUrls[currentImageIndex];
    bgImageElement.style.backgroundImage = `url('${nextImageUrl}')`;
}

// Automatically change the background image every 5 seconds (5000 milliseconds)
setInterval(changeBackgroundImage, 5000);


//click anywher to close menu
window.onclick = function (event) {
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

import { handleSignUp, handleLogin, getCurrentUser } from './auth.js';

getCurrentUser()
    .then((user) => {
        if (user) {
            user.getIdTokenResult().then(idTokenResult => {
                user.role = idTokenResult.claims.role;
                if (user.role === "admin") {
                    window.location.href = "./admin.html"
                }
                else if (user.role === "member") {
                    window.location.href = "./member.html"
                }
                else {
                    window.location.href = "./user.html"
                }
            });
        }
    })
    .catch((error) => {
        console.error('Error checking current user:', error);
    });

// Add event listener to the signupForm
const signupForm = document.querySelector('#register-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSignUp(signupForm)
        .then(() => {
            getCurrentUser()
                .then((user) => {
                    if (user) {
                        // window.location.href = "./user.html"
                    }
                })
                .catch((error) => {
                    console.error('Error checking current user:', error);
                });
        })
        .catch((error) => {
            console.error(error);
        });
});


// Add event listener to the loginForm
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin(loginForm)
        .then(() => {
            getCurrentUser()
                .then((user) => {
                    if (user) {
                        user.getIdTokenResult().then(idTokenResult => {
                            user.role = idTokenResult.claims.role;
                            if (user.role === "admin") {
                                window.location.href = "./admin.html"
                            }
                            else if (user.role === "member") {
                                window.location.href = "./member.html"
                            }
                            else {
                                window.location.href = "./user.html"
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error checking current user:', error);
                });
        })
        .catch((error) => {
            console.error(error);
        });
});




