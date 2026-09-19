/* chat-typing.js — مؤشر الكتابة وحالة اتصال الطرف الآخر في الدردشة
   يُحمَّل بعد chat.js. يعتمد على window.socket التي ينشئها chat.js.
   الأحداث: typing/stopTyping (إرسال) — userTyping/userStopTyping/peerDisconnected (استقبال). */
;(function () {
  "use strict";
  var lastTyping = 0, stopTimer = null, boundInput = null;
  var socketBound = false, boundSocket = null;

  function statusEl() { return document.getElementById("peerStatusTxt"); }
  function dotEl() { return document.getElementById("peerStatusDot"); }
  function myEmail() {
    try {
      var cu = window.currentUser || JSON.parse(localStorage.getItem("currentUser") || "{}");
      return cu.email || "";
    } catch (e) { return ""; }
  }
  function chatIdOf() { return window.chatId || (typeof chatId !== "undefined" ? chatId : ""); }

  // عرض "يكتب الآن..." في رأس الدردشة
  function showPeerTyping(on) {
    var el = statusEl(); if (!el) return;
    clearTimeout(showPeerTyping._t);
    if (on) {
      el.setAttribute("data-typing", "1");
      el.textContent = "يكتب الآن...";
      showPeerTyping._t = setTimeout(function () {
        el.removeAttribute("data-typing");
        el.textContent = "متصل الآن";
      }, 3000);
    } else {
      el.removeAttribute("data-typing");
      el.textContent = "متصل الآن";
    }
  }

  // تحديث حالة الاتصال (متصل/غير متصل)
  function setPeerOnlineStatus(on) {
    var el = statusEl(), dot = dotEl();
    if (el && !el.getAttribute("data-typing")) el.textContent = on ? "متصل الآن" : "غير متصل الآن";
    if (dot) dot.style.background = on ? "" : "#9ca3af";
  }

  window.showPeerTyping = showPeerTyping;
  window.setPeerOnlineStatus = setPeerOnlineStatus;

  // إرسال typing/stopTyping أثناء الكتابة (بحد أقصى مرة كل 1.8 ثانية)
  function bindInput() {
    var inp = document.getElementById("messageInput");
    if (!inp || inp === boundInput) return false;
    boundInput = inp;
    inp.addEventListener("input", function () {
      var socket = window.socket;
      var chatId = chatIdOf();
      if (!socket || !chatId) return;
      var now = Date.now();
      if (now - lastTyping > 1800) {
        lastTyping = now;
        socket.emit("typing", { chatId: chatId, email: myEmail() });
      }
      clearTimeout(stopTimer);
      stopTimer = setTimeout(function () {
        if (window.socket) window.socket.emit("stopTyping", { chatId: chatIdOf(), email: myEmail() });
        lastTyping = 0;
      }, 2200);
    });
    return true;
  }

  // ربط مستمعات الأحداث الواردة على الـ socket عند جاهزيته
  function bindSocket() {
    var socket = window.socket;
    if (!socket || socketBound && socket === boundSocket) return !!socket;
    if (socket !== boundSocket) {
      socketBound = false;
      boundSocket = socket;
    }
    if (socketBound) return true;
    socketBound = true;
    socket.on("userTyping", function (e) {
      if (e && e.email && myEmail() && e.email !== myEmail()) setPeerOnlineStatus(true);
      showPeerTyping(true);
    });
    socket.on("userStopTyping", function () { showPeerTyping(false); });
    socket.on("peerDisconnected", function () {
      clearTimeout(showPeerTyping._t);
      var el = statusEl();
      if (el) el.removeAttribute("data-typing");
      setPeerOnlineStatus(false);
    });
    socket.on("newMessage", function (e) {
      if (e && e.sender && e.sender !== myEmail()) { setPeerOnlineStatus(true); showPeerTyping(false); }
    });
    socket.on("connect", function () { setPeerOnlineStatus(true); });
    return true;
  }

  function tick() {
    var done = true;
    if (!bindInput()) done = false;
    if (!bindSocket()) done = false;
    if (!done) setTimeout(tick, 300);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tick);
  } else {
    tick();
  }
})();
