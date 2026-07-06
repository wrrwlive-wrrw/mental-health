// 西医智能诊疗 - 增强图片/视频AI识别模块
// 提供：专业医学图像分类识别、视频帧提取分析、OCR结果确认、实时拍照引导

// ========== 医学图像分类识别 Prompt ==========
const WM_VISION_PROMPTS = {
  bloodTest: `你是临床检验科专家。请精确识别这张血液检验报告，逐项提取：
- 项目名称、检测值、单位、参考范围
- 用↑标注偏高、↓标注偏低
- 重点关注：血常规(WBC/RBC/PLT/HGB)、肝功(ALT/AST/GGT)、肾功(Cr/BUN/UA)、血脂(TC/TG/LDL/HDL)、血糖(GLU/HbA1c)
- 输出格式：每行一项"项目：值 单位（参考范围）↑/↓"`,

  imaging: `你是影像科主任医师。请专业解读这张医学影像（X光/CT/MRI/超声/内镜），包含：
【检查类型】自动判断影像类型
【检查部位】
【影像所见】系统描述（位置、大小、形态、密度/信号、边界、周围组织关系）
【诊断意见】
【建议】是否需要进一步检查`,

  prescription: `你是药学专家。请精确识别这张处方/用药清单：
- 药品名称（通用名+商品名）、规格、用法用量、天数
- 标注药物分类（抗生素/降压药/降糖药等）
- 检查是否有药物相互作用风险
- 输出格式：每行一药"药名 规格 用法 | 分类"`,

  pathology: `你是病理科专家。请解读这张病理报告/切片图：
【标本来源】
【大体描述】
【镜下所见】
【免疫组化】（如有）
【病理诊断】
【分级分期】（如有）`,

  ecg: `你是心内科专家。请解读这张心电图：
【心率】
【心律】
【电轴】
【各波段分析】P波、PR间期、QRS波群、ST段、T波、QT间期
【诊断结论】
【临床建议】`,

  auto: `你是全科主任医师+检验科+影像科专家。请先判断这张医学图片的类型，然后进行专业识别：
- 如果是化验单：逐项提取数值，标注异常
- 如果是影像报告：转录报告内容
- 如果是影像图片(CT/MRI/X光)：描述影像所见
- 如果是处方：提取药物信息
- 如果是病历：提取关键诊疗信息
请精确、完整地输出识别结果。`
};

// ========== 视频帧提取与分析 ==========
async function wmExtractVideoFrames(videoData, frameCount) {
  frameCount = frameCount || 4;
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = videoData;
    video.muted = true;
    video.preload = 'metadata';
    video.onloadedmetadata = function() {
      const duration = video.duration;
      const interval = duration / (frameCount + 1);
      const frames = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let captured = 0;
      function captureFrame(time) {
        video.currentTime = time;
      }
      video.onseeked = function() {
        canvas.width = Math.min(video.videoWidth, 1280);
        canvas.height = Math.min(video.videoHeight, 720);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL('image/jpeg', 0.8));
        captured++;
        if (captured < frameCount) {
          captureFrame(interval * (captured + 1));
        } else {
          resolve(frames);
        }
      };
      captureFrame(interval);
    };
    video.onerror = () => resolve([]);
  });
}

// ========== 智能图片分类检测 ==========
function wmDetectImageType(filename) {
  const name = (filename || '').toLowerCase();
  if (/血|blood|cbc|routine|常规/.test(name)) return 'bloodTest';
  if (/ct|mri|x.?ray|超声|b超|影像|胸片/.test(name)) return 'imaging';
  if (/处方|rx|prescription|用药/.test(name)) return 'prescription';
  if (/病理|pathology|切片|活检/.test(name)) return 'pathology';
  if (/心电|ecg|ekg/.test(name)) return 'ecg';
  return 'auto';
}

// ========== OCR结果确认与编辑 ==========
function wmShowOcrConfirm(result, target) {
  const el = document.getElementById('wmOcrStatus');
  if (!el) return;
  el.innerHTML = `<div style="background:#f5f9ff;padding:10px;border-radius:8px;border:1px solid #90caf9;margin-top:8px">
    <p style="font-size:12px;font-weight:bold;color:#1565c0;margin:0 0 6px">🔍 AI识别结果预览（可编辑后确认）</p>
    <textarea id="wmOcrEditArea" style="width:100%;min-height:120px;padding:8px;border:1px solid #90caf9;border-radius:6px;font-size:12px;line-height:1.6;resize:vertical">${result}</textarea>
    <div style="margin-top:8px;display:flex;gap:8px">
      <button class="wm-btn wm-btn-primary" style="font-size:12px" onclick="wmConfirmOcr('${target}')">✓ 确认填入</button>
      <button class="wm-btn" style="font-size:12px" onclick="wmCancelOcr()">✗ 取消</button>
      <button class="wm-btn" style="font-size:12px;background:#fff3e0" onclick="wmRetryOcr('${target}')">↻ 重新识别</button>
    </div>
  </div>`;
}

function wmConfirmOcr(target) {
  const area = document.getElementById('wmOcrEditArea');
  if (!area) return;
  const result = area.value.trim();
  if (target === 'labs') {
    const el = document.getElementById('wmLabs');
    if (el) { el.value = (el.value ? el.value+'\n' : '') + result; wmDiagData.labs = el.value; }
  } else if (target === 'imaging') {
    const el = document.getElementById('wmImaging');
    if (el) { el.value = (el.value ? el.value+'\n' : '') + result; wmDiagData.imaging = el.value; }
  } else {
    // all模式智能分配
    const labMatch = result.match(/【化验结果】([\s\S]*?)(?=【|$)/);
    const imgMatch = result.match(/【影像报告】([\s\S]*?)(?=【|$)/);
    if (labMatch) {
      const el = document.getElementById('wmLabs');
      if (el) { el.value = (el.value?el.value+'\n':'') + labMatch[1].trim(); wmDiagData.labs = el.value; }
    }
    if (imgMatch) {
      const el = document.getElementById('wmImaging');
      if (el) { el.value = (el.value?el.value+'\n':'') + imgMatch[1].trim(); wmDiagData.imaging = el.value; }
    }
    if (!labMatch && !imgMatch) {
      const el = document.getElementById('wmLabs');
      if (el) { el.value = (el.value?el.value+'\n':'') + result; wmDiagData.labs = el.value; }
    }
  }
  wmCancelOcr();
  const statusEl = document.getElementById('wmOcrStatus');
  if (statusEl) statusEl.innerHTML = '<span style="color:#2e7d32">✓ 已确认填入</span>';
}

function wmCancelOcr() {
  const el = document.getElementById('wmOcrStatus');
  if (el) el.innerHTML = '';
}

let wmLastOcrTarget = 'all';
function wmRetryOcr(target) {
  wmCancelOcr();
  wmAiRecognizeImagesEnhanced(target);
}

// ========== 增强版OCR识别（替代原wmAiRecognizeImages） ==========
async function wmAiRecognizeImagesEnhanced(target) {
  if (!AI_CONFIG.apiKey) { alert('请先配置AI API Key'); return; }
  const images = (wmDiagData.attachments||[]).filter(f => f.type==='image' && f.data);
  const videos = (wmDiagData.attachments||[]).filter(f => f.type==='video' && f.data);
  if (!images.length && !videos.length) { alert('没有可识别的图片或视频'); return; }

  wmLastOcrTarget = target;
  const statusEl = document.getElementById('wmOcrStatus');
  if (statusEl) statusEl.innerHTML = '<span style="color:#e65100">⏳ AI增强识别中（图片分类+专业提取）...</span>';

  // 收集所有要分析的图像帧
  let allFrames = [];
  // 图片：按文件名智能分类选择prompt
  images.forEach(img => {
    const imgType = wmDetectImageType(img.name);
    allFrames.push({ data: img.data, type: imgType, source: 'image' });
  });
  // 视频：提取关键帧
  for (const v of videos) {
    if (statusEl) statusEl.innerHTML = '<span style="color:#e65100">⏳ 正在提取视频关键帧...</span>';
    const frames = await wmExtractVideoFrames(v.data, 3);
    frames.forEach(f => allFrames.push({ data: f, type: 'auto', source: 'video' }));
  }

  if (!allFrames.length) { if (statusEl) statusEl.innerHTML='<span style="color:#f44336">无有效内容可识别</span>'; return; }

  // 选择最合适的prompt
  let prompt;
  if (target === 'labs') prompt = WM_VISION_PROMPTS.bloodTest;
  else if (target === 'imaging') prompt = WM_VISION_PROMPTS.imaging;
  else {
    // auto模式：根据图片类型选择最合适的prompt
    const types = allFrames.map(f => f.type);
    if (types.every(t => t==='bloodTest')) prompt = WM_VISION_PROMPTS.bloodTest;
    else if (types.every(t => t==='imaging')) prompt = WM_VISION_PROMPTS.imaging;
    else if (types.every(t => t==='ecg')) prompt = WM_VISION_PROMPTS.ecg;
    else if (types.every(t => t==='prescription')) prompt = WM_VISION_PROMPTS.prescription;
    else if (types.every(t => t==='pathology')) prompt = WM_VISION_PROMPTS.pathology;
    else prompt = WM_VISION_PROMPTS.auto;
  }

  const userContent = [{type:'text', text:prompt}];
  allFrames.slice(0, 8).forEach(f => {
    userContent.push({type:'image_url', image_url:{url:f.data, detail:'high'}});
  });

  try {
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+AI_CONFIG.apiKey},
      body:JSON.stringify({ model:AI_CONFIG.model, messages:[{role:'user',content:userContent}], max_tokens:3000, temperature:0.1 })
    });
    if (!resp.ok) throw new Error('HTTP '+resp.status);
    const data = await resp.json();
    let result = data.choices?.[0]?.message?.content||'';
    if (result.includes('</think>')) result = result.split('</think>').pop().trim();
    if (!result) { if (statusEl) statusEl.innerHTML='<span style="color:#f44336">识别失败</span>'; return; }
    // 显示确认面板
    wmShowOcrConfirm(result, target);
  } catch(e) {
    if (statusEl) statusEl.innerHTML = `<span style="color:#f44336">识别失败：${e.message}</span>`;
  }
}
