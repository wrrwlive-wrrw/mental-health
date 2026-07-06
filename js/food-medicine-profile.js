// 药食同源 - 健康档案管理（跨模块数据同步）
function getFmProfiles() {
  return JSON.parse(localStorage.getItem('fm_profiles') || '[]');
}
function saveFmProfiles(list) {
  localStorage.setItem('fm_profiles', JSON.stringify(list));
}
function getFmCurrentProfileId() {
  return localStorage.getItem('fm_current_profile') || '';
}
function getFmCurrentProfile() {
  const id = getFmCurrentProfileId();
  return getFmProfiles().find(p => p.id === id) || null;
}
function setFmCurrentProfile(id) {
  localStorage.setItem('fm_current_profile', id);
}
function createFmProfile(data) {
  const list = getFmProfiles();
  const p = { id: 'fm_' + Date.now(), ...data, records: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  list.push(p);
  saveFmProfiles(list);
  setFmCurrentProfile(p.id);
  return p;
}
function updateFmProfile(id, data) {
  const list = getFmProfiles();
  const idx = list.findIndex(p => p.id === id);
  if (idx >= 0) { Object.assign(list[idx], data, { updatedAt: new Date().toISOString() }); saveFmProfiles(list); }
}
function addFmRecord(record) {
  const list = getFmProfiles();
  const idx = list.findIndex(p => p.id === getFmCurrentProfileId());
  if (idx >= 0) { list[idx].records.unshift({ id: 'r_' + Date.now(), date: new Date().toISOString(), ...record }); saveFmProfiles(list); }
}

// 供其他模块调用的数据摘要
function getFmHealthSummary() {
  const p = getFmCurrentProfile();
  if (!p) return '';
  let s = `【食疗健康档案】姓名:${p.name} 性别:${p.gender} 年龄:${p.age}`;
  if (p.constitution) s += ` 体质:${p.constitution}`;
  if (p.allergies && p.allergies.length) s += ` 过敏:${p.allergies.join(',')}`;
  if (p.chronicDiseases && p.chronicDiseases.length) s += ` 慢性病:${p.chronicDiseases.join(',')}`;
  if (p.dietPreference) s += ` 饮食偏好:${p.dietPreference}`;
  if (p.goal) s += ` 调理目标:${p.goal}`;
  return s;
}

// 跨模块数据聚合（为AI prompt提供完整健康画像）
function getFmCrossModuleData() {
  let data = '';
  // 中医档案
  if (typeof getTcmCurrentPatient === 'function') {
    const tcm = getTcmCurrentPatient();
    if (tcm) {
      data += `\n【中医档案】${tcm.name} 体质:${tcm.constitution||'未评估'}`;
      if (tcm.chronicDiseases) data += ` 慢性病:${tcm.chronicDiseases}`;
      if (tcm.records && tcm.records.length > 0) {
        const r = tcm.records[0];
        data += ` 最近辨证:${r.syndrome||''} 主诉:${r.chiefComplaint||''}`;
      }
    }
  }
  // 西医档案
  if (typeof getWmCurrentPatient === 'function') {
    const wm = getWmCurrentPatient();
    if (wm) {
      const ext = JSON.parse(localStorage.getItem('wm_ext_' + wm.id) || '{}');
      if (ext.bloodType || ext.height) data += `\n【西医档案】血型:${ext.bloodType||'未知'} 身高:${ext.height||''}cm 体重:${ext.weight||''}kg`;
      const recs = JSON.parse(localStorage.getItem('wm_records_' + wm.id) || '[]');
      if (recs.length > 0) data += ` 最近诊断:${recs[0].diagnosis||''}`;
    }
  }
  // 风水健康
  if (typeof getFsHealthSummary === 'function') {
    const fs = getFsHealthSummary();
    if (fs) data += `\n【风水健康】${fs}`;
  }
  // 心理评估
  if (typeof currentUser !== 'undefined' && currentUser) {
    data += `\n【心理评估】用户:${currentUser.name||''}`;
    const results = JSON.parse(localStorage.getItem('mh_test_results') || '[]');
    if (results.length > 0) {
      const last = results[results.length - 1];
      data += ` 最近评估:${last.level||''} 总分:${last.totalScore||''}`;
    }
  }
  return data;
}

// 渲染健康档案Tab
function renderFmProfile() {
  const profiles = getFmProfiles();
  const cur = getFmCurrentProfile();
  return `<div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <span style="font-size:14px;font-weight:bold;color:#8b4513">🏥 我的健康档案</span>
      <button class="fm-tab active" onclick="fmShowCreateProfile()">+ 新建档案</button>
    </div>
    ${profiles.length>0?`<div class="fm-filter" style="margin-bottom:12px">
      ${profiles.map(p=>`<button class="fm-filter-btn ${cur&&cur.id===p.id?'active':''}" onclick="fmSelectProfile('${p.id}')">${p.name}</button>`).join('')}
    </div>`:''}
    <div id="fmProfileDetail">${cur?renderFmProfileDetail(cur):renderFmCreateForm()}</div>
  </div>`;
}

function renderFmProfileDetail(p) {
  return `<div class="fm-card">
    <h4>📋 ${p.name} <span class="fm-tag fm-tag-brown">${p.gender} ${p.age}岁</span></h4>
    <p><b>体质类型：</b>${p.constitution||'未评估'}</p>
    <p><b>过敏食物：</b>${p.allergies&&p.allergies.length?p.allergies.join('、'):'无'}</p>
    <p><b>慢性疾病：</b>${p.chronicDiseases&&p.chronicDiseases.length?p.chronicDiseases.join('、'):'无'}</p>
    <p><b>饮食偏好：</b>${p.dietPreference||'未设置'}</p>
    <p><b>调理目标：</b>${p.goal||'未设置'}</p>
    <p style="font-size:11px;color:#888">创建时间：${new Date(p.createdAt).toLocaleDateString()}</p>
    <div style="margin-top:10px;display:flex;gap:8px">
      <button class="fm-tab" onclick="fmEditProfile()">编辑</button>
      <button class="fm-tab" onclick="fmDeleteProfile('${p.id}')">删除</button>
    </div>
  </div>
  ${p.records&&p.records.length?`<div class="fm-section-title">食疗咨询记录（最近${Math.min(p.records.length,5)}条）</div>
    ${p.records.slice(0,5).map(r=>`<div class="fm-card"><p style="font-size:11px;color:#888">${new Date(r.date).toLocaleString()} [${r.type}]</p><p><b>提问：</b>${r.content}</p><p style="color:#2e7d32"><b>AI建议：</b>${(r.aiReply||'').substring(0,100)}...</p></div>`).join('')}`:''}`;
}

function renderFmCreateForm() {
  return `<div class="fm-card">
    <h4>新建健康档案</h4>
    <div style="display:grid;gap:8px;margin-top:10px">
      <input id="fmName" placeholder="姓名" style="padding:8px;border:1px solid #ddb892;border-radius:6px">
      <div style="display:flex;gap:8px">
        <select id="fmGender" style="flex:1;padding:8px;border:1px solid #ddb892;border-radius:6px"><option value="男">男</option><option value="女">女</option></select>
        <input id="fmAge" type="number" placeholder="年龄" style="flex:1;padding:8px;border:1px solid #ddb892;border-radius:6px">
      </div>
      <select id="fmConst" style="padding:8px;border:1px solid #ddb892;border-radius:6px">
        <option value="">选择体质类型</option><option>平和质</option><option>气虚质</option><option>阳虚质</option><option>阴虚质</option><option>痰湿质</option><option>湿热质</option><option>血瘀质</option><option>气郁质</option><option>特禀质</option>
      </select>
      <input id="fmAllergy" placeholder="过敏食物（逗号分隔，如：海鲜,花生）" style="padding:8px;border:1px solid #ddb892;border-radius:6px">
      <input id="fmChronic" placeholder="慢性疾病（逗号分隔）" style="padding:8px;border:1px solid #ddb892;border-radius:6px">
      <select id="fmDiet" style="padding:8px;border:1px solid #ddb892;border-radius:6px">
        <option value="">饮食偏好</option><option>清淡</option><option>辛辣</option><option>素食</option><option>无忌口</option>
      </select>
      <input id="fmGoal" placeholder="调理目标（如：增强免疫、养胃、减肥）" style="padding:8px;border:1px solid #ddb892;border-radius:6px">
      <button class="fm-tab active" onclick="fmSaveProfile()">保存档案</button>
    </div>
  </div>`;
}

function fmShowCreateProfile(){document.getElementById('fmProfileDetail').innerHTML=renderFmCreateForm();}
function fmSelectProfile(id){setFmCurrentProfile(id);document.getElementById('fmPanel').innerHTML=renderFmProfile();}
function fmSaveProfile() {
  const name=document.getElementById('fmName').value.trim();
  if(!name){alert('请输入姓名');return;}
  createFmProfile({
    name, gender:document.getElementById('fmGender').value,
    age:parseInt(document.getElementById('fmAge').value)||20,
    constitution:document.getElementById('fmConst').value,
    allergies:document.getElementById('fmAllergy').value.split(/[,，]/).filter(Boolean),
    chronicDiseases:document.getElementById('fmChronic').value.split(/[,，]/).filter(Boolean),
    dietPreference:document.getElementById('fmDiet').value,
    goal:document.getElementById('fmGoal').value.trim()
  });
  document.getElementById('fmPanel').innerHTML=renderFmProfile();
}
function fmDeleteProfile(id){if(confirm('确认删除？')){const l=getFmProfiles().filter(p=>p.id!==id);saveFmProfiles(l);if(getFmCurrentProfileId()===id)localStorage.removeItem('fm_current_profile');document.getElementById('fmPanel').innerHTML=renderFmProfile();}}
function fmEditProfile(){fmShowCreateProfile();}
