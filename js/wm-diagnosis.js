// 西医智能诊疗 - 结构化诊断流程
let wmDiagStep = 0;
let wmDiagData = { chiefComplaint:'', hpi:'', pmh:'', pe:'', labs:'', imaging:'', aiResult:'', attachments:[] };

function renderWmDiagnosis() {
  const p = getWmCurrentPatient();
  if (!p) return '<div class="wm-card"><p style="color:#999;text-align:center">请先在"健康档案"中选择或新建病人</p></div>';
  const steps = ['主诉','病史','体查','检查','AI诊断','方案'];
  return `<div>
    <div class="wm-steps">${steps.map((s,i) =>
      `<span class="wm-step ${i===wmDiagStep?'active':''} ${i<wmDiagStep?'done':''}">${i+1}.${s}</span>`
    ).join('')}</div>
    <div id="wmDiagBody">${renderWmDiagStepContent()}</div>
  </div>`;
}

function renderWmDiagStepContent() {
  switch(wmDiagStep) {
    case 0: return renderWmStep0();
    case 1: return renderWmStep1();
    case 2: return renderWmStep2();
    case 3: return renderWmStep3();
    case 4: return renderWmStep4();
    case 5: return renderWmStep5();
    default: return '';
  }
}

function renderWmStep0() {
  return `<div class="wm-card">
    <h4>主诉与现病史</h4>
    <div class="wm-form-group"><label>主诉（主要不适+持续时间）</label>
      <input id="wmChief" value="${wmDiagData.chiefComplaint}" placeholder="如：反复咳嗽伴咳痰1个月"></div>
    <div class="wm-form-group"><label>现病史（发病经过、症状变化、诊治经过）</label>
      <textarea id="wmHpi" placeholder="如：1个月前受凉后出现咳嗽，初为干咳，后有黄痰...">${wmDiagData.hpi}</textarea></div>
    <button class="wm-btn wm-btn-primary" onclick="wmDiagNext(0)">下一步 →</button>
  </div>`;
}

function renderWmStep1() {
  return `<div class="wm-card">
    <h4>既往史与个人史</h4>
    <div class="wm-form-group"><label>既往病史、手术史、用药史</label>
      <textarea id="wmPmh" placeholder="如：高血压5年，服用氨氯地平5mg/日...">${wmDiagData.pmh}</textarea></div>
    <div style="display:flex;gap:8px">
      <button class="wm-btn" onclick="wmDiagStep=0;showWmTab('diagnosis')">← 上一步</button>
      <button class="wm-btn wm-btn-primary" onclick="wmDiagNext(1)">下一步 →</button>
    </div>
  </div>`;
}

function renderWmStep2() {
  return `<div class="wm-card">
    <h4>体格检查</h4>
    <div class="wm-form-group"><label>生命体征与系统查体</label>
      <textarea id="wmPe" placeholder="如：T 37.5℃，BP 130/85mmHg，双肺呼吸音粗...">${wmDiagData.pe}</textarea></div>
    <div style="display:flex;gap:8px">
      <button class="wm-btn" onclick="wmDiagStep=1;showWmTab('diagnosis')">← 上一步</button>
      <button class="wm-btn wm-btn-primary" onclick="wmDiagNext(2)">下一步 →</button>
    </div>
  </div>`;
}

function renderWmStep3() {
  const files = wmDiagData.attachments || [];
  return `<div class="wm-card">
    <h4>辅助检查</h4>
    <div class="wm-form-group"><label>化验结果</label>
      <textarea id="wmLabs" placeholder="如：WBC 12.5×10^9/L，CRP 45mg/L...">${wmDiagData.labs}</textarea></div>
    <div class="wm-form-group"><label>影像检查</label>
      <textarea id="wmImaging" placeholder="如：胸部CT示右下肺斑片影...">${wmDiagData.imaging}</textarea></div>
    <div style="margin:12px 0;padding:12px;background:#f5f9ff;border-radius:8px;border:1px dashed #90caf9">
      <p style="font-size:12px;font-weight:bold;color:#1565c0;margin:0 0 8px">📎 附件采集（报告单/影像/视频）</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        <label class="wm-btn" style="font-size:12px;cursor:pointer">
          📄 上传文档<input type="file" accept=".pdf,.doc,.docx,.txt" multiple hidden onchange="wmAddFiles(this,'doc')">
        </label>
        <label class="wm-btn" style="font-size:12px;cursor:pointer">
          🖼️ 上传图片<input type="file" accept="image/*" multiple hidden onchange="wmAddFiles(this,'image')">
        </label>
        <label class="wm-btn" style="font-size:12px;cursor:pointer">
          🎥 上传视频<input type="file" accept="video/*" hidden onchange="wmAddFiles(this,'video')">
        </label>
        <label class="wm-btn" style="font-size:12px;cursor:pointer">
          📷 拍照<input type="file" accept="image/*" capture="environment" hidden onchange="wmAddFiles(this,'image')">
        </label>
      </div>
      <div id="wmAttachList">${renderWmAttachments(files)}</div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="wm-btn" onclick="wmDiagStep=2;showWmTab('diagnosis')">← 上一步</button>
      <button class="wm-btn wm-btn-primary" onclick="wmDiagNext(3)">AI诊断分析 →</button>
    </div>
  </div>`;
}

function renderWmStep4() {
  return `<div class="wm-card">
    <h4>AI诊断分析</h4>
    <div id="wmDiagResult" style="min-height:100px">${wmDiagData.aiResult?formatWmAnswer(wmDiagData.aiResult):'<p style="color:#999">正在分析中...</p>'}</div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="wm-btn" onclick="wmDiagStep=3;showWmTab('diagnosis')">← 修改检查</button>
      <button class="wm-btn wm-btn-primary" onclick="wmDiagStep=5;showWmTab('diagnosis')">生成方案 →</button>
      <button class="wm-btn" style="background:#e8f5e9" onclick="saveWmDiagRecord()">保存记录</button>
    </div>
  </div>`;
}

function renderWmStep5() {
  return `<div class="wm-card">
    <h4>治疗方案</h4>
    <div id="wmTreatResult" style="min-height:100px"><p style="color:#999">正在生成方案...</p></div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="wm-btn" onclick="wmDiagStep=4;showWmTab('diagnosis')">← 返回诊断</button>
      <button class="wm-btn" style="background:#e8f5e9" onclick="saveWmDiagRecord()">保存完整记录</button>
      <button class="wm-btn wm-btn-primary" onclick="resetWmDiag()">新建诊断</button>
    </div>
  </div>`;
}

function wmDiagNext(step) {
  if (step===0) {
    wmDiagData.chiefComplaint = document.getElementById('wmChief')?.value.trim()||'';
    wmDiagData.hpi = document.getElementById('wmHpi')?.value.trim()||'';
    if (!wmDiagData.chiefComplaint) { alert('请填写主诉'); return; }
  } else if (step===1) {
    wmDiagData.pmh = document.getElementById('wmPmh')?.value.trim()||'';
  } else if (step===2) {
    wmDiagData.pe = document.getElementById('wmPe')?.value.trim()||'';
  } else if (step===3) {
    wmDiagData.labs = document.getElementById('wmLabs')?.value.trim()||'';
    wmDiagData.imaging = document.getElementById('wmImaging')?.value.trim()||'';
    wmDiagStep = 4; showWmTab('diagnosis'); runWmDiagAI(); return;
  }
  wmDiagStep = step + 1;
  showWmTab('diagnosis');
}

async function runWmDiagAI() {
  if (!AI_CONFIG.apiKey) { wmDiagData.aiResult='需要配置AI API Key'; showWmTab('diagnosis'); return; }
  const patient = getWmCurrentPatient();
  const info = formatWmPatientPrompt(patient);
  const prompt = getWmDiagnosePrompt() + info + `\n\n请根据以下病史资料进行诊断分析：
【主诉】${wmDiagData.chiefComplaint}
【现病史】${wmDiagData.hpi||'未提供'}
【既往史】${wmDiagData.pmh||'未提供'}
【体格检查】${wmDiagData.pe||'未提供'}
【化验】${wmDiagData.labs||'未提供'}
【影像】${wmDiagData.imaging||'未提供'}

请给出：1.初步诊断 2.鉴别诊断 3.诊断依据 4.建议进一步检查`;
  try {
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+AI_CONFIG.apiKey},
      body:JSON.stringify({model:AI_CONFIG.model, messages:[{role:'system',content:prompt}], max_tokens:2000, temperature:0.5})
    });
    const data = await resp.json();
    let reply = data.choices?.[0]?.message?.content||'分析失败';
    if (reply.includes('</think>')) reply = reply.split('</think>').pop().trim();
    wmDiagData.aiResult = reply;
  } catch(e) { wmDiagData.aiResult = '连接失败：'+e.message; }
  showWmTab('diagnosis');
}

function saveWmDiagRecord() {
  const patient = getWmCurrentPatient();
  if (!patient) return;
  const attachSummary = (wmDiagData.attachments||[]).map(f => `${f.name}(${f.type})`).join('、');
  addWmRecord(patient.id, {
    type:'diagnosis', chiefComplaint:wmDiagData.chiefComplaint,
    hpi:wmDiagData.hpi, pmh:wmDiagData.pmh, pe:wmDiagData.pe,
    examResults:(wmDiagData.labs+' '+wmDiagData.imaging).trim(),
    attachments: (wmDiagData.attachments||[]).map(f => ({name:f.name, type:f.type, mime:f.mime, size:f.size, addedAt:f.addedAt})),
    diagnosis:wmDiagData.aiResult, medications:'',
    note: attachSummary ? '附件：'+attachSummary : ''
  });
  alert('诊断记录已保存');
}

function resetWmDiag() {
  wmDiagStep = 0;
  wmDiagData = { chiefComplaint:'', hpi:'', pmh:'', pe:'', labs:'', imaging:'', aiResult:'', attachments:[] };
  showWmTab('diagnosis');
}

// ========== 附件采集功能 ==========
function wmAddFiles(input, type) {
  if (!input.files || !input.files.length) return;
  if (!wmDiagData.attachments) wmDiagData.attachments = [];
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      wmDiagData.attachments.push({
        id: 'att_' + Date.now().toString(36) + Math.random().toString(36).slice(2,6),
        name: file.name,
        type: type,
        size: file.size,
        mime: file.type,
        data: e.target.result,
        addedAt: new Date().toISOString()
      });
      document.getElementById('wmAttachList').innerHTML = renderWmAttachments(wmDiagData.attachments);
    };
    if (type === 'image') { reader.readAsDataURL(file); }
    else if (type === 'video') { reader.readAsDataURL(file); }
    else { reader.readAsDataURL(file); }
  });
  input.value = '';
}

function renderWmAttachments(files) {
  if (!files || !files.length) return '<p style="font-size:11px;color:#999;margin:0">暂无附件</p>';
  return `<div style="display:flex;flex-wrap:wrap;gap:8px">${files.map((f, i) => {
    let preview = '';
    if (f.type === 'image' && f.data) {
      preview = `<img src="${f.data}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;display:block;margin-bottom:4px">`;
    } else if (f.type === 'video' && f.data) {
      preview = `<video src="${f.data}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;display:block;margin-bottom:4px"></video>`;
    } else {
      const icon = f.type==='doc'?'📄':'📎';
      preview = `<div style="width:60px;height:60px;background:#e3f2fd;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:4px">${icon}</div>`;
    }
    return `<div style="text-align:center;position:relative;width:70px">
      ${preview}
      <p style="font-size:10px;color:#555;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:70px">${f.name}</p>
      <span onclick="wmRemoveAttach(${i})" style="position:absolute;top:-4px;right:-4px;background:#f44336;color:#fff;border-radius:50%;width:16px;height:16px;font-size:10px;line-height:16px;text-align:center;cursor:pointer">×</span>
    </div>`;
  }).join('')}</div>`;
}

function wmRemoveAttach(idx) {
  if (!wmDiagData.attachments) return;
  wmDiagData.attachments.splice(idx, 1);
  document.getElementById('wmAttachList').innerHTML = renderWmAttachments(wmDiagData.attachments);
}

function wmPreviewAttach(idx) {
  const f = wmDiagData.attachments[idx];
  if (!f) return;
  if (f.type === 'image') { window.open(f.data, '_blank'); }
  else if (f.type === 'video') { window.open(f.data, '_blank'); }
}
