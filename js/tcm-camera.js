// 中医智能诊疗 - 摄像头视频采集 + 引导框
let tcmCameraStream = null;
let tcmCameraType = 'face'; // face/tongue/palm/foot

function openTcmCamera() {
  tcmCameraType = 'face';
  const modal = document.createElement('div');
  modal.className = 'fs-modal';
  modal.id = 'tcmCameraModal';
  modal.innerHTML = `
    <div class="fs-modal-mask" onclick="closeTcmCamera()"></div>
    <div class="fs-modal-box" style="max-width:520px">
      <h3 class="fs-modal-title">📷 中医望诊采集</h3>
      <p style="font-size:12px;color:#666;text-align:center;margin-bottom:10px">
        请选择采集类型，将对应部位对准引导框内
      </p>
      <div style="display:flex;gap:6px;justify-content:center;margin-bottom:10px">
        <button class="tcm-btn tcm-btn-primary" onclick="switchTcmCamType('face')">👤 面部</button>
        <button class="tcm-btn" style="background:#f5f5f5" onclick="switchTcmCamType('tongue')">👅 舌象</button>
        <button class="tcm-btn" style="background:#f5f5f5" onclick="switchTcmCamType('palm')">🤚 手掌</button>
        <button class="tcm-btn" style="background:#f5f5f5" onclick="switchTcmCamType('foot')">🦶 脚掌</button>
      </div>
      <div class="tcm-camera-wrap">
        <video id="tcmCamVideo" autoplay playsinline style="width:100%;border-radius:8px;background:#000"></video>
        <svg id="tcmCamOverlay" class="tcm-camera-overlay"></svg>
        <div class="tcm-camera-guide" id="tcmCamGuide">请将面部对准椭圆框内</div>
      </div>
      <div style="text-align:center;margin-top:10px">
        <button class="tcm-btn tcm-btn-primary" onclick="tcmCamCapture()">📷 拍照</button>
        <button class="tcm-btn" style="background:#eee;margin-left:8px" onclick="closeTcmCamera()">关闭</button>
      </div>
      <div id="tcmCamPreview" style="text-align:center;margin-top:10px"></div>
    </div>`;
  document.body.appendChild(modal);
  startTcmCamera();
  setTimeout(()=>drawTcmOverlay('face'), 300);
}

async function startTcmCamera() {
  try {
    tcmCameraStream = await navigator.mediaDevices.getUserMedia({
      video:{facingMode:'user',width:{ideal:480},height:{ideal:360}}
    });
    const video = document.getElementById('tcmCamVideo');
    if (video) { video.srcObject = tcmCameraStream; video.style.transform = 'scaleX(-1)'; }
  } catch(e) {
    alert('无法访问摄像头，请检查浏览器权限');
    closeTcmCamera();
  }
}

function switchTcmCamType(type) {
  tcmCameraType = type;
  drawTcmOverlay(type);
  const guides = {face:'请将面部对准椭圆框内',tongue:'请张嘴伸舌，对准矩形框',palm:'请将手掌正面对准框内',foot:'请将脚掌对准框内'};
  const el = document.getElementById('tcmCamGuide');
  if (el) el.textContent = guides[type]||'';
  // 更新按钮高亮
  const typeNames = {face:'面部',tongue:'舌象',palm:'手掌',foot:'脚掌'};
  document.querySelectorAll('#tcmCameraModal .tcm-btn').forEach(btn=>{
    const t = btn.textContent;
    if (t.includes('面部')||t.includes('舌象')||t.includes('手掌')||t.includes('脚掌')) {
      btn.className = t.includes(typeNames[type]) ? 'tcm-btn tcm-btn-primary' : 'tcm-btn';
      if (!t.includes(typeNames[type])) btn.style.background = '#f5f5f5';
      else btn.style.background = '';
    }
  });
}

// 绘制引导框overlay
function drawTcmOverlay(type) {
  const svg = document.getElementById('tcmCamOverlay');
  if (!svg) return;
  const w = svg.clientWidth || 480;
  const h = svg.clientHeight || 360;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  let shape = '';
  const cx = w/2, cy = h/2;
  switch(type) {
    case 'face':
      shape = `<ellipse cx="${cx}" cy="${cy-10}" rx="${w*0.22}" ry="${h*0.38}" fill="none" stroke="#4caf50" stroke-width="2" stroke-dasharray="8,4"/>`;
      break;
    case 'tongue':
      const tw=w*0.3, th=h*0.35;
      shape = `<rect x="${cx-tw/2}" y="${cy-th/2+20}" width="${tw}" height="${th}" rx="8" fill="none" stroke="#ff9800" stroke-width="2" stroke-dasharray="8,4"/>`;
      break;
    case 'palm':
      shape = `<ellipse cx="${cx}" cy="${cy}" rx="${w*0.28}" ry="${h*0.4}" fill="none" stroke="#2196f3" stroke-width="2" stroke-dasharray="8,4"/>
        <line x1="${cx-w*0.1}" y1="${cy-h*0.15}" x2="${cx+w*0.1}" y2="${cy-h*0.15}" stroke="#2196f3" stroke-width="1" stroke-dasharray="4,4"/>
        <line x1="${cx-w*0.12}" y1="${cy}" x2="${cx+w*0.12}" y2="${cy}" stroke="#2196f3" stroke-width="1" stroke-dasharray="4,4"/>
        <line x1="${cx-w*0.08}" y1="${cy+h*0.12}" x2="${cx+w*0.08}" y2="${cy+h*0.12}" stroke="#2196f3" stroke-width="1" stroke-dasharray="4,4"/>`;
      break;
    case 'foot':
      shape = `<ellipse cx="${cx}" cy="${cy-20}" rx="${w*0.2}" ry="${h*0.42}" fill="none" stroke="#9c27b0" stroke-width="2" stroke-dasharray="8,4"/>`;
      break;
  }
  // 半透明遮罩 + 引导框
  svg.innerHTML = `<rect width="${w}" height="${h}" fill="rgba(0,0,0,0.15)"/>${shape}`;
}

// 拍照
function tcmCamCapture() {
  const video = document.getElementById('tcmCamVideo');
  if (!video) return;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  window._tcmLastPhoto = dataUrl;
  // 显示预览
  const el = document.getElementById('tcmCamPreview');
  if (el) el.innerHTML = `
    <img src="${dataUrl}" style="max-width:180px;border-radius:6px;border:2px solid #2e7d32;margin:8px">
    <br><button class="tcm-btn tcm-btn-primary" onclick="submitTcmPhoto()">✓ 使用此照片进行AI分析</button>
    <button class="tcm-btn" style="background:#eee;margin-left:6px" onclick="document.getElementById('tcmCamPreview').innerHTML=''">重拍</button>`;
}

// 提交照片给AI望诊分析
function submitTcmPhoto() {
  const dataUrl = window._tcmLastPhoto;
  if (!dataUrl) return;
  const typeLabels = {face:'面部望诊',tongue:'舌象分析',palm:'手掌观察',foot:'脚掌观察'};
  const typePrompts = {
    face:'用户拍摄了面部照片。请从中医望诊角度分析：面色（赤白黄青黑）、五官神态、三部分候（上中下），推断脏腑气血状况，给出初步判断。',
    tongue:'用户拍摄了舌象照片。请从中医舌诊角度分析：舌质（颜色、形态、胖瘦、裂纹、齿痕）、舌苔（颜色、厚薄、润燥、腐腻），推断病性病位。',
    palm:'用户拍摄了手掌照片。请从中医望诊角度分析：手掌颜色、温度推测、指甲情况、青筋（络脉）分布，结合手诊推断体质和脏腑状况。',
    foot:'用户拍摄了脚掌照片。请从中医角度分析：足部颜色、形态、经络反射区域表现，推断健康状况。'
  };
  closeTcmCamera();
  // 加入到问诊对话
  tcmConsultHistory.push({role:'user', content:`[${typeLabels[tcmCameraType]}照片已上传]`});
  tcmConsultHistory.push({role:'ai', content:'照片已收到，正在AI分析中...'});
  refreshConsultChat();
  // 调用AI分析
  tcmCallAI('consultation', typePrompts[tcmCameraType]).then(reply => {
    tcmConsultHistory[tcmConsultHistory.length-1] = {role:'ai', content:reply};
    refreshConsultChat();
  });
}

// 关闭摄像头
function closeTcmCamera() {
  if (tcmCameraStream) {
    tcmCameraStream.getTracks().forEach(t=>t.stop());
    tcmCameraStream = null;
  }
  const modal = document.getElementById('tcmCameraModal');
  if (modal) modal.remove();
  window._tcmLastPhoto = null;
}
