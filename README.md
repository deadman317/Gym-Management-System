# Gym Management System

A Gym Management System built with Node.js and Firebase, designed to streamline gym administration tasks and provide a seamless experience for both gym owners and members.

### Features

- **Member Management**: Easily add, update, and remove gym members with their details, such as name, contact information, membership type, and more.

- **Admin Dashboard**: Access a comprehensive admin dashboard to manage all aspects of the gym efficiently.

### Prerequisites

- Node.js: Ensure you have Node.js installed on your system. You can download it from [here](https://nodejs.org/).

- Firebase Account: You'll need a Firebase account to set up the database and authentication. Create a free account at [Firebase Console](https://console.firebase.google.com/).

- Java: Install Java as the Firebase Emulator requires it. You can download Java from [here](https://www.java.com/).

### Installation

1. Clone the repository to your local machine:

git clone https://github.com/your-username/gym-management-system.git
cd gym-management-system


2. Install the dependencies using npm:

npm install


3. Configure Firebase:

   - Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Copy the Firebase configuration details (apiKey, authDomain, databaseURL, projectId, etc.).
   - Replace the configuration in the `firebaseConfig` object in `src/firebase.js` with your Firebase project configuration.

### Usage

1. Start the development server:

npm start


2. Open your web browser and navigate to `http://localhost:3000` to access the Gym Management System.

### Firebase Emulator

If you wish to use the Firebase Emulator Suite during development, follow these steps:

1. Install the Firebase CLI:

npm install -g firebase-tools

2. Initialize the Firebase Emulator:

firebase init emulators

3. Start the Firebase Emulator:

firebase emulators:start

Now, the Firebase Emulator Suite is running, and the system will use the emulator instead of the production Firebase services.
