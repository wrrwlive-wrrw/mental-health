// 西医智能诊疗 - AI智能体模块
let wmAgentHistory = [];
let wmAgentMode = 'diagnose';

function renderWmAiAgent() {
  const patient = getWmCurrentPatient();
  let badge = '';
  if (patient) {
    const ext = getWmPatientExt(patient.id);
    badge = `<div style="padding:8px 12px;background:#e3f2fd;border-radius:6px;margin-bottom:10px;font-size:12px;color:#0d47a1;line-height:1.6">
      <b>当前病人：</b>${patient.name}（${patient.gender}，${patient.age}岁）
      ${patient.chronicDiseases?'| 慢病：'+patient.chronicDiseases:''}
      ${ext.bloodType?'| 血型：'+ext.bloodType:''}
    </div>`;
  }
  return `<div>
    ${badge}
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <button class="wm-btn ${wmAgentMode==='diagnose'?'wm-btn-primary':''}" onclick="switchWmAgent('diagnose')">🩺 智能诊断</button>
      <button class="wm-btn ${wmAgentMode==='interpret'?'wm-btn-primary':''}" onclick="switchWmAgent('interpret')">🔬 检查解读</button>
      <button class="wm-btn ${wmAgentMode==='treatment'?'wm-btn-primary':''}" onclick="switchWmAgent('treatment')">💊 治疗方案</button>
    </div>
    <div style="font-size:12px;color:#666;margin-bottom:10px">${getWmAgentDesc()}</div>
    <div class="wm-chat" id="wmAgentChat" style="min-height:200px">
      ${wmAgentHistory.length ? wmAgentHistory.map(m =>
        `<div class="wm-chat-msg ${m.role}">${m.role==='ai'?formatWmAnswer(m.content):m.content}</div>`
      ).join('') : `<div class="wm-chat-msg ai">${getWmAgentWelcome()}</div>`}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0">
      ${getWmQuickQ().map(q =>
        `<button class="wm-btn" style="font-size:11px;padding:4px 10px" onclick="askWmAgent('${q}')">${q}</button>`
      ).join('')}
    </div>
    <div class="wm-chat-input">
      <input id="wmAgentInput" placeholder="描述症状或输入检查结果..." onkeydown="if(event.key==='Enter')sendWmAgent()">
      <button onclick="sendWmAgent()">发送</button>
    </div>
    <div style="margin-top:8px">
      <button class="wm-btn" style="background:#f5f5f5;font-size:12px" onclick="clearWmAgent()">清空记录</button>
    </div>
  </div>`;
}

function switchWmAgent(mode) { wmAgentMode = mode; wmAgentHistory = []; showWmTab('aiAgent'); }
function clearWmAgent() { wmAgentHistory = []; showWmTab('aiAgent'); }

function getWmAgentDesc() {
  const d = { diagnose:'系统性问诊采集病史体征，给出鉴别诊断和检查建议', interpret:'解读化验单、影像报告等检查结果，分析临床意义', treatment:'根据诊断给出循证医学治疗方案（药物+非药物+随访）' };
  return d[wmAgentMode] || '';
}

function getWmAgentWelcome() {
  const w = { diagnose:'您好，我是西医AI诊断助手。请描述您的主要症状，我将系统性问诊后给出鉴别诊断建议。<br><br>请先告诉我：哪里不舒服？什么时候开始的？', interpret:'您好，我是检查报告解读助手。请输入您的化验结果或描述影像报告内容，我将为您专业解读：<br>· 异常指标含义<br>· 可能的疾病指向<br>· 后续建议', treatment:'您好，我是治疗方案助手。请告诉我您的诊断或症状，我将提供循证医学治疗方案：<br>· 药物治疗（含剂量疗程）<br>· 非药物治疗<br>· 随访计划<br>· 生活方式建议' };
  return w[wmAgentMode] || '';
}

function getWmQuickQ() {
  const qs = { diagnose:['反复咳嗽一个月','肝区隐痛乏力','血压偏高头晕','结合中医记录综合分析'], interpret:['转氨酶升高','胸部CT报告','血常规白细胞高','尿蛋白阳性'], treatment:['高血压治疗方案','2型糖尿病用药','幽门螺杆菌根除','结合中医给方案'] };
  return qs[wmAgentMode] || [];
}

function askWmAgent(q) { document.getElementById('wmAgentInput').value = q; sendWmAgent(); }

async function sendWmAgent() {
  const input = document.getElementById('wmAgentInput');
  const text = input?.value.trim();
  if (!text) return;
  input.value = '';
  wmAgentHistory.push({role:'user', content:text});
  refreshWmAgentChat();

  if (!AI_CONFIG.apiKey) {
    wmAgentHistory.push({role:'ai', content:'此功能需要配置AI API Key。请在中医模块的"API设置"页面配置（推荐Groq免费平台）。'});
    refreshWmAgentChat(); return;
  }

  const sysPrompt = getWmAgentSysPrompt();
  const messages = [{role:'system', content:sysPrompt}];
  wmAgentHistory.slice(-14).forEach(m => {
    messages.push({role:m.role==='user'?'user':'assistant', content:m.content});
  });

  try {
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+AI_CONFIG.apiKey},
      body:JSON.stringify({model:AI_CONFIG.model, messages, max_tokens:2000, temperature:0.6})
    });
    if (!resp.ok) throw new Error('HTTP '+resp.status);
    const data = await resp.json();
    let reply = data.choices?.[0]?.message?.content || '';
    if (reply.includes('</think>')) reply = reply.split('</think>').pop().trim();
    wmAgentHistory.push({role:'ai', content:reply});
  } catch(e) {
    wmAgentHistory.push({role:'ai', content:'[连接失败] 请检查API设置。错误：'+e.message});
  }
  refreshWmAgentChat();
}

function getWmAgentSysPrompt() {
  const patient = getWmCurrentPatient();
  const patientInfo = formatWmPatientPrompt(patient);
  const recordsInfo = formatWmRecordsPrompt(patient);
  const tcmRef = formatWmTcmCrossRef(patient);
  const prompts = { diagnose:getWmDiagnosePrompt(), interpret:getWmInterpretPrompt(), treatment:getWmTreatmentPrompt() };
  return (prompts[wmAgentMode]||getWmBasePrompt()) + patientInfo + recordsInfo + tcmRef +
    '\n\n【回答风格】条理清晰，分段论述。专业术语配通俗解释。重要内容用【】标注。';
}

function refreshWmAgentChat() {
  const el = document.getElementById('wmAgentChat');
  if (!el) return;
  el.innerHTML = wmAgentHistory.map(m =>
    `<div class="wm-chat-msg ${m.role}">${m.role==='ai'?formatWmAnswer(m.content):m.content}</div>`
  ).join('');
  el.scrollTop = el.scrollHeight;
}

function formatWmAnswer(text) {
  return text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
    .replace(/【(.*?)】/g,'<b style="color:#1565c0">【$1】</b>');
}
