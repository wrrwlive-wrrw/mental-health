// 用户注册与档案管理系统
const ROLE_LABELS = { admin:'管理员', student:'学生', teacher:'老师', social:'社会人员', researcher:'研究人员' };

// 默认管理员账号
const DEFAULT_ADMIN = {
  id: 'u_admin', name: '管理员', phone: 'admin',
  password: 'admin123', gender: '', age: 0, role: 'admin',
  createdAt: '2024-01-01', testHistory: [], chatHistory: []
};

function getUsers() {
  let users = JSON.parse(localStorage.getItem('mh_users') || '[]');
  // 确保管理员账号始终存在
  if (!users.find(u => u.id === 'u_admin')) {
    users.unshift(DEFAULT_ADMIN);
    localStorage.setItem('mh_users', JSON.stringify(users));
  }
  return users;
}
function saveUsers(users) { localStorage.setItem('mh_users', JSON.stringify(users)); }
function getCurrentUser() {
  const id = localStorage.getItem('mh_current');
  if (!id) return null;
  return getUsers().find(u => u.id === id) || null;
}
function setCurrentUser(id) { localStorage.setItem('mh_current', id); }
function logout() { localStorage.removeItem('mh_current'); checkAuth(); }

// 检查登录状态
function checkAuth() {
  const user = getCurrentUser();
  if (user) {
    showPage('home');
    updateHomeUserInfo(user);
  } else {
    showPage('login');
  }
}

// 首页显示用户信息
function updateHomeUserInfo(user) {
  const el = document.getElementById('userInfoBar');
  if (!el) return;
  el.innerHTML = `<span class="user-badge role-${user.role}">${ROLE_LABELS[user.role]}</span>
    <span class="user-name">${user.name}</span>
    <button class="btn-link" onclick="showPage('profile')">我的档案</button>
    <button class="btn-link btn-logout" onclick="logout()">退出</button>`;
  el.style.display = 'flex';
}

// 登录
function doLogin() {
  const phone = document.getElementById('loginPhone').value.trim();
  const pwd = document.getElementById('loginPwd').value.trim();
  if (!phone || !pwd) { alert('请填写手机号和密码'); return; }
  const user = getUsers().find(u => u.phone === phone && u.password === pwd);
  if (!user) { alert('手机号或密码错误'); return; }
  setCurrentUser(user.id);
  checkAuth();
}

// 注册 - 角色切换显示不同字段
function onRegRoleChange() {
  const role = document.getElementById('regRole').value;
  document.querySelectorAll('.role-fields').forEach(el => el.style.display = 'none');
  const target = document.getElementById('fields_' + role);
  if (target) target.style.display = 'block';
}

// 执行注册
function doRegister() {
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const pwd = document.getElementById('regPwd').value.trim();
  const gender = document.getElementById('regGender').value;
  const age = parseInt(document.getElementById('regAge').value) || 0;
  const role = document.getElementById('regRole').value;

  if (!name || !phone || !pwd) { alert('请填写姓名、手机号和密码'); return; }
  const users = getUsers();
  if (users.find(u => u.phone === phone)) { alert('该手机号已注册'); return; }

  const user = {
    id: 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    name, phone, password: pwd, gender, age, role,
    createdAt: new Date().toISOString().slice(0,10),
    testHistory: [], chatHistory: []
  };
  // 角色特有字段
  Object.assign(user, getRoleFields(role));
  users.push(user);
  saveUsers(users);
  setCurrentUser(user.id);
  alert('注册成功！');
  checkAuth();
}

// 获取角色特有字段
function getRoleFields(role) {
  const fields = {};
  if (role === 'student') {
    fields.school = document.getElementById('regSchool')?.value.trim() || '';
    fields.major = document.getElementById('regMajor')?.value.trim() || '';
    fields.grade = document.getElementById('regGrade')?.value.trim() || '';
  } else if (role === 'teacher') {
    fields.title = document.getElementById('regTitle')?.value.trim() || '';
    fields.department = document.getElementById('regDept')?.value.trim() || '';
    fields.specialty = document.getElementById('regSpecialty')?.value.trim() || '';
  } else if (role === 'social') {
    fields.occupation = document.getElementById('regOccupation')?.value.trim() || '';
    fields.company = document.getElementById('regCompany')?.value.trim() || '';
  } else if (role === 'researcher') {
    fields.institution = document.getElementById('regInstitution')?.value.trim() || '';
    fields.researchArea = document.getElementById('regResearch')?.value.trim() || '';
  }
  return fields;
}

// 渲染个人档案页
function renderProfile() {
  const user = getCurrentUser();
  if (!user) { showPage('login'); return; }
  const el = document.getElementById('profileContent');
  if (!el) return;
  let html = `<div class="profile-header">
    <div class="profile-avatar">${user.name.slice(0,1)}</div>
    <h3>${user.name}</h3>
    <span class="user-badge role-${user.role}">${ROLE_LABELS[user.role]}</span>
  </div>
  <div class="profile-info">
    <div class="info-row"><label>手机号</label><span>${user.phone}</span></div>
    <div class="info-row"><label>性别</label><span>${user.gender||'-'}</span></div>
    <div class="info-row"><label>年龄</label><span>${user.age||'-'}</span></div>
    <div class="info-row"><label>注册日期</label><span>${user.createdAt}</span></div>`;
  html += getRoleProfileHtml(user);
  html += `</div>`;
  html += `<div class="profile-stats">
    <div class="stat-item"><span class="stat-num">${(user.testHistory||[]).length}</span><span>评估次数</span></div>
    <div class="stat-item"><span class="stat-num">${(user.chatHistory||[]).length}</span><span>对话记录</span></div>
  </div>`;
  el.innerHTML = html;
}

// 角色特有档案信息
function getRoleProfileHtml(user) {
  let html = '';
  if (user.role === 'student') {
    html += `<div class="info-row"><label>学校</label><span>${user.school||'-'}</span></div>`;
    html += `<div class="info-row"><label>专业</label><span>${user.major||'-'}</span></div>`;
    html += `<div class="info-row"><label>年级</label><span>${user.grade||'-'}</span></div>`;
  } else if (user.role === 'teacher') {
    html += `<div class="info-row"><label>职称</label><span>${user.title||'-'}</span></div>`;
    html += `<div class="info-row"><label>院系</label><span>${user.department||'-'}</span></div>`;
    html += `<div class="info-row"><label>研究方向</label><span>${user.specialty||'-'}</span></div>`;
  } else if (user.role === 'social') {
    html += `<div class="info-row"><label>职业</label><span>${user.occupation||'-'}</span></div>`;
    html += `<div class="info-row"><label>单位</label><span>${user.company||'-'}</span></div>`;
  } else if (user.role === 'researcher') {
    html += `<div class="info-row"><label>机构</label><span>${user.institution||'-'}</span></div>`;
    html += `<div class="info-row"><label>研究领域</label><span>${user.researchArea||'-'}</span></div>`;
  }
  return html;
}

// 渲染用户管理/数据库页面
function renderUsers() {
  const users = getUsers();
  const el = document.getElementById('usersContent');
  if (!el) return;
  const counts = { student:0, teacher:0, social:0, researcher:0 };
  users.forEach(u => { if (counts[u.role] !== undefined) counts[u.role]++; });

  let html = `<div class="user-stats-grid">
    <div class="user-stat" onclick="filterUsers('all')"><span class="stat-num">${users.length}</span><span>总用户</span></div>
    <div class="user-stat" onclick="filterUsers('student')"><span class="stat-num">${counts.student}</span><span>学生</span></div>
    <div class="user-stat" onclick="filterUsers('teacher')"><span class="stat-num">${counts.teacher}</span><span>老师</span></div>
    <div class="user-stat" onclick="filterUsers('social')"><span class="stat-num">${counts.social}</span><span>社会人员</span></div>
    <div class="user-stat" onclick="filterUsers('researcher')"><span class="stat-num">${counts.researcher}</span><span>研究人员</span></div>
  </div>
  <div class="user-filter">
    <select id="userFilter" onchange="filterUsers(this.value)">
      <option value="all">全部角色</option>
      <option value="student">学生</option>
      <option value="teacher">老师</option>
      <option value="social">社会人员</option>
      <option value="researcher">研究人员</option>
    </select>
  </div>
  <div id="userList">${renderUserList(users)}</div>`;
  el.innerHTML = html;
}

// 渲染用户列表
function renderUserList(list) {
  if (!list.length) return '<p style="text-align:center;color:#aaa;padding:30px">暂无用户</p>';
  return list.map(u => `<div class="user-card">
    <div class="user-card-avatar">${u.name.slice(0,1)}</div>
    <div class="user-card-info">
      <div class="user-card-name">${u.name} <span class="user-badge role-${u.role}">${ROLE_LABELS[u.role]}</span></div>
      <div class="user-card-detail">${u.phone} | 注册：${u.createdAt}</div>
    </div>
  </div>`).join('');
}

// 按角色筛选
function filterUsers(role) {
  const users = getUsers();
  const list = role === 'all' ? users : users.filter(u => u.role === role);
  document.getElementById('userList').innerHTML = renderUserList(list);
  const sel = document.getElementById('userFilter');
  if (sel) sel.value = role;
}

// 页面初始化
document.addEventListener('DOMContentLoaded', checkAuth);
