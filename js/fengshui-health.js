// 风水大师 - 个人健康档案模块
function renderFsHealth() {
  const records = getFsHealthRecords();
  const persons = getFsHealthPersons();
  const current = getFsCurrentPerson();
  const user = typeof getFsUser==='function' ? getFsUser() : null;
  // 用当前选中人员或主用户来做五行分析
  const profileUser = current || (user && user.name ? user : null);
  return `<div>
    <h3 class="fs-h3">💊 个人健康档案</h3>
    <div style="padding:10px;background:#fff3e0;border-radius:8px;margin-bottom:14px;font-size:12px;color:#e65100;line-height:1.6">
      基于命理五行分析先天体质倾向，结合健康记录提供养生建议。支持多人管理，诊断结果自动保存到对应个人记录。
    </div>
    ${persons.length ? renderFsPersonList(persons, current) : ''}
    ${profileUser ? renderFsHealthProfile(profileUser) : '<p style="color:#999;text-align:center">请先添加人员信息或填写个人信息</p>'}
    <h4 style="color:#8b6914;margin:16px 0 8px">📋 健康记录</h4>
    <button class="tcm-btn tcm-btn-primary" onclick="showFsHealthForm()" style="margin-bottom:12px">+ 添加健康记录</button>
    <div id="fsHealthFormArea"></div>
    <div id="fsHealthList">${renderFsHealthList(current ? getPersonHealthRecords(current.id) : records)}</div>
  </div>`;
}

function renderFsHealthProfile(user) {
  const wuxing = (user.yearPillar && user.yearPillar.wuxing) || user.yearWuxing || '未知';
  const analysis = getFsHealthAnalysis(wuxing);
  return `<div style="padding:12px;background:#f5f0e0;border-radius:8px;margin-bottom:14px;border:1px solid #d4a847">
    <p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#8b6914">五行体质分析 - ${user.name||''}</p>
    <p style="font-size:12px;color:#666;margin:0 0 6px">属相：${user.zodiac||'--'} | 出生：${user.birthDate||'--'}${user.birthTime?' | 时辰：'+user.birthTime:''}</p>
    <p style="font-size:13px;margin:4px 0"><b>年柱五行：</b>${wuxing}</p>
    <p style="font-size:13px;margin:4px 0"><b>先天体质倾向：</b>${analysis.constitution}</p>
    <p style="font-size:13px;margin:4px 0"><b>易患疾病：</b>${analysis.risks}</p>
    <p style="font-size:13px;margin:4px 0"><b>养生重点：</b>${analysis.advice}</p>
    <p style="font-size:13px;margin:4px 0"><b>宜食：</b>${analysis.food}</p>
  </div>`;
}

// 人员列表展示
function renderFsPersonList(persons, current) {
  return `<div style="margin-bottom:14px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <h4 style="color:#8b6914;margin:0">👥 档案人员</h4>
      <button class="tcm-btn" style="background:#e8f5e9;font-size:11px" onclick="showFsHealthForm()">+ 新增</button>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      <button class="tcm-btn ${!current?'tcm-btn-primary':''}" style="${current?'background:#f5f5f5':''};font-size:12px;padding:4px 10px" onclick="switchFsHealthPerson('')">全部记录</button>
      ${persons.map(p => `
        <button class="tcm-btn ${current&&current.id===p.id?'tcm-btn-primary':''}" style="${!(current&&current.id===p.id)?'background:#f5f5f5':''};font-size:12px;padding:4px 10px" onclick="switchFsHealthPerson('${p.id}')">
          ${p.name}(${p.zodiac})
        </button>
      `).join('')}
    </div>
  </div>`;
}

function switchFsHealthPerson(personId) {
  setFsCurrentPerson(personId);
  if (typeof showFsTab==='function') showFsTab('health');
}

function getFsHealthAnalysis(wuxing) {
  const map = {
    '金': { constitution:'肺金体质，皮肤偏白，体型偏瘦', risks:'呼吸系统疾病、皮肤病、大肠疾病', advice:'润肺养阴，避免燥邪', food:'梨、百合、银耳、白萝卜、蜂蜜' },
    '木': { constitution:'肝木体质，体型修长，面色偏青', risks:'肝胆疾病、筋骨关节病、眼疾', advice:'疏肝理气，柔肝养血，忌怒', food:'枸杞、菊花、绿色蔬菜、酸味食物' },
    '水': { constitution:'肾水体质，面色偏暗，骨骼较重', risks:'肾脏泌尿疾病、腰膝酸软、耳疾', advice:'补肾固精，温阳益气，忌恐', food:'黑芝麻、核桃、山药、黑豆、栗子' },
    '火': { constitution:'心火体质，面色红润，性格急躁', risks:'心血管疾病、失眠、舌疮口疮', advice:'养心安神，清心降火，忌喜过度', food:'莲子、苦瓜、西瓜、绿豆、赤小豆' },
    '土': { constitution:'脾土体质，体型偏丰，面色偏黄', risks:'脾胃消化疾病、湿重、肥胖', advice:'健脾祛湿，调理中焦，忌思虑过度', food:'薏米、山药、茯苓、小米、南瓜' }
  };
  return map[wuxing] || { constitution:'请补充出生信息以分析', risks:'--', advice:'--', food:'--' };
}

function getFsHealthRecords() {
  return JSON.parse(localStorage.getItem('fs_health_records') || '[]');
}
function saveFsHealthRecords(list) {
  localStorage.setItem('fs_health_records', JSON.stringify(list));
}

// ========== 多人健康档案管理 ==========
function getFsHealthPersons() {
  return JSON.parse(localStorage.getItem('fs_health_persons') || '[]');
}
function saveFsHealthPersons(list) {
  localStorage.setItem('fs_health_persons', JSON.stringify(list));
}
function getFsCurrentPerson() {
  const id = localStorage.getItem('fs_health_current_person') || '';
  if (!id) return null;
  return getFsHealthPersons().find(p => p.id === id) || null;
}
function setFsCurrentPerson(id) {
  localStorage.setItem('fs_health_current_person', id);
}

// 获取某人的健康记录
function getPersonHealthRecords(personId) {
  const all = getFsHealthRecords();
  return all.filter(r => r.personId === personId);
}

function showFsHealthForm() {
  const persons = getFsHealthPersons();
  const current = getFsCurrentPerson();
  document.getElementById('fsHealthFormArea').innerHTML = `
    <div style="padding:12px;background:#f9f9f9;border-radius:8px;margin-bottom:12px">
      <div class="tcm-form-group"><label>记录对象</label>
        <div style="display:flex;gap:8px;align-items:center">
          <select id="fsHPerson" onchange="onFsHPersonChange()" style="flex:1">
            <option value="">-- 选择已有人员 --</option>
            ${persons.map(p=>`<option value="${p.id}" ${current&&current.id===p.id?'selected':''}>${p.name}（属${p.zodiac}，${p.birthDate}）</option>`).join('')}
          </select>
          <button class="tcm-btn" style="background:#e8f5e9;font-size:12px;white-space:nowrap" onclick="showNewPersonForm()">+ 新增人员</button>
        </div>
      </div>
      <div id="fsNewPersonArea"></div>
      <div class="tcm-form-group"><label>日期</label><input id="fsHDate" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="tcm-form-group"><label>症状/不适</label><input id="fsHSymptom" placeholder="如：头痛、失眠、胃胀"></div>
      <div class="tcm-form-group"><label>情绪状态</label>
        <select id="fsHMood"><option>平静</option><option>焦虑</option><option>抑郁</option><option>烦躁</option><option>愉快</option></select>
      </div>
      <div class="tcm-form-group"><label>睡眠质量</label>
        <select id="fsHSleep"><option>良好</option><option>一般</option><option>差</option><option>失眠</option></select>
      </div>
      <div class="tcm-form-group"><label>备注</label><input id="fsHNote" placeholder="其他记录"></div>
      <div style="display:flex;gap:8px">
        <button class="tcm-btn tcm-btn-primary" onclick="saveFsHealthEntry()">保存</button>
        <button class="tcm-btn" style="background:#eee" onclick="document.getElementById('fsHealthFormArea').innerHTML=''">取消</button>
      </div>
    </div>`;
}

function showNewPersonForm() {
  document.getElementById('fsNewPersonArea').innerHTML = `
    <div style="padding:10px;background:#e8f5e9;border-radius:6px;margin-bottom:10px;border:1px solid #a5d6a7">
      <p style="font-size:12px;color:#2e7d32;margin:0 0 8px;font-weight:bold">新增人员信息</p>
      <div class="tcm-form-group"><label>姓名 *</label><input id="fsNewName" placeholder="请输入姓名"></div>
      <div class="tcm-form-group"><label>出生日期 *</label><input id="fsNewBirth" type="date"></div>
      <div class="tcm-form-group"><label>性别</label>
        <select id="fsNewGender"><option>男</option><option>女</option></select>
      </div>
      <div class="tcm-form-group"><label>出生时辰</label>
        <select id="fsNewBirthTime">
          <option value="">未知</option>
          <option>子(23-1)</option><option>丑(1-3)</option><option>寅(3-5)</option><option>卯(5-7)</option>
          <option>辰(7-9)</option><option>巳(9-11)</option><option>午(11-13)</option><option>未(13-15)</option>
          <option>申(15-17)</option><option>酉(17-19)</option><option>戌(19-21)</option><option>亥(21-23)</option>
        </select>
      </div>
      <div class="tcm-form-group"><label>备注</label><input id="fsNewRemark" placeholder="如：家人、朋友"></div>
      <div style="display:flex;gap:8px">
        <button class="tcm-btn tcm-btn-primary" onclick="saveNewPerson()">确认添加</button>
        <button class="tcm-btn" style="background:#eee" onclick="document.getElementById('fsNewPersonArea').innerHTML=''">取消</button>
      </div>
    </div>`;
}

function saveNewPerson() {
  const name = document.getElementById('fsNewName')?.value.trim();
  const birthDate = document.getElementById('fsNewBirth')?.value;
  if (!name || !birthDate) { alert('姓名和出生日期为必填'); return; }
  const year = new Date(birthDate).getFullYear();
  const zodiac = typeof calcZodiac==='function' ? calcZodiac(year) : '';
  const yearPillar = typeof calcYearGanZhi==='function' ? calcYearGanZhi(year) : null;
  const person = {
    id: 'fp_' + Date.now().toString(36),
    name,
    birthDate,
    gender: document.getElementById('fsNewGender')?.value || '',
    birthTime: document.getElementById('fsNewBirthTime')?.value || '',
    zodiac,
    yearPillar,
    remark: document.getElementById('fsNewRemark')?.value.trim() || '',
    createdAt: new Date().toISOString()
  };
  const persons = getFsHealthPersons();
  persons.push(person);
  saveFsHealthPersons(persons);
  setFsCurrentPerson(person.id);
  // 刷新表单
  showFsHealthForm();
}

function onFsHPersonChange() {
  const val = document.getElementById('fsHPerson')?.value;
  if (val) setFsCurrentPerson(val);
}

function saveFsHealthEntry() {
  const symptom = document.getElementById('fsHSymptom')?.value.trim();
  if (!symptom) { alert('请填写症状'); return; }
  const personId = document.getElementById('fsHPerson')?.value;
  if (!personId) { alert('请选择记录对象（或先新增人员）'); return; }
  const person = getFsHealthPersons().find(p=>p.id===personId);
  const records = getFsHealthRecords();
  records.unshift({
    id: 'fh_'+Date.now().toString(36),
    personId,
    personName: person ? person.name : '未知',
    personZodiac: person ? person.zodiac : '',
    personBirth: person ? person.birthDate : '',
    date: document.getElementById('fsHDate').value,
    symptom, mood: document.getElementById('fsHMood').value,
    sleep: document.getElementById('fsHSleep').value,
    note: document.getElementById('fsHNote')?.value||''
  });
  saveFsHealthRecords(records);
  document.getElementById('fsHealthFormArea').innerHTML = '';
  document.getElementById('fsHealthList').innerHTML = renderFsHealthList(records);
}

function renderFsHealthList(records) {
  if (!records.length) return '<p style="color:#999;text-align:center;font-size:13px">暂无记录</p>';
  return records.slice(0,30).map(r => `<div class="tcm-case-item">
    <div class="title">${r.personName||'--'} | ${r.date} - ${r.symptom}</div>
    <div class="meta">${r.personZodiac?'属'+r.personZodiac+' | ':''}情绪：${r.mood} | 睡眠：${r.sleep} ${r.note?'| '+r.note:''}</div>
  </div>`).join('');
}

// 获取健康记录摘要（供AI智能体调用）
function getFsHealthSummary(personId) {
  let records;
  if (personId) {
    records = getPersonHealthRecords(personId);
  } else {
    records = getFsHealthRecords();
  }
  if (!records.length) return '';
  const recent = records.slice(0, 10);
  return recent.map(r =>
    `${r.date}：${r.personName||''}，症状[${r.symptom}]，情绪[${r.mood}]，睡眠[${r.sleep}]${r.note?'，备注:'+r.note:''}`
  ).join('\n');
}

// 获取所有人员信息摘要（供AI智能体调用）
function getFsPersonsSummary() {
  const persons = getFsHealthPersons();
  if (!persons.length) return '';
  return persons.map(p => {
    const wuxing = p.yearPillar ? p.yearPillar.wuxing : '';
    const records = getPersonHealthRecords(p.id);
    return `${p.name}（${p.gender}，${p.birthDate}，属${p.zodiac}，${wuxing}命，${records.length}条健康记录）`;
  }).join('；');
}
