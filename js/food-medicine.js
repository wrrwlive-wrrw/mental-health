// 药食同源模块 - 主入口
const FOOD_MEDICINE_MODULES = {
  overview: {name:'药食同源',icon:'🍲',desc:'食疗养生理念与分类总览'},
  regional: {name:'各地美食',icon:'🗺️',desc:'各地药膳美食、吃法与搭配'},
  immunity: {name:'免疫力食谱',icon:'💪',desc:'提升免疫力的食物组合方案'},
  tea:      {name:'养生茶饮',icon:'🍵',desc:'养生茶介绍、配方与饮用指导'}
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
    case 'regional': return renderFmRegional();
    case 'immunity': return renderFmImmunity();
    case 'tea': return renderFmTea();
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
  const cats = ['全部','明目','补气','安神','清热','消食','驱寒','降脂','润喉','暖胃','理气'];
  return `<div>
    <p style="font-size:12px;color:#666;margin-bottom:12px">养生茶饮简便易行，适合学生日常饮用。根据体质和需求选择合适的茶饮，注意禁忌。</p>
    <div class="fm-filter" id="fmTeaFilter">
      ${cats.map(c=>`<button class="fm-filter-btn ${c==='全部'?'active':''}" onclick="fmFilterTea('${c}')">${c}</button>`).join('')}
    </div>
    <div id="fmTeaList">${renderFmTeaList('全部')}</div>
  </div>`;
}
function renderFmTeaList(cat) {
  const teas = cat==='全部'?FM_TEAS:FM_TEAS.filter(t=>t.category===cat);
  return teas.map(t=>`<div class="fm-tea-card">
    <h4>🍵 ${t.name} <span class="fm-tag fm-tag-green">${t.category}</span></h4>
    <p><b>配方：</b>${t.ingredients.map(i=>`${i.name} ${i.amount}`).join('、')}</p>
    <p><b>冲泡：</b>${t.brewing}</p>
    <p><b>功效：</b>${t.benefits.join('、')}</p>
    <p><b>最佳饮用时间：</b>${t.bestTime}</p>
    <p><b>口感：</b>${t.taste}</p>
    <p style="color:#c62828"><b>⚠️ 禁忌：</b>${t.contraindication}</p>
  </div>`).join('');
}
function fmFilterTea(cat){document.getElementById('fmTeaList').innerHTML=renderFmTeaList(cat);}
