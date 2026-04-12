# NexAuth - Premium Sign-In UI & Backend

A state-of-the-art authentication system with a stunning glassmorphism design and integrated Firebase backend.

## ✨ Features
- **Stunning UI**: Modern glassmorphism design with animated background blobs.
- **Robust Auth**: Full Sign-In, Sign-Up, and Password Reset functionality via Firebase.
- **Real-time Sync**: Automatically saves user data (like last login time) to Firestore.
- **Fluid Transitions**: Smooth animations between login modes and dashboard.
- **Toast Notifications**: Interactive feedback for every user action.
- **Node.js Ready**: Includes a simple Express server to host the application.

## 🚀 Getting Started

### 1. Configure Firebase (Mandatory)
The application is pre-integrated with Firebase, but you need to add your own credentials:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a project and add a **Web App**.
3. Copy the `firebaseConfig` object.
4. Open `app.js` and paste it into the `firebaseConfig` variable (around line 6).

### 2. Enable Firebase Services
Make sure the following services are enabled in your Firebase Console:
- **Authentication**: Enable "Email/Password" sign-in provider.
- **Firestore Database**: Create a database in "Start in test mode" (or set your rules) and create a collection named `USER`.

### 3. Run Locally
You can open `SIGN IN.html` directly in your browser, or use the provided Node.js server:
```bash
# Install dependencies
npm install

# Start the server
npm start
```
The application will be available at `http://localhost:3000`.

## 📂 File Structure
- `SIGN IN.html`: The main entry point with semantic HTML5.
- `style.css`: Premium design system and animations.
- `app.js`: Core logic for authentication and database sync.
- `server.js`: Optional Node.js server for hosting.
- `package.json`: Dependency and script management.

---
Built with ❤️ by Antigravity.