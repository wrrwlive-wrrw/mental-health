// 中医智能诊疗 - AI智能体模块
let tcmAgentHistory = [];
let tcmAgentMode = 'consult'; // consult问诊, interpret解读, solution方案

function renderTcmAiAgent() {
  return `<div>
    <div style="padding:10px;background:#e8f5e9;border-radius:8px;margin-bottom:14px;font-size:12px;color:#1b5e20;line-height:1.6">
      AI智能体融合经典中医理论，提供智能问诊、病症解读和诊疗方案建议。配置API后即可使用。
    </div>
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <button class="tcm-btn ${tcmAgentMode==='consult'?'tcm-btn-primary':''}" onclick="switchTcmAgent('consult')">🩺 智能问诊</button>
      <button class="tcm-btn ${tcmAgentMode==='interpret'?'tcm-btn-primary':''}" onclick="switchTcmAgent('interpret')">📖 病症解读</button>
      <button class="tcm-btn ${tcmAgentMode==='solution'?'tcm-btn-primary':''}" onclick="switchTcmAgent('solution')">💊 诊疗方案</button>
    </div>
    <div style="font-size:12px;color:#666;margin-bottom:10px">${getTcmAgentModeDesc()}</div>
    <div class="tcm-chat" id="tcmAgentChat" style="min-height:200px">
      ${tcmAgentHistory.length ? tcmAgentHistory.map(m =>
        `<div class="tcm-chat-msg ${m.role}">${m.role==='ai'?formatTcmAnswer(m.content):m.content}</div>`
      ).join('') : `<div class="tcm-chat-msg ai">${getTcmAgentWelcome()}</div>`}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0">
      ${getTcmAgentQuickQ().map(q =>
        `<button class="tcm-btn" style="background:#e8f5e9;font-size:11px;padding:4px 10px" onclick="askTcmAgent('${q}')">${q}</button>`
      ).join('')}
    </div>
    <div class="tcm-chat-input">
      <input id="tcmAgentInput" placeholder="描述您的症状或问题..." onkeydown="if(event.key==='Enter')sendTcmAgent()">
      <button onclick="sendTcmAgent()">发送</button>
    </div>
    <div style="margin-top:8px">
      <button class="tcm-btn" style="background:#eee;font-size:12px" onclick="clearTcmAgent()">清空记录</button>
    </div>
  </div>`;
}

function switchTcmAgent(mode) {
  tcmAgentMode = mode;
  tcmAgentHistory = [];
  showTcmTab('aiAgent');
}

function getTcmAgentModeDesc() {
  const d = {
    consult: '像真实中医师一样逐步问诊，通过对话采集四诊信息，最终给出辨证分析',
    interpret: '输入症状或检查结果，AI从中医角度解读病因病机、证型归属',
    solution: '针对具体疾病或症状，提供完整的中医诊疗方案（辨证+方药+调养）'
  };
  return d[tcmAgentMode] || '';
}

function getTcmAgentWelcome() {
  const w = {
    consult: '您好，我是中医AI问诊助手。请描述您目前的主要不适，我将逐步为您采集四诊信息，最终给出辨证分析。<br><br>您可以先说说：哪里不舒服？持续多久了？',
    interpret: '您好，我是中医病症解读助手。请告诉我您的症状、体征或西医检查结果，我将从中医角度为您解读：<br>· 属于什么证型<br>· 病因病机是什么<br>· 涉及哪些脏腑经络',
    solution: '您好，我是中医诊疗方案助手。请描述您的疾病或症状，我将提供完整的中医诊疗方案：<br>· 辨证分型<br>· 治则治法<br>· 方药建议（含剂量）<br>· 食疗调养<br>· 生活起居指导'
  };
  return w[tcmAgentMode] || '';
}

function getTcmAgentQuickQ() {
  const qs = {
    consult: ['经常失眠多梦','胃胀不想吃饭','头痛伴颈椎不适','月经不调量少'],
    interpret: ['舌红苔黄腻是什么证','脉弦细数说明什么','肝功能异常中医怎么看','总是疲劳乏力'],
    solution: ['慢性胃炎怎么调理','焦虑失眠的中医方案','高血压的中医调治','颈椎病如何治疗']
  };
  return qs[tcmAgentMode] || [];
}

function askTcmAgent(q) {
  const input = document.getElementById('tcmAgentInput');
  if (input) input.value = q;
  sendTcmAgent();
}

async function sendTcmAgent() {
  const input = document.getElementById('tcmAgentInput');
  const text = input?.value.trim();
  if (!text) return;
  input.value = '';
  tcmAgentHistory.push({role:'user', content:text});
  refreshTcmAgentChat();

  if (!AI_CONFIG.apiKey) {
    tcmAgentHistory.push({role:'ai', content:'此功能需要配置AI API Key。请切换到"API设置"页面配置（推荐Groq免费平台）。'});
    refreshTcmAgentChat();
    return;
  }

  const sysPrompt = getTcmAgentSysPrompt();
  const messages = [{role:'system', content:sysPrompt}];
  tcmAgentHistory.slice(-14).forEach(m => {
    messages.push({role:m.role==='user'?'user':'assistant', content:m.content});
  });

  try {
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+AI_CONFIG.apiKey},
      body:JSON.stringify({model:AI_CONFIG.model, messages, max_tokens:2000, temperature:0.7})
    });
    if (!resp.ok) throw new Error('HTTP '+resp.status);
    const data = await resp.json();
    let reply = data.choices?.[0]?.message?.content || '';
    if (reply.includes('</think>')) reply = reply.split('</think>').pop().trim();
    tcmAgentHistory.push({role:'ai', content:reply});
  } catch(e) {
    tcmAgentHistory.push({role:'ai', content:'[连接失败] 请检查API设置。错误：'+e.message});
  }
  refreshTcmAgentChat();
}

function refreshTcmAgentChat() {
  const el = document.getElementById('tcmAgentChat');
  if (!el) return;
  el.innerHTML = tcmAgentHistory.map(m =>
    `<div class="tcm-chat-msg ${m.role}">${m.role==='ai'?formatTcmAnswer(m.content):m.content}</div>`
  ).join('');
  el.scrollTop = el.scrollHeight;
}

function clearTcmAgent() {
  tcmAgentHistory = [];
  showTcmTab('aiAgent');
}

function getTcmAgentSysPrompt() {
  const patient = getTcmCurrentPatient();
  let patientInfo = '';
  if (patient) {
    patientInfo = `\n【当前病人】${patient.name}，${patient.gender}，${patient.age}岁`;
    if (patient.constitution) patientInfo += `，体质：${patient.constitution}`;
    if (patient.chronicDiseases) patientInfo += `，慢性病：${patient.chronicDiseases}`;
  }

  const modePrompts = {
    consult: `当前模式：智能问诊
要求：
- 像真实中医师一样，循序渐进地问诊
- 每次只问2-3个问题，不要一次问太多
- 按照望闻问切的顺序采集信息
- 信息足够时主动进行辨证分析
- 最终给出：证型判断、病因病机、治则治法建议`,
    interpret: `当前模式：病症解读
要求：
- 对用户描述的症状从中医角度深度解读
- 分析属于哪个/哪些证型
- 解释病因病机（为什么会出现这些症状）
- 指出涉及的脏腑经络
- 与相似证型进行鉴别
- 如果用户提供西医检查结果，做中西医对照解读`,
    solution: `当前模式：诊疗方案
要求：
- 提供完整、系统的中医诊疗方案
- 格式包含：辨证分型、治则治法、主方、药物组成（含剂量）、加减变化
- 附加：煎服方法、食疗推荐、生活调养、注意事项
- 如有多种证型可能，分别给出方案
- 结尾注明仅供参考，建议就医`
  };

  return getTcmBasePrompt() + `
${patientInfo}

${modePrompts[tcmAgentMode] || ''}

【回答风格】条理清晰，分段论述，重点用【】标注。语气专业温和，如同一位经验丰富的老中医在耐心问诊。`;
}
