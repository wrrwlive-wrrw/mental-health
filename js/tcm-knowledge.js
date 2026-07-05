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
  const books = Object.keys(TCM_CLASSICS_DATA||{});
  if (!books.length) return '<p style="color:#999">典籍数据加载中...</p>';
  if (!window._tcmClassicBook) window._tcmClassicBook = books[0];
  if (window._tcmClassicChapter===undefined) window._tcmClassicChapter = 0;
  return `<div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
      ${books.map(k => {
        const b = TCM_CLASSICS_DATA[k];
        return `<button class="tcm-btn ${window._tcmClassicBook===k?'tcm-btn-primary':''}" style="${window._tcmClassicBook!==k?'background:#f5f5f5':''};font-size:11px;padding:4px 8px" onclick="switchTcmClassicBook('${k}')">${b.short}</button>`;
      }).join('')}
    </div>
    <div id="tcmClassicDetail">${renderTcmClassicDetail(window._tcmClassicBook)}</div>
  </div>`;
}

function switchTcmClassicBook(bookId) {
  window._tcmClassicBook = bookId;
  window._tcmClassicChapter = 0;
  document.getElementById('tcmClassicDetail').innerHTML = renderTcmClassicDetail(bookId);
}

function switchTcmClassicChapter(idx) {
  window._tcmClassicChapter = idx;
  document.getElementById('tcmClassicChapterBody').innerHTML = renderTcmClassicChapterContent(window._tcmClassicBook, idx);
}

function renderTcmClassicDetail(bookId) {
  const b = TCM_CLASSICS_DATA[bookId];
  if (!b) return '<p style="color:#999">暂无数据</p>';
  return `<div style="border:1px solid #a5d6a7;border-radius:10px;padding:14px;background:#f9fff9">
    <h4 style="color:#2e7d32;margin:0 0 6px">${b.name}</h4>
    <p style="font-size:12px;color:#888;margin:0 0 8px">${b.era} | ${b.author}</p>
    <p style="font-size:13px;color:#555;line-height:1.7;margin-bottom:12px">${b.intro}</p>
    <h5 style="color:#2e7d32;margin:10px 0 8px">章节目录（点击阅读原文+白话对照）</h5>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
      ${b.chapters.map((c,i) =>
        `<button class="tcm-btn ${window._tcmClassicChapter===i?'tcm-btn-primary':''}" style="${window._tcmClassicChapter!==i?'background:#e8f5e9':''};font-size:11px;padding:4px 10px" onclick="switchTcmClassicChapter(${i})">${c.title}</button>`
      ).join('')}
    </div>
    <div id="tcmClassicChapterBody">${renderTcmClassicChapterContent(bookId, window._tcmClassicChapter)}</div>
  </div>`;
}

function renderTcmClassicChapterContent(bookId, chapterIdx) {
  const b = TCM_CLASSICS_DATA[bookId];
  if (!b || !b.chapters[chapterIdx]) return '';
  const ch = b.chapters[chapterIdx];
  return `<div style="border:1px solid #c8e6c9;border-radius:8px;overflow:hidden">
    <div style="background:#e8f5e9;padding:10px 14px;border-bottom:1px solid #c8e6c9">
      <h5 style="margin:0;color:#2e7d32;font-size:14px">${ch.title}</h5>
      ${ch.subtitle?`<p style="margin:4px 0 0;font-size:12px;color:#888">${ch.subtitle}</p>`:''}
    </div>
    <div style="padding:14px">
      ${ch.sections.map(s => `
        <div style="margin-bottom:16px">
          ${s.heading?`<p style="font-weight:bold;color:#33691e;margin:0 0 8px;font-size:13px">${s.heading}</p>`:''}
          <div style="padding:10px 12px;background:#fffef8;border-left:3px solid #66bb6a;margin-bottom:8px;font-family:KaiTi,STKaiti,serif;font-size:14px;color:#333;line-height:2">
            ${s.original}
          </div>
          <div style="padding:10px 12px;background:#f1f8e9;border-left:3px solid #aed581;font-size:13px;color:#33691e;line-height:1.8">
            <b>【白话文】</b>${s.translation}
          </div>
        </div>
      `).join('')}
    </div>
  </div>`;
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