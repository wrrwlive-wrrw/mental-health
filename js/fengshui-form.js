// 风水大师·个人信息表单 HTML

function getFsUserFormHTML(u) {
  u = u || {};
  return `
    <div class="fs-modal-mask" onclick="closeFsUserForm()"></div>
    <div class="fs-modal-box">
      <h3 class="fs-modal-title">📜 个人信息（用于个性化分析）</h3>
      <div class="fs-form-row">
        <label>姓名 *</label>
        <input id="fsuName" value="${u.name||''}" placeholder="真实姓名或称呼">
      </div>
      <div class="fs-form-row2">
        <div>
          <label>性别</label>
          <select id="fsuGender">
            <option ${u.gender==='男'?'selected':''}>男</option>
            <option ${u.gender==='女'?'selected':''}>女</option>
          </select>
        </div>
        <div>
          <label>出生日期 *</label>
          <input type="date" id="fsuBirthDate" value="${u.birthDate||''}">
        </div>
      </div>
      <div class="fs-form-row2">
        <div>
          <label>出生时辰</label>
          <select id="fsuBirthTime">
            <option value="">未知</option>
            <option value="子" ${u.birthTime==='子'?'selected':''}>子(23-1点)</option>
            <option value="丑" ${u.birthTime==='丑'?'selected':''}>丑(1-3点)</option>
            <option value="寅" ${u.birthTime==='寅'?'selected':''}>寅(3-5点)</option>
            <option value="卯" ${u.birthTime==='卯'?'selected':''}>卯(5-7点)</option>
            <option value="辰" ${u.birthTime==='辰'?'selected':''}>辰(7-9点)</option>
            <option value="巳" ${u.birthTime==='巳'?'selected':''}>巳(9-11点)</option>
            <option value="午" ${u.birthTime==='午'?'selected':''}>午(11-13点)</option>
            <option value="未" ${u.birthTime==='未'?'selected':''}>未(13-15点)</option>
            <option value="申" ${u.birthTime==='申'?'selected':''}>申(15-17点)</option>
            <option value="酉" ${u.birthTime==='酉'?'selected':''}>酉(17-19点)</option>
            <option value="戌" ${u.birthTime==='戌'?'selected':''}>戌(19-21点)</option>
            <option value="亥" ${u.birthTime==='亥'?'selected':''}>亥(21-23点)</option>
          </select>
        </div>
        <div>
          <label>出生地</label>
          <input id="fsuBirthPlace" value="${u.birthPlace||''}" placeholder="如：河南郑州">
        </div>
      </div>
      <div class="fs-form-row">
        <label>现居城市</label>
        <input id="fsuCity" value="${u.city||''}" placeholder="如：北京朝阳区">
      </div>
      <div class="fs-form-row2">
        <div>
          <label>住宅类型</label>
          <input id="fsuHouse" value="${u.house||''}" placeholder="如：高层公寓/独栋">
        </div>
        <div>
          <label>大门朝向</label>
          <select id="fsuOrient">
            <option value="">未知</option>
            ${['东','东南','南','西南','西','西北','北','东北'].map(d=>
              `<option value="${d}" ${u.orientation===d?'selected':''}>${d}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="fs-form-row">
        <label>备注（想了解的问题）</label>
        <textarea id="fsuRemark" rows="2" placeholder="如：想了解今年运势、婚姻、事业...">${u.remark||''}</textarea>
      </div>
      <div class="fs-form-actions">
        <button class="fs-btn-cancel" onclick="closeFsUserForm()">取消</button>
        <button class="fs-btn-submit" onclick="submitFsUser()">保存</button>
      </div>
      <p class="fs-form-tip">※ 信息仅保存在本机浏览器，不上传服务器。</p>
    </div>`;
}
