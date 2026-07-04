// 风水大师·摄像头模块（续）：预览、提交分析、全身照、关闭

// 全身照提示
function fsCaptureFullBody() {
  alert('请将手机/电脑放远，确保全身入镜后点击"拍照"按钮');
  document.getElementById('fsCamAnalysisType').value = 'body';
}

// 显示拍照预览
function showCapturePreview(dataUrl) {
  const el = document.getElementById('fsCameraPreview');
  if (!el) return;
  el.innerHTML = `
    <div style="margin-top:10px;text-align:center">
      <img src="${dataUrl}" style="max-width:200px;border-radius:8px;border:2px solid #c17817">
      <br>
      <button class="fs-btn-submit" style="margin-top:8px" onclick="fsSubmitCameraAnalysis('${dataUrl.slice(0,50)}')">
        🔮 提交AI分析
      </button>
      <button class="fs-btn-cancel" style="margin-top:8px" onclick="document.getElementById('fsCameraPreview').innerHTML=''">
        重拍
      </button>
    </div>`;
  // 存完整dataUrl到临时变量
  window._fsCamLastPhoto = dataUrl;
}

// 提交摄像头照片给AI分析
function fsSubmitCameraAnalysis() {
  const dataUrl = window._fsCamLastPhoto;
  if (!dataUrl) { alert('请先拍照'); return; }
  const analysisType = document.getElementById('fsCamAnalysisType').value;
  const tab = fsCameraTab || 'xiangshu';
  fsCloseCamera();

  const typeLabels = {
    face:'面相分析', palm:'手相分析', foot:'脚相分析',
    body:'全身体相分析', house:'房屋/院落风水分析'
  };
  const typePrompts = {
    face: '用户拍摄了面部照片。请从麻衣神相角度分析：三停比例、五官（眉眼鼻耳口）、十二宫位气色、面型五行归属，给出性格、运势、注意事项。',
    palm: '用户拍摄了手掌照片。请从手相角度分析：三大主线（生命线、智慧线、感情线）的长短深浅、掌丘饱满度、手指比例、特殊纹路，给出解读。',
    foot: '用户拍摄了脚掌照片。请从足相角度分析：脚型（希腊脚/埃及脚/罗马脚）、脚趾形态、脚底纹路、足弓，推断性格与运势。',
    body: '用户拍摄了全身照。请从柳庄神相的体相角度分析：身材比例、站姿、肩膀宽窄、腰背形态、五行体型归属（金木水火土），给出整体运势评价。',
    house: '用户拍摄了房屋/院落照片。请从风水角度分析：建筑坐向、大门位置、周围环境形煞、藏风聚气情况，给出风水评级与化煞建议。'
  };

  addFsLabMsg(tab, {
    type:'image', role:'user',
    data: dataUrl,
    text: `[摄像头${typeLabels[analysisType]}]`
  });
  fsLabAIAnalyze(tab, typePrompts[analysisType], dataUrl);
}

// 关闭摄像头
function fsCloseCamera() {
  if (fsCameraStream) {
    fsCameraStream.getTracks().forEach(t => t.stop());
    fsCameraStream = null;
  }
  const modal = document.getElementById('fsCameraModal');
  if (modal) modal.remove();
  window._fsCamLastPhoto = null;
}
