// High-Fidelity Firebase Configuration Hub
const firebaseConfig = {
  apiKey: "AIzaSyAgQt3aLMr268Ad-rxWYJuFulskPKOi8sc",
  authDomain: "dgfruit-accounts.firebaseapp.com",
  projectId: "dgfruit-accounts",
  storageBucket: "dgfruit-accounts.firebasestorage.app",
  messagingSenderId: "1019124818158",
  appId: "1:1019124818158:web:c0e81c0ae540026c1d93ff",
  measurementId: "G-YSNZW7XSNB"
};

// Initialize Firebase Authority
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// --- High-Fidelity Offline Resilience Hub ---
db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('Sync Hub: Multiple tabs open, persistence limited.');
    } else if (err.code == 'unimplemented') {
        console.warn('Sync Hub: Browser does not support offline persistence.');
    }
});
