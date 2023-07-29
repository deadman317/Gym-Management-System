const profile = document.querySelector(".profile");
const accountDetails = document.querySelector('.account-details');
const profileDetails = document.querySelector('.popup .profile .details');
const profileImage = document.querySelector('.popup .profile .profile-image');
const closePopup = document.querySelector('.popup .close-btn');
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

function togglePopup() {
    const popup = document.getElementById("profilePopup");
    popup.style.display = popup.style.display === "block" ? "none" : "block";
}

function menuToggle() {
    const toggleMenu = document.querySelector(".menu");
    toggleMenu.classList.toggle("active");
}

profile.addEventListener("click", menuToggle);
closePopup.addEventListener("click", togglePopup);
//click anywher to close menu
window.onclick = function (event) {
    if (!event.target.matches(".profile")) {
        const menu = document.querySelector(".menu");
        if (menu.classList.contains("active")) {
            menu.classList.remove("active");
        }
    }
}

const profileButton = document.getElementById("profileButton");
profileButton.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("profilePopup").style.display = "block";
});


import { handleLogout, getCurrentUser, fetchAccountDetails } from './auth.js';

getCurrentUser()
    .then((user) => {
        if (user) {
            if (user.role === "admin") {
                window.location.href = "./admin.html";
            }
            else if (user.role === "member") {
                window.location.href = "./member.html";
            }

            // Call the function to fetch account details
            fetchAccountDetails(user)
                .then((accountData) => {
                    if (accountData) {
                        let html = `${accountData.username}<br><span>${accountData.email}</span><p>${user.role ? user.role : ""}</p>`;
                        accountDetails.innerHTML = html;
                        profile.innerHTML = `${accountData.username[0]}`;


                        html = `${accountData.username[0]} `;
                        profileImage.innerHTML = html;

                        html = `
                        <h3>${accountData.username}</h3>
                        <p>${accountData.email}</p>`;
                        profileDetails.innerHTML = html;
                    }
                });
        } else {
            window.location.href = "./index.html";
        }
    })
    .catch((error) => {
        console.error('Error checking current user:', error);
    });



// Add event listener to the logout button
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    handleLogout()
        .then(() => {
            getCurrentUser()
                .then((user) => {
                    if (!user) {
                        window.location.href = "./index.html";
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


