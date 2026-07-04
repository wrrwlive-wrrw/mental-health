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
      <div class="fs-camera-wrap">
        <video id="fsCameraVideo" autoplay playsinline style="width:100%;border-radius:8px;background:#000"></video>
        <canvas id="fsCameraCanvas" style="display:none"></canvas>
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
        <select id="fsCamAnalysisType" style="font-size:12px;padding:4px 8px;border-radius:4px;border:1px solid #d4a574">
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
