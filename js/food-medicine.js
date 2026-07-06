// 药食同源模块 - 主入口
const FOOD_MEDICINE_MODULES = {
  overview: {name:'药食同源',icon:'🍲',desc:'食疗养生理念与分类总览'},
  season:   {name:'四季养生',icon:'🌿',desc:'根据四季时令结合体质定制食疗方案'},
  regional: {name:'各地美食',icon:'🗺️',desc:'各地药膳美食、吃法与搭配'},
  immunity: {name:'免疫力食谱',icon:'💪',desc:'提升免疫力的食物组合方案'},
  tea:      {name:'养生茶饮',icon:'🍵',desc:'养生茶介绍、配方与饮用指导'},
  organ:    {name:'脏腑食疗',icon:'🫁',desc:'肺肝脾胃专属茶饮与药膳配方'},
  ai:       {name:'AI食疗师',icon:'🤖',desc:'AI智能诊断提供个性化食疗方案'},
  profile:  {name:'健康档案',icon:'🏥',desc:'健康档案管理与跨模块数据同步'}
};
let fmCurrentTab = 'overview';

function renderFoodMedicine() {
  document.getElementById('foodMedicineContent').innerHTML = renderFmPage();
}

function renderFmPage() {
  return `<div class="fm-intro">
    <h3>🍲 药食同源 · 食疗养生</h3>
    <p>药食同源是中华传统养生智慧的精华，合理膳食搭配即可强身健体、预防疾病。本模块涵盖各地药膳美食、免疫力食谱与养生茶饮。</p>
  </div>
  <div class="fm-tabs">
    ${Object.entries(FOOD_MEDICINE_MODULES).map(([k,v])=>
      `<button class="fm-tab ${fmCurrentTab===k?'active':''}" onclick="switchFmTab('${k}')">${v.icon} ${v.name}</button>`
    ).join('')}
  </div>
  <div class="fm-panel" id="fmPanel">${showFmTab(fmCurrentTab)}</div>`;
}

function switchFmTab(tab) {
  fmCurrentTab = tab;
  document.getElementById('fmPanel').innerHTML = showFmTab(tab);
  document.querySelectorAll('.fm-tab').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
}

function showFmTab(tab) {
  switch(tab) {
    case 'overview': return renderFmOverview();
    case 'season': return typeof renderFmSeason==='function'?renderFmSeason():'<p>四季模块加载中...</p>';
    case 'regional': return renderFmRegional();
    case 'immunity': return renderFmImmunity();
    case 'tea': return renderFmTea();
    case 'organ': return renderFmOrgan();
    case 'ai': return typeof renderFmAi==='function'?renderFmAi():'<p>AI模块加载中...</p>';
    case 'profile': return typeof renderFmProfile==='function'?renderFmProfile():'<p>档案模块加载中...</p>';
    default: return '';
  }
}

function renderFmOverview() {
  const d = FM_OVERVIEW;
  return `<div>
    <p style="font-size:13px;color:#555;line-height:1.8;margin-bottom:14px">${d.concept}</p>
    <div class="fm-section-title">四气五味与归经</div>
    ${d.principles.map(p=>`<div class="fm-card"><h4>${p.title}</h4><p>${p.desc}</p></div>`).join('')}
    <div class="fm-section-title">药食同源食材分类</div>
    ${d.categories.map(c=>`<div class="fm-card">
      <h4>${c.icon} ${c.name}</h4>
      <p style="color:#8b4513;margin-bottom:4px"><b>功效：</b>${c.effect}</p>
      <p><b>常用食材：</b>${c.foods.join('、')}</p>
    </div>`).join('')}
  </div>`;
}

let fmRegionFilter = '全部';
function renderFmRegional() {
  const regions = ['全部',...new Set(FM_REGIONAL_FOODS.map(f=>f.region))];
  const foods = fmRegionFilter==='全部'?FM_REGIONAL_FOODS:FM_REGIONAL_FOODS.filter(f=>f.region===fmRegionFilter);
  return `<div>
    <div class="fm-filter">
      ${regions.map(r=>`<button class="fm-filter-btn ${fmRegionFilter===r?'active':''}" onclick="fmFilterRegion('${r}')">${r}</button>`).join('')}
    </div>
    ${foods.map(f=>`<div class="fm-card">
      <h4>🍽️ ${f.name} <span class="fm-tag fm-tag-brown">${f.region}</span><span class="fm-tag fm-tag-green">${f.season}</span></h4>
      <p><b>食材：</b>${f.ingredients.join('、')}</p>
      <p><b>功效：</b>${f.benefits.join('、')}</p>
      <p><b>做法：</b>${f.preparation}</p>
      <p><b>搭配建议：</b>${f.pairing}</p>
    </div>`).join('')}
  </div>`;
}
function fmFilterRegion(r){fmRegionFilter=r;document.getElementById('fmPanel').innerHTML=renderFmRegional();}

function renderFmImmunity() {
  return `<div>
    <p style="font-size:12px;color:#666;margin-bottom:12px">科学搭配药食同源食材，持续调理可有效提升身体免疫力。以下食谱适合大学生日常养生。</p>
    ${FM_IMMUNITY_RECIPES.map(r=>`<div class="fm-recipe-card">
      <h4>💪 ${r.name} <span class="fm-tag fm-tag-orange">${r.target}</span></h4>
      <p><b>配方：</b>${r.ingredients.map(i=>`${i.name}${i.amount}（${i.role}）`).join('、')}</p>
      <p><b>功效：</b>${r.benefits.join('、')}</p>
      <p><b>做法：</b>${r.preparation}</p>
      <p><b>频率：</b>${r.frequency} | <b>适用：</b>${r.suitableFor.join('、')}</p>
      <p style="color:#c62828"><b>⚠️ 注意：</b>${r.contraindication}</p>
    </div>`).join('')}
  </div>`;
}

function renderFmTea() {
  const cats = ['全部','明目','补气','安神','清热','消食','驱寒','降脂','润喉','暖胃','理气','疏肝','防风','生津','祛湿','清心','润肺','养阴','暖宫','补肾'];
  const seasons = ['全部','春','夏','秋','冬'];
  return `<div>
    <p style="font-size:12px;color:#666;margin-bottom:12px">养生茶饮简便易行，适合学生日常饮用。可按功效或四季筛选，根据体质和时令选择合适茶饮。</p>
    <div style="margin-bottom:8px">
      <span style="font-size:12px;color:#8b4513;font-weight:bold">🌿 按季节：</span>
      <div class="fm-filter" id="fmTeaSeasonFilter" style="display:inline-flex;gap:4px;flex-wrap:wrap">
        ${seasons.map(s=>`<button class="fm-filter-btn ${s==='全部'?'active':''}" onclick="fmFilterTeaBySeason('${s}')">${s==='全部'?'全部':({'春':'🌸春','夏':'☀️夏','秋':'🍂秋','冬':'❄️冬'}[s])}</button>`).join('')}
      </div>
    </div>
    <div style="margin-bottom:10px">
      <span style="font-size:12px;color:#8b4513;font-weight:bold">💊 按功效：</span>
      <div class="fm-filter" id="fmTeaFilter" style="display:inline-flex;gap:4px;flex-wrap:wrap">
        ${cats.map(c=>`<button class="fm-filter-btn ${c==='全部'?'active':''}" onclick="fmFilterTea('${c}')">${c}</button>`).join('')}
      </div>
    </div>
    <div id="fmTeaList">${renderFmTeaList('全部','全部')}</div>
  </div>`;
}
function renderFmTeaList(cat, season) {
  // 合并基础茶饮和四季茶饮
  const allTeas = [...FM_TEAS.map(t=>({...t,season:'四季'})), ...(typeof FM_SEASON_TEAS!=='undefined'?FM_SEASON_TEAS:[])];
  let teas = allTeas;
  if (cat && cat!=='全部') teas = teas.filter(t=>t.category===cat);
  if (season && season!=='全部') teas = teas.filter(t=>t.season===season||t.season==='四季');
  if (!teas.length) return '<p style="color:#999;text-align:center;padding:20px">该分类暂无茶饮，请切换筛选条件</p>';
  return teas.map(t=>`<div class="fm-tea-card">
    <h4>🍵 ${t.name} <span class="fm-tag fm-tag-green">${t.category}</span>${t.season&&t.season!=='四季'?`<span class="fm-tag fm-tag-orange">${t.season}季</span>`:''}</h4>
    <p><b>配方：</b>${Array.isArray(t.ingredients)?t.ingredients.map(i=>`${i.name} ${i.amount}`).join('、'):t.ingredients}</p>
    <p><b>冲泡：</b>${t.brewing}</p>
    <p><b>功效：</b>${Array.isArray(t.benefits)?t.benefits.join('、'):t.benefits}</p>
    <p><b>最佳饮用时间：</b>${t.bestTime}</p>
    ${t.taste?`<p><b>口感：</b>${t.taste}</p>`:''}
    <p style="color:#c62828"><b>⚠️ 禁忌：</b>${t.contraindication}</p>
  </div>`).join('');
}
let fmTeaCurrentCat='全部',fmTeaCurrentSeason='全部';
function fmFilterTea(cat){fmTeaCurrentCat=cat;document.getElementById('fmTeaList').innerHTML=renderFmTeaList(cat,fmTeaCurrentSeason);document.querySelectorAll('#fmTeaFilter .fm-filter-btn').forEach(b=>b.classList.remove('active'));event.target.classList.add('active');}
function fmFilterTeaBySeason(s){fmTeaCurrentSeason=s;document.getElementById('fmTeaList').innerHTML=renderFmTeaList(fmTeaCurrentCat,s);document.querySelectorAll('#fmTeaSeasonFilter .fm-filter-btn').forEach(b=>b.classList.remove('active'));event.target.classList.add('active');}

// 脏腑食疗渲染
let fmOrganCurrent = 'lung';
function renderFmOrgan() {
  if(typeof FM_ORGAN_RECIPES==='undefined') return '<p style="color:#999">数据加载中...</p>';
  const organs = Object.entries(FM_ORGAN_RECIPES);
  const cur = FM_ORGAN_RECIPES[fmOrganCurrent];
  return `<div>
    <div class="fm-filter">
      ${organs.map(([k,v])=>`<button class="fm-filter-btn ${fmOrganCurrent===k?'active':''}" onclick="fmSwitchOrgan('${k}')">${v.icon} ${v.name}</button>`).join('')}
    </div>
    <div style="background:${cur.color};padding:12px;border-radius:8px;margin-bottom:12px">
      <p style="font-size:13px;color:#555;line-height:1.7;margin:0"><b>${cur.icon} ${cur.name}：</b>${cur.intro}</p>
    </div>
    <p class="fm-section-title">食疗配方（${cur.recipes.filter(r=>r.type==='食疗').length}个）</p>
    ${cur.recipes.filter(r=>r.type==='食疗').map(r=>`<div class="fm-card">
      <h4>🍽️ ${r.name} <span class="fm-tag fm-tag-green">${r.type}</span></h4>
      <p><b>食材：</b>${r.ingredients}</p>
      <p><b>做法：</b>${r.method}</p>
      <p><b>功效：</b>${r.benefits}</p>
      <p><b>适用：</b>${r.suitable}</p>
    </div>`).join('')}
    <p class="fm-section-title">养生茶饮（${cur.recipes.filter(r=>r.type==='茶饮').length}个）</p>
    ${cur.recipes.filter(r=>r.type==='茶饮').map(r=>`<div class="fm-tea-card">
      <h4>🍵 ${r.name} <span class="fm-tag fm-tag-green">${r.type}</span></h4>
      <p><b>配方：</b>${r.ingredients}</p>
      <p><b>泡法：</b>${r.method}</p>
      <p><b>功效：</b>${r.benefits}</p>
      <p><b>适用：</b>${r.suitable}</p>
    </div>`).join('')}
  </div>`;
}
function fmSwitchOrgan(k){fmOrganCurrent=k;document.getElementById('fmPanel').innerHTML=renderFmOrgan();}
