// 西医智能诊疗 - AI智能体模块
let wmAgentHistory = [];
let wmAgentMode = 'diagnose';
let wmAgentImages = []; // 待发送的图片base64数组

function renderWmAiAgent() {
  const patient = getWmCurrentPatient();
  let badge = '';
  if (patient) {
    const ext = getWmPatientExt(patient.id);
    badge = `<div style="padding:8px 12px;background:#e3f2fd;border-radius:6px;margin-bottom:10px;font-size:12px;color:#0d47a1;line-height:1.6">
      <b>当前病人：</b>${patient.name}（${patient.gender}，${patient.age}岁）
      ${patient.chronicDiseases?'| 慢病：'+patient.chronicDiseases:''}
      ${ext.bloodType?'| 血型：'+ext.bloodType:''}
    </div>`;
  }
  return `<div>
    ${badge}
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <button class="wm-btn ${wmAgentMode==='diagnose'?'wm-btn-primary':''}" onclick="switchWmAgent('diagnose')">🩺 智能诊断</button>
      <button class="wm-btn ${wmAgentMode==='interpret'?'wm-btn-primary':''}" onclick="switchWmAgent('interpret')">🔬 检查解读</button>
      <button class="wm-btn ${wmAgentMode==='treatment'?'wm-btn-primary':''}" onclick="switchWmAgent('treatment')">💊 治疗方案</button>
    </div>
    <div style="font-size:12px;color:#666;margin-bottom:10px">${getWmAgentDesc()}</div>
    <div class="wm-chat" id="wmAgentChat" style="min-height:200px">
      ${wmAgentHistory.length ? wmAgentHistory.map(m =>
        `<div class="wm-chat-msg ${m.role}">${m.role==='ai'?formatWmAnswer(m.content):m.content}</div>`
      ).join('') : `<div class="wm-chat-msg ai">${getWmAgentWelcome()}</div>`}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0">
      ${getWmQuickQ().map(q =>
        `<button class="wm-btn" style="font-size:11px;padding:4px 10px" onclick="askWmAgent('${q}')">${q}</button>`
      ).join('')}
    </div>
    <div id="wmAgentImgPreview" style="margin-bottom:6px"></div>
    <div class="wm-chat-input">
      <input id="wmAgentInput" placeholder="描述症状或输入检查结果..." onkeydown="if(event.key==='Enter')sendWmAgent()">
      <label style="padding:8px 12px;background:#e3f2fd;border-radius:6px;cursor:pointer;font-size:16px;line-height:1" title="上传图片让AI识别">
        🖼️<input type="file" accept="image/*" multiple hidden onchange="wmAgentAddImages(this)">
      </label>
      <label style="padding:8px 12px;background:#e8f5e9;border-radius:6px;cursor:pointer;font-size:16px;line-height:1" title="上传视频提取关键帧分析">
        🎥<input type="file" accept="video/*" hidden onchange="wmAgentAddVideo(this)">
      </label>
      <button onclick="sendWmAgent()">发送</button>
    </div>
    <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="wm-btn" style="background:#f5f5f5;font-size:12px" onclick="clearWmAgent()">清空记录</button>
      <span style="font-size:11px;color:#999;line-height:28px">支持发送图片（化验单/CT/报告）和视频让AI智能识别分析</span>
    </div>
  </div>`;
}

function switchWmAgent(mode) { wmAgentMode = mode; wmAgentHistory = []; wmAgentImages=[]; showWmTab('aiAgent'); }
function clearWmAgent() { wmAgentHistory = []; wmAgentImages=[]; showWmTab('aiAgent'); }

function getWmAgentDesc() {
  const d = { diagnose:'系统性问诊采集病史体征，给出鉴别诊断和检查建议', interpret:'解读化验单、影像报告等检查结果，分析临床意义', treatment:'根据诊断给出循证医学治疗方案（药物+非药物+随访）' };
  return d[wmAgentMode] || '';
}

function getWmAgentWelcome() {
  const w = { diagnose:'您好，我是西医AI诊断助手。请描述您的主要症状，我将系统性问诊后给出鉴别诊断建议。<br><br>请先告诉我：哪里不舒服？什么时候开始的？', interpret:'您好，我是检查报告解读助手。请输入您的化验结果或描述影像报告内容，我将为您专业解读：<br>· 异常指标含义<br>· 可能的疾病指向<br>· 后续建议', treatment:'您好，我是治疗方案助手。请告诉我您的诊断或症状，我将提供循证医学治疗方案：<br>· 药物治疗（含剂量疗程）<br>· 非药物治疗<br>· 随访计划<br>· 生活方式建议' };
  return w[wmAgentMode] || '';
}

function getWmQuickQ() {
  const qs = { diagnose:['反复咳嗽一个月','肝区隐痛乏力','血压偏高头晕','结合中医记录综合分析'], interpret:['转氨酶升高','胸部CT报告','血常规白细胞高','尿蛋白阳性'], treatment:['高血压治疗方案','2型糖尿病用药','幽门螺杆菌根除','结合中医给方案'] };
  return qs[wmAgentMode] || [];
}

function askWmAgent(q) { document.getElementById('wmAgentInput').value = q; sendWmAgent(); }

async function sendWmAgent() {
  const input = document.getElementById('wmAgentInput');
  const text = input?.value.trim();
  if (!text && !wmAgentImages.length) return;
  input.value = '';

  // 构建用户消息显示
  let displayMsg = text || '';
  if (wmAgentImages.length) displayMsg += (displayMsg?' ':'') + `[附${wmAgentImages.length}张图片]`;
  wmAgentHistory.push({role:'user', content:displayMsg, images: wmAgentImages.length?[...wmAgentImages]:null});
  const sendImages = [...wmAgentImages];
  wmAgentImages = [];
  updateWmAgentImgPreview();
  refreshWmAgentChat();

  if (!AI_CONFIG.apiKey) {
    wmAgentHistory.push({role:'ai', content:'此功能需要配置AI API Key。请在中医模块的"API设置"页面配置（推荐Groq免费平台）。'});
    refreshWmAgentChat(); return;
  }

  const sysPrompt = getWmAgentSysPrompt(sendImages.length > 0);
  const messages = [{role:'system', content:sysPrompt}];

  // 构建历史消息（最近14条）
  wmAgentHistory.slice(-14).forEach(m => {
    if (m.role==='user') {
      if (m.images && m.images.length) {
        // 多模态消息
        const content = [{type:'text', text:m.content||'请分析这些图片'}];
        m.images.forEach(img => content.push({type:'image_url', image_url:{url:img, detail:'high'}}));
        messages.push({role:'user', content});
      } else {
        messages.push({role:'user', content:m.content});
      }
    } else {
      messages.push({role:'assistant', content:m.content});
    }
  });

  try {
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+AI_CONFIG.apiKey},
      body:JSON.stringify({model:AI_CONFIG.model, messages, max_tokens:2500, temperature:0.6})
    });
    if (!resp.ok) throw new Error('HTTP '+resp.status);
    const data = await resp.json();
    let reply = data.choices?.[0]?.message?.content || '';
    if (reply.includes('</think>')) reply = reply.split('</think>').pop().trim();
    wmAgentHistory.push({role:'ai', content:reply});
  } catch(e) {
    wmAgentHistory.push({role:'ai', content:'[连接失败] 请检查API设置。错误：'+e.message});
  }
  refreshWmAgentChat();
}

function getWmAgentSysPrompt(hasImages) {
  const patient = getWmCurrentPatient();
  const patientInfo = formatWmPatientPrompt(patient);
  const recordsInfo = formatWmRecordsPrompt(patient);
  const tcmRef = formatWmTcmCrossRef(patient);
  const prompts = { diagnose:getWmDiagnosePrompt(), interpret:getWmInterpretPrompt(), treatment:getWmTreatmentPrompt() };
  let base = (prompts[wmAgentMode]||getWmBasePrompt()) + patientInfo + recordsInfo + tcmRef;
  // 当有图片时添加医学图像分析指导
  if (hasImages) {
    base += `\n\n【医学图像分析能力】
你同时具备影像科、检验科、病理科、心电图室的专业读片能力。当用户发送图片时：
1. 先判断图片类型（化验单/影像/处方/心电图/病理/其他）
2. 化验单：逐项提取数值，标注异常（↑偏高 ↓偏低），分析临床意义
3. 影像图片：系统描述所见，给出诊断意见
4. 处方：识别药物并评估合理性
5. 心电图：分析各波段，给出诊断
6. 将图片分析结果整合到整体诊断中`;
  }
  base += '\n\n【回答风格】条理清晰，分段论述。专业术语配通俗解释。重要内容用【】标注。';
  return base;
}

function refreshWmAgentChat() {
  const el = document.getElementById('wmAgentChat');
  if (!el) return;
  el.innerHTML = wmAgentHistory.map(m => {
    if (m.role==='ai') {
      return `<div class="wm-chat-msg ai">${formatWmAnswer(m.content)}</div>`;
    } else {
      let imgHtml = '';
      if (m.images && m.images.length) {
        imgHtml = `<div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap">${m.images.map(img =>
          `<img src="${img}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;border:1px solid #90caf9">`
        ).join('')}</div>`;
      }
      return `<div class="wm-chat-msg user">${m.content}${imgHtml}</div>`;
    }
  }).join('');
  el.scrollTop = el.scrollHeight;
}

function formatWmAnswer(text) {
  return text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
    .replace(/【(.*?)】/g,'<b style="color:#1565c0">【$1】</b>');
}

// ========== 图片上传与预览（AI智能体） ==========
function wmAgentAddImages(input) {
  if (!input.files || !input.files.length) return;
  Array.from(input.files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      wmAgentImages.push(e.target.result);
      updateWmAgentImgPreview();
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function updateWmAgentImgPreview(msg) {
  const el = document.getElementById('wmAgentImgPreview');
  if (!el) return;
  if (msg) { el.innerHTML = `<div style="padding:6px 10px;background:#fff3e0;border-radius:6px;font-size:12px;color:#e65100">${msg}</div>`; return; }
  if (!wmAgentImages.length) { el.innerHTML = ''; return; }
  el.innerHTML = `<div style="display:flex;gap:6px;flex-wrap:wrap;padding:6px;background:#f5f9ff;border-radius:6px;border:1px solid #90caf9">
    <span style="font-size:11px;color:#1565c0;line-height:40px">待发送：</span>
    ${wmAgentImages.map((img,i) => `<div style="position:relative">
      <img src="${img}" style="width:40px;height:40px;object-fit:cover;border-radius:4px">
      <span onclick="wmAgentRemoveImg(${i})" style="position:absolute;top:-4px;right:-4px;background:#f44336;color:#fff;border-radius:50%;width:14px;height:14px;font-size:9px;line-height:14px;text-align:center;cursor:pointer">×</span>
    </div>`).join('')}
  </div>`;
}

function wmAgentRemoveImg(idx) {
  wmAgentImages.splice(idx, 1);
  updateWmAgentImgPreview();
}

// ========== 视频上传与帧提取（AI智能体） ==========
async function wmAgentAddVideo(input) {
  if (!input.files || !input.files.length) return;
  const file = input.files[0];
  if (!file.type.startsWith('video/')) return;
  updateWmAgentImgPreview('⏳ 正在提取视频关键帧...');
  const reader = new FileReader();
  reader.onload = async function(e) {
    const frames = await wmExtractVideoFrames(e.target.result, 4);
    if (frames.length) {
      wmAgentImages.push(...frames);
      updateWmAgentImgPreview();
    } else {
      updateWmAgentImgPreview('视频帧提取失败，请尝试上传图片');
    }
  };
  reader.readAsDataURL(file);
  input.value = '';
}
