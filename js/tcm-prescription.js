// 中医智能诊疗 - 处方管理
// 十八反
const TCM_SHIBA_FAN = [
  ['甘草','甘遂'],['甘草','大戟'],['甘草','海藻'],['甘草','芫花'],
  ['乌头','贝母'],['乌头','瓜蒌'],['乌头','半夏'],['乌头','白蔹'],['乌头','白及'],
  ['藜芦','人参'],['藜芦','丹参'],['藜芦','玄参'],['藜芦','沙参'],['藜芦','细辛'],['藜芦','芍药']
];
// 十九畏
const TCM_SHIJIU_WEI = [
  ['硫黄','朴硝'],['水银','砒霜'],['狼毒','密陀僧'],['巴豆','牵牛'],
  ['丁香','郁金'],['川乌','犀角'],['牙硝','三棱'],['官桂','赤石脂'],['人参','五灵脂']
];

function renderTcmPrescription() {
  return `<div>
    <div style="display:flex;gap:8px;margin-bottom:14px">
      <button class="tcm-btn tcm-btn-primary" onclick="showTcmRxPanel('ai')">🤖 AI开方</button>
      <button class="tcm-btn" style="background:#fff3e0;border:1px solid #ffb74d" onclick="showTcmRxPanel('formulas')">📖 经典方库</button>
      <button class="tcm-btn" style="background:#e3f2fd;border:1px solid #90caf9" onclick="showTcmRxPanel('history')">📋 历史处方</button>
      <button class="tcm-btn" style="background:#fce4ec;border:1px solid #f48fb1" onclick="showTcmRxPanel('check')">⚠️ 配伍检查</button>
    </div>
    <div id="tcmRxPanel">${renderTcmRxAI()}</div>
  </div>`;
}

function showTcmRxPanel(panel) {
  const el = document.getElementById('tcmRxPanel');
  if (!el) return;
  switch(panel) {
    case 'ai': el.innerHTML = renderTcmRxAI(); break;
    case 'formulas': el.innerHTML = renderTcmFormulas(); break;
    case 'history': el.innerHTML = renderTcmRxHistory(); break;
    case 'check': el.innerHTML = renderTcmCompatCheck(); break;
  }
}

// AI开方
function renderTcmRxAI() {
  return `<div>
    <div class="tcm-form-group">
      <label>输入证型或症状描述</label>
      <textarea id="tcmRxInput" placeholder="例：肝郁脾虚证，症见胁肋胀痛、食少便溏、情志抑郁"></textarea>
    </div>
    <button class="tcm-btn tcm-btn-primary" onclick="tcmAIPrescribe()">AI生成处方</button>
    <div class="tcm-chat" id="tcmRxAIResult" style="margin-top:12px;display:none"></div>
  </div>`;
}

async function tcmAIPrescribe() {
  const input = document.getElementById('tcmRxInput')?.value.trim();
  if (!input) { alert('请输入证型或症状'); return; }
  const el = document.getElementById('tcmRxAIResult');
  el.style.display = 'block';
  el.innerHTML = '<p style="color:#2e7d32;text-align:center">AI正在拟方...</p>';
  const result = await tcmCallAI('prescription', input);
  el.innerHTML = `<div class="tcm-chat-msg ai">${formatTcmAnswer(result)}</div>`;
}

// 经典方库
function renderTcmFormulas() {
  const categories = {
    jb:'解表',xm:'泻下',hj:'和解',qr:'清热',wl:'温里',
    by:'补益',lq:'理气',hx:'活血',qs:'祛湿',ht:'化痰'
  };
  return `<div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
      ${Object.entries(categories).map(([k,v])=>
        `<button class="tcm-btn" style="background:#f5f5f5;font-size:12px" onclick="showFormulaCategory('${k}')">${v}</button>`
      ).join('')}
    </div>
    <div id="tcmFormulaList">${getFormulaListHtml('jb')}</div>
  </div>`;
}

function showFormulaCategory(cat) {
  const el = document.getElementById('tcmFormulaList');
  if (el) el.innerHTML = getFormulaListHtml(cat);
}

function getFormulaListHtml(cat) {
  const formulas = TCM_CLASSIC_FORMULAS[cat] || [];
  if (!formulas.length) return '<p style="color:#999">暂无数据</p>';
  return formulas.map(f => `<div class="tcm-rx-card">
    <div class="tcm-rx-title">${f.name}</div>
    <p style="font-size:12px;color:#666;margin:4px 0">出处：${f.source} | 功效：${f.effect}</p>
    <div class="tcm-rx-herbs">${f.herbs.map(h=>`<span class="tcm-rx-herb">${h}</span>`).join('')}</div>
    <p style="font-size:12px;color:#888;margin-top:4px">主治：${f.indication}</p>
  </div>`).join('');
}

// 配伍检查
function renderTcmCompatCheck() {
  return `<div>
    <div class="tcm-form-group">
      <label>输入药物（逗号分隔）</label>
      <input id="tcmCheckHerbs" placeholder="例：甘草,海藻,半夏,人参">
    </div>
    <button class="tcm-btn tcm-btn-warn" onclick="doTcmCompatCheck()">检查配伍禁忌</button>
    <div id="tcmCheckResult" style="margin-top:12px"></div>
  </div>`;
}

function doTcmCompatCheck() {
  const input = document.getElementById('tcmCheckHerbs')?.value.trim();
  if (!input) return;
  const herbs = input.split(/[,，、\s]+/).filter(Boolean);
  const warnings = [];
  TCM_SHIBA_FAN.forEach(([a,b])=>{
    if (herbs.includes(a)&&herbs.includes(b)) warnings.push(`⚠️ 十八反：${a} 反 ${b}，不宜同用！`);
  });
  TCM_SHIJIU_WEI.forEach(([a,b])=>{
    if (herbs.includes(a)&&herbs.includes(b)) warnings.push(`⚠️ 十九畏：${a} 畏 ${b}，不宜同用！`);
  });
  const el = document.getElementById('tcmCheckResult');
  el.innerHTML = warnings.length ?
    `<div style="color:#c62828;line-height:2">${warnings.join('<br>')}</div>` :
    `<div style="color:#2e7d32">✅ 未发现配伍禁忌（十八反、十九畏），可放心使用。</div>`;
}

// 经典方库数据
const TCM_CLASSIC_FORMULAS = {
  jb: [
    {name:'桂枝汤',source:'《伤寒论》',effect:'解肌祛风，调和营卫',herbs:['桂枝9g','白芍9g','炙甘草6g','生姜9g','大枣4枚'],indication:'太阳中风，头痛发热，汗出恶风，脉浮缓'},
    {name:'麻黄汤',source:'《伤寒论》',effect:'发汗解表，宣肺平喘',herbs:['麻黄9g','桂枝6g','杏仁9g','炙甘草3g'],indication:'太阳伤寒，恶寒发热，无汗而喘，脉浮紧'},
    {name:'银翘散',source:'《温病条辨》',effect:'辛凉透表，清热解毒',herbs:['银花15g','连翘15g','薄荷6g','荆芥6g','豆豉9g','牛蒡子9g','桔梗6g','竹叶6g','芦根15g','甘草3g'],indication:'温病初起，发热无汗或有汗不畅，咽痛口渴'}
  ],
  xm: [
    {name:'大承气汤',source:'《伤寒论》',effect:'峻下热结',herbs:['大黄12g','厚朴15g','枳实12g','芒硝9g'],indication:'阳明腑实证，大便不通，腹满硬痛'},
    {name:'麻子仁丸',source:'《伤寒论》',effect:'润肠泄热，行气通便',herbs:['麻子仁15g','芍药9g','枳实9g','大黄9g','厚朴9g','杏仁9g'],indication:'肠燥津枯，大便干结'}
  ],
  hj: [
    {name:'小柴胡汤',source:'《伤寒论》',effect:'和解少阳',herbs:['柴胡24g','黄芩9g','人参9g','半夏9g','炙甘草6g','生姜9g','大枣4枚'],indication:'少阳证，往来寒热，胸胁苦满，默默不欲饮食'},
    {name:'逍遥散',source:'《太平惠民和剂局方》',effect:'疏肝解郁，健脾养血',herbs:['柴胡9g','当归9g','白芍12g','白术9g','茯苓12g','薄荷3g','煨姜6g','炙甘草6g'],indication:'肝郁脾虚，胁痛头痛，食少便溏'}
  ],
  qr: [
    {name:'白虎汤',source:'《伤寒论》',effect:'清热生津',herbs:['石膏30g','知母12g','炙甘草6g','粳米15g'],indication:'阳明气分热盛，大热大渴大汗脉洪大'},
    {name:'龙胆泻肝汤',source:'《医方集解》',effect:'泻肝胆实火，清下焦湿热',herbs:['龙胆草6g','黄芩9g','栀子9g','泽泻12g','木通6g','车前子9g','当归6g','柴胡6g','生地12g','甘草3g'],indication:'肝胆实火上炎或湿热下注'}
  ],
  wl: [
    {name:'理中汤',source:'《伤寒论》',effect:'温中祛寒，补气健脾',herbs:['人参9g','干姜9g','白术9g','炙甘草9g'],indication:'脾胃虚寒，腹痛便溏，畏寒肢冷'},
    {name:'四逆汤',source:'《伤寒论》',effect:'回阳救逆',herbs:['附子15g','干姜9g','炙甘草12g'],indication:'少阴病，四肢厥逆，恶寒蜷卧，脉微欲绝'}
  ],
  by: [
    {name:'四君子汤',source:'《太平惠民和剂局方》',effect:'益气健脾',herbs:['人参9g','白术9g','茯苓9g','炙甘草6g'],indication:'脾胃气虚，面色萎白，食少便溏'},
    {name:'六味地黄丸',source:'《小儿药证直诀》',effect:'滋阴补肾',herbs:['熟地24g','山萸肉12g','山药12g','泽泻9g','丹皮9g','茯苓9g'],indication:'肾阴虚，腰膝酸软，头晕耳鸣'},
    {name:'归脾汤',source:'《济生方》',effect:'益气补血，健脾养心',herbs:['黄芪15g','人参9g','白术9g','茯神9g','龙眼肉12g','酸枣仁12g','当归9g','远志6g','木香6g','炙甘草6g'],indication:'心脾两虚，失眠健忘，食少体倦'}
  ],
  lq: [
    {name:'柴胡疏肝散',source:'《景岳全书》',effect:'疏肝理气，活血止痛',herbs:['柴胡6g','陈皮6g','川芎6g','香附9g','枳壳6g','芍药9g','甘草3g'],indication:'肝气郁滞，胁肋疼痛'}
  ],
  hx: [
    {name:'血府逐瘀汤',source:'《医林改错》',effect:'活血化瘀，行气止痛',herbs:['桃仁12g','红花9g','当归9g','生地9g','川芎5g','赤芍6g','牛膝9g','桔梗5g','柴胡3g','枳壳6g','甘草3g'],indication:'胸中血瘀，头痛胸痛，失眠心悸'}
  ],
  qs: [
    {name:'五苓散',source:'《伤寒论》',effect:'利水渗湿，温阳化气',herbs:['猪苓9g','泽泻15g','白术9g','茯苓9g','桂枝6g'],indication:'膀胱气化不利，小便不利，水肿'},
    {name:'平胃散',source:'《太平惠民和剂局方》',effect:'燥湿运脾，行气和胃',herbs:['苍术12g','厚朴9g','陈皮9g','炙甘草3g'],indication:'湿滞脾胃，脘腹胀满，食少无味'}
  ],
  ht: [
    {name:'二陈汤',source:'《太平惠民和剂局方》',effect:'燥湿化痰，理气和中',herbs:['半夏15g','橘红15g','茯苓9g','炙甘草5g'],indication:'湿痰咳嗽，痰多色白，恶心呕吐'},
    {name:'温胆汤',source:'《三因极一病证方论》',effect:'理气化痰，和胃利胆',herbs:['半夏6g','竹茹6g','枳实6g','陈皮9g','甘草3g','茯苓5g'],indication:'胆郁痰扰，虚烦不眠，惊悸不安'}
  ]
};

// 历史处方
function renderTcmRxHistory() {
  const p = getTcmCurrentPatient();
  if (!p) return '<p style="color:#999">请先选择病人</p>';
  if (!p.records.length) return '<p style="color:#999">该病人暂无诊疗记录</p>';
  return p.records.map(r => `<div class="tcm-rx-card">
    <div class="tcm-rx-title">${r.date} - ${r.chiefComplaint||'未记录'}</div>
    <div style="font-size:12px;color:#666;line-height:1.8;max-height:150px;overflow-y:auto">
      ${formatTcmAnswer(r.prescription?.result||r.aiAnalysis||'无处方记录')}
    </div>
  </div>`).join('');
}