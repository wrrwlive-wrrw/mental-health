// 风水大师·分析实验室交互逻辑

let fsLabTTSOn = true;
let fsLabRecording = false;
let fsLabRecognition = null;

// 发送文字消息
function fsLabSend(tab) {
  const input = document.getElementById(`fsLabInput_${tab}`);
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addFsLabMsg(tab, {role:'user', content:text});
  fsLabAIAnalyze(tab, text, null);
}

// 图片上传
function fsLabUpload(e, tab) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const dataUrl = ev.target.result;
    addFsLabMsg(tab, {type:'image', role:'user', data:dataUrl, text:'[上传图片分析]'});
    fsLabAIAnalyze(tab, '请分析这张图片', dataUrl);
  };
  reader.readAsDataURL(file);
}

// 语音输入
function fsLabVoiceInput(tab) {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert('浏览器不支持语音识别，请使用 Chrome');
    return;
  }
  if (fsLabRecording) { fsLabRecognition.stop(); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  fsLabRecognition = new SR();
  fsLabRecognition.lang = 'zh-CN';
  fsLabRecognition.continuous = false;
  fsLabRecording = true;
  updateFsLabVoiceBtn(tab, true);
  fsLabRecognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    document.getElementById(`fsLabInput_${tab}`).value = text;
    fsLabSend(tab);
  };
  fsLabRecognition.onend = () => { fsLabRecording = false; updateFsLabVoiceBtn(tab, false); };
  fsLabRecognition.onerror = () => { fsLabRecording = false; updateFsLabVoiceBtn(tab, false); };
  fsLabRecognition.start();
}

function updateFsLabVoiceBtn(tab, active) {
  const btns = document.querySelectorAll('.fs-lab-tool');
  btns.forEach(b => { if (b.textContent.includes('🎤')) b.style.background = active?'#ffdddd':''; });
}

// 获取位置
function fsLabLocation(tab) {
  if (!navigator.geolocation) { alert('浏览器不支持定位'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    const loc = `纬度${pos.coords.latitude.toFixed(4)}, 经度${pos.coords.longitude.toFixed(4)}`;
    addFsLabMsg(tab, {role:'user', content:`📍 我的位置：${loc}，请结合方位分析`});
    fsLabAIAnalyze(tab, `用户位置：${loc}，请结合风水方位进行分析`, null);
  }, () => alert('定位失败，请检查权限'));
}

// 占卜起卦（梅花易数·时间起卦法）
function fsLabDivine(tab) {
  const now = new Date();
  const upper = (now.getHours() + now.getMinutes()) % 8 || 8;
  const lower = (now.getFullYear() + now.getMonth() + now.getDate()) % 8 || 8;
  const dong = (upper + lower) % 6 || 6;
  const gua = ['☰乾','☷坤','☳震','☴巽','☵坎','☲离','☶艮','☱兑'];
  const text = `起卦结果：上卦${gua[upper-1]} 下卦${gua[lower-1]} 动爻第${dong}爻`;
  addFsLabMsg(tab, {role:'user', content:`🎴 ${text}`});
  fsLabAIAnalyze(tab, `我用梅花易数起卦，${text}，请解卦`, null);
}

// 语音播报开关
function fsLabToggleTTS() {
  fsLabTTSOn = !fsLabTTSOn;
  const btns = document.querySelectorAll('.fs-lab-tts');
  btns.forEach(b => b.style.opacity = fsLabTTSOn ? '1' : '0.4');
}

// 语音播报文本
function fsLabSpeak(text) {
  if (!fsLabTTSOn || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g,'').slice(0,300));
  u.lang = 'zh-CN'; u.rate = 0.9; u.pitch = 1.0;
  window.speechSynthesis.speak(u);
}

// 添加消息到历史
function addFsLabMsg(tab, msg) {
  if (!fsLabHistory[tab]) fsLabHistory[tab] = [];
  fsLabHistory[tab].push(msg);
  const el = document.getElementById(`fsLabMsgs_${tab}`);
  if (!el) return;
  el.innerHTML = fsLabHistory[tab].map(m => renderFsLabMsg(m)).join('');
  el.scrollTop = el.scrollHeight;
}
