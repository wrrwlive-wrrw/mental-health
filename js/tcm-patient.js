// 中医智能诊疗 - 病人健康档案管理
let tcmCurrentPatientId = localStorage.getItem('tcm_current_patient') || '';

function getTcmPatients() {
  return JSON.parse(localStorage.getItem('tcm_patients') || '[]');
}
function saveTcmPatients(list) {
  localStorage.setItem('tcm_patients', JSON.stringify(list));
}
function getTcmCurrentPatient() {
  if (!tcmCurrentPatientId) return null;
  return getTcmPatients().find(p => p.id === tcmCurrentPatientId) || null;
}
function setTcmCurrentPatient(id) {
  tcmCurrentPatientId = id;
  localStorage.setItem('tcm_current_patient', id);
}

// 新建病人
function createTcmPatient(data) {
  const patients = getTcmPatients();
  const patient = {
    id: 'tp_' + Date.now().toString(36) + Math.random().toString(36).slice(2,5),
    name: data.name, gender: data.gender, age: parseInt(data.age)||0,
    phone: data.phone||'', constitution: data.constitution||'',
    allergies: data.allergies||'', chronicDiseases: data.chronicDiseases||'',
    familyHistory: data.familyHistory||'',
    createdAt: new Date().toISOString().slice(0,10),
    updatedAt: new Date().toISOString().slice(0,10),
    records: []
  };
  patients.push(patient);
  saveTcmPatients(patients);
  setTcmCurrentPatient(patient.id);
  return patient;
}

// 更新病人信息
function updateTcmPatient(id, data) {
  const patients = getTcmPatients();
  const idx = patients.findIndex(p => p.id === id);
  if (idx < 0) return;
  Object.assign(patients[idx], data, { updatedAt: new Date().toISOString().slice(0,10) });
  saveTcmPatients(patients);
}

// 添加诊疗记录
function addTcmRecord(patientId, record) {
  const patients = getTcmPatients();
  const p = patients.find(x => x.id === patientId);
  if (!p) return;
  record.id = 'tr_' + Date.now().toString(36);
  record.date = new Date().toISOString().slice(0,10);
  p.records.push(record);
  p.updatedAt = record.date;
  saveTcmPatients(patients);
}

// 删除病人
function deleteTcmPatient(id) {
  const patients = getTcmPatients().filter(p => p.id !== id);
  saveTcmPatients(patients);
  if (tcmCurrentPatientId === id) setTcmCurrentPatient('');
}

// 渲染病人列表页
function renderTcmPatientList() {
  const patients = getTcmPatients();
  return `
    <div style="margin-bottom:12px">
      <button class="tcm-btn tcm-btn-primary" onclick="showTcmNewPatientForm()">+ 新建病人档案</button>
    </div>
    <div id="tcmPatientFormArea"></div>
    ${patients.length===0 ? '<p style="color:#999;text-align:center">暂无病人档案，请点击上方按钮新建</p>' : ''}
    <div id="tcmPatientListArea">
      ${patients.map(p => `<div class="tcm-case-item" onclick="selectTcmPatient('${p.id}')">
        <div class="title">${p.name} <span style="font-weight:normal;color:#666">${p.gender} ${p.age}岁</span>
          ${p.id===tcmCurrentPatientId?'<span style="color:#2e7d32;font-size:12px">✓ 当前</span>':''}
        </div>
        <div class="meta">体质：${p.constitution||'未评估'} | 就诊${p.records.length}次 | 建档${p.createdAt}</div>
      </div>`).join('')}
    </div>`;
}

// 选择病人
function selectTcmPatient(id) {
  setTcmCurrentPatient(id);
  renderTcm();
}

// 显示新建表单
function showTcmNewPatientForm() {
  const el = document.getElementById('tcmPatientFormArea');
  if (!el) return;
  el.innerHTML = getTcmPatientFormHtml();
}

// 新建表单HTML
function getTcmPatientFormHtml() {
  const constitutions = ['平和质','气虚质','阳虚质','阴虚质','痰湿质','湿热质','血瘀质','气郁质','特禀质'];
  return `<div style="background:#f9f9f9;padding:14px;border-radius:8px;margin-bottom:14px">
    <h4 style="margin:0 0 10px;color:#2e7d32">新建病人档案</h4>
    <div class="tcm-form-group"><label>姓名 *</label><input id="tcmPName" placeholder="请输入姓名"></div>
    <div class="tcm-form-group"><label>性别</label><select id="tcmPGender"><option value="男">男</option><option value="女">女</option></select></div>
    <div class="tcm-form-group"><label>年龄</label><input id="tcmPAge" type="number" placeholder="年龄"></div>
    <div class="tcm-form-group"><label>联系电话</label><input id="tcmPPhone" placeholder="选填"></div>
    <div class="tcm-form-group"><label>体质类型</label><select id="tcmPConst"><option value="">--未评估--</option>${constitutions.map(c=>`<option value="${c}">${c}</option>`).join('')}</select></div>
    <div class="tcm-form-group"><label>过敏史</label><input id="tcmPAllergy" placeholder="如：青霉素过敏"></div>
    <div class="tcm-form-group"><label>慢性病史</label><input id="tcmPChronic" placeholder="如：高血压、糖尿病"></div>
    <div class="tcm-form-group"><label>家族病史</label><input id="tcmPFamily" placeholder="选填"></div>
    <div style="display:flex;gap:8px">
      <button class="tcm-btn tcm-btn-primary" onclick="submitTcmNewPatient()">保存</button>
      <button class="tcm-btn" style="background:#eee" onclick="document.getElementById('tcmPatientFormArea').innerHTML=''">取消</button>
    </div>
  </div>`;
}

function submitTcmNewPatient() {
  const name = document.getElementById('tcmPName')?.value.trim();
  if (!name) { alert('请输入姓名'); return; }
  createTcmPatient({
    name, gender: document.getElementById('tcmPGender').value,
    age: document.getElementById('tcmPAge').value,
    phone: document.getElementById('tcmPPhone').value,
    constitution: document.getElementById('tcmPConst').value,
    allergies: document.getElementById('tcmPAllergy').value,
    chronicDiseases: document.getElementById('tcmPChronic').value,
    familyHistory: document.getElementById('tcmPFamily').value
  });
  renderTcm();
}
