# Sharik (شارك) - Product Requirements Document (PRD)

## 📌 1. Project Overview & Vision
**Sharik (شارك)** is an interactive, peer-to-peer skill-exchange platform designed to facilitate mutually beneficial learning. The platform matches users based on complementary skills—meaning User A wants to learn what User B can teach, and vice-versa. 

The core vision is to democratize education by replacing monetary transactions with a barter system for knowledge. It targets students, self-taught developers, and lifelong learners.

---

## 🎯 2. Core Objectives
1. **Skill Matching:** Algorithmically pair users whose learning and teaching skills complement each other perfectly.
2. **Real-time Collaboration:** Provide a robust, real-time virtual classroom environment equipped with a chat, whiteboard, code editor, and WebRTC audio/video calls.
3. **Trust & Quality:** Implement skill-verification tests and a user rating/review system to guarantee the quality of interactions.
4. **Gamification:** Motivate users through a points, levels, and badges system.
5. **Safety & Moderation:** Maintain a safe environment through strict user reporting and admin moderation tools.

---

## 🛠 3. Technical Stack
* **Frontend:**
  * Vanilla HTML5, CSS3 (Custom UI System, Dark/Light modes)
  * Vanilla JavaScript (ES6+)
  * WebRTC (Peer-to-Peer Video/Voice/Screen Share)
  * Socket.IO Client (Real-time events)
  * Monaco Editor (Browser-based code editor)
* **Backend:**
  * Node.js / Express.js
  * MongoDB (Mongoose ORM)
  * Socket.IO (Real-time signaling & messaging)
  * JSON Web Tokens (JWT) for Authentication
* **Infrastructure / Hosting:**
  * Backend: Railway
  * Frontend: Firebase Hosting / Vercel
  * Storage: AWS S3 (for image/media uploads)

---

## 👥 4. User Personas

### 1. The Learner (طالب العلم)
* **Goal:** Wants to learn a specific skill (e.g., React.js) without paying for expensive courses.
* **Offering:** Has a strong grasp of another skill (e.g., UI/UX Design) to offer in return.
* **Pain Point:** Struggles to find mentors willing to teach for free.

### 2. The Expert/Teacher (الخبير)
* **Goal:** Wants to build their portfolio, gain teaching experience, and learn new secondary skills.
* **Pain Point:** Traditional freelancing is too competitive; prefers equal exchange of value.

### 3. The Administrator (المشرف)
* **Goal:** Ensure platform safety, review reported users, ban toxic members, and monitor platform health metrics.

---

## 🚀 5. Key Features & Workflows

### 5.1. Authentication & Profiling
* **Sign Up / Login:** Secure authentication using bcrypt hashing and JWT.
* **Skill Selection:** Users select what they *know* (Teach) and what they want to *learn* (Learn).
* **Skill Verification:** Users can take standardized tests (e.g., multiple choice) to get a "Verified" badge (✓) next to their skills, boosting their rank in the matching algorithm.
* **Public Profiles:** Displays user avatar, bio, gamification stats, verified skills, and past reviews.

### 5.2. Smart Matching Algorithm
* **Logic:** Finds users where `User A's Learn Skills ∩ User B's Teach Skills` AND `User A's Teach Skills ∩ User B's Learn Skills`.
* **Scoring:** Calculates a percentage match score based on the number of overlapping skills and Verification status.
* **Match Requests (Inbox System):** Users send a "Match Request" to a potential partner. The partner receives a notification and can **Accept** or **Reject**. If accepted, a chat room is created.

### 5.3. Real-Time Collaboration (The Virtual Classroom)
Once matched, users enter a dedicated Chat Workspace with the following tools:
* **Real-time Chat:** Text messaging with file attachments (Images, Docs, Voice Notes via AWS S3).
* **Interactive Whiteboard:** Includes drawing tools, text, shapes, laser pointer, undo/redo, and the ability to upload images to the board. 
* **Role Management (Teacher/Learner):** One user requests control (Teacher Mode) to lock the board, ensuring the learner only watches until permission is granted.
* **Live Code Editor:** Monaco-based editor supporting 20+ languages with real-time cursor tracking and typing indicators.
* **A/V Communication:** WebRTC-powered Voice Calls, Video Calls, and Screen Sharing.

### 5.4. Gamification & Reviews
* **Points System:** Users earn points for verifying skills, completing lessons, and receiving positive reviews.
* **Levels:** Ranks like "New Member", "Active Learner", "Expert Teacher", and "Sharik Legend".
* **Reviews:** Post-session, users can rate their partner (1-5 stars) and write a review that appears on the partner's public profile.

### 5.5. Admin Dashboard & Moderation
* **Overview:** Dashboard displaying system metrics (Total Users, Active Sessions).
* **User Management:** Admins can view all users and ban toxic accounts.
* **Report System:** Users can report others from within the chat for inappropriate behavior. Admins review these reports and take action.

---

## 🗄 6. Database Schema (MongoDB / Mongoose)

1. **User Module (`User.js`)**
   * Fields: `email`, `password`, `learnSkills`, `teachSkills`, `verifiedSkills`, `avatar`, `bio`, `role` (user/admin), `status` (active/banned), `gamifyPoints`, `gamifyLevel`, `reviews`, `notifications`.
2. **Match Module (`Match.js`)**
   * Fields: `userA`, `userB`, `initiator`, `status` (pending/accepted/rejected), `chatId`.
3. **Message Module (`Message.js`)**
   * Fields: `chatId`, `messageId`, `sender`, `receiver`, `text`, `attachments`.
4. **Report Module (`Report.js`)**
   * Fields: `reporterEmail`, `reportedEmail`, `reason`, `chatId`, `status`.
5. **Whiteboard & CodeEditor States (`WhiteboardState.js`, `CodeEditorState.js`)**
   * Stores the real-time state array to allow users to reconnect and resume where they left off without losing data.

---

## 🗓 7. Future Roadmap
* **V2 (Mobile App):** Building a native application using React Native or Flutter.
* **Group Sessions:** Allowing one expert to teach multiple learners simultaneously.
* **AI Integration:** Using LLMs to analyze code editor content and provide hints to the learner automatically.
* **Calendar Integration:** A built-in scheduler that syncs with Google Calendar for setting up lesson times.

---

## 🔒 8. Security & Privacy
* **Rate Limiting & Anti-Spam:** Limits on file uploads and message frequency.
* **Data Sanitization:** Strict escaping of all inputs (HTML/JS) in the chat and profile bio to prevent XSS.
* **Socket Security:** All socket events are gated behind JWT verification (`authMiddleware` passed to socket handshake).

---
*Document Version: 1.1*  
*Last Updated: May 2026*
