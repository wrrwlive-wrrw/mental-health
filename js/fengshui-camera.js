// 风水大师·摄像头实时采集与AI分析

let fsCameraStream = null;
let fsCameraTab = null;

// 打开摄像头
function fsOpenCamera(tab) {
  fsCameraTab = tab;
  const modal = document.createElement('div');
  modal.className = 'fs-modal';
  modal.id = 'fsCameraModal';
  modal.innerHTML = `
    <div class="fs-modal-mask" onclick="fsCloseCamera()"></div>
    <div class="fs-modal-box" style="max-width:520px">
      <h3 class="fs-modal-title">📹 摄像头采集分析</h3>
      <p style="font-size:12px;color:#666;text-align:center;margin-bottom:10px">
        ${getCameraGuide(tab)}
      </p>
      <div class="fs-camera-wrap" style="position:relative">
        <video id="fsCameraVideo" autoplay playsinline style="width:100%;border-radius:8px;background:#000"></video>
        <canvas id="fsCameraCanvas" style="display:none"></canvas>
        <div id="fsCameraGuideOverlay" class="fs-camera-guide-overlay"></div>
      </div>
      <div class="fs-camera-preview" id="fsCameraPreview"></div>
      <div class="fs-camera-actions">
        <button class="fs-btn-submit" onclick="fsCapturePhoto()">📷 拍照</button>
        <button class="fs-btn-submit" style="background:#4caf50" onclick="fsCaptureFullBody()">🧍 全身照</button>
        <button class="fs-btn-cancel" onclick="fsCloseCamera()">关闭</button>
      </div>
      <div class="fs-camera-opts">
        <label style="font-size:12px;color:#5a4a2a">
          <input type="checkbox" id="fsCamMirror" checked onchange="fsCamToggleMirror()"> 镜像
        </label>
        <select id="fsCamAnalysisType" style="font-size:12px;padding:4px 8px;border-radius:4px;border:1px solid #d4a574" onchange="updateCameraGuide()">
          <option value="face">面相分析</option>
          <option value="palm">手相分析</option>
          <option value="foot">脚相分析</option>
          <option value="body">全身体相</option>
          <option value="house">房屋/院落风水</option>
        </select>
      </div>
    </div>`;
  document.body.appendChild(modal);
  startCamera();
  setTimeout(updateCameraGuide, 300);
}

// 获取摄像头指引
function getCameraGuide(tab) {
  const guides = {
    xiangshu: '请对准面部/手掌/脚掌，光线充足时效果更佳。支持面相、手相、脚相、全身体相分析。',
    fengshui: '请对准房间/院落/大门方向拍摄，AI将从风水角度分析格局吉凶。',
    ziwei: '拍摄面部照片，结合命盘分析面相与紫微主星的关联。',
    bazi: '拍摄面部/手掌，AI将结合八字五行分析体态与命理的呼应。',
    divine: '拍摄任意物品或场景，AI将以象数思维进行卦象联想解读。'
  };
  return guides[tab] || guides.xiangshu;
}

// 启动摄像头
async function startCamera() {
  try {
    fsCameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode:'user', width:{ideal:640}, height:{ideal:480} }
    });
    const video = document.getElementById('fsCameraVideo');
    if (video) {
      video.srcObject = fsCameraStream;
      video.style.transform = 'scaleX(-1)';
    }
  } catch(e) {
    alert('无法访问摄像头，请检查浏览器权限设置');
    fsCloseCamera();
  }
}

// 镜像切换
function fsCamToggleMirror() {
  const video = document.getElementById('fsCameraVideo');
  const checked = document.getElementById('fsCamMirror').checked;
  if (video) video.style.transform = checked ? 'scaleX(-1)' : 'none';
}

// 拍照
function fsCapturePhoto() {
  const video = document.getElementById('fsCameraVideo');
  const canvas = document.getElementById('fsCameraCanvas');
  if (!video || !canvas) return;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (document.getElementById('fsCamMirror').checked) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  showCapturePreview(dataUrl);
}

// 虚线引导框 - 根据分析类型切换
function updateCameraGuide() {
  const el = document.getElementById('fsCameraGuideOverlay');
  if (!el) return;
  const type = document.getElementById('fsCamAnalysisType')?.value || 'face';
  el.innerHTML = getCameraGuideSVG(type);
}

function getCameraGuideSVG(type) {
  const common = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
  if (type === 'face') {
    return `<div style="${common}display:flex;align-items:center;justify-content:center;flex-direction:column">
      <svg width="60%" viewBox="0 0 200 260" style="max-width:220px">
        <ellipse cx="100" cy="120" rx="70" ry="95" fill="none" stroke="#ffcc00" stroke-width="2" stroke-dasharray="8,6" opacity="0.8"/>
        <line x1="60" y1="90" x2="90" y2="90" stroke="#ffcc00" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
        <line x1="110" y1="90" x2="140" y2="90" stroke="#ffcc00" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
        <line x1="90" y1="130" x2="110" y2="130" stroke="#ffcc00" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
        <path d="M80 165 Q100 180 120 165" fill="none" stroke="#ffcc00" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
      </svg>
      <span style="color:#ffcc00;font-size:11px;text-shadow:0 1px 2px #000;margin-top:4px">请将面部对准椭圆框内</span>
    </div>`;
  }
  if (type === 'palm') {
    return `<div style="${common}display:flex;align-items:center;justify-content:center;flex-direction:column">
      <svg width="55%" viewBox="0 0 200 280" style="max-width:200px">
        <path d="M60 280 L60 180 Q60 160 70 140 L75 80 Q78 60 85 60 Q92 60 95 80 L97 120 L100 50 Q103 30 110 30 Q117 30 120 50 L118 120 L125 55 Q128 35 135 35 Q142 35 145 55 L140 130 L148 80 Q150 65 157 65 Q164 65 165 80 L158 160 Q170 150 175 155 Q180 160 170 180 L155 210 Q145 240 140 280 Z" fill="none" stroke="#00ff88" stroke-width="2" stroke-dasharray="8,6" opacity="0.8"/>
        <path d="M75 180 Q100 200 130 175" fill="none" stroke="#00ff88" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
        <path d="M70 210 Q105 225 140 205" fill="none" stroke="#00ff88" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
        <path d="M65 240 Q100 255 140 235" fill="none" stroke="#00ff88" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
      </svg>
      <span style="color:#00ff88;font-size:11px;text-shadow:0 1px 2px #000;margin-top:4px">请将手掌展开对准框内，掌心朝上</span>
    </div>`;
  }
  if (type === 'foot') {
    return `<div style="${common}display:flex;align-items:center;justify-content:center;flex-direction:column">
      <svg width="50%" viewBox="0 0 180 300" style="max-width:180px">
        <path d="M50 290 Q40 250 45 200 Q48 150 55 120 Q60 90 65 80 Q75 60 90 60 Q105 60 115 80 Q120 90 125 120 Q132 150 135 200 Q140 250 130 290 Q110 300 90 300 Q70 300 50 290 Z" fill="none" stroke="#ff88ff" stroke-width="2" stroke-dasharray="8,6" opacity="0.8"/>
        <ellipse cx="65" cy="55" rx="8" ry="12" fill="none" stroke="#ff88ff" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
        <ellipse cx="80" cy="42" rx="7" ry="11" fill="none" stroke="#ff88ff" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
        <ellipse cx="95" cy="38" rx="7" ry="11" fill="none" stroke="#ff88ff" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
        <ellipse cx="110" cy="42" rx="7" ry="11" fill="none" stroke="#ff88ff" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
        <ellipse cx="123" cy="52" rx="6" ry="10" fill="none" stroke="#ff88ff" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
      </svg>
      <span style="color:#ff88ff;font-size:11px;text-shadow:0 1px 2px #000;margin-top:4px">请将脚掌底部对准框内</span>
    </div>`;
  }
  if (type === 'body') {
    return `<div style="${common}display:flex;align-items:center;justify-content:center;flex-direction:column">
      <svg width="40%" viewBox="0 0 120 320" style="max-width:140px">
        <ellipse cx="60" cy="30" rx="20" ry="25" fill="none" stroke="#88ccff" stroke-width="2" stroke-dasharray="6,4" opacity="0.7"/>
        <line x1="60" y1="55" x2="60" y2="180" stroke="#88ccff" stroke-width="2" stroke-dasharray="6,4" opacity="0.7"/>
        <line x1="60" y1="80" x2="20" y2="140" stroke="#88ccff" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.6"/>
        <line x1="60" y1="80" x2="100" y2="140" stroke="#88ccff" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.6"/>
        <line x1="60" y1="180" x2="35" y2="300" stroke="#88ccff" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.6"/>
        <line x1="60" y1="180" x2="85" y2="300" stroke="#88ccff" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.6"/>
      </svg>
      <span style="color:#88ccff;font-size:11px;text-shadow:0 1px 2px #000;margin-top:4px">请将全身对准轮廓内</span>
    </div>`;
  }
  // house 或其他不需要人体引导框
  return `<div style="${common}display:flex;align-items:flex-end;justify-content:center">
    <span style="color:#ffcc00;font-size:11px;text-shadow:0 1px 2px #000;margin-bottom:12px">对准建筑/房间拍摄</span>
  </div>`;
}
