// 药食同源 - 四季养生渲染逻辑
let fmSeasonCurrent = getCurrentSeason();

function renderFmSeason() {
  const seasons = Object.entries(FM_SEASONAL_DATA);
  const cur = FM_SEASONAL_DATA[fmSeasonCurrent];
  const profile = typeof getFmCurrentProfile==='function'?getFmCurrentProfile():null;
  const constitution = profile?profile.constitution:'';
  const matchTip = constitution && FM_CONSTITUTION_SEASON[constitution]
    ? FM_CONSTITUTION_SEASON[constitution][fmSeasonCurrent] : '';

  return `<div>
    <div class="fm-filter">
      ${seasons.map(([k,v])=>`<button class="fm-filter-btn ${fmSeasonCurrent===k?'active':''}" onclick="fmSwitchSeason('${k}')">${v.icon} ${v.name}</button>`).join('')}
    </div>
    ${constitution?`<div style="background:#f0f4c3;padding:10px 14px;border-radius:8px;margin:10px 0;font-size:12px">
      <b>🎯 您的体质：${constitution}</b>｜本季推荐：<span style="color:#e65100">${matchTip||'均衡饮食'}</span>
      ${profile.allergies&&profile.allergies.length?`<br>⚠️ 过敏食物：<span style="color:#c62828">${profile.allergies.join('、')}</span>，以下方案请注意避开`:''}
    </div>`:'<div style="background:#fff3e0;padding:8px 12px;border-radius:8px;margin:10px 0;font-size:12px;color:#e65100">💡 在"健康档案"中填写体质信息，可获得个性化四季食疗建议</div>'}
    <div style="background:${cur.color};padding:12px;border-radius:8px;margin-bottom:12px">
      <h4 style="margin:0 0 6px;color:#5d4037">${cur.icon} ${cur.name}养生</h4>
      <p style="font-size:13px;color:#555;margin:0 0 4px;line-height:1.7"><b>养生原则：</b>${cur.principle}</p>
      <p style="font-size:12px;color:#666;margin:0 0 4px"><b>气候特点：</b>${cur.climate}</p>
      <p style="font-size:12px;color:#666;margin:0 0 4px"><b>饮食要点：</b>${cur.dietTips}</p>
      <p style="font-size:12px;color:#888;margin:0"><b>常见问题：</b>${cur.commonIssues.join('、')}</p>
    </div>
    <p class="fm-section-title">🍵 ${cur.name}养生茶饮（${cur.teas.length}款）</p>
    ${cur.teas.map(t=>`<div class="fm-tea-card">
      <h4>🍵 ${t.name}</h4>
      <p><b>配方：</b>${t.ingredients}</p>
      <p><b>冲泡：</b>${t.brewing}</p>
      <p><b>功效：</b>${t.benefits}</p>
      <p><b>适用：</b>${t.suitable}</p>
      <p style="color:#c62828"><b>⚠️ 禁忌：</b>${t.contraindication}</p>
    </div>`).join('')}
    <p class="fm-section-title">🍽️ ${cur.name}药膳食疗（${cur.recipes.length}款）</p>
    ${cur.recipes.map(r=>`<div class="fm-card">
      <h4>🍽️ ${r.name}</h4>
      <p><b>食材：</b>${r.ingredients}</p>
      <p><b>做法：</b>${r.method}</p>
      <p><b>功效：</b>${r.benefits}</p>
      <p><b>适用：</b>${r.suitable}</p>
      <p style="color:#c62828"><b>⚠️ 注意：</b>${r.contraindication}</p>
    </div>`).join('')}
  </div>`;
}

function fmSwitchSeason(s) {
  fmSeasonCurrent = s;
  document.getElementById('fmPanel').innerHTML = renderFmSeason();
}
