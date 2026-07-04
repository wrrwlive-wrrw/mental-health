// 中医智能诊疗 - 中草药图鉴模块（含拍照识别、野生/种植辨别）
let herbGuideCategory = 'all';
let herbSearchKw = '';
let herbIdentifyHistory = [];

function renderTcmHerbGuide() {
  return `<div>
    <div style="padding:10px;background:#e8f5e9;border-radius:8px;margin-bottom:12px;border-left:3px solid #2e7d32">
      <p style="font-size:13px;color:#1b5e20;margin:0;line-height:1.6">
        <b>中草药百科图鉴</b>：收录常用中草药，涵盖性味归经、功效主治、道地产地、野生与种植辨别。支持拍照AI识别。
      </p>
    </div>
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <button class="tcm-btn tcm-btn-warn" onclick="openHerbCamera()">📷 拍照识别中草药</button>
      <button class="tcm-btn" style="background:#e3f2fd" onclick="askHerbAI()">🤖 AI问药</button>
      <button class="tcm-btn" style="background:#fce4ec" onclick="showHerbIdentifyGuide()">🔍 野生/种植辨别</button>
    </div>
    <div class="tcm-form-group">
      <input id="herbSearchInput" placeholder="搜索中草药（名称、功效、产地）" value="${herbSearchKw}" oninput="herbSearch()">
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px">
      ${Object.entries(HERB_CATEGORIES).map(([k,v])=>
        `<button class="tcm-btn ${herbGuideCategory===k?'tcm-btn-primary':''}" style="${herbGuideCategory!==k?'background:#f5f5f5':''};font-size:11px;padding:4px 10px" onclick="filterHerbs('${k}')">${v}</button>`
      ).join('')}
    </div>
    <div id="herbListArea">${renderHerbList()}</div>
    <div id="herbPhotoResult"></div>
  </div>`;
}

const HERB_CATEGORIES = {
  all:'全部', jiebiao:'解表药', qingre:'清热药', xiaxia:'泻下药',
  qushi:'祛湿药', wenli:'温里药', liq:'理气药', huoxue:'活血药',
  zhixue:'止血药', huatan:'化痰药', buxu:'补虚药', shouse:'收涩药'
};

function filterHerbs(cat) {
  herbGuideCategory = cat;
  document.getElementById('herbListArea').innerHTML = renderHerbList();
}

function herbSearch() {
  herbSearchKw = document.getElementById('herbSearchInput')?.value.trim().toLowerCase() || '';
  document.getElementById('herbListArea').innerHTML = renderHerbList();
}

function renderHerbList() {
  let list = TCM_HERB_DB;
  if (herbGuideCategory !== 'all') list = list.filter(h => h.category === herbGuideCategory);
  if (herbSearchKw) {
    list = list.filter(h =>
      (h.name+h.alias+h.effect+h.origin+h.meridian+h.indication).toLowerCase().includes(herbSearchKw)
    );
  }
  if (!list.length) return '<p style="color:#999;text-align:center">无匹配结果</p>';
  return `<div style="font-size:12px;color:#888;margin-bottom:8px">共 ${list.length} 味药材</div>` +
    list.map(h => `<div class="tcm-case-item" onclick="showHerbDetail('${h.id}')">
    <div class="title" style="color:#2e7d32">${h.name} <span style="font-weight:normal;font-size:12px;color:#888">${h.alias||''}</span></div>
    <div class="meta">${h.prop} | 归${h.meridian}经 | 产地：${h.origin}</div>
    <div style="font-size:12px;color:#555;margin-top:3px">${h.effect}</div>
  </div>`).join('');
}

// 中草药详情页（包含图文、产地、野生/种植辨别）
function showHerbDetail(id) {
  const h = TCM_HERB_DB.find(x => x.id === id);
  if (!h) return;
  document.getElementById('herbListArea').innerHTML = `
    <div style="border:1px solid #a5d6a7;border-radius:10px;padding:16px;background:#f1f8e9">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h4 style="color:#2e7d32;margin:0">${h.name}</h4>
        <button class="tcm-btn" style="background:#eee;font-size:11px;padding:4px 10px" onclick="identifyHerbByAI('${h.id}')">📷 拍照对比</button>
      </div>
      <p style="font-size:12px;color:#888;margin:0 0 12px">${h.alias?'别名：'+h.alias:''}</p>

      <div style="background:#fff;border-radius:8px;padding:12px;margin-bottom:12px">
        <h5 style="margin:0 0 8px;color:#333;font-size:13px">📋 基本信息</h5>
        <table style="font-size:13px;width:100%;border-collapse:collapse">
          <tr><td style="padding:5px 0;color:#555;width:70px"><b>性味</b></td><td>${h.prop}</td></tr>
          <tr><td style="padding:5px 0;color:#555"><b>归经</b></td><td>${h.meridian}</td></tr>
          <tr><td style="padding:5px 0;color:#555"><b>功效</b></td><td style="color:#1b5e20;font-weight:bold">${h.effect}</td></tr>
          <tr><td style="padding:5px 0;color:#555"><b>主治</b></td><td>${h.indication}</td></tr>
          <tr><td style="padding:5px 0;color:#555"><b>用量</b></td><td>${h.dosage}</td></tr>
          <tr><td style="padding:5px 0;color:#555"><b>禁忌</b></td><td style="color:#c62828">${h.contraindication||'无特殊禁忌'}</td></tr>
        </table>
      </div>

      <div style="background:#fff;border-radius:8px;padding:12px;margin-bottom:12px">
        <h5 style="margin:0 0 8px;color:#e65100;font-size:13px">🌍 产地与道地药材</h5>
        <table style="font-size:13px;width:100%;border-collapse:collapse">
          <tr><td style="padding:5px 0;color:#555;width:70px"><b>产地</b></td><td>${h.origin}</td></tr>
          <tr><td style="padding:5px 0;color:#555"><b>道地产区</b></td><td style="color:#e65100;font-weight:bold">${h.bestOrigin}</td></tr>
          <tr><td style="padding:5px 0;color:#555"><b>采收</b></td><td>${h.harvest||'--'}</td></tr>
          <tr><td style="padding:5px 0;color:#555"><b>炮制</b></td><td>${h.processing||'--'}</td></tr>
        </table>
      </div>

      <div style="background:#fff;border-radius:8px;padding:12px;margin-bottom:12px">
        <h5 style="margin:0 0 8px;color:#6a1b9a;font-size:13px">🔬 外观特征与图像识别要点</h5>
        <p style="font-size:13px;color:#333;margin:0 0 6px;line-height:1.7">${h.appearance}</p>
      </div>

      <div style="background:#fff3e0;border-radius:8px;padding:12px;margin-bottom:12px;border:1px solid #ffe0b2">
        <h5 style="margin:0 0 8px;color:#bf360c;font-size:13px">🌿 野生 vs 种植辨别</h5>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
          <div style="padding:8px;background:#e8f5e9;border-radius:6px">
            <p style="margin:0 0 4px;font-weight:bold;color:#2e7d32">🏔️ 野生特征</p>
            <p style="margin:0;color:#333;line-height:1.6">${h.wildFeature}</p>
          </div>
          <div style="padding:8px;background:#e3f2fd;border-radius:6px">
            <p style="margin:0 0 4px;font-weight:bold;color:#1565c0">🌾 种植特征</p>
            <p style="margin:0;color:#333;line-height:1.6">${h.plantedFeature}</p>
          </div>
        </div>
        <div style="margin-top:8px;padding:8px;background:#fce4ec;border-radius:6px">
          <p style="margin:0;font-size:12px;color:#880e4f;line-height:1.6"><b>鉴别要点：</b>${h.identifyTips}</p>
        </div>
      </div>

      ${h.notes?`<div style="padding:8px 12px;background:#e8eaf6;border-radius:6px;font-size:12px;color:#283593;line-height:1.6"><b>💡 备注：</b>${h.notes}</div>`:''}
    </div>
    <button class="tcm-btn" style="background:#eee;margin-top:10px" onclick="document.getElementById('herbListArea').innerHTML=renderHerbList()">← 返回列表</button>`;
}

// ========== 拍照识别中草药 ==========
function openHerbCamera() {
  const el = document.getElementById('herbListArea');
  el.innerHTML = `
    <div style="border:1px solid #ffcc80;border-radius:10px;padding:16px;background:#fff8e1">
      <h4 style="color:#e65100;margin:0 0 10px">📷 中草药图像识别</h4>
      <p style="font-size:12px;color:#666;margin:0 0 12px;line-height:1.6">
        拍摄或选择中草药照片，AI将识别药材品种，分析是否为野生/种植，并给出鉴别建议。
      </p>
      <div style="text-align:center;margin-bottom:14px">
        <input type="file" id="herbPhotoFile" accept="image/*" capture="environment" onchange="handleHerbPhoto()" style="display:none">
        <button class="tcm-btn tcm-btn-warn" onclick="document.getElementById('herbPhotoFile').click()" style="padding:12px 24px;font-size:14px">
          📷 拍照 / 选择图片
        </button>
      </div>
      <div id="herbPhotoPreview" style="text-align:center"></div>
      <div id="herbAIIdentifyResult"></div>
    </div>
    <button class="tcm-btn" style="background:#eee;margin-top:10px" onclick="document.getElementById('herbListArea').innerHTML=renderHerbList()">← 返回列表</button>`;
}

function handleHerbPhoto() {
  const file = document.getElementById('herbPhotoFile')?.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('herbPhotoPreview').innerHTML =
      `<img src="${e.target.result}" style="max-width:100%;max-height:250px;border-radius:10px;margin-bottom:10px;box-shadow:0 2px 8px rgba(0,0,0,0.15)">
       <div style="margin-top:8px">
         <button class="tcm-btn tcm-btn-primary" onclick="doHerbImageIdentify()">🔍 AI识别此药材</button>
       </div>`;
    window._herbPhotoData = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function doHerbImageIdentify() {
  if (!AI_CONFIG.apiKey) {
    document.getElementById('herbAIIdentifyResult').innerHTML =
      '<p style="color:#c62828;text-align:center">图像识别需要配置AI，请先到"API设置"配置Key</p>';
    return;
  }
  const el = document.getElementById('herbAIIdentifyResult');
  el.innerHTML = '<p style="color:#e65100;text-align:center">AI正在分析图片中的中草药...</p>';

  const prompt = `请识别图片中的中草药/中药材，分析并给出：
1. 药材名称（中文名、别名）
2. 判断是野生还是种植的（并说明判断依据）
3. 药材品质评估（外观、色泽、完整度）
4. 性味归经和主要功效
5. 道地产地信息
6. 真伪鉴别要点
7. 保存和使用建议
请详细回答，如果图片不清晰或无法确认，请说明。`;

  const reply = await tcmCallAI('herbIdentify', prompt);
  el.innerHTML = `
    <div style="margin-top:14px;padding:14px;background:#fff;border-radius:8px;border:1px solid #a5d6a7">
      <h5 style="color:#2e7d32;margin:0 0 8px">🤖 AI识别结果</h5>
      <div style="font-size:13px;color:#333;line-height:1.8">${formatTcmAnswer(reply)}</div>
    </div>`;

  // 保存识别记录
  herbIdentifyHistory.unshift({
    date: new Date().toLocaleString(),
    result: reply
  });
}

// 从详情页拍照对比
function identifyHerbByAI(herbId) {
  const h = TCM_HERB_DB.find(x => x.id === herbId);
  if (!h) return;
  const el = document.getElementById('herbListArea');
  el.innerHTML = `
    <div style="border:1px solid #ce93d8;border-radius:10px;padding:16px;background:#f3e5f5">
      <h4 style="color:#6a1b9a;margin:0 0 8px">📷 拍照对比 - ${h.name}</h4>
      <p style="font-size:12px;color:#666;margin:0 0 8px;line-height:1.6">
        拍摄您手中的药材，AI将与"${h.name}"标准特征进行对比，判断真伪和品质。
      </p>
      <div style="padding:10px;background:#fff;border-radius:6px;margin-bottom:12px;font-size:12px;color:#333;line-height:1.7">
        <b>标准特征：</b>${h.appearance}<br>
        <b>鉴别要点：</b>${h.identifyTips}
      </div>
      <div style="text-align:center">
        <input type="file" id="herbCompareFile" accept="image/*" capture="environment" onchange="handleHerbCompare('${herbId}')" style="display:none">
        <button class="tcm-btn tcm-btn-warn" onclick="document.getElementById('herbCompareFile').click()">📷 拍照对比</button>
      </div>
      <div id="herbComparePreview" style="text-align:center;margin-top:10px"></div>
      <div id="herbCompareResult"></div>
    </div>
    <button class="tcm-btn" style="background:#eee;margin-top:10px" onclick="showHerbDetail('${herbId}')">← 返回详情</button>`;
}

function handleHerbCompare(herbId) {
  const file = document.getElementById('herbCompareFile')?.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('herbComparePreview').innerHTML =
      `<img src="${e.target.result}" style="max-width:100%;max-height:200px;border-radius:8px;margin-bottom:8px">
       <div><button class="tcm-btn tcm-btn-primary" onclick="doHerbCompare('${herbId}')">🔍 开始对比分析</button></div>`;
    window._herbCompareData = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function doHerbCompare(herbId) {
  const h = TCM_HERB_DB.find(x => x.id === herbId);
  if (!h || !AI_CONFIG.apiKey) {
    document.getElementById('herbCompareResult').innerHTML =
      '<p style="color:#c62828">需要配置AI接口</p>';
    return;
  }
  const el = document.getElementById('herbCompareResult');
  el.innerHTML = '<p style="color:#6a1b9a;text-align:center">正在对比分析...</p>';

  const prompt = `请对比分析拍摄的药材是否为"${h.name}"。
标准特征：${h.appearance}
野生特征：${h.wildFeature}
种植特征：${h.plantedFeature}
鉴别要点：${h.identifyTips}

请分析：1)是否为${h.name} 2)是野生还是种植 3)品质等级评估 4)真伪判断依据 5)使用建议`;

  const reply = await tcmCallAI('herbCompare', prompt);
  el.innerHTML = `
    <div style="margin-top:12px;padding:12px;background:#fff;border-radius:8px;border:1px solid #ce93d8">
      <h5 style="color:#6a1b9a;margin:0 0 8px">🔬 对比分析结果</h5>
      <div style="font-size:13px;color:#333;line-height:1.8">${formatTcmAnswer(reply)}</div>
    </div>`;
}

// ========== AI问药功能 ==========
let herbAIHistory = [];

function askHerbAI() {
  const el = document.getElementById('herbListArea');
  el.innerHTML = `
    <div style="border:1px solid #90caf9;border-radius:10px;padding:16px;background:#e3f2fd">
      <h4 style="color:#1565c0;margin:0 0 8px">🤖 AI中草药百科问答</h4>
      <p style="font-size:12px;color:#666;margin:0 0 12px">
        可以询问任何中草药相关问题：功效、配伍、产地、鉴别、用法等。
      </p>
      <div class="tcm-chat" id="herbAIChat" style="max-height:300px;overflow-y:auto;margin-bottom:12px">
        <div class="tcm-chat-msg ai">您好！我是中草药百科助手，可以为您解答：<br>
        · 某味中草药的详细介绍（功效、产地、鉴别）<br>
        · 野生与种植药材的区别和辨别方法<br>
        · 道地药材的选购建议<br>
        · 中药配伍宜忌<br>
        · 中药材的真伪鉴别<br>
        请输入您的问题。</div>
      </div>
      <div class="tcm-chat-input">
        <input id="herbAIInput" placeholder="例：如何辨别野生黄芪和种植黄芪？" onkeydown="if(event.key==='Enter')sendHerbAI()">
        <button onclick="sendHerbAI()">提问</button>
      </div>
      <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:5px">
        <button class="tcm-btn" style="font-size:11px;padding:3px 8px;background:#fff" onclick="document.getElementById('herbAIInput').value='如何辨别野生和种植的中药材？';sendHerbAI()">野生vs种植辨别</button>
        <button class="tcm-btn" style="font-size:11px;padding:3px 8px;background:#fff" onclick="document.getElementById('herbAIInput').value='哪些中药材以野生品质为佳？';sendHerbAI()">野生优品推荐</button>
        <button class="tcm-btn" style="font-size:11px;padding:3px 8px;background:#fff" onclick="document.getElementById('herbAIInput').value='十大道地药材有哪些？如何选购？';sendHerbAI()">道地药材</button>
      </div>
    </div>
    <button class="tcm-btn" style="background:#eee;margin-top:10px" onclick="document.getElementById('herbListArea').innerHTML=renderHerbList()">← 返回列表</button>`;
}

async function sendHerbAI() {
  const input = document.getElementById('herbAIInput');
  const text = input?.value.trim();
  if (!text || tcmIsResponding) return;
  input.value = '';
  herbAIHistory.push({role:'user', content:text});
  refreshHerbAIChat();

  if (!AI_CONFIG.apiKey) {
    // 本地知识匹配
    const localAnswer = matchHerbLocalKnowledge(text);
    herbAIHistory.push({role:'ai', content:localAnswer});
    refreshHerbAIChat();
    return;
  }

  herbAIHistory.push({role:'ai', content:'正在查询中草药知识...'});
  refreshHerbAIChat();
  herbAIHistory.pop();

  const reply = await tcmCallAI('herbAI', text);
  herbAIHistory.push({role:'ai', content:reply});
  refreshHerbAIChat();
}

function refreshHerbAIChat() {
  const el = document.getElementById('herbAIChat');
  if (!el) return;
  el.innerHTML = herbAIHistory.map(m =>
    `<div class="tcm-chat-msg ${m.role==='user'?'user':'ai'}">${formatTcmAnswer(m.content)}</div>`
  ).join('');
  el.scrollTop = el.scrollHeight;
}

function matchHerbLocalKnowledge(query) {
  const q = query.toLowerCase();
  const matched = TCM_HERB_DB.filter(h =>
    (h.name+h.alias+h.effect+h.indication+h.origin).toLowerCase().includes(q.replace(/[的了吗？?]/g,'').slice(0,4))
  );
  if (matched.length > 0) {
    const h = matched[0];
    return `【${h.name}】${h.alias?'（'+h.alias+'）':''}\n性味归经：${h.prop}，归${h.meridian}经\n功效：${h.effect}\n主治：${h.indication}\n用量：${h.dosage}\n产地：${h.origin}\n道地产区：${h.bestOrigin}\n\n野生特征：${h.wildFeature}\n种植特征：${h.plantedFeature}\n鉴别要点：${h.identifyTips}\n\n（未配置AI接口，仅显示本地数据库信息。配置AI后可获得更详细回答）`;
  }
  return '未在本地数据库中找到匹配信息。建议配置AI接口（API设置）以获取更全面的中草药知识回答。';
}

// ========== 野生/种植辨别指南 ==========
function showHerbIdentifyGuide() {
  const el = document.getElementById('herbListArea');
  const herbsWithIdentify = TCM_HERB_DB.filter(h => h.wildFeature && h.wildFeature !== '无明显野生品，均为栽培');
  el.innerHTML = `
    <div style="border:1px solid #f48fb1;border-radius:10px;padding:16px;background:#fce4ec">
      <h4 style="color:#880e4f;margin:0 0 10px">🔍 中草药野生与种植辨别指南</h4>
      <p style="font-size:12px;color:#666;margin:0 0 14px;line-height:1.6">
        野生药材通常在自然环境中生长，经受风雨日照，有效成分积累更充分；种植品产量大但品质可能有差异。以下是常见药材的辨别要点：
      </p>

      <div style="background:#fff;border-radius:8px;padding:12px;margin-bottom:14px">
        <h5 style="margin:0 0 8px;color:#c2185b;font-size:13px">通用辨别原则</h5>
        <div style="font-size:12px;color:#333;line-height:1.8">
          <p style="margin:0 0 4px"><b>1. 看外形：</b>野生品形状不规则、个体差异大；种植品形状规整、大小均匀</p>
          <p style="margin:0 0 4px"><b>2. 看颜色：</b>野生品颜色偏深沉厚重；种植品颜色较浅鲜艳</p>
          <p style="margin:0 0 4px"><b>3. 闻气味：</b>野生品气味浓郁持久；种植品气味较淡</p>
          <p style="margin:0 0 4px"><b>4. 尝味道：</b>野生品味道浓烈；种植品味道温和</p>
          <p style="margin:0 0 4px"><b>5. 看质地：</b>野生品质坚实紧密；种植品质稍疏松</p>
          <p style="margin:0"><b>6. 看生长痕迹：</b>野生品有岁月感的粗糙痕迹；种植品表面较光洁</p>
        </div>
      </div>

      <h5 style="color:#880e4f;margin:0 0 8px;font-size:13px">各药材辨别详情</h5>
      ${herbsWithIdentify.map(h => `
        <div class="tcm-case-item" onclick="showHerbDetail('${h.id}')" style="border-left:3px solid #f48fb1">
          <div class="title" style="color:#880e4f">${h.name}</div>
          <div style="font-size:12px;color:#333;margin-top:4px;line-height:1.6">
            <span style="color:#2e7d32">🏔️野生：</span>${h.wildFeature.slice(0,40)}...<br>
            <span style="color:#1565c0">🌾种植：</span>${h.plantedFeature.slice(0,40)}...
          </div>
        </div>
      `).join('')}
    </div>
    <button class="tcm-btn" style="background:#eee;margin-top:10px" onclick="document.getElementById('herbListArea').innerHTML=renderHerbList()">← 返回列表</button>`;
}
