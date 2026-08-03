// ============================================
// GlobeTalk Firebase Configuration
// ============================================




// ============================================
// Replace with YOUR Firebase Keys
// ============================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDasciB6xPOX1voyOBCkaCTpxOsgiFZiSA",
    authDomain: "globetalk-9a8ca.firebaseapp.com",
    projectId: "globetalk-9a8ca",
    storageBucket: "globetalk-9a8ca.firebasestorage.app",
    messagingSenderId: "160687357283",
    appId: "1:160687357283:web:d07765c613fa5d41c22756",
    measurementId: "G-8K1LR824VM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



// ============================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();


// ============================================
// Register
// ============================================

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

    await setDoc(doc(db, "users", userCredential.user.uid), {

        name: name,

        email: email,

        xp: 0,

        hearts: 5,

        streak: 0,

        coins: 0,

        level: 1,

        lessonsCompleted: [],

        createdAt: new Date()

    });

    return userCredential.user;

}


// ============================================
// Login
// ============================================

export async function login(email, password) {

    const userCredential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    return userCredential.user;

}


// ============================================
// Google Login
// ============================================

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

            name: result.user.displayName,

            email: result.user.email,

            xp: 0,

            hearts: 5,

            streak: 0,

            coins: 0,

            level: 1,

            lessonsCompleted: []

        });

    }

    return result.user;

}


// ============================================
// Forgot Password
// ============================================

export async function resetPassword(email) {

    return sendPasswordResetEmail(auth, email);

}


// ============================================
// Logout
// ============================================

export async function logout() {

    return signOut(auth);

}


// ============================================
// Current User
// ============================================

export function currentUser(callback) {

    onAuthStateChanged(auth, (user) => {

        callback(user);

    });

}


// ============================================
// Load User Data
// ============================================

export async function loadUser(uid) {

    const ref = doc(db, "users", uid);

    const snap = await getDoc(ref);

    return snap.data();

}


// ============================================
// Save Progress
// ============================================

export async function saveProgress(uid, data) {

    const ref = doc(db, "users", uid);

    await setDoc(
        ref,
        data,
        {
            merge: true
        }
    );

}