const profile = document.querySelector(".profile");
const accountDetails = document.querySelector('.account-details');


function menuToggle() {
    const toggleMenu = document.querySelector(".menu");
    toggleMenu.classList.toggle("active");
}
profile.addEventListener("click", menuToggle);


const memberButton = document.getElementById("memberButton");
memberButton.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("memberPopup").style.display = "block";
});

//click anywher to close menu
window.onclick = function (event) {

    if (event.target.matches("#memberPopup")) {
        document.getElementById("memberPopup").style.display = "none";
        document.getElementById("upgradeForm").reset();
    }
    if (!event.target.matches(".profile")) {
        const menu = document.querySelector(".menu");
        if (menu.classList.contains("active")) {
            menu.classList.remove("active");
        }
    }
}


import { handleLogout, getCurrentUser, fetchAccountDetails, fetchUsers, upgradeToMember, removeMember } from './auth.js';
// Function to update the UI with the user list
function updateUserList(users) {
    const userListElement = document.getElementById('userList');
    userListElement.innerHTML = '';
    users.forEach((user) => {
        // console.log(user.customClaims);
        if (user.customClaims.role === "member") {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="mail">Email : <span>${user.email}</span></div>
                <div class="icons"><i class="fa-regular fa-pen-to-square editBtn"></i>
                <i class="fa-solid fa-trash deleteBtn"></i></div>
                `;
            userListElement.appendChild(li);
        }
    });
}

// Call the function when the page loads
async function init() {
    const users = await fetchUsers();
    updateUserList(users);
}

init();

getCurrentUser()
    .then((user) => {
        if (user) {
            if (user.role === "member") {
                window.location.href = "./member.html";
            }
            else if (user.role === undefined) {
                window.location.href = "./user.html";
            }

            // Call the function to fetch account details
            fetchAccountDetails(user)
                .then((accountData) => {
                    if (accountData) {
                        let html = `${accountData.username}<br><span>${accountData.email}</span><p>${user.role ? user.role : ""}</p>`;
                        accountDetails.innerHTML = html;
                        profile.innerHTML = `${accountData.username[0]}`;
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

// Function to handle the form submission event
document.getElementById("upgradeForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve form elements
    const email = document.getElementById("email").value;
    const planTypeSelect = document.getElementById("planType");
    const planType = planTypeSelect.value;
    const planPrice = parseInt(planTypeSelect.options[planTypeSelect.selectedIndex].getAttribute("data-price"), 10);
    const duration = parseInt(planTypeSelect.options[planTypeSelect.selectedIndex].getAttribute("data-duration"), 10);

    // Get the current date of subscription
    const currentDate = new Date().toISOString().slice(0, 10);

    // Calculate the end date of the subscription based on the duration
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);
    const endDateFormatted = endDate.toISOString().slice(0, 10);

    // Create user data object
    const userData = {
        email: email,
        planType: planType,
        planPrice: planPrice,
        dateOfSubscription: currentDate,
        subscriptionEndDate: endDateFormatted
    };
    await upgradeToMember(userData);
    document.getElementById("upgradeForm").reset();
    document.getElementById("memberPopup").style.display = "none";
    init();
});

// Function to edit a task
function editTask(editButton) {
    const li = editButton.parentElement.parentElement;
    const emailSpan = li.querySelector('.mail span');
    const emailText = emailSpan.textContent.trim();
    console.log(emailText, "edited");
}

// Function to delete a task
async function deleteTask(deleteButton) {
    const li = deleteButton.parentElement.parentElement;
    const emailSpan = li.querySelector('.mail span');
    const emailText = emailSpan.textContent.trim();
    await removeMember({ email: emailText });
    init();
    console.log(emailText, "deleted");
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("editBtn")) {
        editTask(event.target);
    } else if (event.target.classList.contains("deleteBtn")) {
        deleteTask(event.target);
    }
});


