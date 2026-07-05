// 西医智能诊疗 - 主模块（Tab路由与页面渲染）
const WM_MODULES = {
  diagnosis: { name:'智能诊断', icon:'🩺' },
  aiAgent:   { name:'AI智能体', icon:'🤖' },
  integrate: { name:'中西结合', icon:'🔗' },
  patient:   { name:'健康档案', icon:'📋' },
  settings:  { name:'API设置', icon:'⚙️' }
};
let wmCurrentTab = 'diagnosis';

function renderWm() {
  const el = document.getElementById('wmContent');
  if (!el) return;
  el.innerHTML = renderWmPage();
  showWmTab(wmCurrentTab);
}

function renderWmPage() {
  return `<div class="wm-intro">
    基于循证医学(EBM)的AI辅助诊疗系统。参考国内外最新临床指南，支持智能诊断、检查解读、治疗方案生成，并可与中医诊疗结合分析。
  </div>
  ${renderWmPatientBar()}
  <div id="wmTabs" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:14px">
    ${Object.entries(WM_MODULES).map(([k,v]) =>
      `<div class="wm-tab ${k===wmCurrentTab?'active':''}" onclick="switchWmTab('${k}')">
        <span class="wm-tab-icon">${v.icon}</span><span class="wm-tab-name">${v.name}</span>
      </div>`
    ).join('')}
  </div>
  <div class="wm-panel" id="wmPanel"></div>`;
}

function switchWmTab(tab) {
  wmCurrentTab = tab;
  document.querySelectorAll('#wmTabs .wm-tab').forEach(el => {
    const key = el.getAttribute('onclick').match(/'(\w+)'/)?.[1];
    el.classList.toggle('active', key===tab);
  });
  showWmTab(tab);
}

function showWmTab(tab) {
  const el = document.getElementById('wmPanel');
  if (!el) return;
  const renderers = {
    diagnosis: renderWmDiagnosis,
    aiAgent: renderWmAiAgent,
    integrate: renderWmIntegrate,
    patient: renderWmPatientPage,
    settings: ()=> typeof renderTcmSettings==='function'?renderTcmSettings():'<p>请在中医模块配置API</p>'
  };
  el.innerHTML = (renderers[tab]||(() => ''))();
}

function renderWmPatientBar() {
  const p = getWmCurrentPatient();
  const patients = typeof getTcmPatients==='function' ? getTcmPatients() : [];
  if (!patients.length) return '<div style="padding:8px;background:#fff3e0;border-radius:6px;margin-bottom:10px;font-size:12px;color:#e65100">请先在中医模块或此处新建病人档案</div>';
  return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">
    <span style="font-size:12px;color:#555;font-weight:bold">当前病人：</span>
    <select onchange="setWmCurrentPatient(this.value);renderWm()" style="padding:4px 8px;border-radius:4px;border:1px solid #90caf9;font-size:12px">
      <option value="">-- 选择病人 --</option>
      ${patients.map(pt => `<option value="${pt.id}" ${p&&p.id===pt.id?'selected':''}>${pt.name}（${pt.gender}，${pt.age}岁）</option>`).join('')}
    </select>
  </div>`;
}

function renderWmPatientPage() {
  const patient = getWmCurrentPatient();
  const patients = typeof getTcmPatients==='function' ? getTcmPatients() : [];
  let html = `<div class="wm-card"><h4>📋 健康档案</h4>`;
  if (!patients.length) {
    html += '<p style="color:#999">暂无病人档案，请在中医模块创建或点击下方新建</p>';
  } else {
    html += `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
      ${patients.map(pt => `<button class="wm-btn ${patient&&patient.id===pt.id?'wm-btn-primary':''}" style="font-size:12px;padding:4px 10px" onclick="setWmCurrentPatient('${pt.id}');showWmTab('patient')">${pt.name}</button>`).join('')}
    </div>`;
  }
  if (patient) {
    const ext = getWmPatientExt(patient.id);
    html += `<div style="padding:10px;background:#f5f9ff;border-radius:6px;margin-bottom:12px;font-size:13px;line-height:1.8">
      <b>${patient.name}</b>（${patient.gender}，${patient.age}岁）
      ${patient.allergies?'<br>过敏史：'+patient.allergies:''}
      ${patient.chronicDiseases?'<br>慢性病：'+patient.chronicDiseases:''}
      ${patient.familyHistory?'<br>家族史：'+patient.familyHistory:''}
      ${ext.bloodType?'<br>血型：'+ext.bloodType:''}
      ${ext.height?(' | 身高：'+ext.height+'cm'):''}${ext.weight?(' | 体重：'+ext.weight+'kg'):''}
    </div>`;
    html += renderWmExtForm(patient.id, ext);
    const records = getWmRecords(patient.id);
    html += `<h4 style="color:#1565c0;margin:14px 0 8px">诊疗记录（${records.length}）</h4>`;
    if (records.length) {
      html += records.slice(0,20).map(r => `<div class="wm-record-item">
        <div class="title">${r.date} - ${r.chiefComplaint||r.type||'记录'}</div>
        <div class="meta">${r.diagnosis?'诊断：'+r.diagnosis.slice(0,60)+'...':''}${r.medications?' | 用药：'+r.medications:''}</div>
      </div>`).join('');
    } else { html += '<p style="color:#999;font-size:12px">暂无诊疗记录</p>'; }
  }
  html += '</div>';
  return html;
}

function renderWmExtForm(patientId, ext) {
  return `<div style="padding:10px;background:#fafafa;border-radius:6px;margin-bottom:12px">
    <p style="font-size:12px;font-weight:bold;color:#1565c0;margin:0 0 8px">补充西医信息</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:end">
      <div class="wm-form-group" style="flex:1;min-width:80px;margin:0"><label>血型</label>
        <select id="wmExtBlood"><option value="">未知</option>${['A','B','AB','O'].map(t=>`<option ${ext.bloodType===t?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="wm-form-group" style="flex:1;min-width:80px;margin:0"><label>身高(cm)</label>
        <input id="wmExtH" type="number" value="${ext.height||''}" placeholder="170"></div>
      <div class="wm-form-group" style="flex:1;min-width:80px;margin:0"><label>体重(kg)</label>
        <input id="wmExtW" type="number" value="${ext.weight||''}" placeholder="65"></div>
      <button class="wm-btn wm-btn-primary" style="height:34px;font-size:12px" onclick="saveWmExt('${patientId}')">保存</button>
    </div>
  </div>`;
}

function saveWmExt(patientId) {
  const ext = {
    bloodType: document.getElementById('wmExtBlood')?.value||'',
    height: document.getElementById('wmExtH')?.value||'',
    weight: document.getElementById('wmExtW')?.value||''
  };
  saveWmPatientExt(patientId, ext);
  showWmTab('patient');
}
