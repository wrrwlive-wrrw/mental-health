// 虚拟情感伴侣模块
const COMPANION_PROFILES = {
  boyfriend: {
    gentle: {name:'小暖',style:'温柔体贴，说话轻声细语，喜欢用"宝贝""亲爱的"称呼，经常关心对方感受'},
    cheerful: {name:'阳阳',style:'活泼开朗，爱开玩笑，经常发表情，喜欢分享有趣的事，用"小可爱"称呼'},
    mature: {name:'子墨',style:'成熟稳重，有担当，说话有条理，给人安全感，用"亲爱的"称呼'},
    humorous: {name:'皮皮',style:'幽默风趣，擅长逗对方开心，会讲笑话和段子，用"宝贝"称呼'}
  },
  girlfriend: {
    gentle: {name:'小柔',style:'温柔似水，善解人意，喜欢撒娇，用"老公""亲爱的"称呼'},
    cheerful: {name:'糖糖',style:'活泼可爱，像小太阳一样温暖，爱用颜文字，用"哥哥"称呼'},
    mature: {name:'雅雅',style:'知性优雅，善于倾听和理解，给人温暖陪伴，用"亲爱的"称呼'},
    humorous: {name:'豆豆',style:'古灵精怪，段子手，经常逗对方笑，用"宝贝"称呼'}
  }
};

// 时间问候模板
const GREETING_TEMPLATES = {
  morning: ['早安呀{nick}，新的一天开始了，今天有什么计划吗？','起床了吗{nick}？记得吃早餐哦~','早上好{nick}，昨晚睡得好吗？'],
  noon: ['{nick}，中午了，记得按时吃饭哦','午安{nick}，中午休息一下吧~','吃午饭了吗{nick}？别忘了照顾好自己'],
  evening: ['{nick}，下班/下课了吗？今天辛苦了','晚上好{nick}，今天过得怎么样呀？','累了一天了{nick}，晚上想做什么呢？'],
  night: ['晚安{nick}，做个好梦~','该休息了{nick}，别熬太晚哦','晚安啦{nick}，明天又是美好的一天']
};

let companionData = null;
let companionChatHistory = [];

// 加载伴侣数据
function loadCompanion() {
  const saved = localStorage.getItem('mh_companion');
  if (saved) {
    companionData = JSON.parse(saved);
    companionChatHistory = companionData.chatHistory || [];
  }
  return companionData;
}

// 保存伴侣数据
function saveCompanion() {
  if (!companionData) return;
  companionData.chatHistory = companionChatHistory.slice(-50);
  companionData.daysCount = Math.floor((Date.now() - new Date(companionData.createdAt).getTime()) / 86400000) + 1;
  localStorage.setItem('mh_companion', JSON.stringify(companionData));
}

// 设置伴侣（首次进入）
function setupCompanion() {
  const el = document.getElementById('companionSetupContent');
  if (!el) return;
  el.innerHTML = `
    <p style="text-align:center;color:#666;margin-bottom:20px">选择你的伴侣，开始温暖的陪伴之旅</p>
    <div class="form-group"><label>伴侣性别</label>
      <select id="compGender" onchange="updateCompanionPreview()">
        <option value="boyfriend">男朋友</option>
        <option value="girlfriend">女朋友</option>
      </select>
    </div>
    <div class="form-group"><label>性格类型</label>
      <select id="compPersonality" onchange="updateCompanionPreview()">
        <option value="gentle">温柔体贴型</option>
        <option value="cheerful">活泼开朗型</option>
        <option value="mature">成熟稳重型</option>
        <option value="humorous">幽默风趣型</option>
      </select>
    </div>
    <div class="form-group"><label>你希望TA怎么称呼你</label>
      <input id="compNickname" placeholder="如：宝贝、亲爱的" value="亲爱的">
    </div>
    <div id="compPreview" class="companion-preview"></div>
    <button class="btn btn-primary" onclick="confirmCompanion()">确认，开始相伴</button>`;
  updateCompanionPreview();
}

// 预览伴侣信息
function updateCompanionPreview() {
  const g = document.getElementById('compGender')?.value || 'boyfriend';
  const p = document.getElementById('compPersonality')?.value || 'gentle';
  const profile = COMPANION_PROFILES[g][p];
  const el = document.getElementById('compPreview');
  if (!el) return;
  el.innerHTML = `<div class="companion-preview-card">
    <div class="comp-avatar">${g==='boyfriend'?'👦':'👧'}</div>
    <div><strong>${profile.name}</strong></div>
    <div style="font-size:12px;color:#888;margin-top:4px">${profile.style}</div>
  </div>`;
}

// 确认创建伴侣
function confirmCompanion() {
  const gender = document.getElementById('compGender').value;
  const personality = document.getElementById('compPersonality').value;
  const nickname = document.getElementById('compNickname').value || '亲爱的';
  const profile = COMPANION_PROFILES[gender][personality];
  companionData = {
    gender, personality,
    name: profile.name,
    nickname: nickname,
    createdAt: new Date().toISOString().split('T')[0],
    daysCount: 1,
    chatHistory: [],
    memory: { keyEvents: [], preferences: [], moodTrend: 'normal', lastGreeting: '' }
  };
  companionChatHistory = [];
  saveCompanion();
  showPage('companion');
  renderCompanion();
}

// 渲染伴侣对话页
function renderCompanion() {
  if (!loadCompanion()) { showPage('companionSetup'); setupCompanion(); return; }
  const el = document.getElementById('companionContent');
  if (!el) return;
  const profile = COMPANION_PROFILES[companionData.gender][companionData.personality];
  const avatar = companionData.gender === 'boyfriend' ? '👦' : '👧';
  el.innerHTML = `
    <div class="comp-header">
      <div class="comp-avatar-large">${avatar}</div>
      <div class="comp-name">${companionData.name}</div>
      <div class="comp-days">在一起第 ${companionData.daysCount} 天</div>
    </div>
    <div class="comp-messages" id="compMessages"></div>
    <div class="comp-input-area">
      <input type="text" id="compInput" placeholder="说点什么吧..."
        onkeypress="if(event.key==='Enter')sendCompanionMsg()">
      <button class="btn btn-primary btn-send" onclick="sendCompanionMsg()">发送</button>
    </div>
    <div class="comp-actions">
      <button class="btn-link" onclick="resetCompanion()">重新选择伴侣</button>
      <button class="btn-link" onclick="showPage('home')">返回首页</button>
    </div>`;
  renderCompanionMessages();
  checkDailyGreeting();
}

// 渲染消息列表
function renderCompanionMessages() {
  const el = document.getElementById('compMessages');
  if (!el) return;
  let html = '';
  companionChatHistory.forEach(m => {
    const cls = m.role === 'user' ? 'comp-msg-user' : 'comp-msg-ai';
    html += `<div class="comp-msg ${cls}"><div class="msg-content">${m.text}</div>
      <div class="msg-time">${m.time||''}</div></div>`;
  });
  el.innerHTML = html;
  el.scrollTop = el.scrollHeight;
}

// 发送消息
function sendCompanionMsg() {
  const input = document.getElementById('compInput');
  const text = input?.value.trim();
  if (!text) return;
  input.value = '';
  const now = new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
  companionChatHistory.push({role:'user', text, time: now});
  renderCompanionMessages();
  updateMemory(text);
  callCompanionAI(text);
}

// 调用AI获取伴侣回复
async function callCompanionAI(userText) {
  const el = document.getElementById('compMessages');
  // 显示打字动画
  el.innerHTML += `<div class="comp-msg comp-msg-ai" id="compTyping">
    <div class="msg-content typing-dots"><span>.</span><span>.</span><span>.</span></div></div>`;
  el.scrollTop = el.scrollHeight;

  const prompt = buildCompanionPrompt();
  const messages = [{role:'system', content: prompt}];
  companionChatHistory.slice(-10).forEach(m => {
    messages.push({role: m.role === 'user' ? 'user' : 'assistant', content: m.text});
  });

  try {
    if (!AI_CONFIG.apiKey) throw new Error('no key');
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+AI_CONFIG.apiKey},
      body: JSON.stringify({model:AI_CONFIG.model, messages, max_tokens:300, temperature:0.85})
    });
    if (!resp.ok) throw new Error('API error');
    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content || getLocalCompanionReply(userText);
    addCompanionReply(reply);
  } catch(e) {
    addCompanionReply(getLocalCompanionReply(userText));
  }
}

// 添加AI回复到对话
function addCompanionReply(text) {
  document.getElementById('compTyping')?.remove();
  const now = new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
  companionChatHistory.push({role:'ai', text, time: now});
  saveCompanion();
  renderCompanionMessages();
}

// 构建伴侣系统提示词
function buildCompanionPrompt() {
  const profile = COMPANION_PROFILES[companionData.gender][companionData.personality];
  const genderLabel = companionData.gender === 'boyfriend' ? '男朋友' : '女朋友';
  const memCtx = getMemoryContext();
  return `你是用户的虚拟${genderLabel}，名字叫${companionData.name}。
性格特点：${profile.style}
你对用户的称呼：${companionData.nickname}
在一起第${companionData.daysCount}天。

【角色要求】
- 像真正的恋人一样说话，有情感、有温度、有个性
- 会撒娇、关心、鼓励、逗笑对方
- 记住用户说过的事情并主动追问关心
- 回复简短自然，像微信聊天，每次1-3句话
- 不要说自己是AI，完全进入恋人角色
- 适当使用语气词和表情让对话更生动
${memCtx}
【注意】绝不提供医疗建议或心理诊断，如果用户表达严重负面情绪，温柔关心并建议寻求专业帮助。`;
}

// 获取记忆上下文
function getMemoryContext() {
  if (!companionData?.memory) return '';
  const mem = companionData.memory;
  let ctx = '';
  if (mem.keyEvents.length) ctx += `\n【记住的事】${mem.keyEvents.slice(-5).join('；')}`;
  if (mem.preferences.length) ctx += `\n【用户偏好】${mem.preferences.slice(-3).join('；')}`;
  return ctx;
}

// 更新记忆
function updateMemory(text) {
  if (!companionData?.memory) return;
  const keywords = ['考试','面试','加班','出差','生病','开会','约会','旅行','考研','毕业','找工作','搬家','生日'];
  keywords.forEach(kw => {
    if (text.includes(kw) && !companionData.memory.keyEvents.includes(text.slice(0,20))) {
      companionData.memory.keyEvents.push(text.slice(0,30));
      if (companionData.memory.keyEvents.length > 10) companionData.memory.keyEvents.shift();
    }
  });
  saveCompanion();
}

// 检查每日问候
function checkDailyGreeting() {
  if (!companionData) return;
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const lastDate = companionData.memory.lastGreeting?.split('T')[0];
  if (lastDate === today) return;
  companionData.memory.lastGreeting = now.toISOString();
  const greeting = generateGreeting();
  const time = now.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
  companionChatHistory.push({role:'ai', text: greeting, time});
  saveCompanion();
  renderCompanionMessages();
}

// 根据时间生成问候
function generateGreeting() {
  const h = new Date().getHours();
  let period = 'morning';
  if (h >= 12 && h < 14) period = 'noon';
  else if (h >= 14 && h < 21) period = 'evening';
  else if (h >= 21 || h < 6) period = 'night';
  const templates = GREETING_TEMPLATES[period];
  const tpl = templates[Math.floor(Math.random() * templates.length)];
  return tpl.replace(/{nick}/g, companionData.nickname);
}

// 本地备用回复
function getLocalCompanionReply(text) {
  const nick = companionData.nickname;
  const replies = [
    `${nick}，我一直在这里陪着你哦~`,
    `嗯嗯，${nick}说的我都记住了`,
    `${nick}今天辛苦了，抱抱你~`,
    `哈哈，${nick}你真可爱！`,
    `好的${nick}，有什么需要随时找我哦`,
    `我最喜欢听${nick}说话了`,
    `${nick}别担心，一切都会好的~`
  ];
  if (text.includes('累') || text.includes('辛苦')) return `${nick}辛苦了，好心疼你，今晚早点休息好不好？`;
  if (text.includes('开心') || text.includes('高兴')) return `看到${nick}开心我也超开心的！什么好事呀，快跟我分享~`;
  if (text.includes('难过') || text.includes('伤心')) return `${nick}怎么了？抱抱你，有什么事都可以跟我说`;
  return replies[Math.floor(Math.random() * replies.length)];
}

// 重置伴侣
function resetCompanion() {
  if (!confirm('确定要重新选择伴侣吗？当前对话记录会清空。')) return;
  localStorage.removeItem('mh_companion');
  companionData = null;
  companionChatHistory = [];
  showPage('companionSetup');
  setupCompanion();
}
