import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { firebaseConfig } from './signinfirebase-config.js';

// State management
let isLoginMode = true;
let app, auth, db;

// DOM Elements
const authCard = document.getElementById('authCard');
const dashboardCard = document.getElementById('dashboardCard');
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const toggleAuth = document.getElementById('toggleAuth');
const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');
const toggleText = document.getElementById('toggleText');
const forgotPassword = document.getElementById('forgotPassword');
const googleBtn = document.getElementById('googleBtn');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const userAvatar = document.getElementById('userAvatar');
const logoutBtn = document.getElementById('logoutBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Initialize Firebase
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🚀 Firebase connected");
} catch (error) {
    showToast("⚠️ Configuration missing", "error");
}

// Check Auth Status (Unified Sync)
if (auth) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", user.email);
            // Only update if not already set by a deliberate login/signup action
            if (!localStorage.getItem("userDisplayName") || localStorage.getItem("userDisplayName").includes('@')) {
                localStorage.setItem("userDisplayName", user.displayName || user.email.split('@')[0]);
            }
            showDashboard(user);
        } else {
            localStorage.setItem("isLoggedIn", "false");
            showAuth();
        }
    });
}

// Toggle between Sign In and Sign Up
function updateMode() {
    const usernameGroup = document.getElementById('usernameGroup');
    const emailLabel = document.getElementById('emailLabel');
    const emailInput = document.getElementById('email');
    
    // Trigger slide animation
    authCard.classList.remove('slide-in-right');
    authCard.style.opacity = '0';
    
    setTimeout(() => {
        if (isLoginMode) {
            formTitle.textContent = "Welcome Back";
            formSubtitle.textContent = "Please enter your details to sign in";
            submitBtn.querySelector('span').textContent = "Sign In";
            toggleText.innerHTML = `Don't have an account? <a href="#" id="toggleAuth">Create account</a>`;
            if (usernameGroup) usernameGroup.style.display = 'none';
            if (emailLabel) emailLabel.textContent = "Email or Username";
            if (emailInput) {
                emailInput.type = "text";
                emailInput.placeholder = "Enter email or username";
            }
            document.querySelector('.form-options').style.display = 'flex';
        } else {
            formTitle.textContent = "Create Account";
            formSubtitle.textContent = "Start your journey with NexAuth";
            submitBtn.querySelector('span').textContent = "Join NexAuth";
            toggleText.innerHTML = `Already have an account? <a href="#" id="toggleAuth">Sign In</a>`;
            if (usernameGroup) usernameGroup.style.display = 'block';
            if (emailLabel) emailLabel.textContent = "Email Address";
            if (emailInput) {
                emailInput.type = "email";
                emailInput.placeholder = "name@example.com";
            }
            document.querySelector('.form-options').style.display = 'none';
        }
        
        // Re-attach listener
        const toggleBtn = document.getElementById('toggleAuth');
        if (toggleBtn) {
            toggleBtn.onclick = (e) => {
                e.preventDefault();
                isLoginMode = !isLoginMode;
                updateMode();
            };
        }

        authCard.classList.add('slide-in-right');
        authCard.style.opacity = '1';
    }, 200);
}

// Initial Setup (Universal Sign-Out Catch)
const urlParams = new URLSearchParams(window.location.search);
const shouldLogout = urlParams.get('logout') === 'true';

if (shouldLogout && auth) {
    signOut(auth).then(() => {
        localStorage.setItem("isLoggedIn", "false");
        showToast("👋 Signed out successfully", "success");
        // Clear URL params for a clean state
        window.history.replaceState({}, document.title, window.location.pathname);
    });
}

// Ensure the auth card always 'glides' into view on the first load
if (authCard) {
    authCard.classList.add('slide-in-right');
}

toggleAuth.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    updateMode();
});

// Forgot Password
forgotPassword.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    if (!email) {
        showToast("📧 Enter your email first", "error");
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        showToast("✉️ Reset link sent to your email", "success");
    } catch (error) {
        showToast(`❌ ${formatError(error.code)}`, "error");
    }
});

// Google Login
googleBtn.addEventListener('click', async () => {
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
        showToast("⚠️ Please add Firebase credentials", "error");
        return;
    }
    
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        showToast(`✨ Welcome, ${user.displayName.split(' ')[0]}!`, "success");
        
        // Sync user data to Firestore
        await setDoc(doc(db, "USER", user.uid), {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            last_login: new Date().toISOString()
        }, { merge: true });

    } catch (error) {
        showToast(`❌ ${formatError(error.code)}`, "error");
    }
});

// Handle Form Submission
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    setLoading(true);

    try {
        let userCredential;
        if (isLoginMode) {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", email);
            
            // Fetch personalized username from Firestore
            if (db) {
                const userDoc = await getDoc(doc(db, "USER", userCredential.user.uid));
                if (userDoc.exists() && userDoc.data().username) {
                    localStorage.setItem("userDisplayName", userDoc.data().username);
                } else {
                    localStorage.setItem("userDisplayName", email.split('@')[0]);
                }
                
                // Update last login
                await setDoc(doc(db, "USER", userCredential.user.uid), {
                    last_login: new Date().toISOString()
                }, { merge: true });
            }

            showToast("✅ Login success!", "success");

        } else {
            const usernameInput = document.getElementById('username');
            const chosenUsername = usernameInput ? usernameInput.value : email.split('@')[0];
            
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Update Official Firebase Display Name (Zero Latency Fix)
            await updateProfile(userCredential.user, { 
                displayName: chosenUsername 
            });
            
            // For 'Serious Use': Sign out immediately after creation 
            await signOut(auth);
            localStorage.setItem("isLoggedIn", "false");
            
            // Save the chosen username for the next login
            localStorage.setItem("userDisplayName", chosenUsername);
            
            showToast("✨ Account created! Please sign in now.", "success");
            
            // Switch back to Login Mode UI
            isLoginMode = true;
            updateMode();
            
            // Optional: Clear form
            emailInput.value = email; 
            passwordInput.value = "";
            
            // Save initial data to firestore
            if (db) {
                await setDoc(doc(db, "USER", userCredential.user.uid), {
                    email: email,
                    username: chosenUsername,
                    created_at: new Date().toISOString()
                });
            }
        }

    } catch (error) {
        // Strict Firebase Error Handling
        if (error.code === 'auth/email-already-in-use') {
             showToast("❌ Email already in use. Please sign in.", "error");
        } else {
            showToast(`❌ ${formatError(error.code)}`, "error");
        }
    } finally {
        setLoading(false);
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        showToast("👋 Signed out successfully", "success");
    } catch (error) {
        showToast("Error signing out", "error");
    }
});

// UI Helpers
function setLoading(loading) {
    if (!submitBtn) return;
    
    const btnText = submitBtn.querySelector('span');
    const existingSpinner = submitBtn.querySelector('.loading-spinner');

    if (loading) {
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'not-allowed';
        if (!existingSpinner) {
            submitBtn.insertAdjacentHTML('beforeend', '<div class="loading-spinner"></div>');
        }
        if (btnText) {
            btnText.style.opacity = '0.3'; // Strong fade to show it's locked
        }
    } else {
        submitBtn.disabled = false;
        submitBtn.style.cursor = 'pointer';
        if (existingSpinner) existingSpinner.remove();
        if (btnText) {
            btnText.style.opacity = '1'; // Force 100% opacity
            btnText.style.display = 'block'; // Force visibility
            btnText.style.visibility = 'visible'; // Extra safety
        }
    }
}

function showDashboard(user) {
    authCard.style.display = 'none';
    dashboardCard.style.display = 'block';
    userEmailDisplay.textContent = user.email;
    userAvatar.textContent = user.email.charAt(0).toUpperCase();
    
    // Universal Focal Redirection to Main Dashboard after high-fidelity success
    setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('logout') !== 'true') {
            window.location.href = '../index.html';
        }
    }, 1500);
}

function showAuth() {
    authCard.style.display = 'block';
    dashboardCard.style.display = 'none';
}

function showToast(message, type) {
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 4000);
}

function formatError(code) {
    if (!code) return "An error occurred";
    return code.split('/').pop().replace(/-/g, ' ');
}
