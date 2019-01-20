import { createContext } from "react";
import app from "firebase/app";
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

  async activeSales() {
    const now = new Date();
    return this.db
      .collection("sales")
      .where("endDate", ">=", now)
      .orderBy("endDate")
      .orderBy("startDate");
  }

  async currentSale() {
    const now = new Date();
    const snapshot = await this.db
      .collection("sales")
      .where("endDate", ">=", now)
      .orderBy("endDate")
      .orderBy("startDate")
      .limit(1)
      .get();
    if (snapshot.empty || snapshot.docs[0].startDate <= now) {
      return null;
    }
    return snapshot.docs[0];
  }

  async currentOrder() {
    const user = this.auth.currentUser.uid;
    const sale = await this.currentSale();
    if (!sale) return null;
    return this.db.collection("orders").doc(`${sale.id}/forUser/${user}`);
  }

  async ordersBySale(saleId) {
    return this.db.collection(`/orders/${saleId}/forUser/`);
  }

  async createSale(data) {
    return await this.db.collection("sales").add(data);
  }

  async createOrder({ quoted, quote, total }) {
    const user = this.auth.currentUser;
    const sale = await this.currentSale();
    return await this.db
      .collection("orders")
      .doc(`${sale.id}/forUser/${user.uid}`)
      .set({
        userId: user.uid,
        userName: user.displayName,
        timestamp: new Date(),
        quoted,
        quote,
        total
      });
  }

  async deleteOrder({ saleId, orderId }) {
    console.log(saleId, orderId);
    this.db.doc(`/orders/${saleId}/forUser/${orderId}`).delete();
  }
}

const FirebaseContext = createContext(null);
const UserContext = createContext(null);

export default Firebase;
export { FirebaseContext, UserContext };
