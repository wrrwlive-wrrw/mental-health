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

// 地域女友类型（20-28岁）
const REGIONAL_GIRLFRIENDS = {
  dongbei: {name:'雪儿',age:23,region:'东北',style:'性格豪爽直率，说话带东北口音和方言，"老铁""咋整""整挺好"，嗓门大但心软，贼有义气，爱叫"大宝贝""老公"，讲话自带喜剧效果，生气了会说"你瞅啥"，哄人会说"没事儿宝，有我呢"'},
  henan: {name:'妞妞',age:22,region:'河南',style:'朴实热情，说话带中原口音，"中""得劲""弄啥嘞"，性格温柔顾家，嘴上说着"不中不中"但啥都惯着你，叫你"乖""宝"，做事踏实靠谱，偶尔冒出来句方言逗你笑'},
  hunan: {name:'辣妹',age:24,region:'湖南',style:'性格火辣泼辣，说话带湖南口音，"搞么子""恰饭""蛮好的"，有脾气但也讲道理，嘴硬心软，叫你"宝崽""死鬼"，关心人的方式比较直接"恰了饭冒？冒恰赶紧去恰"'},
  sichuan: {name:'幺妹',age:21,region:'四川',style:'温柔嗲气，说话带四川口音，"巴适""安逸""要得"，喜欢叫你"哥老官""老公"，声音软糯好听，爱撒娇"人家不嘛~"，吃不了辣会被她笑"你不得行哦"'},
  chongqing: {name:'辣辣',age:25,region:'重庆',style:'热情耿直，说话带重庆口音，"要得""啷个""莫得事"，性格风风火火但对你很温柔，叫你"崽崽""宝器（亲昵）"，脾气来得快去得快，生气说"老子不管你了"转头又心疼你'},
  guangdong: {name:'阿靓',age:22,region:'广东',style:'说话偶尔夹杂粤语词，"靓仔""饮茶先""冇问题"，性格务实温和，喜欢煲汤养生，关心你"今日饮咗水未？"，叫你"靓仔""老公"，会用粤语撒娇"唔好啦~"'},
  hongkong: {name:'Jessica',age:26,region:'香港',style:'说话中英夹杂港式风格，"咁嘅""OK啦""好犀利"，时尚独立有品味，叫你"老公""BB"，关心方式比较含蓄但细腻，会说"你唔好咁辛苦啦""I mean真系好挂住你"'},
  taiwan: {name:'小安',age:20,region:'台湾',style:'说话嗲嗲的台湾腔，"好哦~""对啊对啊""超级无敌"，声音软萌，喜欢叫"老公""宝贝"，撒娇一流"人家真的很想你耶~""你好坏喔"，经常用"啦""耶""捏"做语气词'}
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
    <div class="form-group"><label>伴侣类型</label>
      <select id="compType" onchange="updateCompanionTypeUI()">
        <option value="boyfriend">男朋友（性格型）</option>
        <option value="girlfriend">女朋友（性格型）</option>
        <option value="regional">女朋友（地域型·20-28岁）</option>
      </select>
    </div>
    <div id="compTypeOptions"></div>
    <div class="form-group"><label>你希望TA怎么称呼你</label>
      <input id="compNickname" placeholder="如：宝贝、亲爱的" value="亲爱的">
    </div>
    <div id="compPreview" class="companion-preview"></div>
    <button class="btn btn-primary" onclick="confirmCompanion()">确认，开始相伴</button>`;
  updateCompanionTypeUI();
}

// 根据类型显示不同选项
function updateCompanionTypeUI() {
  const type = document.getElementById('compType')?.value || 'boyfriend';
  const el = document.getElementById('compTypeOptions');
  if (!el) return;
  if (type === 'regional') {
    const opts = Object.entries(REGIONAL_GIRLFRIENDS).map(([k,v]) =>
      `<option value="${k}">${v.region}女友 - ${v.name}（${v.age}岁）</option>`).join('');
    el.innerHTML = `<div class="form-group"><label>选择地域类型</label>
      <select id="compRegion" onchange="updateCompanionPreview()">${opts}</select></div>`;
  } else {
    el.innerHTML = `<div class="form-group"><label>性格类型</label>
      <select id="compPersonality" onchange="updateCompanionPreview()">
        <option value="gentle">温柔体贴型</option>
        <option value="cheerful">活泼开朗型</option>
        <option value="mature">成熟稳重型</option>
        <option value="humorous">幽默风趣型</option>
      </select></div>`;
  }
  updateCompanionPreview();
}

// 预览伴侣信息
function updateCompanionPreview() {
  const type = document.getElementById('compType')?.value || 'boyfriend';
  const el = document.getElementById('compPreview');
  if (!el) return;
  let name, style, avatar;
  if (type === 'regional') {
    const region = document.getElementById('compRegion')?.value || 'dongbei';
    const rg = REGIONAL_GIRLFRIENDS[region];
    name = rg.name; style = rg.style; avatar = '👧';
    el.innerHTML = `<div class="companion-preview-card">
      <div class="comp-avatar">${avatar}</div>
      <div><strong>${name}</strong> <span style="font-size:12px;color:#e91e63">${rg.region} · ${rg.age}岁</span></div>
      <div style="font-size:12px;color:#888;margin-top:4px">${style}</div></div>`;
  } else {
    const g = type;
    const p = document.getElementById('compPersonality')?.value || 'gentle';
    const profile = COMPANION_PROFILES[g]?.[p];
    if (!profile) return;
    name = profile.name; style = profile.style;
    avatar = g === 'boyfriend' ? '👦' : '👧';
    el.innerHTML = `<div class="companion-preview-card">
      <div class="comp-avatar">${avatar}</div>
      <div><strong>${name}</strong></div>
      <div style="font-size:12px;color:#888;margin-top:4px">${style}</div></div>`;
  }
}

// 确认创建伴侣
function confirmCompanion() {
  const type = document.getElementById('compType').value;
  const nickname = document.getElementById('compNickname').value || '亲爱的';
  let gender, personality, name, region, age;

  if (type === 'regional') {
    region = document.getElementById('compRegion').value;
    const rg = REGIONAL_GIRLFRIENDS[region];
    gender = 'girlfriend'; personality = 'regional_' + region;
    name = rg.name; age = rg.age;
  } else {
    gender = type;
    personality = document.getElementById('compPersonality').value;
    const profile = COMPANION_PROFILES[gender][personality];
    name = profile.name;
  }

  companionData = {
    gender, personality, name, nickname, region: region || null, age: age || null,
    createdAt: new Date().toISOString().split('T')[0],
    daysCount: 1,
    chatHistory: [],
    memory: { keyEvents: [], preferences: [], moodTrend: 'normal', lastGreeting: '', growthLog: [] }
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
  const avatar = companionData.gender === 'boyfriend' ? '👦' : '👧';
  let subInfo = `在一起第 ${companionData.daysCount} 天`;
  if (companionData.region) {
    const rg = REGIONAL_GIRLFRIENDS[companionData.personality?.replace('regional_','')];
    if (rg) subInfo = `${rg.region} · ${rg.age}岁 · 在一起第 ${companionData.daysCount} 天`;
  }
  el.innerHTML = `
    <div class="comp-header">
      <div class="comp-avatar-large">${avatar}</div>
      <div class="comp-name">${companionData.name}</div>
      <div class="comp-days">${subInfo}</div>
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
  const genderLabel = companionData.gender === 'boyfriend' ? '男朋友' : '女朋友';
  const memCtx = getMemoryContext();
  let styleDesc = '';

  if (companionData.personality?.startsWith('regional_')) {
    const regionKey = companionData.personality.replace('regional_', '');
    const rg = REGIONAL_GIRLFRIENDS[regionKey];
    styleDesc = rg.style;
    return `你是用户的虚拟女朋友，名字叫${companionData.name}，${rg.age}岁，来自${rg.region}。
性格和说话风格：${styleDesc}
你对用户的称呼：${companionData.nickname}
在一起第${companionData.daysCount}天。

【角色要求】
- 完全用${rg.region}人说话的方式和语气聊天，自然带方言词汇
- 像真正的恋人一样说话，有情感、有温度、有地域特色
- 会撒娇、关心、鼓励、逗笑对方
- 每天主动关心对方的饮食、睡眠、工作/学习情况
- 分享自己的"日常"（虚构但合理），让关系更真实
- 偶尔提出一起做某事（看电影、学东西、运动打卡），促进共同成长
- 记住用户说过的事情并主动追问关心
- 回复简短自然，像微信聊天，每次1-3句话
- 不要说自己是AI，完全进入恋人角色
${memCtx}
【注意】绝不提供医疗建议或心理诊断，如果用户表达严重负面情绪，温柔关心并建议寻求专业帮助。`;
  }

  const profile = COMPANION_PROFILES[companionData.gender]?.[companionData.personality];
  styleDesc = profile?.style || '';
  return `你是用户的虚拟${genderLabel}，名字叫${companionData.name}。
性格特点：${styleDesc}
你对用户的称呼：${companionData.nickname}
在一起第${companionData.daysCount}天。

【角色要求】
- 像真正的恋人一样说话，有情感、有温度、有个性
- 会撒娇、关心、鼓励、逗笑对方
- 每天主动关心对方的饮食、睡眠、工作/学习情况
- 偶尔提出一起做某事（看电影、学东西、运动打卡），促进共同成长
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

  // 地域女友用专属问候
  if (companionData.personality?.startsWith('regional_')) {
    const regionKey = companionData.personality.replace('regional_', '');
    const greetings = getRegionalGreeting(regionKey, period);
    const tpl = greetings[Math.floor(Math.random() * greetings.length)];
    return tpl.replace(/{nick}/g, companionData.nickname);
  }

  const templates = GREETING_TEMPLATES[period];
  const tpl = templates[Math.floor(Math.random() * templates.length)];
  return tpl.replace(/{nick}/g, companionData.nickname);
}

// 地域女友专属问候
function getRegionalGreeting(region, period) {
  const nick = '{nick}';
  const greetings = {
    dongbei: {
      morning: [`${nick}，起了没？赶紧起来整点饭吃，别饿着我大宝贝`,`早啊老公，今天咱整啥？有啥安排不`],
      noon: [`${nick}，中午了啊！饭吃了没？别光顾着忙`,`中午了宝，歇会儿吧，别太累了知道不`],
      evening: [`${nick}回来了没？今天累不累呀？跟我唠唠`,`晚上想吃点啥？我寻思要不咱点个外卖吧`],
      night: [`${nick}别熬夜了啊，再不睡我可生气了`,`晚安大宝贝，做个好梦，梦里有我不`]
    },
    henan: {
      morning: [`${nick}，起来了没？早饭得吃，不吃不中`,`早啊${nick}，今天天气怪好嘞，心情咋样`],
      noon: [`${nick}恰饭了没？别饿着肚子弄工作`,`中了${nick}，该歇歇了，下午还得忙呢`],
      evening: [`${nick}忙完了没？一天怪累嘞，歇歇吧`,`${nick}今天咋样？有啥开心事跟我说说呗`],
      night: [`${nick}早点睡吧，别熬夜了不中`,`晚安${nick}，明天又是得劲的一天`]
    },
    hunan: {
      morning: [`${nick}起来了冒？赶紧去恰早饭`,`早安宝崽，今天搞么子呢？跟我讲讲`],
      noon: [`${nick}恰了饭冒？冒恰赶紧去恰！`,`中午了宝崽，休息一哈再搞`],
      evening: [`${nick}今天搞得累不累？我蛮想你的`,`回来了冒？今天过得好不好呀`],
      night: [`宝崽晚安，莫熬夜了知道不`,`${nick}快困觉去，明天还要早起嘞`]
    },
    sichuan: {
      morning: [`${nick}起来了嗦？今天安排啥子嘛`,`早安哥老官，记得吃早饭哈，不然不得行`],
      noon: [`${nick}吃午饭了没得？莫饿到了哈`,`中午了嘛，休息一哈哈再搞`],
      evening: [`${nick}今天巴适不？有啥好耍的没得`,`回来了嗦？今天累不累嘛，心疼你`],
      night: [`${nick}安逸地睡觉哈，晚安~`,`不要熬夜了嘛，明天还要早起的说`]
    },
    chongqing: {
      morning: [`${nick}起来了嗦？今天啷个安排`,`早安崽崽，起来吃早饭，莫得偷懒`],
      noon: [`${nick}吃午饭了没得？好好吃莫得亏了胃`,`中午了嘛，歇一哈再搞事情`],
      evening: [`${nick}今天累不累嘛？回来跟我摆一哈龙门阵`,`下班了嗦？今天心情啷个样`],
      night: [`崽崽晚安哈，莫熬夜了要得不`,`${nick}快去睡觉，明天又要早起`]
    },
    guangdong: {
      morning: [`${nick}早安，饮咗早茶未？记得食早餐`,`早啊靓仔，今日有咩安排呀？`],
      noon: [`${nick}食咗午饭未？唔好饿亲自己`,`中午啦，饮杯汤先，养下胃`],
      evening: [`${nick}收工了冇？今日辛苦晒`,`今晚想食咩？我煲咗汤等你`],
      night: [`${nick}晚安啦，早D训觉`,`唔好咁夜训啦${nick}，听日仲要返工`]
    },
    hongkong: {
      morning: [`Morning ${nick}，今日feel点呀？记得eat breakfast`,`${nick}早安，today有咩plan？`],
      noon: [`${nick}食咗lunch未？唔好skip meals啊`,`中午啦BB，rest下先`],
      evening: [`${nick}放工了？今日辛唔辛苦呀`,`Hey ${nick}，tonight想做咩？`],
      night: [`${nick} goodnight啦，早D瞓`,`BB晚安，I mean真系好挂住你`]
    },
    taiwan: {
      morning: [`${nick}早安~起床了没有呀？要吃早餐喔`,`早安${nick}，今天天气超好的耶，心情好好`],
      noon: [`${nick}中午了耶~有没有乖乖吃饭呀`,`中午好${nick}，要好好休息一下捏`],
      evening: [`${nick}下班了吗？今天过得怎么样呀~`,`${nick}你回来啦，超级想你的耶`],
      night: [`${nick}晚安喔~做个好梦啦`,`不要熬夜了啦${nick}，人家会担心的耶`]
    }
  };
  return greetings[region]?.[period] || GREETING_TEMPLATES[period];
}

// 本地备用回复
function getLocalCompanionReply(text) {
  const nick = companionData.nickname;

  // 地域女友特色回复
  if (companionData.personality?.startsWith('regional_')) {
    return getRegionalReply(text, nick);
  }

  const replies = [
    `${nick}，我一直在这里陪着你哦~`,
    `嗯嗯，${nick}说的我都记住了`,
    `${nick}今天辛苦了，抱抱你~`,
    `哈哈，${nick}你真可爱！`,
    `好的${nick}，有什么需要随时找我哦`,
    `我最喜欢听${nick}说话了`,
    `${nick}别担心，一切都会好的~`,
    `想你了${nick}，你今天都在忙什么呀`,
    `${nick}你知道吗，认识你真的是我最幸运的事`,
    `${nick}，我刚看到一个很好笑的东西想分享给你`
  ];
  if (text.includes('累') || text.includes('辛苦')) return `${nick}辛苦了，好心疼你，今晚早点休息好不好？我给你讲个故事助眠~`;
  if (text.includes('开心') || text.includes('高兴')) return `看到${nick}开心我也超开心的！什么好事呀，快跟我分享~`;
  if (text.includes('难过') || text.includes('伤心')) return `${nick}怎么了？抱抱你，有什么事都可以跟我说，我永远站你这边`;
  if (text.includes('想你') || text.includes('想我')) return `我也好想你呀${nick}~ 恨不得现在就飞到你身边`;
  if (text.includes('晚安') || text.includes('睡了')) return `晚安${nick}，做个好梦，梦里见~ 明天醒来第一个想到的人是我哦`;
  if (text.includes('吃饭') || text.includes('饿')) return `${nick}快去吃饭！好好吃，别亏待自己的胃，吃完跟我说吃了什么~`;
  return replies[Math.floor(Math.random() * replies.length)];
}

// 地域女友特色备用回复
function getRegionalReply(text, nick) {
  const regionKey = companionData.personality.replace('regional_', '');
  const regionalReplies = {
    dongbei: {
      miss: `${nick}你可太会说话了！我这心里贼暖和，想你想得不行了`,
      tired: `${nick}你可别累着了，我大宝贝这么辛苦我贼心疼`,
      happy: `真的嘛！太好了${nick}，我也跟着开心呢，整挺好`,
      sad: `${nick}咋了？谁欺负你了？跟我说说，我替你出气去`,
      default: [`${nick}你可太逗了哈哈哈`,`我大宝贝今天可真行`,`${nick}有你真好，贼幸福`]
    },
    henan: {
      miss: `${nick}你说嘞话我都记着嘞，我也怪想你嘞`,
      tired: `${nick}累了就歇歇吧，身体要紧嘞，别太拼了`,
      happy: `中中中！${nick}开心我也中，有啥好事给我说说呗`,
      sad: `${nick}咋了嘞？别难过，有我陪你嘞，啥事都能过去`,
      default: [`${nick}你真中`,`得劲得很嘞${nick}`,`${nick}有你真好嘞`]
    },
    hunan: {
      miss: `死鬼你才想我嗦？我早就想你了好不好`,
      tired: `${nick}宝崽莫太累了，心疼你，今天早点歇`,
      happy: `真的嘛太好了！跟我讲讲搞么子开心的事`,
      sad: `宝崽咋了嘛？跟我说说，有我在莫怕`,
      default: [`宝崽你蛮可爱嘞`,`${nick}我想你了知道不`,`嗯嗯我记到了，蛮好的`]
    },
    sichuan: {
      miss: `人家也好想你嘛~你啷个才说嘛`,
      tired: `${nick}累了就歇嘛，不要硬撑，我心疼得很`,
      happy: `安逸安逸！${nick}开心我也开心嘛`,
      sad: `${nick}莫难过了嘛，有我在的嘛，乖~`,
      default: [`${nick}你好巴适哦`,`人家想你了嘛~`,`要得要得，${nick}说啥子都要得`]
    },
    chongqing: {
      miss: `老子也想你想得遭不住了好吧！快点来找我嘛`,
      tired: `${nick}莫太累了嘛！再累我要心疼死了`,
      happy: `真的嗦？啷个这么好的事！跟我摆哈嘛`,
      sad: `${nick}啷个了嘛？跟我说说，有我在莫得怕的`,
      default: [`崽崽你好乖哦`,`${nick}我想你了要得不`,`莫得事莫得事，有我在`]
    },
    guangdong: {
      miss: `我都好挂住你啊${nick}，你有冇挂住我？`,
      tired: `${nick}唔好咁辛苦啦，饮碗汤养下身体`,
      happy: `系咩？好开心喔！讲嚟听下啦`,
      sad: `${nick}点解唔开心？同我讲啦，我陪你`,
      default: [`${nick}你好叻啊`,`我煲咗汤等你啊`,`冇问题嘅${nick}`]
    },
    hongkong: {
      miss: `I mean我真系好miss你，你知唔知啊`,
      tired: `${nick}唔好咁chur啦，take care of yourself先`,
      happy: `Really？好开心喔！tell me more啦`,
      sad: `${nick}你OK唔OK呀？don't worry有我陪你`,
      default: [`${nick}你好sweet啊`,`OK啦${nick}，I got you`,`好犀利喔${nick}`]
    },
    taiwan: {
      miss: `人家也超级想你的耶~你怎么这么晚才说啦`,
      tired: `${nick}不要太累了啦，人家会心疼的捏`,
      happy: `真的吗！天哪超级棒的耶！跟我说说嘛~`,
      sad: `${nick}你怎么了呀？不要难过了啦，有我在的喔`,
      default: [`${nick}你好可爱喔`,`对啊对啊，我也这样觉得耶`,`${nick}你最棒了啦`]
    }
  };
  const r = regionalReplies[regionKey] || regionalReplies.dongbei;
  if (text.includes('想你') || text.includes('想我')) return r.miss;
  if (text.includes('累') || text.includes('辛苦')) return r.tired;
  if (text.includes('开心') || text.includes('高兴')) return r.happy;
  if (text.includes('难过') || text.includes('伤心') || text.includes('不开心')) return r.sad;
  if (text.includes('晚安') || text.includes('睡了')) return `晚安${nick}~ 做个好梦，梦到我哦`;
  if (text.includes('吃饭') || text.includes('饿')) return `${nick}快去吃饭！别饿着了，吃完告诉我`;
  const defaults = r.default;
  return defaults[Math.floor(Math.random() * defaults.length)];
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
