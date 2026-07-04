// 中医智能诊疗 - 中医典籍知识
function renderTcmKnowledge() {
  return `<div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">
      <button class="tcm-btn tcm-btn-primary" onclick="showTcmKnowPanel('classics')">📜 经典要义</button>
      <button class="tcm-btn" style="background:#f5f5f5" onclick="showTcmKnowPanel('theory')">☯️ 基础理论</button>
      <button class="tcm-btn" style="background:#f5f5f5" onclick="showTcmKnowPanel('meridian')">🔵 经络腧穴</button>
      <button class="tcm-btn" style="background:#f5f5f5" onclick="showTcmKnowPanel('herbs')">🌿 常用中药</button>
    </div>
    <div id="tcmKnowPanel">${renderTcmClassics()}</div>
  </div>`;
}
function showTcmKnowPanel(p) {
  const el = document.getElementById('tcmKnowPanel');
  if (!el) return;
  const r = {classics:renderTcmClassics,theory:renderTcmTheory,meridian:renderTcmMeridian,herbs:renderTcmHerbs};
  el.innerHTML = (r[p]||renderTcmClassics)();
}

function renderTcmClassics() {
  const classics = [
    {name:'《黄帝内经》',era:'战国~西汉',content:'中医学奠基之作。分《素问》《灵枢》各81篇。确立阴阳五行、脏腑经络、病因病机、诊法治则等基本理论。"正气存内，邪不可干"、"治未病"思想影响深远。'},
    {name:'《难经》',era:'东汉',content:'以问答形式阐述81个医学疑难。补充发展了脉学（独取寸口）、经络（奇经八脉）、脏腑（命门学说）等理论。'},
    {name:'《神农本草经》',era:'东汉',content:'现存最早本草学专著。载药365种，按上中下三品分类。确立四气五味、升降浮沉等药性理论，奠定中药学基础。'},
    {name:'《伤寒杂病论》',era:'东汉·张仲景',content:'创立六经辨证体系，确立"辨证论治"原则。分《伤寒论》和《金匮要略》。载方314首，被尊为"方书之祖"，方剂至今沿用。'},
    {name:'《温病条辨》',era:'清·吴鞠通',content:'温病学代表作。创卫气营血辨证和三焦辨证体系。上焦如羽非轻不举，中焦如衡非平不安，下焦如权非重不沉。名方：银翘散、桑菊饮、安宫牛黄丸。'},
    {name:'《医学心悟》',era:'清·程钟龄',content:'提出"医门八法"：汗、吐、下、和、温、清、消、补。论述简明扼要，便于初学。名言："论治之法，则当知邪正之分。"'},
    {name:'《思考中医》',era:'现代·刘力红',content:'以现代视角诠释《伤寒论》，强调中医思维方式的重要性。提出"道"与"术"的关系，帮助理解中医理论的哲学根基。'},
    {name:'《名老中医之路》',era:'现代',content:'收录数十位国医大师的成长历程和临床心得。展现各家学术思想和辨证用药特色，是学习名家经验的宝贵资料。'}
  ];
  return classics.map(c=>`<div class="tcm-case-item">
    <div class="title">${c.name} <span style="font-weight:normal;color:#888;font-size:12px">${c.era}</span></div>
    <div style="font-size:13px;color:#555;line-height:1.7;margin-top:6px">${c.content}</div>
  </div>`).join('');
}

function renderTcmTheory() {
  return `<div style="font-size:13px;line-height:1.8;color:#333">
    <h4 style="color:#2e7d32">☯️ 阴阳学说</h4>
    <p>阴阳是宇宙万物对立统一的概括。人体阴阳平衡为健康，失调则生病。"阴平阳秘，精神乃治"。</p>
    <h4 style="color:#2e7d32">🔥 五行学说</h4>
    <p>木火土金水相生相克。肝属木、心属火、脾属土、肺属金、肾属水。用于解释脏腑关系和指导治疗。</p>
    <h4 style="color:#2e7d32">🫁 脏腑理论</h4>
    <p>五脏（肝心脾肺肾）藏精气而不泻；六腑（胆胃大小肠膀胱三焦）传化物而不藏。脏腑互为表里。</p>
    <h4 style="color:#2e7d32">🩺 八纲辨证</h4>
    <p>阴阳为总纲，表里辨病位，寒热辨病性，虚实辨邪正。八纲是辨证的基本纲领。</p>
    <h4 style="color:#2e7d32">💊 治疗八法</h4>
    <p>汗法（发汗解表）、吐法（涌吐）、下法（泻下）、和法（和解）、温法（温里）、清法（清热）、消法（消导）、补法（补益）。《医学心悟》程钟龄总结。</p>
  </div>`;
}

function renderTcmMeridian() {
  const meridians = [
    '手太阴肺经（11穴）：中府→云门→少商 | 主治肺系病证',
    '手阳明大肠经（20穴）：商阳→合谷→迎香 | 主治头面、咽喉病',
    '足阳明胃经（45穴）：承泣→足三里→厉兑 | 主治脾胃病',
    '足太阴脾经（21穴）：隐白→三阴交→大包 | 主治脾胃、妇科病',
    '手少阴心经（9穴）：极泉→神门 | 主治心、神志病',
    '手太阳小肠经（19穴）：少泽→听宫 | 主治头面、耳目病',
    '足太阳膀胱经（67穴）：睛明→背俞穴→至阴 | 主治脏腑病',
    '足少阴肾经（27穴）：涌泉→太溪→俞府 | 主治肾系病',
    '手厥阴心包经（9穴）：天池→内关→中冲 | 主治心胸病',
    '手少阳三焦经（23穴）：关冲→外关→丝竹空 | 主治头侧部病',
    '足少阳胆经（44穴）：瞳子髎→风池→足窍阴 | 主治肝胆病',
    '足厥阴肝经（14穴）：大敦→太冲→期门 | 主治肝病、妇科病'
  ];
  return `<div style="font-size:13px;line-height:2">
    <h4 style="color:#2e7d32">十二正经</h4>
    ${meridians.map(m=>`<p style="border-bottom:1px dashed #eee;padding:4px 0">${m}</p>`).join('')}
  </div>`;
}

function renderTcmHerbs() {
  const herbs = [
    {name:'麻黄',prop:'辛苦温',meridian:'肺膀胱',effect:'发汗解表，宣肺平喘，利水消肿'},
    {name:'桂枝',prop:'辛甘温',meridian:'心肺膀胱',effect:'发汗解肌，温通经脉，助阳化气'},
    {name:'柴胡',prop:'苦辛微寒',meridian:'肝胆',effect:'疏散退热，疏肝解郁，升举阳气'},
    {name:'黄芪',prop:'甘微温',meridian:'肺脾',effect:'补气固表，利尿托毒，生肌'},
    {name:'当归',prop:'甘辛温',meridian:'肝心脾',effect:'补血活血，调经止痛，润肠通便'},
    {name:'白芍',prop:'苦酸微寒',meridian:'肝脾',effect:'养血柔肝，缓急止痛，敛阴止汗'},
    {name:'茯苓',prop:'甘淡平',meridian:'心肺脾肾',effect:'利水渗湿，健脾宁心'},
    {name:'半夏',prop:'辛温有毒',meridian:'脾胃肺',effect:'燥湿化痰，降逆止呕，消痞散结'},
    {name:'黄连',prop:'苦寒',meridian:'心脾胃肝胆大肠',effect:'清热燥湿，泻火解毒'},
    {name:'附子',prop:'辛甘大热有毒',meridian:'心肾脾',effect:'回阳救逆，补火助阳，散寒止痛'}
  ];
  return `<div style="font-size:13px">
    <h4 style="color:#2e7d32">常用中药速查</h4>
    ${herbs.map(h=>`<div style="padding:8px;border-bottom:1px solid #f0f0f0">
      <b style="color:#e65100">${h.name}</b> <span style="color:#888">[${h.prop}]</span> 归${h.meridian}经<br>
      <span style="color:#555">功效：${h.effect}</span>
    </div>`).join('')}
  </div>`;
}