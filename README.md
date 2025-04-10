<div class="hero-icon" align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
</div>

<h1 align="center">
sweet-surprise-reminders
</h1>
<h4 align="center">A simple, personal web app to create and manage sweet reminders, helping you make your girlfriend's day special, every day.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<div class="badges" align="center">
  <img src="https://img.shields.io/badge/Framework-React%20(Vite)-blue" alt="React via Vite">
  <img src="https://img.shields.io/badge/UI%20Library-Chakra%20UI-teal" alt="Chakra UI">
  <img src="https://img.shields.io/badge/Backend-Firebase%20(BaaS)-orange" alt="Firebase BaaS">
  <img src="https://img.shields.io/badge/Language-JavaScript-yellow" alt="JavaScript">
</div>
<div class="badges" align="center">
  <img src="https://img.shields.io/github/last-commit/coslynx/giftify-sweet-reminders?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/coslynx/giftify-sweet-reminders?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/coslynx/giftify-sweet-reminders?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 License
- 👏 Authors

## 📍 Overview
`sweet-surprise-reminders` is a focused Minimum Viable Product (MVP) designed as a personal, private web application. It allows a single user (e.g., a boyfriend) to create, manage, and view reminders intended to help them plan thoughtful gestures for their partner. Built with React, Chakra UI, and Firebase (Authentication & Firestore), it prioritizes simplicity, privacy, and ease of use for managing relationship-focused prompts.

## 📦 Features
|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| 🔑 | **Authentication** | Secure user login via Firebase Authentication (Email/Password). Ensures reminders are private to the registered user. |
| ⚙️ | **Architecture**   | Frontend-focused Single Page Application (SPA) using React with Vite. Leverages Firebase BaaS (Backend-as-a-Service) for auth and database. Follows component-based structure. |
| 📄 | **Documentation**  | Includes this README providing an overview, setup guide, usage instructions, and technical details. Code includes JSDoc comments. |
| 🔗 | **Dependencies**   | Key dependencies include `react`, `react-router-dom`, `@chakra-ui/react`, and `firebase`. Managed via `npm`. |
| ✨ | **UI/UX**          | Clean, responsive interface built with Chakra UI. Focuses on intuitive reminder management (CRUD operations via modals/forms). Includes loading states and feedback toasts. |
| 💾 | **Data Persistence**| Reminders (text, date) are securely stored per user in Firebase Firestore. Service layer abstracts Firestore interactions. |
| 🧩 | **Modularity**     | Code is organized into components, pages, services, and contexts for better maintainability and separation of concerns. |
| ⚡️  | **Performance**    | Vite provides fast development server and optimized production builds. React's virtual DOM ensures efficient UI updates. Firebase interactions are asynchronous. |
| 🔐 | **Security**       | Relies on Firebase Authentication for secure login and Firestore Security Rules (required setup) to ensure data privacy per user. Sensitive keys managed via `.env`. |
| 🔀 | **Version Control**| Utilizes Git for version control, hosted on GitHub. |
| 🔌 | **Integrations**   | Direct integration with Firebase SDK for Authentication and Firestore database operations. |
| 🚀 | **Deployment**     | Designed for easy deployment using Firebase Hosting. |

## 📂 Structure
```text
{
  "package.json": "...",
  ".env": "...",
  "vite.config.js": "...",
  "src": {
    "main.jsx": "...",
    "config": {
      "firebase.js": "...",
      "chakraTheme.js": "..."
    },
    "contexts": {
      "AuthContext.jsx": "..."
    },
    "services": {
      "authService.js": "...",
      "reminderService.js": "..."
    },
    "components": {
      "Navbar.jsx": "...",
      "LoadingSpinner.jsx": "...",
      "ReminderList.jsx": "...",
      "ReminderItem.jsx": "...",
      "ReminderForm.jsx": "..."
    },
    "pages": {
      "LoginPage.jsx": "...",
      "DashboardPage.jsx": "..."
    },
    "utils": {
      "helpers.js": "..."
    },
    "styles": {
      "global.css": "..."
    },
    "App.jsx": "..."
  },
  "startup.sh": "...",
  "commands.json": "...",
  "public": {
    "index.html": "...",
    "favicon.ico": "..."
  },
  "README.md": "...",
  ".gitignore": "..."
}
```
> [!NOTE]
> The full file content is omitted here for brevity. Refer to the project files for complete code.

## 💻 Installation
  > [!WARNING]
  > ### 🔧 Prerequisites
  > - **Node.js**: Version 18 or higher recommended.
  > - **npm**: Version 8 or higher (usually included with Node.js).
  > - **Firebase Project**: You need a Firebase project set up.
  >   - Enable **Authentication** (Email/Password provider).
  >   - Enable **Firestore Database**. Create it in **Production mode** (this sets up stricter default security rules).

  ### 🚀 Setup Instructions
  1.  **Clone the repository**:
      ```bash
      git clone https://github.com/coslynx/giftify-sweet-reminders.git
      cd giftify-sweet-reminders
      ```
  2.  **Install dependencies**:
      ```bash
      npm install
      ```
  3.  **Configure environment variables**:
      *   Create a `.env` file in the project root. You can copy the structure from `.env` if an example exists, or create it manually.
          ```bash
          # Example: If .env.example exists
          # cp .env.example .env
          # Otherwise, create .env manually
          touch .env
          ```
      *   Add your Firebase project configuration details to the `.env` file. Replace the placeholders:
          ```dotenv
          # .env
          VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
          VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN_HERE
          VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_HERE
          VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET_HERE
          VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID_HERE
          VITE_FIREBASE_APP_ID=YOUR_APP_ID_HERE
          ```
          > [!TIP]
          > You can find these values in your Firebase project settings: Project settings > General > Your apps > Web app > SDK setup and configuration > Config.

  4.  **Set up Firestore Security Rules**:
      *   Navigate to your Firebase project console -> Firestore Database -> Rules.
      *   Paste the following **basic** rules to allow authenticated users to read/write their own reminders. **Review and adapt these rules based on your security needs.**
          ```firestore-rules
          rules_version = '2';
          service cloud.firestore {
            match /databases/{database}/documents {
              // Allow reads and writes only by the authenticated user who owns the data
              match /users/{userId}/reminders/{reminderId} {
                allow read, write: if request.auth != null && request.auth.uid == userId;
              }
              // Deny reads/writes to the 'users' collection itself
              match /users/{userId} {
                allow read, write: if false;
              }
            }
          }
          ```
      *   Click **Publish**.

## 🏗️ Usage
### 🏃‍♂️ Running the MVP
1.  **Start the development server**:
    ```bash
    npm run dev
    ```
    This command starts the Vite development server, typically accessible at `http://localhost:5173` (the port might vary).

2.  **Access the application**:
    *   Open your web browser and navigate to the URL provided by Vite (e.g., `http://localhost:5173`).
    *   You will be redirected to the Login page.
    > [!NOTE]
    > Since Firebase Authentication doesn't have a default user creation UI, you'll need to either:
    > a) Manually create a test user in the Firebase Console (Authentication -> Users -> Add user).
    > b) Temporarily modify the app to include a registration feature (outside the current MVP scope).

3.  **Use the App**:
    *   Log in with the credentials of the user you created in Firebase.
    *   You'll be taken to the Dashboard.
    *   Use the "Add Reminder" button to create new reminders (text and date).
    *   Click the edit or delete icons on existing reminders to manage them.

> [!TIP]
> ### ⚙️ Configuration
> - All Firebase connectivity settings are configured via the `.env` file in the project root. Ensure the `VITE_FIREBASE_*` variables are correct.
> - UI theme customizations (colors, fonts) can be adjusted in `src/config/chakraTheme.js`.
> - Firestore Security Rules in the Firebase Console control data access permissions.

### 📚 Examples
The primary usage involves interacting with the UI:

1.  **Login**: Enter your Firebase user credentials on the Login page.
2.  **View Dashboard**: See a list of upcoming reminders sorted by date.
3.  **Add Reminder**: Click "Add Reminder", fill in the text and select a date in the modal form, then click "Save Reminder".
4.  **Edit Reminder**: Click the edit icon on a reminder, modify the text or date in the modal, and click "Save Reminder".
5.  **Delete Reminder**: Click the delete icon on a reminder.
6.  **Logout**: Click the "Logout" button in the navigation bar.

## 🌐 Hosting
### 🚀 Deployment Instructions
This application is well-suited for deployment using **Firebase Hosting**.

#### Deploying to Firebase Hosting
1.  **Install Firebase CLI**: If you haven't already, install the Firebase CLI globally:
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login to Firebase**:
    ```bash
    firebase login
    ```
3.  **Initialize Firebase in your project**: (If you haven't already)
    ```bash
    firebase init
    ```
    *   Select **Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys**.
    *   Choose **Use an existing project** and select your Firebase project.
    *   For the public directory, enter **`dist`**. (Vite builds the production assets into the `dist` folder by default).
    *   Configure as a **single-page app (rewrite all urls to /index.html)**: Answer **Yes**.
    *   Set up automatic builds and deploys with GitHub?: Choose **No** for manual deployment (or Yes if you want to configure CI/CD).

4.  **Build the application for production**:
    ```bash
    npm run build
    ```
    This command creates the optimized production build in the `dist` folder.

5.  **Deploy to Firebase Hosting**:
    ```bash
    firebase deploy --only hosting
    ```
    After deployment, the Firebase CLI will provide you with the URL where your app is live.

### 🔑 Environment Variables
Firebase Hosting automatically handles serving the static files built by Vite. The `VITE_FIREBASE_*` environment variables defined in your `.env` file are **embedded into the JavaScript bundle during the `npm run build` process**.

Ensure your `.env` file contains the correct production Firebase project credentials **before** running `npm run build` for deployment.

**Required Variables for Build:**
*   `VITE_FIREBASE_API_KEY`
*   `VITE_FIREBASE_AUTH_DOMAIN`
*   `VITE_FIREBASE_PROJECT_ID`
*   `VITE_FIREBASE_STORAGE_BUCKET`
*   `VITE_FIREBASE_MESSAGING_SENDER_ID`
*   `VITE_FIREBASE_APP_ID`

## 📜 API Documentation
This MVP is primarily a frontend application that interacts directly with Firebase services (Authentication and Firestore) using the Firebase JavaScript SDK. There are **no custom backend API endpoints** exposed by this application itself.

### 🔍 Endpoints
N/A - All data operations are performed via the Firebase SDK within the frontend code (`src/services/reminderService.js`) targeting Firestore.

### 🔒 Authentication
Authentication is handled by Firebase Authentication:
1.  Users log in via the UI using Email and Password.
2.  The `AuthContext` manages the user's authentication state using `onAuthStateChanged`.
3.  The `currentUser.uid` is used by the `reminderService.js` to scope Firestore database operations (create, read, update, delete) to the logged-in user's data.
4.  Access control is enforced by **Firestore Security Rules** configured in the Firebase Console.

### 📝 Examples
N/A - No direct API calls. See the `src/services/reminderService.js` file for examples of how the application interacts with Firestore using the Firebase SDK.

> [!NOTE]
> ## 📜 License & Attribution
>
> ### 📄 License
> This Minimum Viable Product (MVP) is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.
>
> ### 🤖 AI-Generated MVP
> This MVP was entirely generated using artificial intelligence through [CosLynx.com](https://coslynx.com).
>
> No human was directly involved in the coding process of the repository: giftify-sweet-reminders
>
> ### 📞 Contact
> For any questions or concerns regarding this AI-generated MVP, please contact CosLynx at:
> - Website: [CosLynx.com](https://coslynx.com)
> - Twitter: [@CosLynxAI](https://x.com/CosLynxAI)

<p align="center">
  <h1 align="center">🌐 CosLynx.com</h1>
</p>
<p align="center">
  <em>Create Your Custom MVP in Minutes With CosLynxAI!</em>
</p>
<div class="badges" align="center">
<img src="https://img.shields.io/badge/Developers-Drix10,_Kais_Radwan-red" alt="">
<img src="https://img.shields.io/badge/Website-CosLynx.com-blue" alt="">
<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4,_v6-black" alt="">
</div>