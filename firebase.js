// ===================================================
// GlobeTalk Firebase
// ===================================================

// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

// Firebase Authentication
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Firestore
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


// ==========================================
// YOUR FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyDasciB6xPOX1voyOBCkaCTpxOsgiFZiSA",
    authDomain: "globetalk-9a8ca.firebaseapp.com",
    projectId: "globetalk-9a8ca",
    storageBucket: "globetalk-9a8ca.firebasestorage.app",
    messagingSenderId: "160687357283",
    appId: "1:160687357283:web:d07765c613fa5d41c22756",
    measurementId: "G-8K1LR824VM"
};



// ==========================================

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();


// ==========================================
// REGISTER
// ==========================================

export async function register(name, email, password) {

    const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

    await updateProfile(userCredential.user, {
        displayName: name
    });

    await setDoc(
        doc(db, "users", userCredential.user.uid),
        {

            uid: userCredential.user.uid,

            name: name,

            email: email,

            avatar: "🌍",

            level: 1,

            xp: 0,

            hearts: 5,

            coins: 0,

            streak: 0,

            lessonsCompleted: [],

            createdAt: serverTimestamp(),

            lastLogin: serverTimestamp()

        }
    );

    return userCredential.user;

}


// ==========================================
// LOGIN
// ==========================================

export async function login(email, password) {

    const userCredential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    await updateDoc(
        doc(db, "users", userCredential.user.uid),
        {
            lastLogin: serverTimestamp()
        }
    );

    return userCredential.user;

}


// ==========================================
// GOOGLE LOGIN
// ==========================================

export async function googleLogin() {

    const result =
        await signInWithPopup(
            auth,
            googleProvider
        );

    const ref = doc(db, "users", result.user.uid);

    const snap = await getDoc(ref);

    if (!snap.exists()) {

        await setDoc(ref, {

            uid: result.user.uid,

            name: result.user.displayName,

            email: result.user.email,

            avatar: "🌍",

            level: 1,

            xp: 0,

            hearts: 5,

            coins: 0,

            streak: 0,

            lessonsCompleted: [],

            createdAt: serverTimestamp(),

            lastLogin: serverTimestamp()

        });

    }

    return result.user;

}


// ==========================================
// PASSWORD RESET
// ==========================================

export async function resetPassword(email) {

    await sendPasswordResetEmail(auth, email);

}


// ==========================================
// LOGOUT
// ==========================================

export async function logout() {

    await signOut(auth);

}


// ==========================================
// AUTH STATE
// ==========================================

export function currentUser(callback) {

    onAuthStateChanged(auth, (user) => {

        callback(user);

    });

}


// ==========================================
// LOAD USER
// ==========================================

export async function getUserData(uid) {

    const snapshot =
        await getDoc(
            doc(db, "users", uid)
        );

    return snapshot.data();

}


// ==========================================
// SAVE USER DATA
// ==========================================

export async function saveUserData(uid, data) {

    await updateDoc(
        doc(db, "users", uid),
        data
    );

}