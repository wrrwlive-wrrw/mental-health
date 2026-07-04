// 风水大师 - AI智能体模块
let fsAgentHistory = [];
let fsAgentMode = 'interpret'; // interpret解读, guide指导, solution方案

function renderFsAiAgent() {
  return `<div>
    <h3 class="fs-h3">🤖 AI智能体</h3>
    <div style="padding:10px;background:#f3e5f5;border-radius:8px;margin-bottom:14px;font-size:12px;color:#4a148c;line-height:1.6">
      AI智能体融合易经、命理、风水、相术等传统文化知识，为您提供个性化解读与建议。
    </div>
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <button class="tcm-btn ${fsAgentMode==='interpret'?'tcm-btn-primary':''}" onclick="switchFsAgent('interpret')">🔮 命理解读</button>
      <button class="tcm-btn ${fsAgentMode==='guide'?'tcm-btn-primary':''}" onclick="switchFsAgent('guide')">🧭 运势指导</button>
      <button class="tcm-btn ${fsAgentMode==='solution'?'tcm-btn-primary':''}" onclick="switchFsAgent('solution')">💡 解决方案</button>
    </div>
    <div style="font-size:12px;color:#666;margin-bottom:10px">${getFsAgentModeDesc()}</div>
    <div class="tcm-chat" id="fsAgentChat" style="min-height:200px">
      ${fsAgentHistory.length ? fsAgentHistory.map(m =>
        `<div class="tcm-chat-msg ${m.role}">${m.role==='ai'?formatFsAnswer(m.content):m.content}</div>`
      ).join('') : `<div class="tcm-chat-msg ai">${getFsAgentWelcome()}</div>`}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0">
      ${getFsQuickQuestions().map(q =>
        `<button class="tcm-btn" style="background:#f5f0e0;font-size:11px;padding:4px 10px" onclick="askFsAgent('${q}')">${q}</button>`
      ).join('')}
    </div>
    <div class="tcm-chat-input">
      <input id="fsAgentInput" placeholder="输入您的问题..." onkeydown="if(event.key==='Enter')sendFsAgent()">
      <button onclick="sendFsAgent()">发送</button>
    </div>
    <div style="margin-top:8px;display:flex;gap:8px">
      <button class="tcm-btn" style="background:#eee;font-size:12px" onclick="clearFsAgent()">清空记录</button>
    </div>
  </div>`;
}

function switchFsAgent(mode) {
  fsAgentMode = mode;
  fsAgentHistory = [];
  showFsTab('aiAgent');
}

function getFsAgentModeDesc() {
  const descs = {
    interpret: '根据您的八字、命盘信息，解读命理格局、五行强弱、十神关系',
    guide: '分析当前大运流年，提供事业、感情、健康等方面的运势指导',
    solution: '针对具体问题（事业困境、感情纠葛、健康隐患），给出命理层面的化解方案'
  };
  return descs[fsAgentMode] || '';
}

function getFsAgentWelcome() {
  const msgs = {
    interpret: '您好，我是命理解读AI。请告诉我您的出生年月日时（或直接提问），我将为您解读八字格局、紫微命盘、五行旺衰等命理信息。',
    guide: '您好，我是运势指导AI。请告诉我您想了解哪方面的运势（事业/感情/财运/健康/学业），我将结合命理为您分析当前运势走向和注意事项。',
    solution: '您好，我是命理解决方案AI。请描述您当前遇到的困扰或问题，我将从命理、风水、择日等角度为您提供化解建议和具体方案。'
  };
  return msgs[fsAgentMode] || '';
}

function getFsQuickQuestions() {
  const qs = {
    interpret: ['分析我的八字格局','我的五行缺什么','我的命中贵人方位','十神看性格特点'],
    guide: ['今年事业运如何','感情运势分析','财运方向建议','健康注意事项'],
    solution: ['事业遇到瓶颈怎么办','如何改善人际关系','最近总失眠怎么调','搬家选什么方位好']
  };
  return qs[fsAgentMode] || [];
}

function askFsAgent(question) {
  const input = document.getElementById('fsAgentInput');
  if (input) input.value = question;
  sendFsAgent();
}

async function sendFsAgent() {
  const input = document.getElementById('fsAgentInput');
  const text = input?.value.trim();
  if (!text) return;
  input.value = '';
  fsAgentHistory.push({role:'user', content:text});
  refreshFsAgentChat();

  if (!AI_CONFIG.apiKey) {
    const fallback = getFsAgentFallback(text);
    fsAgentHistory.push({role:'ai', content:fallback});
    refreshFsAgentChat();
    return;
  }

  // 调用AI
  const sysPrompt = getFsAgentPrompt();
  const messages = [{role:'system', content:sysPrompt}];
  fsAgentHistory.slice(-12).forEach(m => {
    messages.push({role: m.role==='user'?'user':'assistant', content:m.content});
  });

  try {
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+AI_CONFIG.apiKey},
      body:JSON.stringify({model:AI_CONFIG.model, messages, max_tokens:1500, temperature:0.8})
    });
    if (!resp.ok) throw new Error('HTTP '+resp.status);
    const data = await resp.json();
    let reply = data.choices?.[0]?.message?.content || '';
    if (reply.includes('</think>')) reply = reply.split('</think>').pop().trim();
    fsAgentHistory.push({role:'ai', content:reply});
  } catch(e) {
    fsAgentHistory.push({role:'ai', content:'[连接失败] '+getFsAgentFallback(text)});
  }
  refreshFsAgentChat();
}

function refreshFsAgentChat() {
  const el = document.getElementById('fsAgentChat');
  if (!el) return;
  el.innerHTML = fsAgentHistory.map(m =>
    `<div class="tcm-chat-msg ${m.role}">${m.role==='ai'?(typeof formatFsAnswer==='function'?formatFsAnswer(m.content):m.content):m.content}</div>`
  ).join('');
  el.scrollTop = el.scrollHeight;
}

function clearFsAgent() {
  fsAgentHistory = [];
  showFsTab('aiAgent');
}

function getFsAgentPrompt() {
  const user = typeof getFsUserInfo==='function' ? getFsUserInfo() : null;
  let userInfo = '';
  if (user) {
    userInfo = `\n【用户信息】姓名：${user.name||'未知'}，性别：${user.gender||'未知'}，出生：${user.birthDate||'未知'} ${user.birthHour||''}时，生肖：${user.zodiac||''}，年柱：${user.yearGanZhi||''}，五行：${user.yearWuxing||''}`;
  }
  const modePrompts = {
    interpret: '当前模式：命理解读。请详细分析用户的命理格局，包括八字结构、五行旺衰、十神配置、格局高低、大运走势。',
    guide: '当前模式：运势指导。请结合用户命理信息分析当前运势，提供具体的事业、感情、健康等方面指导建议，指出需要注意的时间节点。',
    solution: '当前模式：解决方案。用户正在咨询具体问题，请从命理、风水、择日、五行调理等多角度给出具体可操作的化解方案和建议。'
  };
  return `你是一位精通中华传统文化的AI智能体，融贯以下经典：
- 《易经》：阴阳八卦、六十四卦
- 《三命通会》《渊海子平》《滴天髓》《子平真诠》：八字命理
- 《紫微斗数全书》：紫微命盘
- 《麻衣神相》《柳庄神相》：面相手相
- 《葬书》《玉匣记》：风水择吉

${modePrompts[fsAgentMode]||''}
${userInfo}

【回答原则】
1. 引经据典，展现专业性
2. 条理清晰，分点论述
3. 给出具体可操作的建议
4. 语气温和有智慧，像一位阅历丰富的老师
5. 适当提醒"仅供参考，重大决策需综合考虑"
6. 如用户未提供出生信息，主动询问`;
}

function getFsAgentFallback(msg) {
  return '此功能需要配置AI API Key。请进入"中医智能诊疗"模块的"API设置"页面配置（推荐Groq免费平台）。\n\n配置后即可使用AI命理解读、运势指导和解决方案功能。';
}

function formatFsAnswer(text) {
  if (typeof formatFsAnswer_orig === 'function') return formatFsAnswer_orig(text);
  return text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
    .replace(/【(.*?)】/g,'<b style="color:#8b6914">【$1】</b>');
}

