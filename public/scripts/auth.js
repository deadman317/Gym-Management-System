import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, getDoc, addDoc, doc, setDoc, deleteDoc, onSnapshot, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-functions.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAbHyebOie9iXH4i5Ni753JNvAOKXJrPRw",
    authDomain: "gym-management-f4107.firebaseapp.com",
    projectId: "gym-management-f4107",
    storageBucket: "gym-management-f4107.appspot.com",
    messagingSenderId: "1059390031498",
    appId: "1:1059390031498:web:55f3cac9eb4374414b0f73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

connectFunctionsEmulator(functions, "127.0.0.1", 5001);
connectAuthEmulator(auth, "http://127.0.0.1:9099");
connectFirestoreEmulator(db, '127.0.0.1', 8080);

//signup
export function handleSignUp(signupForm) {
    return new Promise((resolve, reject) => {
        // Get user info
        const email = signupForm['r-email'].value;
        const password = signupForm['r-password'].value;
        const confirmPassword = signupForm['r-confirmPassword'].value;

        console.log(email, password, confirmPassword);

        // Check if passwords match
        if (password !== confirmPassword) {
            const error = new Error("Passwords do not match!");
            reject(error);
            return;
        }

        // Sign up the user
        createUserWithEmailAndPassword(auth, email, password)
            .then((cred) => {
                return setDoc(doc(db, "users", cred.user.uid), {
                    username: signupForm['r-username'].value
                });
            })
            .then(() => {
                document.getElementById("registerPopup").style.display = "none";
                signupForm.reset();
                resolve(); // Resolve the Promise when signup is successful
            })
            .catch((error) => {
                console.log(error.message);
                reject(error); // Reject the Promise if there's an error during signup
            });
    });
}


//login
export function handleLogin(loginForm) {
    return new Promise((resolve, reject) => {
        // Get user info
        const email = loginForm['l-email'].value;
        const password = loginForm['l-password'].value;

        // Log in the user
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                document.getElementById("loginPopup").style.display = "none";
                loginForm.reset();
                resolve(); // Resolve the Promise when login is successful
            })
            .catch((error) => {
                console.log(error.message);
                reject(error); // Reject the Promise if there's an error during login
            });
    });
}


// logout
export function handleLogout() {
    return new Promise((resolve, reject) => {
        signOut(auth)
            .then(() => {
                resolve(); // Resolve the Promise when logout is successful
            })
            .catch((error) => {
                reject(error); // Reject the Promise if there's an error during logout
            });
    });
}


//auth listener
export function getCurrentUser() {
    return new Promise((resolve, reject) => {
        // Firebase onAuthStateChanged listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // Unsubscribe the listener to stop further calls

            if (user) {
                // If there is a current user, resolve the Promise with the user object
                user.getIdTokenResult().then(idTokenResult => {
                    user.role = idTokenResult.claims.role;
                    resolve(user);
                });
            } else {
                // If there is no current user or the user is logged out, resolve with null
                resolve(null);
            }
        }, (error) => {
            // Reject the Promise if there's an error during authentication check
            reject(error);
        });
    });
}

//get user details
export function fetchAccountDetails(user) {
    return getDoc(doc(db, "users", user.uid))
        .then((docSnap) => {
            return {
                username: docSnap.data().username,
                email: user.email
            };
        })
        .catch((error) => {
            console.log(error.message);
            return null;
        });
}

// get member details
export function fetchMemberDetails(member) {
    return getDoc(doc(db, "members", member.uid))
        .then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    planType: data.planType,
                    planPrice: data.planPrice,
                    dateOfSubscription: data.dateOfSubscription,
                    subscriptionEndDate: data.subscriptionEndDate
                };
            } else {
                console.log("Member not found");
                return null;
            }
        })
        .catch((error) => {
            console.log(error.message);
            return null;
        });
}


//get all users
export async function fetchUsers() {
    try {
        // Create a reference to the Firebase Callable Cloud Function
        const getAllUsers = httpsCallable(functions, 'getAllUsers');

        // Call the function and wait for the response
        const response = await getAllUsers();

        // Assuming the response has a 'data' property containing the list of users
        const data = response.data;

        // Check for any errors in the response
        if (data.error) {
            console.error('Error fetching users:', data.error);
            return [];
        }

        // Assuming the response has a 'users' property containing the list of users
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// Function to upgrade to member using the user ID
export async function upgradeToMember(userId) {
    try {
        // Create a reference to the Firebase Callable Cloud Function
        const makeUserMember = httpsCallable(functions, 'makeUserMember');

        // Call the Cloud Function with the user ID as data
        const result = await makeUserMember(userId);

        // Handle the result if needed
        console.log(result.data.message);
    } catch (error) {
        // Handle errors if the Cloud Function call fails
        console.error('Error upgrading to member:', error.message);
    }
}


export async function removeMember(userId) {
    try {
        // Get a reference to the Cloud Function
        const removeMember = httpsCallable(functions, 'removeMember');

        // Call the Cloud Function
        const result = await removeMember(userId);

        // Process the result
        const { success, message } = result.data;
        console.log(message);
    } catch (error) {
        console.error(error.message);
    }
}


