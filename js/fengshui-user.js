// 风水大师·个人信息管理
// 姓名、出生年月日时、出生地、居住地、属相（自动推算）

const ZODIAC = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
const TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const DI_ZHI   = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const WUXING_GAN = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};

// 获取用户资料
function getFsUser() {
  try { return JSON.parse(localStorage.getItem('mh_fs_user') || '{}'); }
  catch(e) { return {}; }
}

// 保存用户资料
function saveFsUser(data) {
  localStorage.setItem('mh_fs_user', JSON.stringify(data));
}

// 计算属相（按农历简化：以立春 2/4 为界的年份）
function calcZodiac(year) {
  return ZODIAC[(year - 4) % 12];
}

// 计算年柱干支
function calcYearGanZhi(year) {
  const g = TIAN_GAN[(year - 4) % 10];
  const z = DI_ZHI[(year - 4) % 12];
  return { gan:g, zhi:z, wuxing: WUXING_GAN[g] };
}

// 用户信息卡（显示在每个版块顶部）
function renderFsUserBar() {
  const u = getFsUser();
  if (!u.name) {
    return `
      <div class="fs-user-bar fs-user-empty" onclick="showFsUserForm()">
        <span style="font-size:20px">👤</span>
        <span style="margin-left:8px;color:#8b6914">点击填写个人信息（姓名、出生年月、属相等），获得个性化分析</span>
      </div>`;
  }
  const yr = new Date(u.birthDate || Date.now()).getFullYear();
  const zodiac = u.zodiac || calcZodiac(yr);
  const gz = calcYearGanZhi(yr);
  return `
    <div class="fs-user-bar">
      <div class="fs-user-info">
        <b>${u.name}</b>
        <span class="fs-user-tag">${u.gender||''}</span>
        <span class="fs-user-tag">属${zodiac}</span>
        <span class="fs-user-tag">${gz.gan}${gz.zhi}年·${gz.wuxing}命</span>
        <span class="fs-user-tag">📍${u.city||'未填'}</span>
      </div>
      <button class="fs-user-edit" onclick="showFsUserForm()">修改</button>
    </div>`;
}

// 显示个人信息表单
function showFsUserForm() {
  const u = getFsUser();
  const modal = document.createElement('div');
  modal.className = 'fs-modal';
  modal.id = 'fsUserModal';
  modal.innerHTML = getFsUserFormHTML(u);
  document.body.appendChild(modal);
}

// 关闭表单
function closeFsUserForm() {
  const m = document.getElementById('fsUserModal');
  if (m) m.remove();
}

// 提交表单
function submitFsUser() {
  const data = {
    name:       document.getElementById('fsuName').value.trim(),
    gender:     document.getElementById('fsuGender').value,
    birthDate:  document.getElementById('fsuBirthDate').value,
    birthTime:  document.getElementById('fsuBirthTime').value,
    birthPlace: document.getElementById('fsuBirthPlace').value.trim(),
    city:       document.getElementById('fsuCity').value.trim(),
    house:      document.getElementById('fsuHouse').value.trim(),
    orientation:document.getElementById('fsuOrient').value,
    remark:     document.getElementById('fsuRemark').value.trim()
  };
  if (!data.name || !data.birthDate) {
    alert('姓名和出生日期为必填项');
    return;
  }
  const y = new Date(data.birthDate).getFullYear();
  data.zodiac = calcZodiac(y);
  data.yearPillar = calcYearGanZhi(y);
  saveFsUser(data);
  closeFsUserForm();
  if (typeof renderFengshui === 'function') renderFengshui();
}

// 用户信息卡片（嵌入主页面）
function renderFsUserInfoCard() {
  const u = getFsUser();
  if (!u.name) {
    return `<div class="fs-user-card fs-user-empty" onclick="showFsUserForm()">
      <span>👤</span><span>点击填写个人信息（姓名、生辰、居住地），获取个性化分析</span>
    </div>`;
  }
  const yr = new Date(u.birthDate).getFullYear();
  const zodiac = u.zodiac || calcZodiac(yr);
  const gz = u.yearPillar || calcYearGanZhi(yr);
  return `<div class="fs-user-card">
    <div class="fs-user-left">
      <b>${u.name}</b>
      <span class="fs-utag">${u.gender||''}</span>
      <span class="fs-utag">属${zodiac}</span>
      <span class="fs-utag">${gz.gan}${gz.zhi}年·${gz.wuxing}命</span>
      <span class="fs-utag">📍${u.city||'未填'}</span>
      ${u.birthTime?`<span class="fs-utag">${u.birthTime}时生</span>`:''}
    </div>
    <button class="fs-user-edit-btn" onclick="showFsUserForm()">✏️ 修改</button>
  </div>`;
}

// 获取用户信息（供 prompt 使用）
function getFsUserInfo() {
  const u = getFsUser();
  if (!u.name) return null;
  return {
    name: u.name,
    gender: u.gender,
    birthDate: u.birthDate,
    birthTime: u.birthTime,
    birthPlace: u.birthPlace,
    currentPlace: u.city,
    house: u.house,
    orientation: u.orientation,
    zodiac: u.zodiac,
    yearPillar: u.yearPillar,
    remark: u.remark
  };
}
