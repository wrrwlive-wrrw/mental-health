// 中医智能诊疗 - 药方识别与反向推病
let rxIdentifyHistory = [];

function renderTcmRxIdentify() {
  const records = getRxRecords();
  return `<div>
    <div style="padding:12px;background:#f3e5f5;border-radius:8px;margin-bottom:14px;border-left:3px solid #7b1fa2">
      <p style="font-size:13px;color:#4a148c;margin:0;line-height:1.7">
        <b>药方识别</b>：输入一副中药方剂，AI将分析药物组成，反向推断可治疗的疾病、证型及适应症。
      </p>
    </div>
    <div class="tcm-form-group">
      <label>输入方式</label>
      <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
        <button class="tcm-btn tcm-btn-primary" id="rxModeText" onclick="switchRxInputMode('text')">文字输入</button>
        <button class="tcm-btn" id="rxModePhoto" style="background:#f5f5f5" onclick="switchRxInputMode('photo')">拍照识别</button>
        <button class="tcm-btn" id="rxModeClassic" style="background:#f5f5f5" onclick="switchRxInputMode('classic')">经典方选择</button>
        <button class="tcm-btn" style="background:#e8f5e9;color:#2e7d32" onclick="showRxHistory()">📋 历史记录(${records.length})</button>
      </div>
    </div>
    <div id="rxInputArea">${renderRxTextInput()}</div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="tcm-btn tcm-btn-primary" onclick="doRxIdentify()">🔍 分析药方</button>
      <button class="tcm-btn" style="background:#eee" onclick="clearRxIdentify()">清空</button>
    </div>
    <div id="rxIdentifyResult" style="margin-top:14px"></div>
  </div>`;
}

function switchRxInputMode(mode) {
  document.getElementById('rxModeText').className = 'tcm-btn' + (mode==='text'?' tcm-btn-primary':'');
  document.getElementById('rxModePhoto').className = 'tcm-btn' + (mode==='photo'?' tcm-btn-primary':'');
  document.getElementById('rxModeClassic').className = 'tcm-btn' + (mode==='classic'?' tcm-btn-primary':'');
  document.getElementById('rxModeText').style.background = mode==='text'?'':'#f5f5f5';
  document.getElementById('rxModePhoto').style.background = mode==='photo'?'':'#f5f5f5';
  document.getElementById('rxModeClassic').style.background = mode==='classic'?'':'#f5f5f5';
  const el = document.getElementById('rxInputArea');
  if (mode==='text') el.innerHTML = renderRxTextInput();
  else if (mode==='photo') el.innerHTML = renderRxPhotoInput();
  else el.innerHTML = renderRxClassicInput();
}

function renderRxTextInput() {
  return `<div class="tcm-form-group">
    <label>输入药方（药名用逗号或空格分隔，可带剂量）</label>
    <textarea id="rxInputText" rows="4" placeholder="例：柴胡9g 黄芩9g 人参9g 半夏9g 炙甘草6g 生姜9g 大枣4枚&#10;&#10;或：桂枝,白芍,炙甘草,生姜,大枣"></textarea>
  </div>`;
}

function renderRxPhotoInput() {
  return `<div style="text-align:center;padding:20px">
    <p style="color:#666;font-size:13px;margin-bottom:12px">拍摄药方或处方笺，AI自动识别药物</p>
    <input type="file" id="rxPhotoFile" accept="image/*" capture="environment" onchange="handleRxPhoto()" style="display:none">
    <button class="tcm-btn tcm-btn-warn" onclick="document.getElementById('rxPhotoFile').click()">📷 拍照/选择图片</button>
    <div id="rxPhotoPreview" style="margin-top:12px"></div>
  </div>`;
}

function handleRxPhoto() {
  const file = document.getElementById('rxPhotoFile')?.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('rxPhotoPreview').innerHTML =
      `<img src="${e.target.result}" style="max-width:100%;max-height:200px;border-radius:8px;margin-bottom:8px">
       <p style="font-size:12px;color:#666">图片已加载，点击"分析药方"进行AI识别</p>`;
    window._rxPhotoData = e.target.result;
  };
  reader.readAsDataURL(file);
}

function renderRxClassicInput() {
  const formulas = [
    {name:'桂枝汤', herbs:'桂枝9g 白芍9g 炙甘草6g 生姜9g 大枣4枚'},
    {name:'麻黄汤', herbs:'麻黄9g 桂枝6g 杏仁9g 炙甘草3g'},
    {name:'小柴胡汤', herbs:'柴胡24g 黄芩9g 人参9g 半夏9g 炙甘草6g 生姜9g 大枣4枚'},
    {name:'逍遥散', herbs:'柴胡9g 当归9g 白芍12g 白术9g 茯苓12g 薄荷3g 煨姜6g 炙甘草6g'},
    {name:'六味地黄丸', herbs:'熟地24g 山萸肉12g 山药12g 泽泻9g 丹皮9g 茯苓9g'},
    {name:'归脾汤', herbs:'黄芪15g 人参9g 白术9g 茯神9g 龙眼肉12g 酸枣仁12g 当归9g 远志6g 木香6g 炙甘草6g'},
    {name:'四逆汤', herbs:'附子15g 干姜9g 炙甘草12g'},
    {name:'血府逐瘀汤', herbs:'桃仁12g 红花9g 当归9g 生地9g 川芎5g 赤芍6g 牛膝9g 桔梗5g 柴胡3g 枳壳6g 甘草3g'},
    {name:'补中益气汤', herbs:'黄芪18g 人参6g 白术9g 炙甘草6g 当归6g 陈皮6g 升麻3g 柴胡3g'},
    {name:'银翘散', herbs:'银花15g 连翘15g 薄荷6g 荆芥6g 豆豉9g 牛蒡子9g 桔梗6g 竹叶6g 芦根15g 甘草3g'}
  ];
  return `<div class="tcm-form-group">
    <label>选择经典方剂进行分析</label>
    <select id="rxClassicSelect" onchange="fillRxClassic()" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px">
      <option value="">-- 选择方剂 --</option>
      ${formulas.map(f=>`<option value="${f.herbs}">${f.name}（${f.herbs.split(' ').length}味药）</option>`).join('')}
    </select>
  </div>
  <div class="tcm-form-group">
    <label>方剂组成</label>
    <textarea id="rxInputText" rows="3" placeholder="选择后自动填入，也可手动修改"></textarea>
  </div>`;
}

function fillRxClassic() {
  const v = document.getElementById('rxClassicSelect')?.value || '';
  const el = document.getElementById('rxInputText');
  if (el) el.value = v;
}

// 核心分析函数
async function doRxIdentify() {
  const textEl = document.getElementById('rxInputText');
  const input = textEl?.value.trim() || '';
  if (!input && !window._rxPhotoData) { alert('请输入药方或上传图片'); return; }
  const el = document.getElementById('rxIdentifyResult');
  el.innerHTML = '<p style="color:#7b1fa2;text-align:center">正在分析药方...</p>';

  // 如果是图片模式且有AI
  if (!input && window._rxPhotoData) {
    if (!AI_CONFIG.apiKey) {
      el.innerHTML = '<p style="color:#c62828">图片识别需要配置AI，请先到"API设置"配置Key</p>';
      return;
    }
    const reply = await tcmCallAI('rxphoto', '请识别图片中的中药处方，列出所有药物名称和剂量');
    if (textEl) textEl.value = reply;
    el.innerHTML = '<p style="color:#2e7d32">已识别药物，请确认后点击"分析药方"</p>';
    window._rxPhotoData = null;
    return;
  }

  // 解析药物列表
  const herbs = parseHerbList(input);
  if (herbs.length === 0) { el.innerHTML = '<p style="color:#c62828">未能识别出药物，请检查输入</p>'; return; }

  // 本地匹配
  const localResult = matchLocalFormulas(herbs);

  // AI深度分析
  let aiResult = '';
  if (AI_CONFIG.apiKey) {
    aiResult = await tcmCallAI('rxIdentify', input);
  }

  // 渲染结果
  el.innerHTML = renderRxResult(herbs, localResult, aiResult);

  // 保存分析记录
  saveRxRecord(input, herbs, localResult, aiResult);
}

// 解析药物名称
function parseHerbList(text) {
  return text.replace(/\d+[gG克]?/g, ' ')
    .replace(/[,，、；;：:\n]/g, ' ')
    .split(/\s+/)
    .map(s => s.replace(/[（）()枚片付剂]/g, '').trim())
    .filter(s => s.length >= 1 && s.length <= 6);
}

// 本地经典方匹配
function matchLocalFormulas(herbs) {
  const herbSet = new Set(herbs.map(h => h.replace(/[白赤生炙煨制]?/, '')));
  const fullSet = new Set(herbs);
  const results = [];

  RX_IDENTIFY_DB.forEach(item => {
    let matchCount = 0;
    item.herbs.forEach(h => {
      if (fullSet.has(h) || herbSet.has(h) || herbs.some(uh => uh.includes(h) || h.includes(uh))) {
        matchCount++;
      }
    });
    const ratio = matchCount / item.herbs.length;
    if (ratio >= 0.6) {
      results.push({ ...item, matchRatio: ratio, matchCount });
    }
  });

  results.sort((a, b) => b.matchRatio - a.matchRatio);
  return results.slice(0, 5);
}

// 渲染分析结果
function renderRxResult(herbs, localResult, aiResult) {
  let html = `<div style="padding:10px;background:#f3e5f5;border-radius:8px;margin-bottom:12px">
    <p style="margin:0;font-size:13px"><b>识别到 ${herbs.length} 味药物：</b></p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${herbs.map(h=>`<span style="padding:3px 10px;background:#fff;border:1px solid #ce93d8;border-radius:12px;font-size:12px">${h}</span>`).join('')}
    </div>
  </div>`;

  if (localResult.length > 0) {
    html += `<h4 style="color:#7b1fa2;margin:12px 0 8px">📋 匹配经典方剂</h4>`;
    localResult.forEach(item => {
      const pct = Math.round(item.matchRatio * 100);
      html += `<div class="tcm-rx-card" style="border-color:#ce93d8">
        <div class="tcm-rx-title" style="color:#7b1fa2">${item.name}
          <span style="font-size:12px;color:#888;font-weight:normal">匹配度 ${pct}%</span>
        </div>
        <p style="font-size:12px;color:#666;margin:4px 0"><b>出处：</b>${item.source}</p>
        <p style="font-size:12px;color:#333;margin:4px 0"><b>功效：</b>${item.effect}</p>
        <p style="font-size:13px;color:#c62828;margin:6px 0"><b>主治疾病：</b>${item.diseases}</p>
        <p style="font-size:12px;color:#555;margin:4px 0"><b>适用证型：</b>${item.syndrome}</p>
        <p style="font-size:12px;color:#888;margin:4px 0"><b>临床应用：</b>${item.clinical}</p>
      </div>`;
    });
  } else {
    html += `<div style="padding:12px;background:#fff3e0;border-radius:8px;margin-bottom:12px">
      <p style="color:#e65100;font-size:13px;margin:0">未匹配到经典方剂，可能是加减方或自拟方。${AI_CONFIG.apiKey?'请参考下方AI分析结果。':'建议配置AI获取深度分析。'}</p>
    </div>`;
  }

  if (aiResult) {
    html += `<h4 style="color:#2e7d32;margin:12px 0 8px">🤖 AI深度分析</h4>
      <div class="tcm-chat"><div class="tcm-chat-msg ai">${formatTcmAnswer(aiResult)}</div></div>`;
  }

  html += `<p style="font-size:11px;color:#999;margin-top:10px;text-align:center">
    ※ 以上分析仅供学习参考，不替代专业医疗诊断</p>`;
  return html;
}

function clearRxIdentify() {
  const textEl = document.getElementById('rxInputText');
  if (textEl) textEl.value = '';
  document.getElementById('rxIdentifyResult').innerHTML = '';
  window._rxPhotoData = null;
}

// 保存与历史记录
function getRxRecords() {
  return JSON.parse(localStorage.getItem('tcm_rx_records') || '[]');
}

function saveRxRecord(input, herbs, localResult, aiResult) {
  const records = getRxRecords();
  records.unshift({
    id: 'rx_' + Date.now().toString(36),
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    input: input,
    herbs: herbs,
    matchedFormulas: localResult.map(r => ({ name: r.name, diseases: r.diseases, matchRatio: r.matchRatio })),
    aiResult: aiResult || ''
  });
  // 最多保存50条
  if (records.length > 50) records.length = 50;
  localStorage.setItem('tcm_rx_records', JSON.stringify(records));
}

function showRxHistory() {
  const records = getRxRecords();
  const el = document.getElementById('rxIdentifyResult');
  if (!records.length) {
    el.innerHTML = '<p style="color:#999;text-align:center">暂无历史记录</p>';
    return;
  }
  el.innerHTML = `<h4 style="color:#7b1fa2;margin:0 0 10px">📋 分析历史记录</h4>
    ${records.map(r => `<div class="tcm-case-item" onclick="showRxRecordDetail('${r.id}')">
      <div class="title">${r.herbs.slice(0,5).join('、')}${r.herbs.length>5?'等'+r.herbs.length+'味':''}</div>
      <div class="meta">${r.date} | ${r.matchedFormulas.length?'匹配：'+r.matchedFormulas.map(f=>f.name).join('、'):'无匹配方剂'}${r.aiResult?' | 含AI分析':''}</div>
    </div>`).join('')}
    <button class="tcm-btn tcm-btn-danger" style="margin-top:10px;font-size:12px" onclick="clearRxHistory()">清空所有记录</button>`;
}

function showRxRecordDetail(id) {
  const records = getRxRecords();
  const r = records.find(x => x.id === id);
  if (!r) return;
  const el = document.getElementById('rxIdentifyResult');
  let html = `<div style="margin-bottom:10px">
    <button class="tcm-btn" style="background:#eee;font-size:12px" onclick="showRxHistory()">← 返回列表</button>
    <span style="font-size:12px;color:#888;margin-left:8px">${r.date}</span>
  </div>
  <div style="padding:10px;background:#f3e5f5;border-radius:8px;margin-bottom:12px">
    <p style="margin:0;font-size:13px"><b>药方（${r.herbs.length}味）：</b></p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${r.herbs.map(h=>`<span style="padding:3px 10px;background:#fff;border:1px solid #ce93d8;border-radius:12px;font-size:12px">${h}</span>`).join('')}
    </div>
    <p style="font-size:12px;color:#666;margin-top:6px">原始输入：${r.input}</p>
  </div>`;

  if (r.matchedFormulas.length) {
    html += `<h4 style="color:#7b1fa2;margin:10px 0 6px">匹配方剂</h4>`;
    r.matchedFormulas.forEach(f => {
      html += `<div class="tcm-rx-card" style="border-color:#ce93d8">
        <div class="tcm-rx-title" style="color:#7b1fa2">${f.name} <span style="font-size:12px;color:#888;font-weight:normal">${Math.round(f.matchRatio*100)}%</span></div>
        <p style="font-size:13px;color:#c62828;margin:4px 0"><b>主治：</b>${f.diseases}</p>
      </div>`;
    });
  }

  if (r.aiResult) {
    html += `<h4 style="color:#2e7d32;margin:10px 0 6px">AI分析</h4>
      <div class="tcm-chat"><div class="tcm-chat-msg ai">${formatTcmAnswer(r.aiResult)}</div></div>`;
  }
  el.innerHTML = html;
}

function clearRxHistory() {
  if (!confirm('确定清空所有药方分析记录？')) return;
  localStorage.removeItem('tcm_rx_records');
  showRxHistory();
}

// 药方识别本地知识库
const RX_IDENTIFY_DB = [
  {
    name:'桂枝汤', source:'《伤寒论》', herbs:['桂枝','白芍','甘草','生姜','大枣'],
    effect:'解肌祛风，调和营卫',
    diseases:'感冒、流感（风寒表虚）、自汗症、妊娠恶阻、产后发热、荨麻疹、过敏性鼻炎',
    syndrome:'太阳中风证：发热、汗出、恶风、脉浮缓',
    clinical:'现代用于植物神经功能紊乱、体质虚弱反复感冒、多汗症、低热不退'
  },
  {
    name:'麻黄汤', source:'《伤寒论》', herbs:['麻黄','桂枝','杏仁','甘草'],
    effect:'发汗解表，宣肺平喘',
    diseases:'感冒（风寒表实）、支气管炎、支气管哮喘、急性肾炎初期水肿',
    syndrome:'太阳伤寒证：恶寒重、发热、无汗、身痛、脉浮紧',
    clinical:'现代用于流行性感冒、急性支气管炎早期、水肿初起兼表证'
  },
  {
    name:'小柴胡汤', source:'《伤寒论》', herbs:['柴胡','黄芩','人参','半夏','甘草','生姜','大枣'],
    effect:'和解少阳',
    diseases:'感冒后期、疟疾、慢性肝炎、胆囊炎、胸膜炎、淋巴结炎、产后发热、经期感冒',
    syndrome:'少阳证：往来寒热、胸胁苦满、默默不欲饮食、心烦喜呕、口苦、咽干、目眩',
    clinical:'现代广泛用于肝胆疾病、消化系统疾病、呼吸道感染中后期、免疫调节'
  },
  {
    name:'逍遥散', source:'《太平惠民和剂局方》', herbs:['柴胡','当归','白芍','白术','茯苓','薄荷','生姜','甘草'],
    effect:'疏肝解郁，健脾养血',
    diseases:'慢性肝炎、月经不调、乳腺增生、更年期综合征、抑郁症、焦虑症、胃神经官能症',
    syndrome:'肝郁脾虚证：胁痛、头痛、食少、月经不调、乳房胀痛、情绪抑郁',
    clinical:'现代用于抑郁症、经前紧张综合征、乳腺增生、功能性消化不良、慢性胃炎'
  },
  {
    name:'六味地黄丸', source:'《小儿药证直诀》', herbs:['熟地','山萸肉','山药','泽泻','丹皮','茯苓'],
    effect:'滋阴补肾',
    diseases:'糖尿病、高血压、更年期综合征、慢性肾病、腰椎退行性病变、耳鸣耳聋、视力减退',
    syndrome:'肾阴虚证：腰膝酸软、头晕耳鸣、五心烦热、盗汗、遗精、口干、舌红少苔',
    clinical:'现代用于2型糖尿病辅助治疗、肾病综合征、甲亢、神经衰弱、老年性疾病'
  },
  {
    name:'归脾汤', source:'《济生方》', herbs:['黄芪','人参','白术','茯神','龙眼肉','酸枣仁','当归','远志','木香','甘草'],
    effect:'益气补血，健脾养心',
    diseases:'贫血、心悸、失眠、神经衰弱、功能性子宫出血、血小板减少性紫癜',
    syndrome:'心脾两虚证：心悸怔忡、失眠多梦、健忘、体倦食少、面色萎黄、舌淡脉细弱',
    clinical:'现代用于缺铁性贫血、焦虑失眠、功能性心律不齐、月经过多'
  },
  {
    name:'四逆汤', source:'《伤寒论》', herbs:['附子','干姜','甘草'],
    effect:'回阳救逆',
    diseases:'心力衰竭、休克、急性心肌梗死（阳虚型）、慢性腹泻（脾肾阳虚）、甲减',
    syndrome:'少阴病阳衰证：四肢厥冷、恶寒蜷卧、面色苍白、脉微欲绝',
    clinical:'现代用于心源性休克辅助治疗、慢性心力衰竭、严重阳虚证'
  },
  {
    name:'血府逐瘀汤', source:'《医林改错》', herbs:['桃仁','红花','当归','生地','川芎','赤芍','牛膝','桔梗','柴胡','枳壳','甘草'],
    effect:'活血化瘀，行气止痛',
    diseases:'冠心病、心绞痛、脑梗塞后遗症、头痛（瘀血型）、失眠、肋间神经痛、创伤后遗症',
    syndrome:'胸中血瘀证：胸痛如刺、头痛日久、心悸失眠、急躁易怒、舌暗有瘀点',
    clinical:'现代用于冠心病心绞痛、脑血管病后遗症、顽固性头痛、创伤性疼痛'
  },
  {
    name:'补中益气汤', source:'《脾胃论》', herbs:['黄芪','人参','白术','甘草','当归','陈皮','升麻','柴胡'],
    effect:'补中益气，升阳举陷',
    diseases:'胃下垂、子宫脱垂、脱肛、慢性腹泻、重症肌无力、低血压、习惯性流产',
    syndrome:'脾虚气陷证：食少体倦、少气懒言、面色萎黄、大便稀溏、脏器下垂',
    clinical:'现代用于内脏下垂、慢性疲劳综合征、反复感冒、术后体虚恢复'
  },
  {
    name:'银翘散', source:'《温病条辨》', herbs:['银花','连翘','薄荷','荆芥','豆豉','牛蒡子','桔梗','竹叶','芦根','甘草'],
    effect:'辛凉透表，清热解毒',
    diseases:'流行性感冒、急性扁桃体炎、咽喉炎、流行性腮腺炎、麻疹初期、风疹',
    syndrome:'风热犯卫证：发热、微恶寒、咽痛、口渴、舌尖红、脉浮数',
    clinical:'现代用于上呼吸道感染（风热型）、急性咽炎、早期传染病'
  },
  {
    name:'龙胆泻肝汤', source:'《医方集解》', herbs:['龙胆草','黄芩','栀子','泽泻','木通','车前子','当归','柴胡','生地','甘草'],
    effect:'泻肝胆实火，清下焦湿热',
    diseases:'急性结膜炎、中耳炎、带状疱疹、泌尿系感染、急性盆腔炎、高血压（肝火旺型）',
    syndrome:'肝胆湿热证：头痛目赤、胁痛口苦、耳聋耳肿、阴痒带下、小便淋浊',
    clinical:'现代用于泌尿系感染、生殖器疱疹、急性黄疸性肝炎、顽固性偏头痛'
  },
  {
    name:'理中汤', source:'《伤寒论》', herbs:['人参','干姜','白术','甘草'],
    effect:'温中祛寒，补气健脾',
    diseases:'慢性胃炎（虚寒型）、胃溃疡、慢性腹泻、功能性消化不良、小儿消化不良',
    syndrome:'脾胃虚寒证：脘腹冷痛喜温按、呕吐清水、大便稀溏、畏寒肢冷',
    clinical:'现代用于慢性萎缩性胃炎、肠易激综合征（腹泻型）、慢性结肠炎'
  },
  {
    name:'四物汤', source:'《太平惠民和剂局方》', herbs:['熟地','当归','白芍','川芎'],
    effect:'补血调经',
    diseases:'月经不调、痛经、贫血、产后虚弱、不孕症、更年期综合征',
    syndrome:'血虚证：面色苍白、头晕目眩、心悸失眠、月经量少色淡、舌淡脉细',
    clinical:'现代用于缺铁性贫血、月经失调、产后恢复、皮肤干燥无华'
  },
  {
    name:'温胆汤', source:'《三因极一病证方论》', herbs:['半夏','竹茹','枳实','陈皮','甘草','茯苓'],
    effect:'理气化痰，和胃利胆',
    diseases:'失眠、焦虑症、眩晕、癫痫、胆囊炎、美尼尔综合征、神经官能症',
    syndrome:'胆郁痰扰证：虚烦不眠、惊悸不宁、口苦呕涎、头晕目眩、苔白腻',
    clinical:'现代用于焦虑失眠、植物神经紊乱、梅尼埃病、痰湿体质调理'
  },
  {
    name:'五苓散', source:'《伤寒论》', herbs:['猪苓','泽泻','白术','茯苓','桂枝'],
    effect:'利水渗湿，温阳化气',
    diseases:'急性肾炎水肿、泌尿系感染、肝硬化腹水、脑积水、美尼尔综合征',
    syndrome:'膀胱气化不利：小便不利、头痛微热、烦渴欲饮水入即吐、水肿',
    clinical:'现代用于急慢性肾炎、特发性水肿、婴幼儿腹泻脱水、脑水肿辅助'
  }
];
