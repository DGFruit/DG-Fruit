// --- World-Class DGFruit Interaction Engine ---

// Global Focal Hub Variables
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const menuBtn = document.querySelector(".background");
const closeBtn = document.getElementById("close-btn");
const moreBtn = document.getElementById("more-btn");
const dropdownMenu = document.getElementById("dropdown-menu");
const settingsBtn = document.getElementById("settings-btn");
const settingsPopup = document.getElementById("settings-popup");
const themeTrigger = document.getElementById("theme-trigger");
const themeSubmenu = document.getElementById("theme-submenu");
const sidebarSettingsBtn = document.getElementById("sidebar-settings-opener");
const sidebarSettingsPanel = document.getElementById("sidebar-settings-panel");
const closeSettingsPanel = document.getElementById("close-settings-panel");
const sidebarSocialBtn = document.getElementById("sidebar-social-btn");
const sidebarSocialPopup = document.getElementById("sidebar-social-popup");
const contactBtn = document.getElementById("contact-btn");
const aboutBtn = document.getElementById("about-btn");

// Universal Theme Arrival Logic
const currentStoredTheme = localStorage.getItem('theme') || 'light';
if (currentStoredTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

document.addEventListener("DOMContentLoaded", () => {
    const darkModeChk = document.getElementById("dark-mode-chk");
    if (darkModeChk) {
        darkModeChk.checked = document.body.classList.contains('dark-mode');
        darkModeChk.addEventListener("change", () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    // Initialize Icons for dynamically added elements
    if (typeof lucide !== 'undefined') lucide.createIcons();
});

const closeSidebar = () => {
    if (sidebar && sidebarOverlay) {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
        
        // Also dismiss all high-fidelity modal panels via the unified hub
        closeAllAsidePanels();
        
        document.body.classList.remove("menu-active");
    }
};

// Interaction Listeners
if (menuBtn && sidebar && sidebarOverlay) {
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebar.classList.toggle("active");
        sidebarOverlay.classList.toggle("active");
        document.body.classList.toggle("menu-active");
    });
}

if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

if (moreBtn && dropdownMenu) {
    moreBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle("active");
        document.body.classList.toggle("menu-active");
    });
}

if (settingsBtn && settingsPopup) {
    settingsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        settingsPopup.classList.toggle("active");
    });
}

if (themeTrigger && themeSubmenu) {
    themeTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        themeSubmenu.classList.toggle("active");
        themeTrigger.classList.toggle("open");
    });
}

if (sidebarSocialBtn && sidebarSocialPopup) {
    sidebarSocialBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebarSocialBtn.classList.toggle("active");
        sidebarSocialPopup.classList.toggle("active");
    });
}

const sidebarSettingsDropdown = document.getElementById("sidebar-settings-dropdown");

if (sidebarSettingsBtn && sidebarSettingsDropdown) {
    sidebarSettingsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Ensure no other dropdowns are active in the sidebar
        if (sidebarSocialPopup) sidebarSocialPopup.classList.remove("active");
        if (sidebarSocialBtn) sidebarSocialBtn.classList.remove("active");
        
        sidebarSettingsBtn.classList.toggle("active");
        sidebarSettingsDropdown.classList.toggle("active");
    });
}

if (closeSettingsPanel && sidebarSettingsPanel) {
    closeSettingsPanel.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllAsidePanels();
    });
}

// World-Class Sidebar Settings Panel (Direct Hub Delegation)
document.addEventListener("click", (e) => {
    const navItem = e.target.closest(".settings-nav-item");
    if (navItem) {
        e.stopPropagation();
        const target = navItem.getAttribute("data-target");
        const panel = document.getElementById("sidebar-settings-panel");
        
        // --- Exclusive Dismissal Logic ---
        closeAllAsidePanels();

        // Open the settings panel as an aside to the sidebar
        if (panel) {
            panel.classList.add("active");
            const overlay = document.getElementById("settings-panel-overlay");
            if (overlay) overlay.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent background scroll
        }
        
        if (sidebarSettingsBtn) sidebarSettingsBtn.classList.add("active-prussian");
        
        loadSettingsPortal(target);
    }
});
const settingsDynamicView = document.getElementById("settings-dynamic-view");
const settingsStage = document.getElementById("settings-stage");

function updateThemeSelection() {
    const lightBtn = document.getElementById("set-theme-light");
    const darkBtn = document.getElementById("set-theme-dark");
    if (lightBtn && darkBtn) {
        const isDark = document.body.classList.contains("dark-mode");
        lightBtn.classList.toggle("active", !isDark);
        darkBtn.classList.toggle("active", isDark);
    }
}

// --- DGFruit High-Fidelity Modal Manager ---
// --- DGFruit Global Auth Sync Authority ---
if (typeof auth !== "undefined") {
    auth.onAuthStateChanged((user) => {
        if (user) {
            localStorage.setItem("isLoggedIn", "true");
            // Only sync from Firebase if local data haven't been customized
            if (!localStorage.getItem("userDisplayName")) {
                localStorage.setItem("userDisplayName", user.displayName || "Explorer");
            }
            if (!localStorage.getItem("userEmail")) {
                localStorage.setItem("userEmail", user.email);
            }
            if (!localStorage.getItem("userPhotoURL")) {
                localStorage.setItem("userPhotoURL", user.photoURL);
            }
        } else {
            localStorage.setItem("isLoggedIn", "false");
        }
        checkAuthStatus(); // Universal UI Refresh
    });
}

function closeAllAsidePanels() {
    // Close blurring overlays
    const overlays = document.querySelectorAll(".panel-overlay");
    overlays.forEach(overlay => overlay.classList.remove("active"));
    
    // Close sidebar dropdowns
    if (sidebarSocialPopup) sidebarSocialPopup.classList.remove("active");
    if (sidebarSettingsDropdown) sidebarSettingsDropdown.classList.remove("active");
    
    // Remove individual panel active states
    const panels = document.querySelectorAll(".contact-aside-panel, .about-aside-panel, .settings-aside-panel, .community-hub-overlay");
    panels.forEach(panel => panel.classList.remove("active"));
    
    // Specifically handle the hub overlay if it's the class based one
    const hubOverlay = document.getElementById("community-hub-overlay");
    if (hubOverlay) hubOverlay.classList.remove("active");
    
    if (sidebarSettingsBtn) sidebarSettingsBtn.classList.remove("active-prussian");
    
    document.body.style.overflow = ""; // Restore scrolling
}

function syncActiveStates(target) {
    const navItems = document.querySelectorAll(".settings-nav-item");
    navItems.forEach(nav => {
        if (nav.getAttribute("data-target") === target) {
            nav.classList.add("active");
        } else {
            nav.classList.remove("active");
        }
    });
}

function updateAccountInfo() {
    const name = localStorage.getItem("userDisplayName") || "User";
    const email = localStorage.getItem("userEmail") || "dgfruit.auth@identity.com";
    const photoURL = localStorage.getItem("userPhotoURL");
    const initial = name.charAt(0).toUpperCase();

    // Account Hub Content Refresh
    const accName = document.getElementById("account-display-name");
    const accEmail = document.getElementById("account-display-email");
    const accAvatar = document.getElementById("account-avatar-large");
    
    if (accName) accName.textContent = name;
    if (accEmail) accEmail.textContent = email;

    if (accAvatar) {
        if (photoURL && photoURL !== "null" && photoURL !== "") {
            accAvatar.innerHTML = `<img src="${photoURL}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
        } else {
            accAvatar.innerHTML = `<span style="font-size: 3rem; font-weight: 800; color: white;">${initial}</span>`;
            accAvatar.style.background = "var(--accent-blue)";
        }
    }
}

function loadSettingsPortal(target) {
    const stage = document.getElementById('settings-dynamic-view');
    const placeholder = document.getElementById('settings-stage-placeholder');
    const templateId = 'template-' + target;
    const template = document.getElementById(templateId);
    
    if (stage) {
        stage.innerHTML = ''; // clear current portal
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        if (template) {
            stage.appendChild(template.content.cloneNode(true));
        }
        
        // --- High-Fidelity State Sync ---
        syncActiveStates(target);
        
        if (target === 'appearance-hub') {
            updateThemeSelection();
        }
        if (target === 'account-hub') {
            updateAccountInfo();
        }
    }
}

if (settingsDynamicView) {
    settingsDynamicView.addEventListener("click", async (e) => {
        const lightBtn = e.target.closest("#set-theme-light");
        const darkBtn = e.target.closest("#set-theme-dark");
        const deleteBtn = e.target.closest(".delete-account");
        
        const changePhotoBtn = e.target.closest("#change-photo-btn");
        
        if (changePhotoBtn) {
            const uploadInput = document.getElementById("avatar-upload-input");
            if (uploadInput) uploadInput.click();
        }

        if (lightBtn) {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
            updateThemeSelection();
            const chk = document.getElementById("dark-mode-chk");
            if (chk) chk.checked = false;
        }
        if (darkBtn) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
            updateThemeSelection();
            const chk = document.getElementById("dark-mode-chk");
            if (chk) chk.checked = true;
        }

        // --- Permanent Account Deletion logic ---
        if (deleteBtn) {
            if (typeof auth === "undefined") {
                alert("Cloud Sync Hub offline. Please try again later.");
                return;
            }
            const confirmed = confirm("⚠️ AUTHORITATIVE WARNING: This will permanently delete your DG FRUIT account and all associated data from Firebase. This action cannot be undone.\n\nAre you absolutely sure?");
            
            if (confirmed) {
                try {
                    const user = auth.currentUser;
                    if (user) {
                        await user.delete();
                        localStorage.clear();
                        alert("Account successfully deleted. Returning to Home Hub.");
                        window.location.href = "web.html";
                    } else {
                        alert("Authentication error: No active session found. Please sign in again to delete your account.");
                    }
                } catch (error) {
                    console.error("Deletion Hub Error:", error);
                    if (error.code === "auth/requires-recent-login") {
                        alert("Security Gate Triggered: Sensitive actions require a recent login. Please sign out and sign back in before deleting your account.");
                    } else {
                        alert("An error occurred during account deletion: " + error.message);
                    }
                }
            }
        }
        // --- High-Fidelity Password Reset Gate ---
        const changePassBtn = e.target.closest("#change-password-btn, #change-pswd-btn");
        if (changePassBtn) {
            if (typeof auth === "undefined") {
                alert("Security Hub offline. Please try again later.");
                return;
            }
            const user = auth.currentUser;
            if (!user) {
                alert("Authentication Required: Please sign in to initiate a password reset.");
                return;
            }

            const confirmed = confirm(`Security protocol initiation: A password reset link will be sent to your registered email (${user.email}). \n\nContinue?`);
            if (confirmed) {
                try {
                    await auth.sendPasswordResetEmail(user.email);
                    alert("Security Protocol Success: A password reset link has been dispatched to your email address.");
                } catch (error) {
                    console.error("Password Gate Error:", error);
                    alert("A security error occurred: " + error.message);
                }
            }
        }


        // --- High-Fidelity Username Change Hub (14-Day Cooldown) ---
        const usernameBtn = e.target.closest(".change-username-btn");
        if (usernameBtn) {
            if (typeof auth === "undefined" || typeof db === "undefined") {
                alert("Cloud Sync Hub offline. Please try again later.");
                return;
            }
            const user = auth.currentUser;
            if (!user) {
                alert("Authentication Required: Please sign in to change your username.");
                return;
            }

            try {
                // Verify Cooldown via Firestore
                const userRef = db.collection("users").doc(user.uid);
                const doc = await userRef.get();
                const now = new Date();
                
                if (doc.exists && doc.data().lastUsernameChange) {
                    const lastChange = doc.data().lastUsernameChange.toDate();
                    const diffTime = Math.abs(now - lastChange);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays <= 14) {
                        alert(`Security Cooldown Active: You can only change your username once every 14 days. Please wait ${15 - diffDays} more days.`);
                        return;
                    }
                }

                const newUsername = prompt("Enter your new Digital Artisan alias:", user.displayName || "");
                if (newUsername && newUsername.trim() !== "" && newUsername !== user.displayName) {
                    // 1. Firebase Profile Update
                    await user.updateProfile({ displayName: newUsername.trim() });
                    
                    // 2. Firestore Cooldown Update
                    await userRef.set({
                        lastUsernameChange: firebase.firestore.FieldValue.serverTimestamp(),
                        displayName: newUsername.trim()
                    }, { merge: true });

                    // 3. Sync Local Authority
                    localStorage.setItem("userDisplayName", newUsername.trim());
                    
                    // 4. Global UI Refresh
                    checkAuthStatus();
                    loadSettingsPortal("account-hub"); // Refresh the hub view
                    
                    alert("Alias successfully updated across all DG FRUIT platforms.");
                }
            } catch (error) {
                console.error("Username Hub Error:", error);
                alert("An error occurred during username update: " + error.message);
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    // Auto-load first portal if needed
    loadSettingsPortal("account-hub");
});



// Global Click-Outside Authoritative Gate
document.addEventListener("click", (e) => {
    // 1. Sidebar Focal Persistence
    if (sidebar && sidebar.classList.contains("active")) {
        const isSettingsPanel = sidebarSettingsPanel && sidebarSettingsPanel.contains(e.target);
        const isMenuBtn = menuBtn && menuBtn.contains(e.target);
        const isOpener = e.target.closest("#sidebar-settings-opener");
        const isPanelOverlay = e.target.closest(".panel-overlay");
        const isAsidePanel = e.target.closest(".contact-aside-panel") || 
                             e.target.closest(".about-aside-panel") || 
                             e.target.closest(".settings-aside-panel");
        
        if (!sidebar.contains(e.target) && !isMenuBtn && !isSettingsPanel && 
            !isOpener && !isPanelOverlay && !isAsidePanel) {
            closeSidebar();
        }
    }


// --- Authoritative Global Modal Delegation Hub ---
document.addEventListener("click", (e) => {
    const contactBtn = e.target.closest("#contact-btn");
    if (contactBtn) {
        e.stopPropagation();
        const overlay = document.getElementById("contact-overlay");
        if (overlay) {
            const isActive = overlay.classList.contains("active");
            closeAllAsidePanels();
            if (!isActive) {
                overlay.classList.add("active");
                document.body.style.overflow = "hidden"; // Prevent background scroll
            }
        }
    }

    const aboutBtn = e.target.closest("#about-btn");
    if (aboutBtn) {
        e.stopPropagation();
        const overlay = document.getElementById("about-overlay");
        if (overlay) {
            const isActive = overlay.classList.contains("active");
            closeAllAsidePanels();
            if (!isActive) {
                overlay.classList.add("active");
                document.body.style.overflow = "hidden"; // Prevent background scroll
            }
        }
    }

    const helpTrigger = e.target.closest("#help-btn");
    if (helpTrigger) {
        e.stopPropagation();
        
        // Ensure settings popup is dismissed
        if (settingsPopup) settingsPopup.classList.remove("active");
        
        // --- Authoritative Direct Redirect to Secret Hub ---
        const isSubfolder = window.location.pathname.toLowerCase().match(/[\\\/](secret|signin|learning)[\\\/]/);
        window.location.href = isSubfolder ? `../Secret/index.html` : `Secret/index.html`;
    }

    // Community Hub (Discord) Modal Logic
    const communityTrigger = e.target.closest(".community-cta");
    if (communityTrigger) {
        e.stopPropagation();
        const overlay = document.getElementById("community-hub-overlay");
        if (overlay) {
            const isActive = overlay.classList.contains("active");
            closeAllAsidePanels();
            if (!isActive) {
                overlay.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        }
    }

    const copyBtn = e.target.closest("#copy-discord-link");
    if (copyBtn) {
        const input = document.getElementById("discord-invite-input");
        if (input) {
            input.select();
            document.execCommand("copy");
            const icon = copyBtn.querySelector("i");
            if (icon) {
                icon.className = "fa-solid fa-check";
                setTimeout(() => {
                    icon.className = "fa-solid fa-copy";
                }, 2000);
            }
        }
    }
    
    // Close on overlay click (Background Blur Gate)
    if (e.target.classList.contains("panel-overlay")) {
        closeAllAsidePanels();
    }
});

    // 2. Dropdown (More Button)
    if (dropdownMenu && dropdownMenu.classList.contains("active")) {
        if (!dropdownMenu.contains(e.target) && !moreBtn.contains(e.target)) {
            dropdownMenu.classList.remove("active");
            document.body.classList.remove("menu-active");
        }
    }

    // 3. Settings Popup (Global Button)
    if (settingsPopup && settingsPopup.classList.contains("active")) {
        if (!settingsPopup.contains(e.target) && !settingsBtn.contains(e.target)) {
            settingsPopup.classList.remove("active");
        }
    }

    // 4. Sidebar Settings Panel Gate (The Aside Panel)
    if (sidebarSettingsPanel && sidebarSettingsPanel.classList.contains("active")) {
        // Only close if clicking outside the panel AND not clicking a navigation item
        const isNavItem = e.target.closest(".settings-nav-item");
        const isOpener = e.target.closest("#sidebar-settings-opener");
        
        if (!sidebarSettingsPanel.contains(e.target) && !isNavItem && !isOpener) {
            closeAllAsidePanels();
        }
    }
});

// Navigation Engine
const setupNav = (id, url) => {
    const buttons = document.querySelectorAll(`[id='${id}']`);
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const isSubfolder = window.location.pathname.toLowerCase().match(/[\\\/](secret|signin|learning)[\\\/]/);
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
            
            // --- Secret Hub Gate ---
            if (url.includes("Secret") && !isLoggedIn) {
                window.location.href = isSubfolder ? "../signin/SIGN IN.html" : "signin/SIGN IN.html";
                return;
            }

            window.location.href = isSubfolder ? `../${url}` : url;
        });
    });
};

setupNav("home-btn", "web.html");
setupNav("mobile-home-btn", "web.html");
setupNav("showcases-btn", "showcases.html");
setupNav("dropdown-showcases-btn", "showcases.html");
setupNav("learning-btn", "Learning/index.html");
setupNav("dropdown-learning-btn", "Learning/index.html");
setupNav("ai-btn", "Secret/index.html");
setupNav("mobile-ai-btn", "Secret/index.html");
setupNav("secret-hub-button", "Secret/index.html");

// Global Event Delegation for Dynamic Settings Hub Controls
document.addEventListener('click', (e) => {
    // Identity Configuration Protocol (Formal Modal)
    const editNameBtn = e.target.closest('#edit-username-btn');
    if (editNameBtn) {
        const modal = document.getElementById('username-modal-overlay');
        const title = modal.querySelector('h2');
        const label = modal.querySelector('label');
        const input = document.getElementById('new-username-input');
        const saveBtn = document.getElementById('save-username-btn');
        
        if (modal && input) {
            title.textContent = "Profile Configuration";
            label.textContent = "Display Name";
            input.type = "text";
            input.placeholder = "Enter your authoritative name...";
            saveBtn.textContent = "Update Profile";
            
            const currentName = localStorage.getItem("userDisplayName") || "Guest User";
            input.value = currentName;
            modal.classList.add('active');
            document.body.style.overflow = "hidden";
        }
    }

    // Modal Close Triggers
    const closeModalBtn = e.target.closest('#close-username-modal');
    const cancelModalBtn = e.target.closest('#cancel-username-btn');
    const modalOverlay = e.target === document.getElementById('username-modal-overlay');
    
    if (closeModalBtn || cancelModalBtn || modalOverlay) {
        const modal = document.getElementById('username-modal-overlay');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = "";
        }
    }

    // Save Protocol (Handles both Name and Password)
    const saveBtn = e.target.closest('#save-username-btn');
    if (saveBtn) {
        const input = document.getElementById('new-username-input');
        const modal = document.getElementById('username-modal-overlay');
        const isPassword = input && input.type === "password";
        
        if (input && modal) {
            const val = input.value.trim();
            if (val !== "") {
                if (isPassword) {
                    showNotification("Security key updated successfully!", "success");
                } else {
                    localStorage.setItem("userDisplayName", val);
                    checkAuthStatus();
                    updateAccountInfo();
                    showNotification("Profile updated successfully!", "success");
                }
                modal.classList.remove('active');
                document.body.style.overflow = "";
            } else {
                showNotification(isPassword ? "Password cannot be empty." : "Name cannot be empty.", "info");
            }
        }
    }

    // Security Intelligence Protocols (Sessions & Logs)
    const sessionsBtn = e.target.closest('#view-sessions-btn');
    const logsBtn = e.target.closest('#view-logs-btn');
    const privacyPassBtn = e.target.closest('.privacy-action-btn.primary'); // Sync from Privacy Hub

    if (sessionsBtn || logsBtn || privacyPassBtn) {
        if (privacyPassBtn) {
            // Trigger Password Change instead if in Privacy Hub
            const changePswdBtn = document.getElementById('change-pswd-btn');
            if (changePswdBtn) changePswdBtn.click();
            return;
        }

        const modal = document.getElementById('security-logs-overlay');
        const title = document.getElementById('security-logs-title');
        const container = document.getElementById('security-logs-container');
        
        if (modal && container) {
            const isSessions = (sessionsBtn !== null);
            title.textContent = isSessions ? "Active Strategic Sessions" : "Login Intelligence Log";
            
            const data = isSessions ? [
                { icon: 'fa-laptop', time: 'Active Now', info: 'Chrome on Windows 11', loc: 'Current Session • IP: 192.168.1.1', type: 'success' },
                { icon: 'fa-mobile-screen', time: '2 hours ago', info: 'Safari on iPhone 15', loc: 'Mumbai, India • IP: 103.21.x.x', type: 'info' },
                { icon: 'fa-tablet-screen-button', time: 'Yesterday', info: 'Chrome on iPad Pro', loc: 'Delhi, India • IP: 112.55.x.x', type: 'info' }
            ] : [
                { icon: 'fa-check-circle', time: 'Today, 10:45 AM', info: 'Successful Portal Entry', loc: 'Chrome / Windows • IP: 192.168.1.1', type: 'success' },
                { icon: 'fa-triangle-exclamation', time: 'Yesterday, 9:20 PM', info: 'Unrecognized Device Warning', loc: 'Firefox / Linux • IP: 45.12.x.x', type: 'warning' },
                { icon: 'fa-xmark-circle', time: '2 days ago', info: 'Failed Login Attempt', loc: 'Unknown Browser • IP: 203.0.x.x', type: 'danger' }
            ];

            container.innerHTML = data.map(log => `
                <div class="log-item">
                    <div class="log-icon ${log.type}">
                        <i class="fa-solid ${log.icon}"></i>
                    </div>
                    <div class="log-details">
                        <span class="log-time">${log.time}</span>
                        <span class="log-info">${log.info}</span>
                        <span class="log-location">${log.loc}</span>
                    </div>
                </div>
            `).join('');

            modal.classList.add('active');
            document.body.style.overflow = "hidden";
        }
    }

    // Close Security Logs Modal
    const closeLogsIcon = e.target.closest('#close-security-modal');
    const closeLogsBtn = e.target.closest('#close-logs-btn');
    const logsOverlay = e.target === document.getElementById('security-logs-overlay');

    if (closeLogsIcon || closeLogsBtn || logsOverlay) {
        const modal = document.getElementById('security-logs-overlay');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = "";
        }
    }

    // Change Password Trigger
    const changePswdBtn = e.target.closest('#change-pswd-btn');
    if (changePswdBtn) {
        const modal = document.getElementById('username-modal-overlay');
        const title = modal.querySelector('h2');
        const label = modal.querySelector('label');
        const input = document.getElementById('new-username-input');
        const saveBtn = document.getElementById('save-username-btn');
        
        if (modal) {
            title.textContent = "Security Credential Update";
            label.textContent = "New Authority Password";
            input.type = "password";
            input.placeholder = "Enter new secure key...";
            input.value = "";
            saveBtn.textContent = "Update Key";
            
            modal.classList.add('active');
            document.body.style.overflow = "hidden";
        }
    }

    // --- Appearance Hub: Theme Toggling ---
    const lightThemeBtn = e.target.closest('#set-theme-light');
    const darkThemeBtn = e.target.closest('#set-theme-dark');
    
    if (lightThemeBtn) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        showNotification("Light Theme Protocol Activated", "success");
    }
    if (darkThemeBtn) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        showNotification("Dark Theme Protocol Activated", "success");
    }



    // Authoritative ID Card Export Protocol

});

// Authoritative File Upload Handler for World-Class Avatars
document.addEventListener('change', (e) => {
    if (e.target.id === 'avatar-upload-input') {
        const file = e.target.files[0];
        if (file) {
            // High-Fidelity Validation Protocol
            if (!file.type.startsWith('image/')) {
                showNotification("Invalid file type. Please select an image.", "info");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Image = event.target.result;
                localStorage.setItem("userPhotoURL", base64Image);
                checkAuthStatus();
                updateAccountInfo(); // Instant focal refresh
                showNotification("Profile picture updated from device!", "success");
            };
            reader.readAsDataURL(file);
        }
    }
});

function showNotification(msg, type = 'info') {
    const notifyHub = document.getElementById('notification-hub') || createNotificationHub();
    const notification = document.createElement('div');
    notification.className = `dg-notification ${type}`;
    notification.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${msg}</span>
    `;
    notifyHub.appendChild(notification);
    
    // Entrance protocol
    setTimeout(() => notification.classList.add('active'), 10);
    
    // Retirement protocol
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

function createNotificationHub() {
    const hub = document.createElement('div');
    hub.id = 'notification-hub';
    hub.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 15px;
        pointer-events: none;
    `;
    document.body.appendChild(hub);
    return hub;
}

// Social Media Popup Logic
const socialBtn = document.getElementById("social-btn");
const socialPopup = document.getElementById("social-popup");
if (socialBtn && socialPopup) {
    socialBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        socialPopup.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!socialBtn.contains(e.target) && !socialPopup.contains(e.target)) {
            socialPopup.classList.remove("active");
        }
    });
}

// Auth Status Engine
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const accPart = document.getElementById("user-profile") || document.querySelector(".acc-part");
    const signinBtnArr = document.querySelectorAll(".signinbtn");

    // Only show sign-in/profile on home page
    const isHomePage = window.location.pathname.endsWith('web.html') || window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    const isSecretPage = window.location.pathname.includes('/Secret/');
    
    if (!isHomePage && !isSecretPage) {
        if (accPart) accPart.style.display = "none";
        signinBtnArr.forEach(btn => btn.style.display = "none");
        return;
    }

    if (isLoggedIn === "true") {
        const name = localStorage.getItem("userDisplayName") || "Guest";
        const email = localStorage.getItem("userEmail") || "";
        const photoURL = localStorage.getItem("userPhotoURL"); // Reserved for world-class image arrival
        
        const userNavName = document.getElementById("user-nav-name");
        const mainAvatar = document.getElementById("user-avatar") || document.getElementById("menu-avatar");
        const popupAvatar = document.getElementById("popup-avatar-preview");
        const popName = document.getElementById("user-display-name") || document.getElementById("user-menu-name");
        const popEmail = document.getElementById("user-display-email");

        // Dynamic Identity Hub: Initial-Gate fallback
        const userInitial = name.charAt(0).toUpperCase();

        if (userNavName) userNavName.textContent = name;
        if (popName) popName.textContent = name;
        if (popEmail) popEmail.textContent = email;

        if (mainAvatar) {
            if (photoURL && photoURL !== "null") {
                mainAvatar.innerHTML = `<img src="${photoURL}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            } else {
                mainAvatar.textContent = userInitial;
            }
        }

        if (popupAvatar) {
            if (photoURL && photoURL !== "null") {
                popupAvatar.innerHTML = `<img src="${photoURL}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            } else {
                popupAvatar.textContent = userInitial;
            }
        }

        if (accPart) accPart.style.display = "flex";
        signinBtnArr.forEach(btn => btn.style.display = "none");
    } else {
        if (accPart) accPart.style.display = "none";
        signinBtnArr.forEach(btn => btn.style.display = "block");
    }
}

checkAuthStatus();

const sgninBtn = document.getElementById("sgninbtn");
if (sgninBtn) {
    sgninBtn.addEventListener("click", () => {
        const isSubfolder = window.location.pathname.toLowerCase().match(/[\\\/](secret|signin|learning)[\\\/]/);
        window.location.href = isSubfolder ? "../signin/SIGN IN.html" : "signin/SIGN IN.html";
    });
}

const userAvatar = document.getElementById("user-avatar");
const profilePopup = document.getElementById("profile-popup");
if (userAvatar && profilePopup) {
    userAvatar.addEventListener("click", (e) => {
        e.stopPropagation();
        profilePopup.classList.toggle("active");
    });
}

const signoutLink = document.getElementById("signout-link");
if (signoutLink) {
    signoutLink.addEventListener("click", () => {
        const isSubfolder = window.location.pathname.toLowerCase().match(/[\\\/](secret|signin|learning)[\\\/]/);
        window.location.href = isSubfolder ? "../signin/SIGN IN.html?logout=true" : "signin/SIGN IN.html?logout=true";
    });
}

const editAccountLink = document.getElementById("edit-account-link");
if (editAccountLink) {
    editAccountLink.addEventListener("click", () => {
        if (profilePopup) profilePopup.classList.remove("active");
        if (sidebarSettingsPanel) {
            sidebarSettingsPanel.classList.add("active");
            const overlay = document.getElementById("settings-panel-overlay");
            if (overlay) overlay.classList.add("active");
            document.body.style.overflow = "hidden";
            if (sidebarSettingsBtn) sidebarSettingsBtn.classList.add("active-prussian");
            loadSettingsPortal("account-hub");
        }
    });
}

// FAQ Accordion Functionality
document.addEventListener("DOMContentLoaded", () => {
    const faqQuestions = document.querySelectorAll(".faq-question");
    
    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains("active");
            
            // Close all FAQ items
            document.querySelectorAll(".faq-item").forEach(item => {
                item.classList.remove("active");
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add("active");
            }
        });
    });
});

// Help Modal Functionality - Modified for Authentication Check
// Help Modal Functionality - Synchronized with Aside Panel Hub
const helpBtn = document.getElementById("help-btn");
const helpOverlay = document.getElementById("help-overlay");
const closeHelpModal = document.getElementById("close-help-modal");


// Join Us Button - Open Contact Modal
const joinUsBtn = document.getElementById("join-us-btn");
if (joinUsBtn) {
    joinUsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Close settings popup
        if (settingsPopup) {
            settingsPopup.classList.remove("active");
            if (themeSubmenu) themeSubmenu.classList.remove("active");
            if (themeTrigger) themeTrigger.classList.remove("open");
        }
        
        // Open contact modal by clicking the hidden or sidebar contact button
        const targetBtn = document.getElementById("contact-btn");
        if (targetBtn) {
            targetBtn.click();
        }
    });
}



// Modal Close Button Logic
document.addEventListener("click", (e) => {
    if (e.target.id === "close-contact-modal" || e.target.id === "close-about-modal" || e.target.id === "close-help-modal" || e.target.id === "close-community-modal") {
        closeAllAsidePanels();
    }
});
