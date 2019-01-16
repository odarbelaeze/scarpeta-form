import { createContext } from "react";
import app from "firebase/app";
import "firebase/auth";

class Firebase {
  constructor() {
    const config = {
      apiKey: process.env.REACT_APP_API_KEY,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_DATABASE_URL,
      projectId: process.env.REACT_APP_PROJECT_ID,
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
    };

    app.initializeApp(config);

    this.auth = app.auth();
    this.listenForUser();
  }

  listenForUser() {
    this.auth.onAuthStateChanged(user => {
      console.log("User state changed.");
      this.user = user;
    });
  }

  isAuthenticated() {
    return !!this.user;
  }

  loginWithGoogle() {
    const provider = new app.auth.GoogleAuthProvider();
    this.auth.languageCode = "es";
    return this.auth.signInWithPopup(provider);
  }

  logout() {
    return this.auth.signOut();
  }
}

const FirebaseContext = createContext(null);
const UserContext = createContext(null);

export default Firebase;
export { FirebaseContext, UserContext };
