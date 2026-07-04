// 风水大师·分析实验室（图片/语音/文字/对话 + AI分析引擎）

// 聊天历史（按版块分）
let fsLabHistory = {};

// 渲染分析入口面板
function renderFsLab(tab) {
  const labels = {
    fengshui:'上传户型图/房屋照片，或描述你的住宅情况',
    xiangshu:'上传面部/手掌/脚掌照片，或描述五官特征',
    ziwei:'输入出生年月日时，排紫微命盘',
    bazi:'输入出生年月日时，排四柱八字',
    divine:'心中默念问题，点击起卦或输入文字'
  };
  const hist = fsLabHistory[tab] || [];
  return `
    <div class="fs-lab">
      <div class="fs-lab-msgs" id="fsLabMsgs_${tab}">
        ${hist.length ? hist.map(m => renderFsLabMsg(m)).join('') : `<div class="fs-lab-welcome">欢迎使用分析功能，${labels[tab]}</div>`}
      </div>
      <div class="fs-lab-input">
        <div class="fs-lab-tools">
          <label class="fs-lab-tool" title="上传图片">
            📷<input type="file" accept="image/*" onchange="fsLabUpload(event,'${tab}')" hidden>
          </label>
          <button class="fs-lab-tool" onclick="fsOpenCamera('${tab}')" title="摄像头拍照">📹</button>
          <button class="fs-lab-tool" onclick="fsLabVoiceInput('${tab}')" title="语音输入">🎤</button>
          <button class="fs-lab-tool" onclick="fsLabLocation('${tab}')" title="获取位置">📍</button>
          ${tab==='divine'?'<button class="fs-lab-tool fs-lab-divine-btn" onclick="fsLabDivine(\''+tab+'\')">🎴 起卦</button>':''}
        </div>
        <div class="fs-lab-row">
          <input type="text" id="fsLabInput_${tab}" placeholder="输入你的问题..."
            onkeypress="if(event.key==='Enter')fsLabSend('${tab}')">
          <button class="fs-lab-send" onclick="fsLabSend('${tab}')">发送</button>
          <button class="fs-lab-tts" onclick="fsLabToggleTTS()" title="语音播报">🔊</button>
        </div>
      </div>
    </div>`;
}

// 渲染单条消息
function renderFsLabMsg(m) {
  if (m.type === 'image') {
    return `<div class="fs-lab-msg fs-lab-user"><img src="${m.data}" class="fs-lab-img"><span>${m.text||'[上传图片]'}</span></div>`;
  }
  const cls = m.role === 'user' ? 'fs-lab-user' : 'fs-lab-ai';
  return `<div class="fs-lab-msg ${cls}">${m.content}</div>`;
}
