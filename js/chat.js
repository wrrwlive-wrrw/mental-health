// 心理辅导对话系统 - 含语音输入和智能诊断
let chatRole = 'student';
let chatHistory = JSON.parse(localStorage.getItem('mh_chat') || '[]');
let recognition = null;
let isRecording = false;

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
  localStorage.setItem('mh_chat', JSON.stringify(chatHistory));
  // 自动诊断响应
  if (chatRole === 'student') setTimeout(() => autoResponse(text), 800);
}

// 智能自动诊断响应
function autoResponse(text) {
  let matched = [];
  for (const [key, item] of Object.entries(PSYCH_KB)) {
    const hits = item.keywords.filter(k => text.includes(k));
    if (hits.length > 0) matched.push({ key, item, score: hits.length });
  }
  matched.sort((a, b) => b.score - a.score);

  let reply = '';
  if (matched.length === 0) {
    reply = generateEmpatheticReply(text);
  } else {
    const top = matched[0].item;
    reply = generateDiagnosisReply(top, text);
  }

  const sysMsg = { role: 'system', text: reply, time: new Date().toLocaleTimeString() };
  chatHistory.push(sysMsg);
  renderChat();
  localStorage.setItem('mh_chat', JSON.stringify(chatHistory));
}

// 生成共情回复（未匹配到具体问题时）
function generateEmpatheticReply(text) {
  const empathyReplies = [
    '谢谢你愿意分享。能告诉我更多关于你的感受吗？',
    '我在认真倾听。你现在最困扰的是什么？',
    '你的感受很重要。可以具体说说发生了什么吗？',
    '我理解你愿意来倾诉，这本身就是积极的一步。能详细描述一下吗？',
    '每个人都会遇到困难时期。你愿意多说一些吗？我想更好地理解你的状况。'
  ];
  return empathyReplies[Math.floor(Math.random() * empathyReplies.length)];
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
    localStorage.removeItem('mh_chat');
    renderChat();
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  renderChat();
  switchRole('student');
  initVoice();
});
