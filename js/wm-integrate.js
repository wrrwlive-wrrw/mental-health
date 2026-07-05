// 西医智能诊疗 - 中西医结合分析模块
let wmIntegrateResult = '';

function renderWmIntegrate() {
  const patient = getWmCurrentPatient();
  if (!patient) return '<div class="wm-card"><p style="color:#999;text-align:center">请先选择病人</p></div>';
  const wmRecords = getWmRecords(patient.id);
  const tcmRecords = patient.records || [];
  return `<div>
    <div class="wm-card">
      <h4 style="color:#1565c0">🔗 中西医结合分析 - ${patient.name}</h4>
      <p style="font-size:12px;color:#666;margin:4px 0 12px">综合中医辨证与西医诊断，给出中西医结合治疗方案</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
        <div style="padding:10px;background:#e8f5e9;border-radius:6px">
          <p style="font-size:12px;font-weight:bold;color:#2e7d32;margin:0 0 6px">中医诊疗（${tcmRecords.length}次）</p>
          ${tcmRecords.length ? tcmRecords.slice(-3).map(r => `<p style="font-size:11px;color:#333;margin:2px 0">${r.date||''}：${r.chiefComplaint||''} ${r.syndrome?'→辨证：'+(typeof r.syndrome==='object'?r.syndrome.result:r.syndrome).slice(0,30):''}</p>`).join('') : '<p style="font-size:11px;color:#999">暂无中医记录</p>'}
        </div>
        <div style="padding:10px;background:#e3f2fd;border-radius:6px">
          <p style="font-size:12px;font-weight:bold;color:#1565c0;margin:0 0 6px">西医诊疗（${wmRecords.length}次）</p>
          ${wmRecords.length ? wmRecords.slice(0,3).map(r => `<p style="font-size:11px;color:#333;margin:2px 0">${r.date}：${r.chiefComplaint||''} ${r.diagnosis?'→'+r.diagnosis.slice(0,30):''}</p>`).join('') : '<p style="font-size:11px;color:#999">暂无西医记录</p>'}
        </div>
      </div>
      <div class="wm-form-group"><label>补充说明（可选）</label>
        <input id="wmIntNote" placeholder="希望重点分析的方向，如：肝病的中西医结合方案">
      </div>
      <button class="wm-btn wm-btn-primary" onclick="runWmIntegrateAI()">AI中西结合分析</button>
    </div>
    <div id="wmIntegrateResult" class="wm-card" style="${wmIntegrateResult?'':'display:none'}">
      ${wmIntegrateResult ? formatWmAnswer(wmIntegrateResult) : ''}
    </div>
  </div>`;
}

async function runWmIntegrateAI() {
  const patient = getWmCurrentPatient();
  if (!patient) return;
  if (!AI_CONFIG.apiKey) { alert('请先配置AI API Key'); return; }
  const note = document.getElementById('wmIntNote')?.value.trim()||'';
  const patientInfo = formatWmPatientPrompt(patient);
  const wmRec = formatWmRecordsPrompt(patient);
  const tcmRef = formatWmTcmCrossRef(patient);

  const prompt = getWmIntegratePrompt() + patientInfo + wmRec + tcmRef +
    `\n\n请对该病人进行中西医结合分析：
1. 西医诊断与中医辨证的对应关系
2. 中西医结合治疗方案（西药+中药/针灸）
3. 中西药联用注意事项
4. 综合调养建议
${note?'【重点方向】'+note:''}`;

  wmIntegrateResult = '正在分析...';
  showWmTab('integrate');
  try {
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+AI_CONFIG.apiKey},
      body:JSON.stringify({model:AI_CONFIG.model, messages:[{role:'system',content:prompt}], max_tokens:2000, temperature:0.6})
    });
    const data = await resp.json();
    let reply = data.choices?.[0]?.message?.content||'分析失败';
    if (reply.includes('</think>')) reply = reply.split('</think>').pop().trim();
    wmIntegrateResult = reply;
  } catch(e) { wmIntegrateResult = '连接失败：'+e.message; }
  showWmTab('integrate');
}
