// 心理辅导对话系统 - 含语音输入和智能诊断
let chatRole = 'student';
let chatHistory = [];
let recognition = null;
let isRecording = false;

// 获取当前用户聊天记录key
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

// 心理诊断知识库 - 基于CBT、ACT、正念疗法等前沿方案
const PSYCH_KB = {
  anxiety: {
    keywords: ['焦虑','紧张','担心','害怕','恐惧','慌','不安','心慌','失眠','睡不着'],
    diagnosis: '焦虑情绪/广泛性焦虑倾向',
    theory: '认知行为疗法(CBT) + 正念减压(MBSR)',
    suggestions: [
      '【认知重构】识别"灾难化思维"，问自己：最坏结果的真实概率是多少？',
      '【4-7-8呼吸法】吸气4秒→屏息7秒→呼气8秒，重复3-4次',
      '【渐进式肌肉放松】从脚趾到头顶，依次紧绷5秒再放松',
      '【接纳承诺疗法(ACT)】不与焦虑对抗，观察它如旁观者',
      '若持续2周以上且影响生活，建议就医评估是否需要药物辅助'
    ]
  },
  depression: {
    keywords: ['抑郁','难过','悲伤','没意思','活着没意义','自杀','想死','绝望','空虚','麻木','哭'],
    diagnosis: '抑郁情绪/抑郁倾向',
    theory: '行为激活疗法(BA) + 人际关系疗法(IPT)',
    suggestions: [
      '【行为激活】每天安排1件小的愉悦活动，哪怕只是散步5分钟',
      '【情绪日记】记录每天情绪变化及触发事件，觉察模式',
      '【社交处方】每天至少与1人有意义的对话交流',
      '【认知三角】区分想法≠事实，悲观想法不代表现实',
      '⚠️ 若有自伤想法请立即拨打 400-161-9995 或 988',
      '建议尽快预约专业心理咨询，抑郁症是可以治愈的'
    ]
  },
  stress: {
    keywords: ['压力','累','疲惫','崩溃','撑不住','负担','喘不过气','头疼','考试'],
    diagnosis: '心理压力过载/应激反应',
    theory: '压力接种训练(SIT) + 正念认知疗法(MBCT)',
    suggestions: [
      '【压力分级】列出压力源，按可控/不可控分类，聚焦可控部分',
      '【时间管理】使用番茄工作法，25分钟专注+5分钟休息',
      '【正念练习】每天10分钟正念冥想，专注当下呼吸',
      '【身体释压】有氧运动30分钟可有效降低皮质醇水平',
      '学会说"不"，合理设置个人边界'
    ]
  },
  relationship: {
    keywords: ['人际','朋友','孤独','社交','不合群','被排斥','室友','同学','吵架','矛盾'],
    diagnosis: '人际关系困扰',
    theory: '人际关系疗法(IPT) + 社交技能训练(SST)',
    suggestions: [
      '【共情倾听】尝试复述对方的感受："你是不是觉得..."',
      '【非暴力沟通】观察+感受+需要+请求的四步表达法',
      '【认知去中心化】"别人的反应不一定与我有关"',
      '【小步社交】从低风险社交开始，如参加兴趣小组',
      '人际冲突是正常的，关键是学会建设性地表达需求'
    ]
  },
  selfworth: {
    keywords: ['自卑','没用','不够好','比不上','失败','废物','讨厌自己','自我否定'],
    diagnosis: '自我价值感低/自尊受损',
    theory: '自我慈悲疗法(Self-Compassion) + 叙事疗法',
    suggestions: [
      '【自我慈悲练习】像对待好朋友一样对待自己',
      '【优势发现】每天写3件自己做得好的小事',
      '【去比较化】减少社交媒体使用，关注自身成长轨迹',
      '【核心信念工作】觉察"我不够好"的信念来源，重新评估',
      '自我价值不需要通过他人认可来证明'
    ]
  }
};

function switchRole(role) {
  chatRole = role;
  document.getElementById('roleStudent').className = role==='student' ? 'btn btn-sm btn-active' : 'btn btn-sm';
  document.getElementById('roleTeacher').className = role==='teacher' ? 'btn btn-sm btn-active' : 'btn btn-sm';
}

function renderChat() {
  const el = document.getElementById('chatMessages');
  el.innerHTML = chatHistory.map(m => `
    <div class="chat-msg ${m.role}">
      <div class="msg-role">${m.role==='student'?'学生':'老师'}${m.role==='system'?' (智能助手)':''}</div>
      <div class="msg-content">${m.text}</div>
      <div class="msg-time">${m.time||''}</div>
    </div>`).join('');
  el.scrollTop = el.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  const msg = { role: chatRole, text, time: new Date().toLocaleTimeString() };
  chatHistory.push(msg);
  input.value = '';
  renderChat();
  saveChatHistory();
  // 自动诊断响应
  if (chatRole === 'student') setTimeout(() => autoResponse(text), 800);
}

// 智能自动诊断响应 - 具备倾听、关怀和专业问答能力
function autoResponse(text) {
  // 1. 先检测是否是问候/打招呼
  if (isGreeting(text)) {
    replyAs(generateGreeting());
    return;
  }
  // 2. 检测危机信号（优先级最高）
  if (isCrisis(text)) {
    replyAs(generateCrisisReply());
    return;
  }
  // 3. 关键词匹配心理问题
  let matched = [];
  for (const [key, item] of Object.entries(PSYCH_KB)) {
    const hits = item.keywords.filter(k => text.includes(k));
    if (hits.length > 0) matched.push({ key, item, score: hits.length });
  }
  matched.sort((a, b) => b.score - a.score);
  // 4. 根据匹配结果分层回复
  if (matched.length === 0) {
    replyAs(generateEmpatheticReply(text));
  } else {
    // 先共情回应，再给出专业分析
    const empathy = getEmpathyPrefix(matched[0].key);
    const diagnosis = generateDiagnosisReply(matched[0].item, text);
    replyAs(empathy + diagnosis);
  }
}

function replyAs(text) {
  const sysMsg = { role: 'system', text, time: new Date().toLocaleTimeString() };
  chatHistory.push(sysMsg);
  renderChat();
  saveChatHistory();
}

// 判断是否为问候语
function isGreeting(text) {
  const greetings = ['你好','hello','hi','嗨','早上好','下午好','晚上好','在吗','有人吗'];
  return greetings.some(g => text.toLowerCase().includes(g));
}

// 生成问候回复
function generateGreeting() {
  const user = getCurrentUser ? getCurrentUser() : null;
  const name = user ? user.name : '同学';
  const greetings = [
    `${name}你好！我是你的心理健康助手。今天感觉怎么样？有什么想聊聊的吗？`,
    `你好${name}！很高兴见到你。无论开心还是烦恼，都可以和我说说。我会认真倾听。`,
    `${name}你好！这里是一个安全的空间，你可以自由表达。想从哪里开始呢？`,
    `你好！我一直在这里。你最近过得怎么样？有没有什么事情让你牵挂？`
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

// 危机信号检测
function isCrisis(text) {
  const crisis = ['自杀','想死','不想活','结束生命','跳楼','割腕','自残','活着没意义'];
  return crisis.some(k => text.includes(k));
}

// 危机干预回复
function generateCrisisReply() {
  return `<div class="diagnosis-reply" style="border-left-color:#f44336">
    <div class="diag-header" style="color:#d32f2f">我非常关心你的安全</div>
    <div class="diag-section">
      我听到了你说的话，我想让你知道：<strong>你的生命很重要，你值得被帮助。</strong>
    </div>
    <div class="diag-section">
      <strong>请立即联系专业帮助：</strong>
      <ul>
        <li>全国心理援助热线：<strong>400-161-9995</strong></li>
        <li>北京心理危机研究与干预中心：<strong>010-82951332</strong></li>
        <li>生命热线：<strong>400-821-1215</strong></li>
        <li>紧急情况请拨打 <strong>120</strong> 或 <strong>110</strong></li>
      </ul>
    </div>
    <div class="diag-section">
      在等待帮助的过程中，请尝试：深呼吸、去一个安全的地方、联系一个你信任的人。
      <br>你不需要独自面对这一切。
    </div></div>`;
}

// 生成共情回复（未匹配到具体问题时）- 专业倾听与追问
function generateEmpatheticReply(text) {
  const len = text.length;
  // 根据用户输入长度调整回复策略
  if (len < 5) {
    const short = [
      '我在听，你可以多说一些。这里很安全。',
      '没关系，慢慢来。你想表达什么呢？',
      '我注意到你似乎有些犹豫。不着急，我会一直在这里。'
    ];
    return short[Math.floor(Math.random() * short.length)];
  }
  const empathyReplies = [
    '谢谢你愿意和我分享这些。我能感受到这件事对你的影响。能告诉我，这种感觉是什么时候开始的吗？',
    '我听到了你说的话，这确实不容易。在这种情况下，你通常会怎么应对呢？',
    '你的感受是完全合理的。面对这样的状况，任何人都可能会有类似的反应。你觉得最让你困扰的是哪一部分？',
    '谢谢你的信任。我想更好地理解你的处境——这种状况对你的日常生活有什么影响吗？',
    '我很认真地在听你说的每一句话。你提到的这些，有没有和身边的人聊过？',
    '这听起来确实让你承受了不少。在你看来，什么样的改变会让你感觉好一些？'
  ];
  return empathyReplies[Math.floor(Math.random() * empathyReplies.length)];
}

// 共情前缀（诊断前先表达理解）
function getEmpathyPrefix(category) {
  const prefixes = {
    anxiety: '<p style="margin-bottom:10px;color:#555">我能感受到你现在的不安和紧张。这种感觉很不好受，但请相信，焦虑是可以被有效管理的。让我帮你分析一下：</p>',
    depression: '<p style="margin-bottom:10px;color:#555">听到你这样说，我很心疼。你愿意来倾诉，这本身就说明你内心还有力量。请允许我提供一些可能对你有帮助的信息：</p>',
    stress: '<p style="margin-bottom:10px;color:#555">我理解你现在承受着很大的压力。你已经很努力了，这份坚持值得被看到。以下是一些可能帮到你的方法：</p>',
    relationship: '<p style="margin-bottom:10px;color:#555">人际关系中的困扰确实会让人很难受。你的感受是被理解的。让我们一起来看看可以怎么改善：</p>',
    selfworth: '<p style="margin-bottom:10px;color:#555">我想告诉你，你比你以为的更有价值。这种自我怀疑的声音不代表事实。让我帮你换个角度看看：</p>'
  };
  return prefixes[category] || '';
}

// 生成诊断回复（匹配到心理问题时）
function generateDiagnosisReply(item, text) {
  let reply = `<div class="diagnosis-reply">`;
  reply += `<div class="diag-header">智能心理评估分析</div>`;
  reply += `<div class="diag-section">`;
  reply += `<strong>初步判断：</strong>${item.diagnosis}`;
  reply += `</div>`;
  reply += `<div class="diag-section">`;
  reply += `<strong>理论依据：</strong>${item.theory}`;
  reply += `</div>`;
  reply += `<div class="diag-section"><strong>专业建议：</strong><ul>`;
  item.suggestions.forEach(s => { reply += `<li>${s}</li>`; });
  reply += `</ul></div>`;
  reply += `<div class="diag-footer">`;
  reply += `提示：以上为AI辅助分析，仅供参考。如症状持续，请寻求专业心理咨询师帮助。`;
  reply += `</div></div>`;
  return reply;
}

// 语音识别功能
function initVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    document.getElementById('voiceBtn').style.display = 'none';
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = 'zh-CN';
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = function(e) {
    let transcript = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript;
    }
    document.getElementById('chatInput').value = transcript;
    if (e.results[e.results.length - 1].isFinal) {
      updateVoiceStatus('识别完成，可点击发送');
    }
  };

  recognition.onend = function() {
    isRecording = false;
    document.getElementById('voiceBtn').classList.remove('recording');
    updateVoiceStatus('');
  };

  recognition.onerror = function(e) {
    isRecording = false;
    document.getElementById('voiceBtn').classList.remove('recording');
    if (e.error === 'not-allowed') {
      updateVoiceStatus('请允许麦克风权限');
    } else {
      updateVoiceStatus('语音识别出错，请重试');
    }
    setTimeout(() => updateVoiceStatus(''), 3000);
  };
}

function toggleVoice() {
  if (!recognition) { initVoice(); }
  if (!recognition) { alert('您的浏览器不支持语音识别'); return; }
  if (isRecording) {
    recognition.stop();
    isRecording = false;
  } else {
    recognition.start();
    isRecording = true;
    document.getElementById('voiceBtn').classList.add('recording');
    updateVoiceStatus('正在聆听...');
  }
}

function updateVoiceStatus(msg) {
  document.getElementById('voiceStatus').textContent = msg;
}

// 清空聊天记录
function clearChat() {
  if (confirm('确定清空所有对话记录？')) {
    chatHistory = [];
    localStorage.removeItem(getChatKey());
    renderChat();
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  loadChatHistory();
  renderChat();
  switchRole('student');
  initVoice();
});
