/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.getAllUsers = functions.https.onCall((data, context) => {
    // Check if request is made by an admin
    if (!(context.auth && context.auth.token.role === "admin")) {
        return {
            error: 'Only admins can access the list of users.',
        };
    }

    // Fetch and return the list of users
    return admin
        .auth()
        .listUsers()
        .then((users) => {
            return users.users.map((user) => {
                return user.toJSON();
            });
        })
        .catch((err) => {
            return {
                error: 'Failed to fetch users: ' + err.message,
            };
        });
});

// Cloud Function to make a user a member user and add subscription data to Firestore database
exports.makeUserMember = functions.https.onCall(async (data, context) => {
    try {
        // Check if the request is authenticated (user must be an admin to perform this action)
        if (!context.auth || !context.auth.token.role === "admin") {
            throw new functions.https.HttpsError(
                'permission-denied',
                'Only admin users can make other users member.'
            );
        }

        // Get the user record from Firebase Authentication
        const userRecord = await admin.auth().getUserByEmail(data.email);

        // Set custom claim for the user to make them a member user
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'member' });

        // Add subscription data to Firestore database
        const subscriptionData = {
            planType: data.planType,
            planPrice: data.planPrice,
            dateOfSubscription: data.dateOfSubscription,
            subscriptionEndDate: data.subscriptionEndDate
        };

        // Create a reference to the user's role collection (assuming role is "member")
        const memberCollectionRef = admin.firestore().collection('members');

        // Add the subscription data to Firestore under the member's collection with the user ID as document ID
        await memberCollectionRef.doc(userRecord.uid).set(subscriptionData);

        return {
            success: true,
            message: `User ${userRecord.email} is now a member user with subscription data added.`,
        };
    } catch (error) {
        console.error('Error making user member:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while making user member.');
    }
});


exports.removeMember = functions.https.onCall(async (data, context) => {
    try {
        // Check if the request is authenticated (user must be an admin to perform this action)
        if (!context.auth || !context.auth.token.role === "admin") {
            throw new functions.https.HttpsError(
                'permission-denied',
                'Only admin users can remove members.'
            );
        }

        // Get the user record from Firebase Authentication
        const userRecord = await admin.auth().getUserByEmail(data.email);

        // Remove the user's custom claim to revoke their membership
        await admin.auth().setCustomUserClaims(userRecord.uid, null);

        // Remove the member's data from Firestore
        const memberCollectionRef = admin.firestore().collection('members');
        await memberCollectionRef.doc(userRecord.uid).delete();

        return {
            success: true,
            message: `User ${userRecord.email} has been removed as a member.`,
        };
    } catch (error) {
        console.error('Error removing member:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while removing the member.');
    }
});
