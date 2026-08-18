import {
  getApp,
  getApps,
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOfHsJq2lBKq87n4PYL1aq1cLrhkC0wIg",
  authDomain: "tcc-7491c.firebaseapp.com",
  projectId: "tcc-7491c",
  storageBucket: "tcc-7491c.firebasestorage.app",
  messagingSenderId: "626560679583",
  appId: "1:626560679583:web:9514f3b9c9a4c1fa26acaa",
  measurementId: "G-Y76EJYVFMN"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
