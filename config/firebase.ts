import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDe8klSw9cGZKLZSj3_IvoblMaV0IylMeo",
  authDomain: "bloom-wellness-4bde0.firebaseapp.com",
  projectId: "bloom-wellness-4bde0",
  storageBucket: "bloom-wellness-4bde0.firebasestorage.app",
  messagingSenderId: "43899980709",
  appId: "1:43899980709:web:dbec174d73a65c35e2b64c",
  measurementId: "G-B7ZTC6R62H"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
export { auth };
export type { User };
export default app;