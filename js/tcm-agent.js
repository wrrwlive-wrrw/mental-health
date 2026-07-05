// 中医智能诊疗 - AI智能体模块
let tcmAgentHistory = [];
let tcmAgentMode = 'consult'; // consult问诊, interpret解读, solution方案

function renderTcmAiAgent() {
  const patient = getTcmCurrentPatient();
  let patientBadge = '';
  if (patient) {
    patientBadge = `<div style="padding:8px 12px;background:#fff3e0;border-radius:6px;margin-bottom:10px;font-size:12px;color:#e65100;line-height:1.6">
      <b>已加载档案：</b>${patient.name}（${patient.gender}，${patient.age}岁）
      ${patient.constitution?'| 体质：'+patient.constitution:''}
      ${patient.chronicDiseases?'| 慢病：'+patient.chronicDiseases:''}
      | 就诊${patient.records?patient.records.length:0}次
    </div>`;
  }
  return `<div>
    <div style="padding:10px;background:#e8f5e9;border-radius:8px;margin-bottom:14px;font-size:12px;color:#1b5e20;line-height:1.6">
      AI智能体融合经典中医理论，提供智能问诊、病症解读和诊疗方案建议。已自动加载当前病人的健康档案与就诊记录。
    </div>
    ${patientBadge}
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
    consult: ['经常失眠多梦','胃胀不想吃饭','结合我的档案分析体质','头痛伴颈椎不适'],
    interpret: ['舌红苔黄腻是什么证','结合就诊记录分析病情变化','肝功能异常中医怎么看','总是疲劳乏力'],
    solution: ['根据我的体质给调理方案','焦虑失眠的中医方案','综合既往病史给建议','颈椎病如何治疗']
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
  let recordsInfo = '';

  if (patient) {
    patientInfo = `\n【当前病人档案】
姓名：${patient.name}，性别：${patient.gender}，年龄：${patient.age}岁
体质类型：${patient.constitution||'未评估'}
过敏史：${patient.allergies||'无'}
慢性病史：${patient.chronicDiseases||'无'}
家族病史：${patient.familyHistory||'无'}
建档日期：${patient.createdAt}`;

    // 加入就诊记录
    if (patient.records && patient.records.length > 0) {
      const recent = patient.records.slice(-10);
      recordsInfo = `\n【就诊记录（近${recent.length}次）】\n` +
        recent.map(r => {
          let entry = `${r.date}：`;
          if (r.chiefComplaint) entry += `主诉[${r.chiefComplaint}]`;
          if (r.syndrome) entry += `，辨证[${r.syndrome}]`;
          if (r.prescription) entry += `，处方[${r.prescription}]`;
          if (r.diagnosis) entry += `，诊断[${r.diagnosis}]`;
          if (r.symptoms) entry += `，症状[${r.symptoms}]`;
          if (r.treatment) entry += `，治疗[${r.treatment}]`;
          if (r.note) entry += `，备注[${r.note}]`;
          return entry;
        }).join('\n');
    }
  }

  // 尝试获取风水模块的健康记录（跨模块调用）
  let fsHealthInfo = '';
  if (typeof getFsHealthSummary === 'function') {
    const summary = getFsHealthSummary();
    if (summary) {
      fsHealthInfo = `\n【健康日志记录】\n${summary}`;
    }
  }

  const modePrompts = {
    consult: `当前模式：智能问诊
要求：
- 像真实中医师一样，循序渐进地问诊
- 每次只问2-3个问题，不要一次问太多
- 按照望闻问切的顺序采集信息
- 主动参考病人既往就诊记录和健康档案，发现规律和关联
- 信息足够时主动进行辨证分析
- 最终给出：证型判断、病因病机、治则治法建议`,
    interpret: `当前模式：病症解读
要求：
- 对用户描述的症状从中医角度深度解读
- 结合病人的体质类型、慢性病史和既往就诊记录综合分析
- 分析属于哪个/哪些证型
- 解释病因病机（为什么会出现这些症状）
- 指出涉及的脏腑经络
- 与相似证型进行鉴别
- 如果用户提供西医检查结果，做中西医对照解读`,
    solution: `当前模式：诊疗方案
要求：
- 提供完整、系统的中医诊疗方案
- 参考病人既往治疗方案的效果反馈，优化用药
- 格式包含：辨证分型、治则治法、主方、药物组成（含剂量）、加减变化
- 附加：煎服方法、食疗推荐、生活调养、注意事项
- 如有多种证型可能，分别给出方案
- 结尾注明仅供参考，建议就医`
  };

  return getTcmBasePrompt() + `
${patientInfo}
${recordsInfo}
${fsHealthInfo}

${modePrompts[tcmAgentMode] || ''}

【回答风格】条理清晰，分段论述，重点用【】标注。语气专业温和，如同一位经验丰富的老中医在耐心问诊。
【重要】当用户询问与健康相关的问题时，你应主动结合已有的健康档案、就诊记录进行综合分析，指出既往病史与当前症状的关联，并追踪治疗进展。`;
}
