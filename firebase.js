// استيراد الحاجات اللي محتاجها من Firebase
import { initializeApp } from "firebase/app";
// لو عايز تضيف خدمات تانية من Firebase شوف الدوكس
// https://firebase.google.com/docs/web/setup#available-libraries

// إعدادات Firebase بتاعة المشروع
const firebaseConfig = {
  apiKey: "AIzaSyAEFqwC5hUu0FIh5POlxGLjyrVcAtcdlac",
  authDomain: "sharij-532a3.firebaseapp.com",
  projectId: "sharij-532a3",
  storageBucket: "sharij-532a3.firebasestorage.app",
  messagingSenderId: "967146029245",
  appId: "1:967146029245:web:d16822073dee19eb7877d4"
};

// تشغيل Firebase
const app = initializeApp(firebaseConfig);