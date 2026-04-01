// ===========================
// 主题切换（亮/暗）
// ===========================
const themeBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

function getTheme() {
  return localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeBtn) {
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
}

setTheme(getTheme());

// ===========================
// 导航栏高亮当前页
// ===========================
const currentPath = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath ||
     (currentPath === '' && href === 'index.html') ||
     (currentPath === 'index.html' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ===========================
// 滚动进度条
// ===========================
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight * 100) + '%';
  });
}

// ===========================
// 搜索功能
// ===========================
const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchBtn = document.getElementById('search-btn');

// 搜索数据
const searchData = [
  { title: '关于', url: 'index.html', section: '导航' },
  { title: '简历', url: 'cv.html', section: '导航' },
  { title: '项目', url: 'projects.html', section: '导航' },
  { title: '书架', url: 'books.html', section: '导航' },
  { title: '图片库', url: 'gallery.html', section: '导航' },
  { title: '音乐库', url: 'music.html', section: '导航' },
  { title: '笔记', url: 'notes.html', section: '导航' },
  { title: '日志', url: 'blog.html', section: '导航' },

  // 书架
  { title: '《宇宙》', url: 'books.html', section: '书架' },
  { title: '《哈姆莱特》', url: 'books.html', section: '书架' },
  { title: '《极简宇宙史》', url: 'books.html', section: '书架' },
  { title: '《2001：太空漫游》', url: 'books.html', section: '书架' },
  { title: '《同一个，另一个》', url: 'books.html', section: '书架' },

  // 笔记
  { title: '《宇宙》读书笔记', url: 'notes.html', section: '笔记' },
  { title: '线性回归模型原理', url: 'notes.html', section: '笔记' },

  // 日志
  { title: '开始', url: 'blog.html', section: '日志' },

  // 音乐
  { title: 'Breaking the Habit', url: 'music.html', section: '音乐' },
];

function openSearch() {
  if (searchOverlay) {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput && searchInput.focus(), 50);
    renderSearchResults('');
  }
}

function closeSearch() {
  if (searchOverlay) searchOverlay.classList.remove('active');
}

if (searchBtn) searchBtn.addEventListener('click', openSearch);

if (searchOverlay) {
  searchOverlay.addEventListener('click', e => {
    if (e.target === searchOverlay) closeSearch();
  });
}

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
  if (e.key === 'Escape') closeSearch();
});

function renderSearchResults(query) {
  if (!searchResults) return;
  const q = query.toLowerCase().trim();
  const filtered = q
    ? searchData.filter(item => item.title.toLowerCase().includes(q))
    : searchData;

  if (filtered.length === 0) {
    searchResults.innerHTML = `<div style="padding:24px;text-align:center;color:var(--text-muted)">未找到相关内容</div>`;
    return;
  }

  // 按 section 分组
  const groups = {};
  filtered.forEach(item => {
    if (!groups[item.section]) groups[item.section] = [];
    groups[item.section].push(item);
  });

  let html = '';
  for (const [section, items] of Object.entries(groups)) {
    html += `<div class="search-section-label">${section}</div>`;
    items.forEach(item => {
      html += `
        <div class="search-item" onclick="location.href='${item.url}'">
          <span class="search-item-title">${item.title}</span>
        </div>`;
    });
  }
  searchResults.innerHTML = html;
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    renderSearchResults(searchInput.value);
  });
}

// 键盘导航搜索结果
if (searchInput) {
  searchInput.addEventListener('keydown', e => {
    const items = searchResults.querySelectorAll('.search-item');
    const selected = searchResults.querySelector('.search-item.selected');
    let idx = Array.from(items).indexOf(selected);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (selected) selected.classList.remove('selected');
      items[(idx + 1) % items.length]?.classList.add('selected');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (selected) selected.classList.remove('selected');
      items[(idx - 1 + items.length) % items.length]?.classList.add('selected');
    } else if (e.key === 'Enter') {
      const sel = searchResults.querySelector('.search-item.selected');
      if (sel) sel.click();
    }
  });
}
