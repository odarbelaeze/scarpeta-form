const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// On sign up.
exports.processSignUp = functions.auth.user().onCreate(user => {
  // Check if user meets role criteria.
  const admins = ["odarbelaeze@gmail.com", "criscarpetta@gmail.com"];
  if (user.email && admins.includes(user.email) && user.emailVerified) {
    const customClaims = { admin: true };
    // Set custom user claims on this newly created user.
    return admin
      .auth()
      .setCustomUserClaims(user.uid, customClaims)
      .then(() => {
        // Update real-time database to notify client to force refresh.
        const metadataRef = admin.database().ref("metadata/" + user.uid);
        // Set the refresh time to the current UTC timestamp.
        // This will be captured on the client to force a token refresh.
        return metadataRef.set({ refreshTime: new Date().getTime() });
      })
      .catch(error => {
        console.log(error);
      });
  }
  return false;
});
