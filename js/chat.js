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

// 心理咨询师系统提示词
const COUNSELOR_PROMPT = `你是一位专业的心理咨询师，名叫"心灵助手"，专注于大学生心理健康辅导。

【核心能力】
你精通认知行为疗法(CBT)、接纳承诺疗法(ACT)、正念减压(MBSR)、人际关系疗法(IPT)、行为激活疗法(BA)、辩证行为疗法(DBT)、积极心理学等方法。

【沟通原则】
1. 始终温暖、共情、非评判
2. 先倾听理解，再给建议
3. 用开放式提问引导自我探索
4. 回复控制在150字以内，简洁有力
5. 给出具体可操作的建议
6. 检测到自杀/自伤风险时立即提供危机热线(400-161-9995)
7. 像真人咨询师一样自然对话，不使用markdown格式`;

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
  el.innerHTML = chatHistory.map(m => `
    <div class="chat-msg ${m.role}">
      <div class="msg-role">${getRoleName(m.role)}</div>
      <div class="msg-content">${m.text}</div>
      <div class="msg-time">${m.time||''}</div>
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
  const sysPrompt = chatMode === 'train' ? VISITOR_PROMPT : COUNSELOR_PROMPT;
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
function initVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { document.getElementById('voiceBtn').style.display='none'; return; }
  recognition = new SR();
  recognition.lang = 'zh-CN';
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.onresult = function(e) {
    let t = '';
    for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
    document.getElementById('chatInput').value = t;
    if (e.results[e.results.length-1].isFinal) updateVoiceStatus('识别完成');
  };
  recognition.onend = function() {
    isRecording = false;
    document.getElementById('voiceBtn').classList.remove('recording');
    updateVoiceStatus('');
  };
  recognition.onerror = function(e) {
    isRecording = false;
    document.getElementById('voiceBtn').classList.remove('recording');
    updateVoiceStatus(e.error==='not-allowed'?'请允许麦克风权限':'语音识别出错');
    setTimeout(()=>updateVoiceStatus(''), 3000);
  };
}

function toggleVoice() {
  if (!recognition) initVoice();
  if (!recognition) { alert('浏览器不支持语音识别'); return; }
  if (isRecording) { recognition.stop(); isRecording=false; }
  else {
    recognition.start(); isRecording=true;
    document.getElementById('voiceBtn').classList.add('recording');
    updateVoiceStatus('正在聆听...');
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

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  const savedKey = localStorage.getItem('mh_ai_key');
  const savedUrl = localStorage.getItem('mh_ai_url');
  const savedModel = localStorage.getItem('mh_ai_model');
  if (savedKey) AI_CONFIG.apiKey = savedKey;
  if (savedUrl) AI_CONFIG.apiUrl = savedUrl;
  if (savedModel) AI_CONFIG.model = savedModel;
  loadChatHistory();
  renderChat();
  switchRole('student');
  switchChatMode('consult');
  initVoice();
});