// 风水大师 - 个人健康档案模块
function renderFsHealth() {
  const records = getFsHealthRecords();
  const user = typeof getFsUser==='function' ? getFsUser() : null;
  return `<div>
    <h3 class="fs-h3">💊 个人健康档案</h3>
    <div style="padding:10px;background:#fff3e0;border-radius:8px;margin-bottom:14px;font-size:12px;color:#e65100;line-height:1.6">
      基于命理五行分析您的先天体质倾向，结合健康记录提供养生建议。仅供参考，如有疾病请就医。
    </div>
    ${user ? renderFsHealthProfile(user) : '<p style="color:#999;text-align:center">请先填写个人信息（点击顶部"填写个人信息"）</p>'}
    <h4 style="color:#8b6914;margin:16px 0 8px">📋 健康记录</h4>
    <button class="tcm-btn tcm-btn-primary" onclick="showFsHealthForm()" style="margin-bottom:12px">+ 添加健康记录</button>
    <div id="fsHealthFormArea"></div>
    <div id="fsHealthList">${renderFsHealthList(records)}</div>
  </div>`;
}

function renderFsHealthProfile(user) {
  const wuxing = user.yearWuxing || '未知';
  const analysis = getFsHealthAnalysis(wuxing);
  return `<div style="padding:12px;background:#f5f0e0;border-radius:8px;margin-bottom:14px;border:1px solid #d4a847">
    <p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#8b6914">五行体质分析</p>
    <p style="font-size:13px;margin:4px 0"><b>年柱五行：</b>${wuxing}</p>
    <p style="font-size:13px;margin:4px 0"><b>先天体质倾向：</b>${analysis.constitution}</p>
    <p style="font-size:13px;margin:4px 0"><b>易患疾病：</b>${analysis.risks}</p>
    <p style="font-size:13px;margin:4px 0"><b>养生重点：</b>${analysis.advice}</p>
    <p style="font-size:13px;margin:4px 0"><b>宜食：</b>${analysis.food}</p>
  </div>`;
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

function showFsHealthForm() {
  document.getElementById('fsHealthFormArea').innerHTML = `
    <div style="padding:12px;background:#f9f9f9;border-radius:8px;margin-bottom:12px">
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

function saveFsHealthEntry() {
  const symptom = document.getElementById('fsHSymptom')?.value.trim();
  if (!symptom) { alert('请填写症状'); return; }
  const records = getFsHealthRecords();
  records.unshift({
    id: 'fh_'+Date.now().toString(36),
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
  return records.slice(0,20).map(r => `<div class="tcm-case-item">
    <div class="title">${r.date} - ${r.symptom}</div>
    <div class="meta">情绪：${r.mood} | 睡眠：${r.sleep} ${r.note?'| '+r.note:''}</div>
  </div>`).join('');
}
