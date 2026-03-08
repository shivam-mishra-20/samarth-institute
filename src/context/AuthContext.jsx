import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { USER_ROLES } from "../constants/roles";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordResetRequired, setPasswordResetRequired] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user role from Firestore
        try {
          // First try: Query users collection by uid field
          let usersQuery = query(
            collection(db, "users"),
            where("uid", "==", firebaseUser.uid),
          );
          let querySnapshot = await getDocs(usersQuery);

          // Fallback: If not found by uid, try querying by email (lowercase for consistency)
          if (querySnapshot.empty && firebaseUser.email) {
            usersQuery = query(
              collection(db, "users"),
              where("email", "==", firebaseUser.email.toLowerCase()),
            );
            querySnapshot = await getDocs(usersQuery);
          }

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
            const docId = querySnapshot.docs[0].id;

            // If found by email but uid doesn't match, update it
            if (userDoc.uid !== firebaseUser.uid) {
              await updateDoc(doc(db, "users", docId), {
                uid: firebaseUser.uid,
              });
              userDoc.uid = firebaseUser.uid;
            }

            setUser(firebaseUser);
            setUserRole(userDoc.role);
            setUserData(userDoc);
            setPasswordResetRequired(userDoc.passwordResetRequired || false);
          } else {
            setUser(null);
            setUserRole(null);
            setUserData(null);
            setPasswordResetRequired(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          setUserRole(null);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
        setUserData(null);
        setPasswordResetRequired(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password, role) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      console.log("✅ Firebase Auth successful. UID:", userCredential.user.uid);

      // First try: Query users collection by uid field
      let usersQuery = query(
        collection(db, "users"),
        where("uid", "==", userCredential.user.uid),
      );
      let querySnapshot = await getDocs(usersQuery);

      // Fallback: If not found by uid, try querying by email (case-insensitive)
      if (querySnapshot.empty) {
        console.log("User not found by UID, trying email lookup...");
        usersQuery = query(
          collection(db, "users"),
          where("email", "==", email.toLowerCase()),
        );
        querySnapshot = await getDocs(usersQuery);
      }

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        const docId = querySnapshot.docs[0].id;

        // If found by email but uid doesn't match, update it
        if (userDoc.uid !== userCredential.user.uid) {
          console.log("Updating UID in Firestore document...");
          await updateDoc(doc(db, "users", docId), {
            uid: userCredential.user.uid,
          });
          userDoc.uid = userCredential.user.uid;
        }

        if (userDoc.role !== role) {
          await signOut(auth);
          throw new Error("Invalid credentials for this role");
        }
        setUserRole(userDoc.role);
        setUserData(userDoc);
        setPasswordResetRequired(userDoc.passwordResetRequired || false);
        return userCredential.user;
      } else {
        await signOut(auth);
        throw new Error(
          `User data not found in Firestore for ${email}. Please contact admin to create your profile.`,
        );
      }
    } catch (error) {
      console.error("🔴 Login Error Details:", {
        code: error.code,
        message: error.message,
        email: email,
        role: role,
        fullError: error,
      });
      throw error;
    }
  };

  const signup = async (email, password, role, additionalData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Store user role and additional data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        role,
        createdAt: new Date().toISOString(),
        ...additionalData,
      });

      setUserRole(role);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
      setUserData(null);
      setPasswordResetRequired(false);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + "/login",
        handleCodeInApp: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    userData,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    passwordResetRequired,
    setPasswordResetRequired,
    isStudent: userRole === USER_ROLES.STUDENT,
    isTeacher: userRole === USER_ROLES.TEACHER,
    isAdmin: userRole === USER_ROLES.ADMIN,
    isParent: userRole === USER_ROLES.PARENT,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
