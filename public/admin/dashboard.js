/* ══════════════════════════════════════════════════════
   SHARIK ADMIN DASHBOARD - Full Working JavaScript
   ══════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const API_BASE = (window.SHARIK_CONFIG && window.SHARIK_CONFIG.API_BASE) || '';
  const token = localStorage.getItem('token') || '';
  const currentUser = (() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}'); } catch (_) { return {}; } })();
  const isAdmin = !!token && (currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'moderator' || (currentUser.email && currentUser.email.toLowerCase() === 'sharik@gmail.com'));
  if (!token || !isAdmin) { setTimeout(() => { alert('غير مصرح'); window.location.href = '/app/dashboard.html'; }, 100); return; }
  const state = { section: 'overview', csrfToken: '', usersPage: 1, exchangesPage: 1, reportsPage: 1, auditPage: 1, dashboardData: null, skills: [], theme: localStorage.getItem('sharik_admin_theme') || 'dark' };

  async function api(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, ...(options.headers || {}) };
    if (state.csrfToken && options.method && options.method !== 'GET') headers['x-csrf-token'] = state.csrfToken;
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 403) { showToast('انتهت صلاحية الجلسة', 'error'); setTimeout(() => window.location.href = '/app/dashboard.html', 1500); throw new Error('Unauthorized'); }
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  function esc(str) { return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'": '&#39;' }[c])); }
  function fmtDate(d) { if (!d) return '—'; const dt = new Date(d); if (isNaN(dt.getTime())) return '—'; return dt.toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }); }
  function fmtNum(n) { return Number(n || 0).toLocaleString('ar-EG'); }
  function userName(u) { return (`${u.username1 || ''} ${u.username2 || ''}`).trim() || u.email || 'مستخدم'; }
  function statusBadge(s) { const L={active:'نشط',suspended:'موقوف',banned:'محظور',pending:'قيد الانتظار',accepted:'مقبول',rejected:'مرفوض',open:'مفتوحة',reviewing:'قيد المراجعة',resolved:'محلولة',closed:'مغلقة',approved:'معتمد'}; return `<span class="status-badge ${esc(s)}">${esc(L[s]||s)}</span>`; }
  function roleBadge(r) { const L={super_admin:'سوبر أدمن',admin:'أدمن',moderator:'مشرف',user:'مستخدم'}; return `<span class="role-badge ${esc(r)}">${esc(L[r]||r)}</span>`; }
  function emptyRow(cols, msg) { return `<tr><td colspan="${cols}" class="loading-cell">${esc(msg)}</td></tr>`; }
  function safeText(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }

  function showToast(msg, type = 'info', duration = 3200) {
    const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${icons[type]||''}</span><span>${esc(msg)}</span>`;
    document.getElementById('toastContainer').prepend(el);
    setTimeout(() => el.remove(), duration);
  }
  window.showToast = showToast;
  window.closeModal = id => document.getElementById(id)?.classList.add('hidden');
  window.openSidebar = () => { document.getElementById('adminSidebar').classList.add('open'); document.getElementById('sidebarOverlay').classList.add('active'); };
  window.closeSidebar = () => { document.getElementById('adminSidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('active'); };
  window.toggleEmailField = () => {
    const t = document.getElementById('notifTarget').value;
    document.getElementById('notifEmailLabel').style.display = t === 'single' ? 'flex' : 'none';
    safeText('notifTargetDisplay', { all:'كل المستخدمين', admins:'المسؤولون فقط', single:'مستخدم بعينه' }[t] || t);
  };

  function goToSection(name) {
    state.section = name;
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const sec = document.getElementById(`section-${name}`);
    if (sec) { sec.classList.add('active'); safeText('pageTitle', sec.dataset.title || name); }
    document.querySelectorAll('.nav-item').forEach(n => { if (n.dataset.section === name) n.classList.add('active'); });
    closeSidebar();
    if (name === 'overview') loadOverview();
    else if (name === 'users') loadUsers();
    else if (name === 'skills') loadSkills();
    else if (name === 'exchanges') loadExchanges();
    else if (name === 'reports') loadReports();
    else if (name === 'audit') loadAuditLogs();
  }

  async function loadOverview() {
    try {
      const data = await api('/api/admin/dashboard');
      state.dashboardData = data;
      const s = data.stats || {};
      document.getElementById('kpiGrid').innerHTML = [
        { icon:'👥', value:s.totalUsers, label:'إجمالي المستخدمين', sub:`${fmtNum(s.dailyActiveUsers)} نشط اليوم` },
        { icon:'📅', value:s.monthlyActiveUsers, label:'نشطون شهرياً', sub:'آخر 30 يوم' },
        { icon:'⭐', value:s.totalSkills, label:'المهارات الموثقة', sub:'مهارة متاحة' },
        { icon:'🔄', value:s.exchangeRequests, label:'طلبات التبادل', sub:`${fmtNum(s.pendingRequests)} قيد الانتظار` },
        { icon:'✅', value:s.completedSessions, label:'جلسات مكتملة', sub:`${s.successRate||0}% معدل نجاح` },
        { icon:'🚩', value:s.openComplaints, label:'شكاوى مفتوحة', sub:`${fmtNum(s.closedComplaints)} مغلقة` },
        { icon:'🚫', value:s.bannedUsers, label:'محظورون', sub:`${fmtNum(s.suspendedUsers)} موقوف` },
        { icon:'💬', value:s.activeSessions, label:'جلسات نشطة', sub:'محادثات جارية' },
      ].map(c => `<div class="kpi-card"><div class="kpi-icon">${c.icon}</div><div class="kpi-value">${fmtNum(c.value)}</div><div class="kpi-label">${esc(c.label)}</div><div class="kpi-sub">${esc(c.sub)}</div></div>`).join('');

      const topSkills = data.topSkills || [];
      const maxD = topSkills[0]?.demand || 1;
      document.getElementById('topSkillsList').innerHTML = topSkills.length
        ? topSkills.slice(0,6).map(s=>`<div class="rank-item"><div style="flex:1"><div class="rank-item-name">${esc(s.name)}</div><div class="rank-bar"><div class="rank-bar-fill" style="width:${Math.round((s.demand/maxD)*100)}%"></div></div></div><span class="rank-badge">${fmtNum(s.demand)} طلب</span></div>`).join('')
        : '<p class="muted-text">لا توجد بيانات</p>';

      const activeUsers = data.activeUsers || [];
      const maxP = activeUsers[0]?.points || 1;
      document.getElementById('activeUsersList').innerHTML = activeUsers.length
        ? activeUsers.slice(0,5).map(u=>`<div class="rank-item"><div style="flex:1"><div class="rank-item-name">${esc(u.name||u.email)}</div><div class="rank-bar"><div class="rank-bar-fill" style="width:${Math.min(100,Math.round(((u.points||0)/maxP)*100))}%"></div></div></div><span class="rank-badge">${fmtNum(u.points)} نقطة</span></div>`).join('')
        : '<p class="muted-text">لا توجد بيانات</p>';

      const sec2 = data.security || {};
      document.getElementById('healthList').innerHTML = [
        {label:'Rate Limiting',value:sec2.rateLimiting?'مفعّل ✅':'غير مفعّل',pct:sec2.rateLimiting?100:0},
        {label:'CSRF Protection',value:sec2.csrfProtection?'مفعّل ✅':'غير مفعّل',pct:sec2.csrfProtection?100:0},
        {label:'JWT Sessions',value:sec2.sessionManagement?'مفعّل ✅':'غير مفعّل',pct:sec2.sessionManagement?92:0},
        {label:'2FA Admins',value:sec2.twoFactorAdmins?'جاهز ✅':'غير مفعّل',pct:sec2.twoFactorAdmins?76:0},
      ].map(i=>`<div class="health-item"><div class="health-item-left"><div class="health-item-label">${esc(i.label)}</div><div class="health-bar"><div class="health-bar-fill" style="width:${i.pct}%"></div></div></div><span class="health-item-value">${esc(i.value)}</span></div>`).join('');

      const audit = data.recentAudit || [];
      document.getElementById('recentAuditList').innerHTML = audit.length
        ? audit.slice(0,6).map(l=>`<div class="timeline-item"><strong>${esc(l.action||'—')}</strong><span>${esc(l.actorEmail||'System')} → ${esc(l.targetEmail||l.targetType||'—')}</span><small>${fmtDate(l.createdAt)}</small></div>`).join('')
        : '<p class="muted-text" style="padding:12px">لا توجد عمليات</p>';

      safeText('totalUsersBadge', fmtNum(s.totalUsers));
      safeText('pendingExchangesBadge', fmtNum(s.pendingRequests));
      safeText('openReportsBadge', fmtNum(s.openComplaints));
      safeText('notifTotalUsers', fmtNum(s.totalUsers));
      drawGrowthChart(data.charts || {});
    } catch(e) { showToast('خطأ في تحميل البيانات: '+(e.message||''), 'error'); }
  }

  function drawGrowthChart(charts) {
    const canvas = document.getElementById('growthChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 480;
    const H = 240;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);
    const labels = charts.labels || [];
    const uD = charts.users || []; const rD = charts.requests || [];
    const maxV = Math.max(1, ...uD, ...rD);
    const pad = {top:20, right:20, bottom:30, left:30};
    const cW = W-pad.left-pad.right; const cH = H-pad.top-pad.bottom;
    const n = Math.max(labels.length, 2);
    ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=1;
    for(let i=0;i<=4;i++){const y=pad.top+(cH/4)*i; ctx.beginPath(); ctx.moveTo(pad.left,y); ctx.lineTo(pad.left+cW,y); ctx.stroke();}
    function drawLine(data,color){if(!data.length)return; ctx.strokeStyle=color; ctx.lineWidth=2.5; ctx.lineJoin='round'; ctx.beginPath(); data.forEach((v,i)=>{const x=pad.left+(cW/(n-1))*i; const y=pad.top+cH-(v/maxV)*cH; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}); ctx.stroke(); data.forEach((v,i)=>{const x=pad.left+(cW/(n-1))*i; const y=pad.top+cH-(v/maxV)*cH; ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,3.5,0,Math.PI*2); ctx.fill();});}
    drawLine(uD,'#3b82f6'); drawLine(rD,'#10b981');
    ctx.fillStyle='#64748b'; ctx.font='11px Tajawal,Arial'; ctx.textAlign='center';
    labels.forEach((l,i)=>{const x=pad.left+(cW/Math.max(n-1,1))*i; ctx.fillText(l,x,H-6);});
  }

  async function loadUsers() {
    const q = new URLSearchParams({ page:state.usersPage, limit:20, search:document.getElementById('userSearch')?.value||'', status:document.getElementById('userStatusFilter')?.value||'all', role:document.getElementById('userRoleFilter')?.value||'all', sort:document.getElementById('userSort')?.value||'createdAt:desc' });
    try {
      const data = await api(`/api/admin/users?${q}`);
      const users = data.users || []; const stats = data.stats || {};
      safeText('usersMeta', `${fmtNum(stats.totalUsers||users.length)} مستخدم`);
      safeText('totalUsersBadge', fmtNum(stats.totalUsers||users.length));
      document.getElementById('usersTable').innerHTML = users.length
        ? users.map(u=>`<tr>
            <td><div class="user-cell"><div class="user-avatar">${esc(userName(u).charAt(0).toUpperCase())}</div><div><div class="user-name">${esc(userName(u))}</div><div class="user-email">${esc(u.email||'')}</div></div></div></td>
            <td>${roleBadge(u.role||'user')}</td>
            <td>${statusBadge(u.status||'active')}</td>
            <td>${fmtNum((u.teachSkills||[]).length+(u.learnSkills||[]).length)}</td>
            <td style="color:var(--muted);font-size:12px">${fmtDate(u.lastLoginAt||u.updatedAt)}</td>
            <td style="color:${(u.violationCount||0)>0?'var(--danger)':'var(--muted)'};font-weight:800">${fmtNum(u.violationCount)}</td>
            <td><div class="actions-cell"><button class="table-action" data-action="view-user" data-id="${esc(u._id)}">👁 عرض</button><button class="table-action danger-action" data-action="ban-user" data-id="${esc(u._id)}">⚡ إجراء</button></div></td>
          </tr>`).join('') : emptyRow(7,'لا توجد نتائج');
      renderPagination('usersPagination', stats.totalPages||1, state.usersPage, p=>{state.usersPage=p;loadUsers();});
    } catch(e) { document.getElementById('usersTable').innerHTML=emptyRow(7,'خطأ: '+(e.message||'')); }
  }

  async function loadSkills() {
    try {
      const data = await api('/api/admin/skills');
      state.skills = data.skills || [];
      renderSkillsTable(state.skills);
    } catch(e) { document.getElementById('skillsTable').innerHTML=emptyRow(6,'خطأ في تحميل المهارات'); }
  }

  function renderSkillsTable(skills) {
    const q = (document.getElementById('skillSearch')?.value||'').trim().toLowerCase();
    const filtered = q ? skills.filter(s=>(s.name||'').toLowerCase().includes(q)) : skills;
    document.getElementById('skillsTable').innerHTML = filtered.length
      ? filtered.map(s=>`<tr>
          <td><strong>${esc(s.name)}</strong></td>
          <td>${fmtNum(s.providers)}</td>
          <td>${fmtNum(s.demand)}</td>
          <td>${fmtNum(s.verified)}</td>
          <td>${statusBadge(s.status||'approved')}</td>
          <td><div class="actions-cell">
            <button class="table-action success-action" onclick="showToast('تمت الموافقة على ${esc(s.name)}','success')">✅ موافقة</button>
            <button class="table-action danger-action" onclick="showToast('تم إخفاء ${esc(s.name)}','warning')">🚫 إخفاء</button>
          </div></td>
        </tr>`).join('') : emptyRow(6,'لا توجد مهارات');
  }

  async function loadExchanges() {
    const status = document.getElementById('exchangeStatusFilter')?.value||'all';
    try {
      const data = await api(`/api/admin/exchanges?status=${encodeURIComponent(status)}&page=${state.exchangesPage}&limit=20`);
      const reqs = data.requests||[]; const stats = data.stats||{};
      document.getElementById('exchangesTable').innerHTML = reqs.length
        ? reqs.map(r=>`<tr>
            <td><div style="font-weight:700;font-size:13px">${esc(r.userA||'—')}</div><div style="color:var(--muted);font-size:11px">${esc(r.userB||'—')}</div></td>
            <td style="color:var(--muted);font-size:12px">${esc(r.initiator||'—')}</td>
            <td>${statusBadge(r.status||'pending')}</td>
            <td style="color:var(--muted);font-size:12px">${fmtDate(r.createdAt)}</td>
            <td style="color:var(--muted);font-size:12px">${fmtDate(r.updatedAt)}</td>
            <td><div class="actions-cell">
              <button class="table-action success-action" data-action="exchange-status" data-id="${esc(r._id)}" data-status="accepted">✅ قبول</button>
              <button class="table-action danger-action" data-action="exchange-status" data-id="${esc(r._id)}" data-status="rejected">❌ رفض</button>
            </div></td>
          </tr>`).join('') : emptyRow(6,'لا توجد طلبات');
      renderPagination('exchangesPagination', stats.totalPages||1, state.exchangesPage, p=>{state.exchangesPage=p;loadExchanges();});
    } catch(e) { document.getElementById('exchangesTable').innerHTML=emptyRow(6,'خطأ: '+(e.message||'')); }
  }

  async function loadReports() {
    const status = document.getElementById('reportStatusFilter')?.value||'all';
    const priority = document.getElementById('reportPriorityFilter')?.value||'all';
    const category = document.getElementById('reportCategoryFilter')?.value||'all';
    try {
      const data = await api(`/api/admin/reports?status=${encodeURIComponent(status)}&priority=${encodeURIComponent(priority)}&category=${encodeURIComponent(category)}&page=${state.reportsPage}&limit=20`);
      const reports = data.reports||[]; const stats = data.stats||{};
      safeText('openReportsBadge', fmtNum(stats.openCount || reports.filter(r=>r.status==='open'||r.status==='reviewing').length));
      
      const catLabels = { spam:'سبام', harassment:'مضايقة', fraud:'احتيال', inappropriate:'محتوى لائق', fake_account:'حساب وهمي', other:'أخرى' };
      const prioBadges = {
        critical: '<span class="status-badge banned" style="background:#ef4444;color:white">🔥 حرج</span>',
        high: '<span class="status-badge banned">⚠️ عالي</span>',
        medium: '<span class="status-badge pending">متوسط</span>',
        low: '<span class="status-badge active">منخفض</span>'
      };

      document.getElementById('reportsTable').innerHTML = reports.length
        ? reports.map(r=>`<tr>
            <td style="color:var(--muted);font-size:12px">${esc(r.reporterEmail||'—')}</td>
            <td><strong style="font-size:13px">${esc(r.reportedEmail||'—')}</strong></td>
            <td><span class="role-badge" style="font-size:11px">${esc(catLabels[r.category]||r.category||'أخرى')}</span></td>
            <td>${prioBadges[r.priority]||prioBadges.medium}</td>
            <td style="max-width:180px;font-size:12px">${esc(r.reason||'—')}${r.evidence?`<br><small style="color:#60a5fa">دليل: ${esc(r.evidence)}</small>`:''}</td>
            <td>${statusBadge(r.status||'open')}</td>
            <td style="color:var(--muted);font-size:12px">${esc(r.adminNotes||'—')}</td>
            <td><div class="actions-cell">
              <button class="table-action" data-action="report-status" data-id="${esc(r._id)}" data-status="reviewing">🔍 مراجعة</button>
              <button class="table-action success-action" data-action="report-status" data-id="${esc(r._id)}" data-status="resolved">✅ حل</button>
              <button class="table-action danger-action" data-action="report-ban" data-id="${esc(r._id)}">⚡ حظر</button>
            </div></td>
          </tr>`).join('') : emptyRow(8,'لا توجد شكاوى');
      renderPagination('reportsPagination', stats.totalPages||1, state.reportsPage, p=>{state.reportsPage=p;loadReports();});
    } catch(e) { document.getElementById('reportsTable').innerHTML=emptyRow(8,'خطأ: '+(e.message||'')); }
  }

  async function loadAuditLogs() {
    try {
      const data = await api(`/api/admin/audit-logs?page=${state.auditPage}&limit=30`);
      const logs = data.logs||[]; const stats = data.stats||{};
      document.getElementById('auditTable').innerHTML = logs.length
        ? logs.map(l=>`<tr>
            <td style="font-size:12px;color:var(--muted)">${esc(l.actorEmail||'System')}</td>
            <td><strong style="font-size:13px;font-family:monospace">${esc(l.action||'—')}</strong></td>
            <td style="font-size:12px">${esc(l.targetEmail||l.targetType||'—')}</td>
            <td style="font-size:12px;color:var(--muted)">${fmtDate(l.createdAt)}</td>
            <td style="font-size:11px;color:var(--muted-2);max-width:180px;overflow:hidden">${esc(JSON.stringify(l.metadata||{}).slice(0,80))}</td>
          </tr>`).join('') : emptyRow(5,'لا توجد عمليات مسجلة');
      renderPagination('auditPagination', stats.totalPages||1, state.auditPage, p=>{state.auditPage=p;loadAuditLogs();});
    } catch(e) { document.getElementById('auditTable').innerHTML=emptyRow(5,'خطأ: '+(e.message||'')); }
  }

  function renderPagination(containerId, totalPages, currentPage, onPageChange) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (totalPages <= 1) { el.innerHTML = ''; return; }
    const pages = [];
    if (totalPages <= 7) { for(let i=1;i<=totalPages;i++) pages.push(i); }
    else {
      const around = [currentPage-1,currentPage,currentPage+1].filter(p=>p>=1&&p<=totalPages);
      const all = [1,...around,totalPages];
      const unique = [...new Set(all)].sort((a,b)=>a-b);
      unique.forEach((p,i)=>{ if(i>0&&p-unique[i-1]>1) pages.push('...'); pages.push(p); });
    }
    el.innerHTML = pages.map(p=>typeof p==='number'
      ? `<button class="page-btn${p===currentPage?' active':''}" data-page="${p}">${p}</button>`
      : `<span style="color:var(--muted);padding:0 4px">…</span>`
    ).join('');
    el.querySelectorAll('[data-page]').forEach(btn=>btn.addEventListener('click',()=>onPageChange(Number(btn.dataset.page))));
  }

  async function openUserModal(userId) {
    document.getElementById('userModal').classList.remove('hidden');
    document.getElementById('userModalBody').innerHTML = '<p style="text-align:center;padding:24px;color:var(--muted)">جاري التحميل...</p>';
    try {
      const data = await api(`/api/admin/users/${userId}`);
      const u = data.user || {}; const audit = data.audit || []; const reports = data.reports || [];
      safeText('userModalTitle', `ملف: ${userName(u)}`);
      function pCard(label, value, color) { return `<div class="profile-card"><span>${esc(label)}</span><strong style="${color?`color:${color}`:''}"><span>${esc(String(value||'—'))}</span></strong></div>`; }

      const deviceIcon = u.lastDevice === 'mobile' ? '📱' : u.lastDevice === 'tablet' ? '📲' : '🖥️';
      const loginHistoryHtml = (u.loginHistory||[]).length
        ? `<div style="margin-top:16px"><h3 style="font-size:14px;margin-bottom:8px">📍 سجل الدخول (آخر 5)</h3><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="color:var(--muted);border-bottom:1px solid var(--border)"><th style="padding:4px 8px;text-align:right">الوقت</th><th style="padding:4px 8px;text-align:right">IP</th><th style="padding:4px 8px;text-align:right">الجهاز</th><th style="padding:4px 8px;text-align:right">المتصفح</th><th style="padding:4px 8px;text-align:right">النظام</th></tr></thead><tbody>${(u.loginHistory||[]).map(l=>`<tr style="border-bottom:1px solid var(--border)"><td style="padding:4px 8px">${fmtDate(l.at)}</td><td style="padding:4px 8px;font-family:monospace;color:#60a5fa">${esc(l.ip||'—')}</td><td style="padding:4px 8px">${l.device==='mobile'?'📱':l.device==='tablet'?'📲':'🖥️'} ${esc(l.device||'—')}</td><td style="padding:4px 8px">${esc(l.browser||'—')}</td><td style="padding:4px 8px">${esc(l.os||'—')}</td></tr>`).join('')}</tbody></table></div>`
        : '<p class="muted-text" style="padding:8px">لا يوجد سجل دخول حتى الآن</p>';

      const reportsOnUserHtml = reports.length
        ? `<div style="margin-top:16px"><h3 style="font-size:14px;margin-bottom:8px">🚩 البلاغات ضد هذا المستخدم (${reports.length})</h3>${reports.map(r=>`<div style="padding:8px;border:1px solid var(--border);border-radius:8px;margin-bottom:6px;font-size:12px"><div style="display:flex;justify-content:space-between"><span><b>${esc(r.reporterEmail||'—')}</b> → <span style="color:${r.priority==='high'||r.priority==='critical'?'var(--danger)':'var(--muted)'}">${esc(r.reason||'—')}</span></span>${statusBadge(r.status||'open')}</div><div style="color:var(--muted);margin-top:4px">${fmtDate(r.createdAt)}</div></div>`).join('')}</div>`
        : '';

      document.getElementById('userModalBody').innerHTML = `
        <div class="profile-grid">
          ${pCard('الاسم الكامل', userName(u))}
          ${pCard('البريد الإلكتروني', u.email)}
          ${pCard('الدور', u.role)}
          ${pCard('الحالة', u.status)}
          ${pCard('آخر IP', u.lastIp || '—', '#60a5fa')}
          ${pCard('الجهاز', u.lastDevice ? `${deviceIcon} ${u.lastDevice}` : '—')}
          ${pCard('المتصفح', u.lastBrowser || '—')}
          ${pCard('نظام التشغيل', u.lastOs || '—')}
          ${pCard('مهارات التعليم', (u.teachSkills||[]).join('، ')||'غير محدد')}
          ${pCard('مهارات التعلم', (u.learnSkills||[]).join('، ')||'غير محدد')}
          ${pCard('مخالفات', u.violationCount||0, u.violationCount>0?'var(--danger)':'')}
          ${pCard('سبب الحظر', u.banReason||'لا يوجد')}
          ${pCard('تاريخ التسجيل', fmtDate(u.createdAt))}
          ${pCard('آخر دخول', fmtDate(u.lastLoginAt))}
        </div>
        ${loginHistoryHtml}
        ${reportsOnUserHtml}
        <h3 style="margin:16px 0 8px;font-size:15px">📋 سجل الإجراءات (${audit.length})</h3>
        <div class="timeline">${audit.length ? audit.slice(0,6).map(l=>`<div class="timeline-item"><strong>${esc(l.action||'—')}</strong><span>${esc(l.actorEmail||'System')}</span><small>${fmtDate(l.createdAt)}</small></div>`).join('') : '<p class="muted-text" style="padding:8px">لا توجد إجراءات</p>'}</div>`;
    } catch(e) { document.getElementById('userModalBody').innerHTML=`<p style="color:var(--danger);padding:16px">خطأ: ${esc(e.message)}</p>`; }
  }

  function openBanModal(userId) {
    document.getElementById('banUserId').value = userId;
    document.getElementById('banStatus').value = 'banned';
    document.getElementById('banReason').value = '';
    document.getElementById('banDurationValue').value = '';
    document.getElementById('banDurationPreset').value = '';
    document.getElementById('banNotify').checked = true;
    document.getElementById('banModal').classList.remove('hidden');
  }

  async function confirmBan() {
    const userId = document.getElementById('banUserId').value;
    const status = document.getElementById('banStatus').value;
    const reason = document.getElementById('banReason').value.trim();
    const dv = document.getElementById('banDurationValue').value;
    const du = document.getElementById('banDurationPreset').value;
    const notify = document.getElementById('banNotify').checked;
    if (!userId) { showToast('معرف المستخدم غير موجود','error'); return; }
    const body = { status, reason, notify };
    if (du && dv) { body.durationValue = Number(dv); body.durationUnit = du; }
    try {
      await api(`/api/admin/users/${userId}/status`, { method:'PUT', body:JSON.stringify(body) });
      closeModal('banModal');
      showToast(status==='active'?'تم رفع الحظر ✅':'تم تطبيق الإجراء ✅', 'success');
      loadUsers(); loadOverview();
    } catch(e) { showToast('فشل الإجراء: '+(e.message||''),'error'); }
  }

  async function sendNotification() {
    const target = document.getElementById('notifTarget').value;
    const email = document.getElementById('notifEmail').value.trim();
    const type = document.getElementById('notifType').value;
    const title = document.getElementById('notifTitle').value.trim();
    const message = document.getElementById('notifMessage').value.trim();
    const resultEl = document.getElementById('notifResult');
    if (!title||!message) { showToast('العنوان والرسالة مطلوبان','warning'); return; }
    if (target==='single'&&!email) { showToast('يرجى إدخال البريد الإلكتروني','warning'); return; }
    resultEl.className='result-msg hidden';
    try {
      const data = await api('/api/admin/notifications',{method:'POST',body:JSON.stringify({target,email,title,message,type})});
      resultEl.className='result-msg success'; resultEl.textContent=`✅ تم الإرسال إلى ${fmtNum(data.sent||0)} مستخدم`;
      document.getElementById('notifTitle').value=''; document.getElementById('notifMessage').value='';
      showToast(`تم الإرسال إلى ${fmtNum(data.sent||0)} مستخدم`,'success');
    } catch(e) { resultEl.className='result-msg error'; resultEl.textContent=`❌ فشل: ${e.message||''}`; showToast('فشل الإرسال','error'); }
  }

  async function updateExchangeStatus(id,status) {
    try { await api(`/api/admin/exchanges/${id}`,{method:'PATCH',body:JSON.stringify({status})}); showToast(status==='accepted'?'تم القبول ✅':'تم الرفض','success'); loadExchanges(); }
    catch(e) { showToast('فشل: '+(e.message||''),'error'); }
  }

  async function updateReportStatus(id,status,notes) {
    try {
      const body = { status };
      if (notes) body.adminNotes = notes;
      await api(`/api/admin/reports/${id}`,{method:'PATCH',body:JSON.stringify(body)});
      showToast('تم تحديث الشكوى ✅','success'); loadReports();
    } catch(e) { showToast('فشل: '+(e.message||''),'error'); }
  }

  async function updateReportPriority(id, priority) {
    try {
      await api(`/api/admin/reports/${id}`, {method:'PATCH', body:JSON.stringify({priority})});
      showToast(`تم تعيين الأولوية: ${priority} ✅`, 'success'); loadReports();
    } catch(e) { showToast('فشل: '+(e.message||''),'error'); }
  }

  async function banFromReport(reportId) {
    const reason = prompt('سبب الحظر:');
    if (reason === null) return;
    try {
      await api(`/api/admin/reports/${reportId}/ban-user`, {method:'POST', body:JSON.stringify({status:'banned', reason: reason||'بسبب البلاغ', durationValue:7, durationUnit:'days'})});
      showToast('✅ تم حظر المستخدم من هذا البلاغ', 'success'); loadReports();
    } catch(e) { showToast('فشل: '+(e.message||''),'error'); }
  }

  window.unbanUserDirect = async function(userId) {
    if (!(await SharikConfirm.show('رفع الحظر عن هذا المستخدم؟'))) return;
    try {
      await api(`/api/admin/users/${userId}/status`, {method:'PUT', body:JSON.stringify({status:'active', reason:'رفع الحظر يدوياً', notify:true})});
      showToast('✅ تم رفع الحظر', 'success');
      closeModal('userModal'); loadUsers(); loadOverview();
    } catch(e) { showToast('فشل: '+(e.message||''),'error'); }
  };

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action==='view-user') openUserModal(btn.dataset.id);
    else if (action==='ban-user') openBanModal(btn.dataset.id);
    else if (action==='exchange-status') updateExchangeStatus(btn.dataset.id, btn.dataset.status);
    else if (action==='report-status') updateReportStatus(btn.dataset.id, btn.dataset.status);
    else if (action==='report-ban') banFromReport(btn.dataset.id);
    else if (action==='report-priority') updateReportPriority(btn.dataset.id, btn.dataset.priority);
  });

  function debounce(fn,delay) { let t; return (...args)=>{clearTimeout(t); t=setTimeout(()=>fn(...args),delay);}; }
  function applyTheme() { document.body.classList.toggle('light',state.theme==='light'); safeText('themeBtn',state.theme==='light'?'🌙':'☀️'); }

  document.addEventListener('DOMContentLoaded', async function() {
    applyTheme();
    safeText('adminEmailDisplay', currentUser.email||'Admin');
    safeText('adminRoleDisplay', ({super_admin:'Super Admin',admin:'Admin',moderator:'Moderator',user:'User'}[currentUser.role]||'Admin'));
    safeText('adminInitial', (currentUser.email||'A').charAt(0).toUpperCase());
    safeText('adminRoleBadge', ({super_admin:'🔑 Super Admin',admin:'🛡 Admin',moderator:'👁 Moderator'}[currentUser.role]||'Admin'));
    try { const csrf=await api('/api/admin/csrf-token'); state.csrfToken=csrf.csrfToken||''; } catch(_){}
    document.getElementById('adminNav').addEventListener('click', e=>{const btn=e.target.closest('.nav-item[data-section]'); if(btn) goToSection(btn.dataset.section);});
    document.getElementById('logoutBtn').addEventListener('click',async()=>{if(!(await SharikConfirm.show('تسجيل الخروج؟')))return; localStorage.removeItem('token'); localStorage.removeItem('currentUser'); window.location.href='/login-signup/login.html';});
    document.getElementById('langBtn')?.addEventListener('click',()=>{ if(window.SharikI18N){ const next=window.SharikI18N.getLang()==='ar'?'en':'ar'; window.SharikI18N.setLang(next); } });
    document.getElementById('refreshBtn').addEventListener('click',()=>{ state.usersPage=1; goToSection(state.section); showToast('جاري التحديث...','info',1500); });
    document.getElementById('themeBtn').addEventListener('click',()=>{ state.theme=state.theme==='dark'?'light':'dark'; localStorage.setItem('sharik_admin_theme',state.theme); applyTheme(); });
    const dLoadUsers=debounce(()=>{state.usersPage=1;loadUsers();},300);
    ['userSearch','userStatusFilter','userRoleFilter','userSort'].forEach(id=>{const el=document.getElementById(id); if(el){el.addEventListener('input',dLoadUsers);el.addEventListener('change',dLoadUsers);}});
    document.getElementById('skillSearch')?.addEventListener('input',()=>renderSkillsTable(state.skills));
    document.getElementById('exchangeStatusFilter')?.addEventListener('change',()=>{state.exchangesPage=1;loadExchanges();});
    ['reportStatusFilter','reportPriorityFilter','reportCategoryFilter'].forEach(id=>{
      document.getElementById(id)?.addEventListener('change',()=>{state.reportsPage=1;loadReports();});
    });
    document.getElementById('sendNotificationBtn')?.addEventListener('click',sendNotification);
    document.getElementById('confirmBanBtn')?.addEventListener('click',confirmBan);
    window.addEventListener('resize',debounce(()=>{if(state.section==='overview'&&state.dashboardData) drawGrowthChart(state.dashboardData.charts||{});},200));
    await loadOverview();
  });
})();
