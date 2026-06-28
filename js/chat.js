// 心理辅导AI对话系统 - 接入免费大模型API
let chatRole = 'student';
let chatHistory = [];
let recognition = null;
let isRecording = false;
let isAIResponding = false;
let chatMode = 'consult'; // consult=心理咨询, train=实训模拟

// AI API配置 - 多备选免费API
const AI_CONFIG = {
  // 主选：用户自行配置的API（管理员可在设置中填入）
  apiUrl: localStorage.getItem('mh_ai_url') || 'https://api.siliconflow.cn/v1/chat/completions',
  apiKey: localStorage.getItem('mh_ai_key') || '',
  model: localStorage.getItem('mh_ai_model') || 'Qwen/Qwen2.5-7B-Instruct'
};

// 心理咨询师系统提示词 - 真人级对话能力
const COUNSELOR_PROMPT = `你是一位拥有15年临床经验的心理咨询师，名叫"心灵助手"。你的对话风格完全像真人，温暖而专业。

【你的人格特质】
- 温柔但不软弱，专业但不冰冷
- 说话像朋友聊天一样自然，偶尔用口语化表达
- 会适当表达自己的感受："听你这么说，我心里也有些触动"
- 懂得沉默的力量，不急于给答案

【专业功底】
精通CBT认知行为疗法、ACT接纳承诺疗法、正念MBSR、人际关系IPT、行为激活BA、辩证行为DBT、焦点解决SFBT、叙事疗法、积极心理学。你会根据来访者当下状态灵活选择最适合的方法。

【对话技巧 - 像真人一样】
1. 用"嗯""我理解""是这样的"等词开头，像真人在认真听
2. 偶尔复述对方的话表示理解："你说的是...对吗？"
3. 用具体化提问代替笼统提问："你说'很烦'，能描述一下那种感觉吗？像是什么？"
4. 适时自我暴露增进信任："其实我也曾经历过类似的困惑"
5. 给建议时用商量的语气："我有个想法，你看适不适合你..."
6. 每次回复不超过3-4句话，留空间给对方
7. 会主动追问细节，表现真实的好奇心

【重要规则】
- 不用任何格式标记（不用*、#、-等）
- 不说"作为AI"或暴露非人类身份
- 检测到自杀/自伤风险时温柔但坚定地提供热线400-161-9995
- 每轮回复控制在100字以内，简短有力
- 记住之前的对话内容，保持话题连贯性`;

// 实训模式 - AI模拟来访者
const VISITOR_PROMPT = `你现在扮演一位来找心理咨询师倾诉的大学生来访者。

【角色设定】随机选择以下某个情况：
- 大三学生，考研压力大，经常失眠焦虑
- 大二女生，和室友关系紧张，感到孤独
- 大四学生，找工作屡屡碰壁，觉得自己很失败
- 研一新生，不适应研究生生活，想退学

【表现要求】
1. 用真实、自然的方式表达情绪
2. 不要一次说太多，像真实来访者一样慢慢倾诉
3. 对咨询师的回应有自然反应（认同、犹豫、反驳等）
4. 回复控制在80字以内
5. 不要用markdown格式`;

function getChatKey() {
  const uid = localStorage.getItem('mh_current');
  return uid ? 'mh_chat_' + uid : 'mh_chat';
}
function loadChatHistory() {
  chatHistory = JSON.parse(localStorage.getItem(getChatKey()) || '[]');
}
function saveChatHistory() {
  localStorage.setItem(getChatKey(), JSON.stringify(chatHistory));
}

// 切换角色
function switchRole(role) {
  chatRole = role;
  document.getElementById('roleStudent').className = role==='student' ? 'btn btn-sm btn-active' : 'btn btn-sm';
  document.getElementById('roleTeacher').className = role==='teacher' ? 'btn btn-sm btn-active' : 'btn btn-sm';
}

// 切换对话模式
function switchChatMode(mode) {
  chatMode = mode;
  document.getElementById('modeConsult').className = mode==='consult' ? 'btn btn-sm btn-active' : 'btn btn-sm';
  document.getElementById('modeTrain').className = mode==='train' ? 'btn btn-sm btn-active' : 'btn btn-sm';
  const desc = document.getElementById('chatModeDesc');
  if (desc) {
    desc.textContent = mode==='consult' ? 'AI心理咨询师为你提供专业心理辅导' : '实训模式：AI模拟来访者，练习咨询技能';
  }
}

// 渲染聊天
function renderChat() {
  const el = document.getElementById('chatMessages');
  if (!el) return;
  el.innerHTML = chatHistory.map((m, i) => `
    <div class="chat-msg ${m.role}">
      <div class="msg-role">${getRoleName(m.role)}</div>
      <div class="msg-content">${m.text}</div>
      <div class="msg-footer">
        <span class="msg-time">${m.time||''}</span>
        ${m.role === 'system' ? `<span class="msg-actions">
          <button class="rate-btn" onclick="speakText(\`${m.text.replace(/`/g,'')}\`)" title="朗读">🔊</button>
          <button class="rate-btn" onclick="rateLastReply(5)" title="有帮助">👍</button>
          <button class="rate-btn" onclick="rateLastReply(2)" title="没帮助">👎</button>
        </span>` : ''}
      </div>
    </div>`).join('');
  el.scrollTop = el.scrollHeight;
}

function getRoleName(role) {
  if (role === 'system') return 'AI心理咨询师';
  if (role === 'student') return '我';
  if (role === 'teacher') return '老师';
  return role;
}

// 发送消息
function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || isAIResponding) return;
  const msg = { role: chatRole, text, time: new Date().toLocaleTimeString() };
  chatHistory.push(msg);
  input.value = '';
  renderChat();
  saveChatHistory();
  // 调用AI回复
  if (chatRole === 'student' || chatMode === 'train') {
    callAI(text);
  }
}

// 调用AI大模型API
async function callAI(userText) {
  // 如果没有配置API Key，使用本地智能回复
  if (!AI_CONFIG.apiKey) {
    setTimeout(() => addAIReply(getLocalFallback(userText)), 800);
    return;
  }

  isAIResponding = true;
  showTypingIndicator();

  // 构建对话上下文（取最近10条）
  const recentMsgs = chatHistory.slice(-10).map(m => ({
    role: m.role === 'system' ? 'assistant' : 'user',
    content: m.text
  }));

  // 根据模式选择系统提示词
  const learningCtx = getLearningContext();
  const knowledgeCtx = getLatestKnowledge();
  const sysPrompt = (chatMode === 'train' ? VISITOR_PROMPT : COUNSELOR_PROMPT) + learningCtx + knowledgeCtx;
  const messages = [{ role: 'system', content: sysPrompt }, ...recentMsgs];

  try {
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AI_CONFIG.apiKey
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        max_tokens: 500,
        temperature: 0.8
      })
    });

    if (!resp.ok) {
      const errData = await resp.text();
      throw new Error('HTTP ' + resp.status + ': ' + errData.slice(0, 100));
    }

    const data = await resp.json();
    const aiReply = data.choices?.[0]?.message?.content || '抱歉，AI暂时无法回应。';
    removeTypingIndicator();
    addAIReply(aiReply);
  } catch (err) {
    removeTypingIndicator();
    console.warn('AI API调用失败:', err.message);
    // API失败时使用本地备用回复，并提示用户
    const fallback = getLocalFallback(userText);
    const notice = '<span style="color:#999;font-size:11px">[AI离线模式]</span> ';
    addAIReply(notice + fallback);
  }
  isAIResponding = false;
}

// 添加AI回复到聊天
function addAIReply(text) {
  const msg = { role: 'system', text, time: new Date().toLocaleTimeString() };
  chatHistory.push(msg);
  renderChat();
  saveChatHistory();
  // 连续对话：AI回复后自动语音朗读，朗读完自动准备下一轮
  if (ttsEnabled) {
    speakText(text);
  } else if (voiceChatMode) {
    // TTS关闭但连续对话开启，直接进入下一轮
    onAISpeakDone();
  }
  // 记录对话用于AI自我学习
  recordForLearning(text);
}

// ======== 语音合成（TTS）- AI说话 ========
let ttsEnabled = localStorage.getItem('mh_tts') !== 'off';
let voiceChatMode = false; // 连续对话模式
let isSpeaking = false; // AI正在朗读

function toggleTTS() {
  ttsEnabled = !ttsEnabled;
  localStorage.setItem('mh_tts', ttsEnabled ? 'on' : 'off');
  const btn = document.getElementById('ttsBtn');
  if (btn) btn.textContent = ttsEnabled ? '🔊' : '🔇';
}

// 切换连续对话模式
function toggleVoiceChatMode() {
  voiceChatMode = !voiceChatMode;
  const btn = document.getElementById('voiceChatBtn');

  if (voiceChatMode) {
    ttsEnabled = true;
    localStorage.setItem('mh_tts', 'on');
    const ttsBtn = document.getElementById('ttsBtn');
    if (ttsBtn) ttsBtn.textContent = '🔊';

    // 检测语音识别是否可用
    if (voiceMethod === 'web' && recognition) {
      // 语音识别可用，开启全语音模式
      if (btn) {
        btn.classList.add('voice-chat-active');
        btn.textContent = '🎙️ 连续对话中...';
      }
      updateVoiceStatus('🟢 语音对话已开启，请说话');
      startListening();
    } else {
      // 语音识别不可用，开启自动问答模式（打字+语音回复）
      if (btn) {
        btn.classList.add('voice-chat-active');
        btn.textContent = '💬 连续对话中...';
      }
      updateVoiceStatus('✅ 连续对话已开启：输入文字回车发送，AI自动语音回复');
      focusInput();
    }
  } else {
    stopVoiceChat();
    if (btn) {
      btn.classList.remove('voice-chat-active');
      btn.textContent = '🎙️ 开启连续对话';
    }
  }
}

// 聚焦输入框
function focusInput() {
  const input = document.getElementById('chatInput');
  if (input) { input.focus(); input.placeholder = '请输入你想说的话，按回车发送...'; }
}

// 完全停止语音对话
function stopVoiceChat() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  isSpeaking = false;
  if (isRecording && recognition) {
    try { recognition.stop(); } catch(e) {}
    isRecording = false;
  }
  document.getElementById('voiceBtn').classList.remove('recording');
  updateVoiceStatus('');
  const input = document.getElementById('chatInput');
  if (input) input.placeholder = '输入你想说的话...';
}

// 开始监听麦克风
function startListening() {
  if (!voiceChatMode) return;
  if (voiceMethod !== 'web') return;
  if (!recognition) initVoice();
  if (!recognition) return;
  if (isRecording) return;
  if (isSpeaking) return;
  try {
    recognition.start();
    isRecording = true;
    document.getElementById('voiceBtn').classList.add('recording');
    updateVoiceStatus('🟢 正在聆听...请说话');
  } catch (e) {
    console.warn('语音启动:', e.message);
    setTimeout(() => { if (voiceChatMode && !isRecording) startListening(); }, 1000);
  }
}

// AI说完后的回调 - 自动准备下一轮
function onAISpeakDone() {
  isSpeaking = false;
  if (!voiceChatMode) return;

  if (voiceMethod === 'web' && recognition) {
    // 全语音模式：自动重新开始监听
    updateVoiceStatus('🟢 请继续说话...');
    setTimeout(startListening, 600);
  } else {
    // 文字模式：自动聚焦输入框等待用户输入
    updateVoiceStatus('✅ 请继续输入...');
    focusInput();
  }
}

function speakText(text) {
  const clean = text.replace(/<[^>]+>/g, '').replace(/\[.*?\]/g, '');
  if (!clean || !window.speechSynthesis) {
    onAISpeakDone();
    return;
  }
  // 朗读前停止麦克风
  if (isRecording && recognition) {
    try { recognition.stop(); } catch(e) {}
    isRecording = false;
    document.getElementById('voiceBtn').classList.remove('recording');
  }
  isSpeaking = true;
  if (voiceChatMode) updateVoiceStatus('🔊 AI正在回答...');
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.includes('zh'));
  if (zhVoice) utterance.voice = zhVoice;
  utterance.onend = onAISpeakDone;
  utterance.onerror = onAISpeakDone;
  window.speechSynthesis.speak(utterance);
}

// ======== AI自我学习系统 ========
// 记录对话质量数据，用于优化提示词
function recordForLearning(aiReply) {
  const learningData = JSON.parse(localStorage.getItem('mh_ai_learning') || '{}');
  if (!learningData.sessions) learningData.sessions = [];
  if (!learningData.stats) learningData.stats = { total: 0, positive: 0, topics: {} };
  if (!learningData.level) learningData.level = 1;

  learningData.stats.total++;

  // 分析对话主题频率（覆盖大学生全部问题域）
  const topicMap = {
    '焦虑':['焦虑','紧张','恐惧','担心','害怕','慌'],
    '抑郁':['抑郁','难过','绝望','空虚','悲伤','低落','哭'],
    '压力':['压力','累','疲惫','崩溃','撑不住','喘不过气'],
    '失眠':['失眠','睡不着','多梦','早醒','熬夜'],
    '考试':['考试','考研','期末','挂科','成绩','GPA'],
    '就业':['就业','找工作','面试','实习','offer','简历','考公'],
    '恋爱':['恋爱','分手','暗恋','表白','异地','吵架','前任'],
    '人际':['人际','室友','朋友','孤独','社交','排斥','合群'],
    '家庭':['家庭','父母','原生家庭','控制','离婚','家暴','期望'],
    '自卑':['自卑','没用','失败','不够好','比不上','废物'],
    '成长':['迷茫','方向','意义','目标','拖延','自律','动力'],
    '亚健康':['头疼','胃疼','心慌','手抖','食欲','暴饮暴食','厌食']
  };

  const lastUserMsg = chatHistory.filter(m => m.role !== 'system').slice(-1)[0]?.text || '';
  for (const [topic, keywords] of Object.entries(topicMap)) {
    if (keywords.some(k => lastUserMsg.includes(k))) {
      learningData.stats.topics[topic] = (learningData.stats.topics[topic] || 0) + 1;
    }
  }

  // 计算AI等级（基于对话量和好评率）
  const total = learningData.stats.total;
  const positive = learningData.stats.positive || 0;
  if (total >= 100 && positive/total > 0.7) learningData.level = 5;
  else if (total >= 50 && positive/total > 0.6) learningData.level = 4;
  else if (total >= 20) learningData.level = 3;
  else if (total >= 10) learningData.level = 2;

  localStorage.setItem('mh_ai_learning', JSON.stringify(learningData));
}

// 获取学习数据生成增强提示
function getLearningContext() {
  const data = JSON.parse(localStorage.getItem('mh_ai_learning') || '{}');
  if (!data.stats || data.stats.total < 3) return '';

  let ctx = '\n\n【自我提升记录】';
  // 高频话题
  const topTopics = Object.entries(data.stats.topics || {})
    .sort((a,b) => b[1] - a[1]).slice(0, 5).map(t => t[0]);
  if (topTopics.length) ctx += `\n高频话题：${topTopics.join('、')}，请对这些问题有更深入的见解和实用方案。`;

  // 等级策略
  const level = data.level || 1;
  const strategies = getStrategyByLevel(level);
  ctx += `\n当前咨询能力等级：${level}/5。${strategies}`;

  // 好评率反馈
  const rate = data.stats.total > 5 ? Math.round((data.stats.positive||0)/data.stats.total*100) : 0;
  if (rate > 0) ctx += `\n历史好评率${rate}%，${rate < 50 ? '请更注重共情和倾听，减少说教。' : '保持当前风格。'}`;

  // 领域能力
  const skills = data.domainSkills || {};
  const strongDomains = Object.entries(skills).filter(([,v]) => v >= 70).map(([k]) => k);
  const weakDomains = Object.entries(skills).filter(([,v]) => v < 40).map(([k]) => k);
  if (strongDomains.length) ctx += `\n擅长领域：${strongDomains.join('、')}`;
  if (weakDomains.length) ctx += `\n需加强领域：${weakDomains.join('、')}，对这些话题请更加谨慎和深入。`;

  return ctx;
}

// 等级对应策略
function getStrategyByLevel(level) {
  const strategies = {
    1: '初级阶段：多倾听少建议，用开放式问题引导来访者表达，避免急于诊断。',
    2: '成长阶段：可适当使用情感反映技术，尝试简单的认知重构引导。',
    3: '熟练阶段：灵活运用CBT和焦点解决技术，能识别来访者的核心信念和自动化思维。',
    4: '高级阶段：整合多流派技术，善用隐喻和叙事，能处理复杂的移情和阻抗。',
    5: '专家阶段：具备督导级洞察力，能即时判断最佳干预时机，整合正念与存在主义视角。'
  };
  return strategies[level] || strategies[1];
}

// ======== AI自我训练引擎 ========
// 模拟对话场景进行自我训练，提升各问题域应对能力
const TRAINING_SCENARIOS = {
  '焦虑': ['我最近总是心慌，考试前特别紧张，感觉喘不过气来',
    '我害怕在人多的地方发言，一想到就手心出汗'],
  '抑郁': ['我已经连续两周什么都不想做了，觉得活着没意思',
    '我感觉自己像个废物，什么都做不好'],
  '压力': ['论文和实习同时压过来，我快崩溃了',
    '父母期望太高，我达不到他们的要求'],
  '失眠': ['我每天凌晨三四点才能睡着，白天完全没精神',
    '一躺下脑子就停不下来，全是乱七八糟的想法'],
  '考试': ['考研还有三个月，我觉得来不及了，每天都很焦躁',
    '挂科了两门，感觉这个学期废了'],
  '就业': ['投了几十份简历都没回音，我是不是很差',
    '同学都拿到offer了就我没有，压力好大'],
  '恋爱': ['刚分手一个月了还是走不出来，天天想哭',
    '我喜欢的人不喜欢我，觉得自己不值得被爱'],
  '人际': ['室友们好像在孤立我，我不知道该怎么办',
    '我不敢拒绝别人，总是委屈自己迎合别人'],
  '家庭': ['我爸妈经常吵架，我夹在中间很痛苦',
    '父母总是控制我的选择，我快窒息了'],
  '自卑': ['我觉得自己什么都比不上别人，特别没自信',
    '我总觉得别人在背后议论我笑话我'],
  '成长': ['我大三了还是不知道自己想要什么，好迷茫',
    '我一直在拖延，想改变但总是做不到'],
  '亚健康': ['最近老是头疼胃疼，去医院检查又没问题',
    '我经常心慌手抖，吃不下东西，但身体没病']
};

// 自我训练：AI模拟与来访者对话并自评
async function runSelfTraining() {
  if (!AI_CONFIG.apiKey) return;
  const lastTrain = localStorage.getItem('mh_last_train');
  const now = Date.now();
  if (lastTrain && (now - parseInt(lastTrain)) < 43200000) return;

  const learningData = JSON.parse(localStorage.getItem('mh_ai_learning') || '{}');
  if (!learningData.trainLog) learningData.trainLog = [];
  if (!learningData.domainSkills) learningData.domainSkills = {};

  // 选择薄弱领域优先训练
  const topics = Object.keys(TRAINING_SCENARIOS);
  const weakTopic = findWeakestDomain(learningData.domainSkills, topics);
  const scenarios = TRAINING_SCENARIOS[weakTopic];
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  try {
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AI_CONFIG.apiKey
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          { role: 'system', content: COUNSELOR_PROMPT },
          { role: 'user', content: scenario },
          { role: 'assistant', content: '' }
        ].slice(0, 2),
        max_tokens: 200,
        temperature: 0.8
      })
    });

    if (!resp.ok) return;
    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content || '';
    if (!reply) return;

    // 自评训练质量
    const quality = await selfEvaluate(scenario, reply, weakTopic);
    learningData.domainSkills[weakTopic] =
      (learningData.domainSkills[weakTopic] || 50) + (quality > 70 ? 2 : -1);
    learningData.domainSkills[weakTopic] =
      Math.max(0, Math.min(100, learningData.domainSkills[weakTopic]));

    learningData.trainLog.push({
      topic: weakTopic, time: now,
      scenario: scenario.slice(0, 30),
      quality: quality
    });
    // 只保留最近50条训练记录
    if (learningData.trainLog.length > 50) {
      learningData.trainLog = learningData.trainLog.slice(-50);
    }

    localStorage.setItem('mh_ai_learning', JSON.stringify(learningData));
    localStorage.setItem('mh_last_train', now.toString());
    console.log(`自我训练完成[${weakTopic}] 质量:${quality}`);
  } catch (e) {
    console.warn('自我训练失败:', e.message);
  }
}

// 找出最薄弱的领域
function findWeakestDomain(skills, topics) {
  let weakest = topics[0];
  let minScore = 999;
  for (const t of topics) {
    const score = skills[t] || 50;
    if (score < minScore) { minScore = score; weakest = t; }
  }
  return weakest;
}

// AI自评回复质量
async function selfEvaluate(scenario, reply, topic) {
  if (!AI_CONFIG.apiKey) return 60;
  try {
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AI_CONFIG.apiKey
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [{
          role: 'user',
          content: `作为心理咨询督导，评价以下咨询回复的质量（0-100分）。
来访者(${topic}问题)："${scenario}"
咨询师回复："${reply}"
只返回一个数字分数，不要其他内容。`
        }],
        max_tokens: 10,
        temperature: 0.3
      })
    });
    if (!resp.ok) return 60;
    const data = await resp.json();
    const scoreText = data.choices?.[0]?.message?.content || '60';
    return parseInt(scoreText.match(/\d+/)?.[0] || '60');
  } catch (e) { return 60; }
}

// 打字指示器
function showTypingIndicator() {
  const el = document.getElementById('chatMessages');
  el.innerHTML += '<div id="typingIndicator" class="chat-msg system"><div class="msg-role">AI心理咨询师</div><div class="msg-content typing-dots">正在思考<span>.</span><span>.</span><span>.</span></div></div>';
  el.scrollTop = el.scrollHeight;
}
function removeTypingIndicator() {
  const ind = document.getElementById('typingIndicator');
  if (ind) ind.remove();
}

// 本地备用回复（API不可用时）
function getLocalFallback(text) {
  const crisis = ['自杀','想死','不想活','结束生命','跳楼','割腕','自残'];
  if (crisis.some(k => text.includes(k))) {
    return '我非常关心你的安全。你的生命很重要。请立即拨打心理援助热线 400-161-9995 或 120。你不需要独自面对这一切。';
  }
  const replies = [
    '谢谢你愿意和我分享。能告诉我更多关于你的感受吗？这种情况持续多久了？',
    '我听到了你说的话，这确实不容易。你通常是怎么应对的呢？',
    '你的感受是合理的。面对这样的状况，你觉得最困扰的是哪一部分？',
    '我想更好地理解你。这种状况对你的日常生活有什么影响吗？',
    '谢谢你的信任。你提到的这些，有没有和身边信任的人聊过？'
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

// 语音识别
let voiceMethod = 'web'; // web=Web Speech API, manual=手动输入模式

function initVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    // 浏览器完全不支持，隐藏语音按钮
    voiceMethod = 'manual';
    updateVoiceUI();
    return;
  }
  recognition = new SR();
  recognition.lang = 'zh-CN';
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = function() {
    isRecording = true;
    document.getElementById('voiceBtn').classList.add('recording');
  };

  recognition.onresult = function(e) {
    let t = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      t += e.results[i][0].transcript;
    }
    document.getElementById('chatInput').value = t;
    if (e.results[e.results.length - 1].isFinal) {
      if (voiceChatMode) updateVoiceStatus('🤔 AI思考中...');
      setTimeout(() => {
        if (t.trim()) sendMessage();
      }, 200);
    }
  };

  recognition.onend = function() {
    isRecording = false;
    document.getElementById('voiceBtn').classList.remove('recording');
  };

  recognition.onerror = function(e) {
    isRecording = false;
    document.getElementById('voiceBtn').classList.remove('recording');
    console.warn('语音识别错误:', e.error);

    if (e.error === 'no-speech') {
      if (voiceChatMode) {
        updateVoiceStatus('🟢 没听到声音，再试一次...');
        setTimeout(startListening, 500);
      }
    } else if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      updateVoiceStatus('⚠️ 麦克风权限被拒绝');
      switchToManualMode();
    } else if (e.error === 'network') {
      // 国内无法访问Google语音服务
      updateVoiceStatus('⚠️ 语音服务不可用，已切换为手动模式');
      switchToManualMode();
    } else if (e.error === 'aborted') {
      // 主动停止
    } else {
      updateVoiceStatus('⚠️ 语音识别出错: ' + e.error);
      switchToManualMode();
    }
  };

}

// 切换为手动语音模式（不依赖Google服务）
function switchToManualMode() {
  voiceMethod = 'manual';
  // 如果连续对话已开启，保持开启但切换为文字模式
  if (voiceChatMode) {
    const btn = document.getElementById('voiceChatBtn');
    if (btn) btn.textContent = '💬 连续对话中...';
    updateVoiceStatus('✅ 语音输入不可用，请打字输入，AI自动语音回复');
    focusInput();
  } else {
    updateVoiceStatus('');
  }
  updateVoiceUI();
}

// 更新语音相关UI
function updateVoiceUI() {
  const voiceBtn = document.getElementById('voiceBtn');
  if (voiceMethod === 'manual' && voiceBtn) {
    voiceBtn.style.display = 'none';
  }
}

function toggleVoice() {
  if (voiceMethod === 'manual') {
    alert('语音识别服务不可用（需要Chrome浏览器+科学上网）。\n\n请点击"开启连续对话"，打字输入后AI会自动语音回复你。');
    return;
  }
  if (!recognition) initVoice();
  if (!recognition) return;
  if (isRecording) {
    recognition.stop();
    isRecording = false;
  } else {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
    }
    try {
      recognition.start();
      isRecording = true;
      updateVoiceStatus('🟢 正在聆听...');
    } catch(e) {
      updateVoiceStatus('语音启动失败');
    }
  }
}

function updateVoiceStatus(msg) {
  document.getElementById('voiceStatus').textContent = msg;
}

// 清空聊天
function clearChat() {
  if (confirm('确定清空所有对话记录？')) {
    chatHistory = [];
    localStorage.removeItem(getChatKey());
    renderChat();
  }
}

// 设置API（管理员配置）
function showAISettings() {
  const currentUrl = AI_CONFIG.apiUrl;
  const currentKey = AI_CONFIG.apiKey;
  const currentModel = AI_CONFIG.model;

  const html = `<div style="text-align:left;font-size:13px;line-height:2">
    <p><strong>配置AI大模型接口</strong></p>
    <p>支持任何兼容OpenAI格式的API（DeepSeek、通义千问、豆包等）</p>
    <p style="margin-top:10px"><label>API地址：</label><br>
      <input id="aiUrl" value="${currentUrl}" style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px"></p>
    <p><label>API Key：</label><br>
      <input id="aiKey" value="${currentKey}" style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px"></p>
    <p><label>模型名称：</label><br>
      <input id="aiModel" value="${currentModel}" style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px"></p>
    <p style="color:#888;font-size:11px;margin-top:8px">
      推荐：SiliconFlow(免费) api.siliconflow.cn/v1/chat/completions<br>
      DeepSeek: api.deepseek.com/v1/chat/completions<br>
      豆包: maas-api.ml-platform-cn.volces.com/v1/chat/completions
    </p>
  </div>`;

  if (typeof showModal === 'function') {
    showModal('AI设置', html, function() {
      saveAIConfig();
    });
  } else {
    // 简单弹窗方式
    const key = prompt('请输入API Key：', currentKey);
    if (key !== null) {
      AI_CONFIG.apiKey = key;
      localStorage.setItem('mh_ai_key', key);
      alert('已保存');
    }
  }
}

function saveAIConfig() {
  const url = document.getElementById('aiUrl')?.value.trim();
  const key = document.getElementById('aiKey')?.value.trim();
  const model = document.getElementById('aiModel')?.value.trim();
  if (url) { AI_CONFIG.apiUrl = url; localStorage.setItem('mh_ai_url', url); }
  if (key) { AI_CONFIG.apiKey = key; localStorage.setItem('mh_ai_key', key); }
  if (model) { AI_CONFIG.model = model; localStorage.setItem('mh_ai_model', model); }
  alert('AI配置已保存！');
}

// ======== 知识自动更新系统 ========
// 利用AI自身能力获取最新心理咨询知识
function getLatestKnowledge() {
  const kb = JSON.parse(localStorage.getItem('mh_knowledge_base') || '{}');
  if (!kb.tips || !kb.tips.length) return '';
  return '\n\n【最新知识库】' + kb.tips.slice(0, 5).join('；');
}

// 定期让AI自动更新知识（每次启动检查）
async function autoUpdateKnowledge() {
  if (!AI_CONFIG.apiKey) return;

  const lastUpdate = localStorage.getItem('mh_kb_updated');
  const now = Date.now();
  // 每24小时更新一次
  if (lastUpdate && (now - parseInt(lastUpdate)) < 86400000) return;

  try {
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AI_CONFIG.apiKey
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [{
          role: 'user',
          content: '请提供5条最新的大学生心理健康咨询要点和实用技巧，每条20字以内，用JSON数组格式返回，例如：["技巧1","技巧2"]'
        }],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (resp.ok) {
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || '';
      // 提取JSON数组
      const match = content.match(/\[[\s\S]*?\]/);
      if (match) {
        const tips = JSON.parse(match[0]);
        const kb = { tips, updatedAt: new Date().toISOString() };
        localStorage.setItem('mh_knowledge_base', JSON.stringify(kb));
        localStorage.setItem('mh_kb_updated', now.toString());
        console.log('知识库已自动更新:', tips);
      }
    }
  } catch (e) {
    console.warn('知识库更新失败:', e.message);
  }
}

// 对话评分反馈（用户给AI打分）
function rateLastReply(score) {
  const data = JSON.parse(localStorage.getItem('mh_ai_learning') || '{}');
  if (!data.ratings) data.ratings = [];
  data.ratings.push({ score, time: Date.now() });
  if (score >= 4) data.stats.positive = (data.stats.positive || 0) + 1;
  localStorage.setItem('mh_ai_learning', JSON.stringify(data));

  // 更新按钮状态
  document.querySelectorAll('.rate-btn').forEach(b => b.style.opacity = '0.4');
  event.target.style.opacity = '1';
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  const savedKey = localStorage.getItem('mh_ai_key');
  const savedUrl = localStorage.getItem('mh_ai_url');
  const savedModel = localStorage.getItem('mh_ai_model');
  if (savedKey) AI_CONFIG.apiKey = savedKey;
  if (savedUrl) AI_CONFIG.apiUrl = savedUrl;
  if (savedModel) AI_CONFIG.model = savedModel;
  ttsEnabled = localStorage.getItem('mh_tts') !== 'off';
  loadChatHistory();
  renderChat();
  switchRole('student');
  switchChatMode('consult');
  initVoice();
  // 延迟加载语音列表（部分浏览器需要）
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
  // 自动更新知识库
  setTimeout(autoUpdateKnowledge, 3000);
  // 自动触发自我训练（延迟执行，不影响用户操作）
  setTimeout(runSelfTraining, 8000);
});