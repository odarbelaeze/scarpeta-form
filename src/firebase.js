import { createContext } from "react";
import app from "firebase/app";
import moment from "moment";
import pickBy from "lodash.pickby";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

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
    this.db = app.firestore();
    this.rt = app.database();

    this.db.settings({ timestampsInSnapshots: true });
  }

  isAuthenticated() {
    return !!this.user;
  }

  loginWithGoogle() {
    const provider = new app.auth.GoogleAuthProvider();
    this.auth.languageCode = "es";
    return this.auth.signInWithPopup(provider);
  }

  logOut() {
    return this.auth.signOut();
  }

  async currentSale() {
    return this.db
      .collection("sales")
      .orderBy("timestamp", "desc")
      .limit(1);
  }

  async currentOrder() {
    const user = this.auth.currentUser.uid;
    const dayStart = moment()
      .startOf("day")
      .toDate();
    return this.db
      .collection(`orders`)
      .where("userId", "==", user)
      .where("timestamp", ">", dayStart)
      .limit(1);
  }

  async ordersBetween({ startDate, endDate }) {
    return this.db
      .collection(`/orders/`)
      .where("timestamp", ">", startDate)
      .where("timestamp", "<=", endDate);
  }

  async createSale({ products }) {
    return await this.db.collection("sales").add({
      products,
      timestamp: moment().toDate()
    });
  }

  async createOrder({ quoted, quote, total }) {
    const user = this.auth.currentUser;
    return await this.db.collection("orders").add({
      userId: user.uid,
      userName: user.displayName,
      timestamp: moment().toDate(),
      quoted,
      quote: pickBy(quote, value => value && value > 0),
      total
    });
  }

  async deleteOrder({ orderId }) {
    this.db.doc(`/orders/${orderId}`).delete();
  }
}

const FirebaseContext = createContext(null);
const UserContext = createContext(null);

export default Firebase;
export { FirebaseContext, UserContext };
