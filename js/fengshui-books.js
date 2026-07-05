// 风水大师 - 经典书籍学习模块（含原文+白话对照）
let fsBookCurrent = 'yijing';
let fsBookChapter = 0;

function renderFsBooks() {
  return `<div>
    <h3 class="fs-h3">📚 经典书籍与学习</h3>
    <p style="font-size:12px;color:#666;margin-bottom:12px">古代原文+白话文对照，方便学习理解传统文化经典。</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
      <span style="font-size:12px;color:#8b6914;font-weight:bold;line-height:28px">风水命理：</span>
      ${['yijing','zangshu','qingnang','hanlongjing','ditian','sanming','yuanhai','ziwei','mayi','yuhe'].map(k =>
        `<button class="tcm-btn ${fsBookCurrent===k?'tcm-btn-primary':''}" style="${fsBookCurrent!==k?'background:#f5f5f5':''};font-size:11px;padding:4px 8px" onclick="switchFsBook('${k}')">${FS_BOOKS_DATA[k]?.short||k}</button>`
      ).join('')}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
      <span style="font-size:12px;color:#2e7d32;font-weight:bold;line-height:28px">养生典籍：</span>
      ${['suwen','yangsheng','shesheng','qianjin'].map(k =>
        `<button class="tcm-btn ${fsBookCurrent===k?'tcm-btn-primary':''}" style="${fsBookCurrent!==k?'background:#e8f5e9':''};font-size:11px;padding:4px 8px" onclick="switchFsBook('${k}')">${FS_BOOKS_DATA[k]?.short||k}</button>`
      ).join('')}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">
      <span style="font-size:12px;color:#6a1b9a;font-weight:bold;line-height:28px">文学名著：</span>
      ${['jinpingmei'].map(k =>
        `<button class="tcm-btn ${fsBookCurrent===k?'tcm-btn-primary':''}" style="${fsBookCurrent!==k?'background:#f3e5f5':''};font-size:11px;padding:4px 8px" onclick="switchFsBook('${k}')">${FS_BOOKS_DATA[k]?.short||k}</button>`
      ).join('')}
    </div>
    <div id="fsBookPanel">${renderFsBookDetail(fsBookCurrent)}</div>
  </div>`;
}

function switchFsBook(book) {
  fsBookCurrent = book;
  fsBookChapter = 0;
  document.getElementById('fsBookPanel').innerHTML = renderFsBookDetail(book);
}

function showFsBookPanel(book) { switchFsBook(book); }

function switchFsBookChapter(idx) {
  fsBookChapter = idx;
  document.getElementById('fsBookChapterContent').innerHTML = renderFsChapterContent(fsBookCurrent, idx);
}

// 渲染书籍详情页
function renderFsBookDetail(bookId) {
  const b = FS_BOOKS_DATA[bookId];
  if (!b) return '<p style="color:#999">暂无此书数据</p>';
  return `<div style="border:1px solid #d4a847;border-radius:10px;padding:16px;background:#fffdf5">
    <h4 style="color:#8b6914;margin:0 0 6px">${b.name}</h4>
    <p style="font-size:12px;color:#888;margin:0 0 10px">${b.era} | ${b.author}</p>
    <p style="font-size:13px;color:#555;line-height:1.7;margin-bottom:12px">${b.intro}</p>
    <div style="background:#f9f5e8;padding:10px;border-radius:6px;margin-bottom:12px">
      <p style="font-size:12px;font-weight:bold;color:#8b6914;margin:0 0 6px">核心要义：</p>
      <p style="font-size:13px;color:#333;margin:0;line-height:1.7">${b.keyPoints}</p>
    </div>
    <p style="font-size:12px;color:#2e7d32;margin-bottom:12px"><b>📖 学习建议：</b>${b.study}</p>
    ${b.lectures?`<div style="background:#e8eaf6;padding:10px;border-radius:6px;margin-bottom:12px">
      <p style="font-size:12px;font-weight:bold;color:#283593;margin:0 0 6px">🎓 高校课程讲座推荐：</p>
      ${b.lectures.map(l=>`<p style="font-size:12px;color:#333;margin:0 0 4px;line-height:1.6">• <b>${l.teacher}</b>（${l.school}）：${l.course}${l.note?' — '+l.note:''}</p>`).join('')}
    </div>`:''}
    <h5 style="color:#8b6914;margin:12px 0 8px">章节目录（点击阅读原文+白话对照）</h5>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
      ${b.chapters.map((c,i) =>
        `<button class="tcm-btn ${fsBookChapter===i?'tcm-btn-primary':''}" style="${fsBookChapter!==i?'background:#f9f5e8':''};font-size:11px;padding:4px 10px" onclick="switchFsBookChapter(${i})">${c.title}</button>`
      ).join('')}
    </div>
    <div id="fsBookChapterContent">${renderFsChapterContent(bookId, fsBookChapter)}</div>
  </div>`;
}

// 渲染章节内容（原文+白话对照）
function renderFsChapterContent(bookId, chapterIdx) {
  const b = FS_BOOKS_DATA[bookId];
  if (!b || !b.chapters[chapterIdx]) return '';
  const ch = b.chapters[chapterIdx];
  return `<div style="border:1px solid #e0d5a0;border-radius:8px;overflow:hidden">
    <div style="background:#f9f5e8;padding:10px 14px;border-bottom:1px solid #e0d5a0">
      <h5 style="margin:0;color:#8b6914;font-size:14px">${ch.title}</h5>
      ${ch.subtitle?`<p style="margin:4px 0 0;font-size:12px;color:#888">${ch.subtitle}</p>`:''}
    </div>
    <div style="padding:14px">
      ${ch.sections.map(s => `
        <div style="margin-bottom:16px">
          ${s.heading?`<p style="font-weight:bold;color:#5d4e37;margin:0 0 8px;font-size:13px">${s.heading}</p>`:''}
          <div style="padding:10px 12px;background:#fffef8;border-left:3px solid #d4a847;margin-bottom:8px;font-family:KaiTi,STKaiti,serif;font-size:14px;color:#333;line-height:2">
            ${s.original}
          </div>
          <div style="padding:10px 12px;background:#f0faf0;border-left:3px solid #66bb6a;font-size:13px;color:#2e7d32;line-height:1.8">
            <b>【白话文】</b>${s.translation}
          </div>
        </div>
      `).join('')}
    </div>
  </div>`;
}
