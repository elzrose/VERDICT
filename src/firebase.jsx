
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA7AfrXlCwDULVrPGqQdbk2g6ncA2KwHLs",
  authDomain: "verdict-30230.firebaseapp.com",
  projectId: "verdict-30230",
  storageBucket: "verdict-30230.firebasestorage.app",
  messagingSenderId: "937799963834",
  appId: "1:937799963834:web:c006e235ae3ea082901e83",
  measurementId: "G-0M6DZSKPCV"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Successfully logged in:", result.user.displayName);
    return result.user;
  } catch (error) {
    console.error("Error logging in:", error);
  }
};
export const registerWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Successfully registered:", result.user.email);
    return result.user;
  } catch (error) {
    console.error("Error registering:", error);
    alert(error.message); // Show error to the user
  }
};
// Function 3: Login with Email
export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Successfully logged in:", result.user.email);
    return result.user;
  } catch (error) {
    console.error("Error logging in:", error);
    alert("Invalid email or password!");
  }
};
export default app;
