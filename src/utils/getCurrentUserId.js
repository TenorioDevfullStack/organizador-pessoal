import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";

export default function getCurrentUserId() {
  const auth = getAuth(app);
  return auth.currentUser ? auth.currentUser.uid : null;
}
