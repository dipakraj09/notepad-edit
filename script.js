/* JavaScript Block 8 */
if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

/* JavaScript Block 9 */
const { jsPDF } = window.jspdf;
    const MAX_UNTITLED_FILES = 1000;

    // DOM Elements
    const body = document.body;
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectBtn = document.getElementById('selectBtn');
    const editor = document.getElementById('editor');
    const editorContainer = document.getElementById('editor-container');
    const highlightingArea = document.getElementById('highlighting-area');
    const highlightingCode = document.getElementById('highlighting-code');
    const previewArea = document.getElementById('previewArea');
    const downloadBtn = document.getElementById('downloadBtn');
    const fileNameInput = document.getElementById('fileName');
    const fileExtSelect = document.getElementById('fileExtSelect');
    const languageIndicatorText = document.getElementById('languageIndicator').querySelector('span');
    const languageIndicatorDot = document.getElementById('languageIndicator').querySelector('i');
    const copyBtn = document.getElementById('copyBtn');
    const previewBtn = document.getElementById('previewBtn');
    const spinner = document.getElementById('spinner');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    const fileIcon = document.getElementById('fileIcon');
    const fileIconText = document.getElementById('fileIconText');
    const fileIconImg = document.getElementById('fileIconImg');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIconImg = document.getElementById('themeIconImg');
    const goToLineBtn = document.getElementById('goToLineBtn');
    const lineCountLabel = document.getElementById('lineCountLabel');
    const goToLineModal = document.getElementById('goToLineModal');
    const closeGoToLineModal = document.getElementById('closeGoToLineModal');
    const lineNumberInput = document.getElementById('lineNumberInput');
    const submitGoToLineBtn = document.getElementById('submitGoToLineBtn');
    const linePreview = document.getElementById('linePreview');
    const suggestNameBtn = document.getElementById('suggestNameBtn');
    const suggestionDropdown = document.getElementById('suggestionDropdown');
    const lineCountBadge = document.getElementById('lineCountBadge');
    const totalLinesDisplay = document.getElementById('totalLinesDisplay');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenuItems = document.getElementById('mobileMenuItems');
    const lineNumbers = document.getElementById('line-numbers');

    // Tool Buttons
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const findBtn = document.getElementById('findBtn');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const duplicateLineBtn = document.getElementById('duplicateLineBtn');
    const deleteLineBtn = document.getElementById('deleteLineBtn');
    const trimSpacesBtn = document.getElementById('trimSpacesBtn');
    const sortLinesBtn = document.getElementById('sortLinesBtn');
    const timestampBtn = document.getElementById('timestampBtn');
    const toggleLineNumbersBtn = document.getElementById('toggleLineNumbersBtn');
    const commentToggleBtn = document.getElementById('commentToggleBtn');
    const indentBtn = document.getElementById('indentBtn');
    const outdentBtn = document.getElementById('outdentBtn');
    const emojiBtn = document.getElementById('emojiBtn');
    const statsBtn = document.getElementById('statsBtn');

    // Modals
    const findReplaceModal = document.getElementById('findReplaceModal');
    const closeFindReplaceModal = document.getElementById('closeFindReplaceModal');
    const findInput = document.getElementById('findInput');
    const replaceInput = document.getElementById('replaceInput');
    const findNextBtn = document.getElementById('findNextBtn');
    const replaceAllBtn = document.getElementById('replaceAllBtn');
    const statsModal = document.getElementById('statsModal');
    const closeStatsModal = document.getElementById('closeStatsModal');
    const emojiModal = document.getElementById('emojiModal');
    const closeEmojiModal = document.getElementById('closeEmojiModal');
    const emojiGrid = document.getElementById('emojiGrid');
    const confirmModal = document.getElementById('confirmModal');
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmYesBtn = document.getElementById('confirmYesBtn');
    const confirmNoBtn = document.getElementById('confirmNoBtn');

    let untitledCounter = 1;
    let isPreviewMode = false;
    let history = [];
    let historyIndex = -1;
    const MAX_HISTORY = 100;
    let lastFindIndex = -1;
    let confirmCallback = null;

    // Current file state
    let currentFile = {
      name: `Untitled-${untitledCounter}`,
      extension: 'txt',
      language: 'text'
    };

    // Enhanced Language Map
    const languageMap = {
      'js': 'javascript', 'ts': 'typescript', 'jsx': 'jsx', 'tsx': 'tsx',
      'py': 'python', 'java': 'java', 'c': 'c', 'cpp': 'cpp', 'cs': 'csharp', 
      'go': 'go', 'rb': 'ruby', 'php': 'php', 'swift': 'swift', 'kt': 'kotlin',
      'rs': 'rust', 'scala': 'scala', 'r': 'r', 'dart': 'dart', 'lua': 'lua',
      'html': 'html', 'xml': 'xml', 'svg': 'xml',
      'css': 'css', 'scss': 'scss', 'less': 'less',
      'json': 'json', 'yaml': 'yaml', 'yml': 'yaml', 'toml': 'toml', 
      'ipynb': 'json', 'ahk': 'autohotkey',
      'md': 'markdown', 'sh': 'bash', 'bat': 'batch', 'ps1': 'powershell',
      'sql': 'sql', 'txt': 'text', 'log': 'text', 'ini': 'ini', 
      'conf': 'text', 'csv': 'text', 'pdf': 'text',
      'dockerfile': 'dockerfile', 'graphql': 'graphql'
    };

    // Icon Colors
    const iconColors = {
      'js': '#f7df1e', 'ts': '#3178c6', 'jsx': '#61dafb', 'tsx': '#3178c6',
      'py': '#3572A5', 'java': '#b07219', 'c': '#555555', 'cpp': '#f34b7d', 
      'cs': '#178600', 'go': '#00ADD8', 'rb': '#CC342D', 'php': '#777BB4', 
      'swift': '#F05138', 'kt': '#7F52FF', 'ahk': '#9546a3', 'rs': '#dea584',
      'scala': '#c22d40', 'r': '#198ce7', 'dart': '#00B4AB', 'lua': '#000080',
      'html': '#e34c26', 'xml': '#005A9C', 'svg': '#FFB13B',
      'css': '#1572B6', 'scss': '#C6538C', 'less': '#1D365D',
      'json': '#1e88e5', 'yaml': '#cb171e', 'yml': '#cb171e', 
      'toml': '#99424F', 'ipynb': '#F37626',
      'md': '#083fa1', 'sh': '#89e051', 'bat': '#C1F12E', 'ps1': '#012456',
      'sql': '#f29111', 'txt': '#6c757d', 'log': '#adb5bd', 
      'ini': '#495057', 'conf': '#495057', 'csv': '#2dce89', 'pdf': '#d32f2f',
      'dockerfile': '#384d54', 'graphql': '#E10098',
      default: '#6c757d'
    };

    const iconTextColors = {
      'js': '#000000', 'jsx': '#000000', 'svg': '#000000', 
      'sh': '#000000', 'bat': '#000000', 'ipynb': '#ffffff', 
      'pdf': '#ffffff', 'ahk': '#ffffff',
      default: '#ffffff'
    };

    // Icon Images
    const iconImages = {
      py: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      js: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      ts: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      cpp: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
      c: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
      cs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
      go: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
      rb: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
      php: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
      swift: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
      kt: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
      rs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',
      scala: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg',
      r: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg',
      dart: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
      lua: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg',
      html: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      css: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      scss: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
      jsx: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      tsx: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      json: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg',
      xml: 'https://cdn-icons-png.flaticon.com/512/2306/2306173.png',
      yaml: 'https://cdn-icons-png.flaticon.com/512/2306/2306173.png',
      csv: 'https://cdn-icons-png.flaticon.com/512/2306/2306173.png',
      sql: 'https://cdn-icons-png.flaticon.com/512/2306/2306173.png',
      sh: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
      ahk: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png',
      md: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg',
      txt: 'https://cdn-icons-png.flaticon.com/512/3022/3022260.png',
      pdf: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
      jpg: 'https://cdn-icons-png.flaticon.com/512/136/136524.png',
      jpeg: 'https://cdn-icons-png.flaticon.com/512/136/136524.png',
      png: 'https://cdn-icons-png.flaticon.com/512/136/136524.png',
      gif: 'https://cdn-icons-png.flaticon.com/512/136/136524.png',
      ipynb: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg',
      log: 'https://cdn-icons-png.flaticon.com/512/2306/2306173.png'
    };

    // Smart Filename Suggestions
    const filenameSuggestions = {
      html: ['index.html', 'main.html', 'home.html', 'about.html', 'contact.html', 'style.html', 'script.html'],
      css: ['style.css', 'main.css', 'app.css', 'custom.css', 'theme.css', 'layout.css'],
      js: ['script.js', 'main.js', 'app.js', 'index.js', 'utils.js', 'helpers.js'],
      py: ['main.py', 'app.py', 'script.py', 'utils.py', 'helpers.py', 'config.py', 'server.py'],
      json: ['package.json', 'config.json', 'data.json', 'settings.json', 'manifest.json'],
      md: ['README.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE.md', 'TODO.md'],
      txt: ['notes.txt', 'readme.txt', 'log.txt', 'data.txt', 'output.txt'],
      java: ['Main.java', 'App.java', 'Utils.java', 'Helper.java', 'Config.java'],
      cpp: ['main.cpp', 'app.cpp', 'utils.cpp', 'helper.cpp', 'config.cpp'],
      c: ['main.c', 'app.c', 'utils.c', 'helper.c', 'config.c'],
      cs: ['Program.cs', 'Main.cs', 'App.cs', 'Utils.cs', 'Config.cs'],
      php: ['index.php', 'config.php', 'utils.php', 'functions.php', 'api.php'],
      rb: ['main.rb', 'app.rb', 'Gemfile', 'Rakefile', 'config.ru'],
      go: ['main.go', 'app.go', 'utils.go', 'helper.go', 'server.go'],
      ts: ['main.ts', 'app.ts', 'index.ts', 'utils.ts', 'types.ts'],
      jsx: ['App.jsx', 'index.jsx', 'Main.jsx', 'Component.jsx'],
      tsx: ['App.tsx', 'index.tsx', 'Main.tsx', 'Component.tsx'],
      sql: ['schema.sql', 'data.sql', 'queries.sql', 'init.sql', 'migration.sql'],
      xml: ['config.xml', 'data.xml', 'manifest.xml', 'settings.xml'],
      yaml: ['docker-compose.yml', 'config.yml', '.github/workflows/ci.yml', 'kubernetes.yml'],
      yml: ['docker-compose.yml', 'config.yml', '.github/workflows/ci.yml'],
      sh: ['script.sh', 'deploy.sh', 'build.sh', 'setup.sh', 'run.sh'],
      bat: ['script.bat', 'build.bat', 'run.bat', 'setup.bat'],
      ps1: ['script.ps1', 'deploy.ps1', 'build.ps1', 'setup.ps1'],
      dockerfile: ['Dockerfile', 'Dockerfile.prod', 'Dockerfile.dev'],
      ahk: ['script.ahk', 'hotkeys.ahk', 'macros.ahk', 'automation.ahk']
    };

    // Emojis for picker
    const emojis = ['😀', '😂', '😍', '🎉', '👍', '❤️', '🔥', '✨', '💯', '🚀', '😎', '🤔', 
                    '👏', '🙌', '💪', '🎯', '✅', '⭐', '📝', '💡', '🌟', '💻', '🖥️', '⌨️', 
                    '🖱️', '🐛', '🔧', '📦', '📊', '📈', '🔒', '🔓', '⚡', '🌈', '🍕', '🎮'];

    // Event Listeners
    selectBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('active'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));
    dropZone.addEventListener('drop', handleFileDrop);
    downloadBtn.addEventListener('click', triggerDownloadAnimation);
    copyBtn.addEventListener('click', copyToClipboard);
    previewBtn.addEventListener('click', togglePreview);
    themeToggleBtn.addEventListener('click', toggleTheme);
    goToLineBtn.addEventListener('click', () => {
      goToLineModal.classList.add('show');
      lineNumberInput.focus();
      lineNumberInput.value = '';
      linePreview.style.display = 'none';
    });
    closeGoToLineModal.addEventListener('click', () => goToLineModal.classList.remove('show'));
    goToLineModal.addEventListener('click', (e) => { if (e.target === goToLineModal) goToLineModal.classList.remove('show'); });
    submitGoToLineBtn.addEventListener('click', processGoToLine);
    lineNumberInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); processGoToLine(); } });
    
    // Tool buttons
    undoBtn.addEventListener('click', performUndo);
    redoBtn.addEventListener('click', performRedo);
    findBtn.addEventListener('click', showFindReplaceModal);
    selectAllBtn.addEventListener('click', () => { editor.select(); showToast('All text selected', 'success'); });
    duplicateLineBtn.addEventListener('click', duplicateLine);
    deleteLineBtn.addEventListener('click', deleteLine);
    trimSpacesBtn.addEventListener('click', trimSpaces);
    sortLinesBtn.addEventListener('click', sortLines);
    timestampBtn.addEventListener('click', insertTimestamp);
    toggleLineNumbersBtn.addEventListener('click', toggleLineNumbers);
    commentToggleBtn.addEventListener('click', toggleComments);
    indentBtn.addEventListener('click', indentLines);
    outdentBtn.addEventListener('click', outdentLines);
    emojiBtn.addEventListener('click', showEmojiModal);
    statsBtn.addEventListener('click', showStatsModal);
    lineCountBadge.addEventListener('click', showStatsModal);
    
    // Find & Replace Modal
    closeFindReplaceModal.addEventListener('click', () => findReplaceModal.classList.remove('show'));
    findReplaceModal.addEventListener('click', (e) => { if (e.target === findReplaceModal) findReplaceModal.classList.remove('show'); });
    findNextBtn.addEventListener('click', findNext);
    replaceAllBtn.addEventListener('click', replaceAll);
    
    // Stats Modal
    closeStatsModal.addEventListener('click', () => statsModal.classList.remove('show'));
    statsModal.addEventListener('click', (e) => { if (e.target === statsModal) statsModal.classList.remove('show'); });
    
    // Emoji Modal
    closeEmojiModal.addEventListener('click', () => emojiModal.classList.remove('show'));
    emojiModal.addEventListener('click', (e) => { if (e.target === emojiModal) emojiModal.classList.remove('show'); });
    
    // Confirm Modal
    closeConfirmModal.addEventListener('click', () => confirmModal.classList.remove('show'));
    confirmNoBtn.addEventListener('click', () => { confirmModal.classList.remove('show'); if (confirmCallback) confirmCallback(false); });
    confirmYesBtn.addEventListener('click', () => { confirmModal.classList.remove('show'); if (confirmCallback) confirmCallback(true); });
    
    // Filename suggestions
    suggestNameBtn.addEventListener('click', showFilenameSuggestions);
    
    // Mobile menu
    mobileMenuBtn.addEventListener('click', showMobileMenu);
    closeMobileMenu.addEventListener('click', () => mobileMenuOverlay.classList.remove('show'));
    mobileMenuOverlay.addEventListener('click', (e) => { if (e.target === mobileMenuOverlay) mobileMenuOverlay.classList.remove('show'); });
    
    // Filename input
    fileNameInput.addEventListener('input', updateFileInfoFromInput);
    fileNameInput.addEventListener('blur', () => {
      if (!fileNameInput.value.trim()) setUniqueUntitledName();
      suggestionDropdown.classList.remove('show');
    });
    fileNameInput.addEventListener('focus', () => {
      if (currentFile.extension && filenameSuggestions[currentFile.extension]) {
        showFilenameSuggestions();
      }
    });

    editor.addEventListener('paste', handlePasteEvent);
    document.addEventListener('keydown', handleShortcuts);
    editor.addEventListener('input', () => {
      autoDetectLanguage();
      updateAndHighlight();
      if (isPreviewMode) renderPreviewContent();
    });
    editor.addEventListener('scroll', syncScroll);
    fileExtSelect.addEventListener('change', handleExtensionChange);

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      setUniqueUntitledName();
      const savedTheme = localStorage.getItem('theme') || 'light';
      if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
      }
      updateAndHighlight();
      initEmojiGrid();
      initMobileMenu();
      addToHistory();
    });

    // Initialize Emoji Grid
    function initEmojiGrid() {
      emojiGrid.innerHTML = '';
      emojis.forEach(emoji => {
        const btn = document.createElement('button');
        btn.textContent = emoji;
        btn.style.cssText = 'font-size: 1.5rem; padding: 10px; border: none; background: #f0f0f0; border-radius: 8px; cursor: pointer; transition: all 0.2s;';
        btn.addEventListener('click', () => insertEmoji(emoji));
        btn.addEventListener('mouseover', () => btn.style.background = '#e0e0e0');
        btn.addEventListener('mouseout', () => btn.style.background = '#f0f0f0');
        emojiGrid.appendChild(btn);
      });
    }

    // Initialize Mobile Menu
    function initMobileMenu() {
      const tools = [
        { id: 'undoBtn', name: 'Undo', icon: 'https://cdn-icons-png.flaticon.com/512/318/318275.png', action: performUndo },
        { id: 'redoBtn', name: 'Redo', icon: 'https://cdn-icons-png.flaticon.com/512/318/318276.png', action: performRedo },
        { id: 'findBtn', name: 'Find & Replace', icon: 'https://cdn-icons-png.flaticon.com/512/149/149852.png', action: showFindReplaceModal },
        { id: 'selectAllBtn', name: 'Select All', icon: 'https://cdn-icons-png.flaticon.com/512/60/60793.png', action: () => { editor.select(); showToast('All selected', 'success'); } },
        { id: 'duplicateLineBtn', name: 'Duplicate Line', icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png', action: duplicateLine },
        { id: 'deleteLineBtn', name: 'Delete Line', icon: 'https://cdn-icons-png.flaticon.com/512/3096/3096673.png', action: deleteLine },
        { id: 'trimSpacesBtn', name: 'Trim Spaces', icon: 'https://cdn-icons-png.flaticon.com/512/1159/1159876.png', action: trimSpaces },
        { id: 'sortLinesBtn', name: 'Sort Lines', icon: 'https://cdn-icons-png.flaticon.com/512/2355/2355683.png', action: sortLines },
        { id: 'timestampBtn', name: 'Insert Timestamp', icon: 'https://cdn-icons-png.flaticon.com/512/2928/2928989.png', action: insertTimestamp },
        { id: 'toggleLineNumbersBtn', name: 'Toggle Line Numbers', icon: 'https://cdn-icons-png.flaticon.com/512/2099/2099199.png', action: toggleLineNumbers },
        { id: 'commentToggleBtn', name: 'Toggle Comments', icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828960.png', action: toggleComments },
        { id: 'indentBtn', name: 'Indent', icon: 'https://cdn-icons-png.flaticon.com/512/271/271220.png', action: indentLines },
        { id: 'outdentBtn', name: 'Outdent', icon: 'https://cdn-icons-png.flaticon.com/512/271/271218.png', action: outdentLines },
        { id: 'emojiBtn', name: 'Insert Emoji', icon: 'https://cdn-icons-png.flaticon.com/512/742/742751.png', action: showEmojiModal },
        { id: 'themeToggleBtn', name: 'Toggle Theme', icon: 'https://cdn-icons-png.flaticon.com/512/740/740878.png', action: toggleTheme },
        { id: 'goToLineBtn', name: 'Go to Line', icon: 'https://cdn-icons-png.flaticon.com/512/2928/2928981.png', action: () => { goToLineModal.classList.add('show'); lineNumberInput.focus(); } },
        { id: 'previewBtn', name: 'Toggle Preview', icon: 'https://cdn-icons-png.flaticon.com/512/709/709612.png', action: togglePreview },
        { id: 'copyBtn', name: 'Copy to Clipboard', icon: 'https://cdn-icons-png.flaticon.com/512/1621/1621635.png', action: copyToClipboard },
        { id: 'statsBtn', name: 'Statistics', icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920276.png', action: showStatsModal }
      ];

      tools.forEach(tool => {
        const item = document.createElement('div');
        item.className = 'mobile-menu-item';
        item.innerHTML = `<img src="${tool.icon}" alt="${tool.name}"><span>${tool.name}</span>`;
        item.addEventListener('click', () => {
          tool.action();
          mobileMenuOverlay.classList.remove('show');
        });
        mobileMenuItems.appendChild(item);
      });
    }

    function showMobileMenu() {
      mobileMenuOverlay.classList.add('show');
    }

    // Custom Confirm Dialog
    function showConfirm(title, message, callback) {
      confirmTitle.textContent = title;
      confirmMessage.textContent = message;
      confirmCallback = callback;
      confirmModal.classList.add('show');
    }

    // Filename Suggestions
    function showFilenameSuggestions() {
      const ext = currentFile.extension;
      const suggestions = filenameSuggestions[ext] || filenameSuggestions['txt'];
      
      suggestionDropdown.innerHTML = '';
      suggestions.forEach(name => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        const iconUrl = iconImages[ext] || iconImages['txt'];
        item.innerHTML = `<img src="${iconUrl}" alt="${ext}"><span>${name}</span>`;
        item.addEventListener('click', () => {
          fileNameInput.value = name;
          updateFileInfoFromInput({ target: { value: name } });
          suggestionDropdown.classList.remove('show');
          showToast(`Filename set to: ${name}`, 'success');
        });
        suggestionDropdown.appendChild(item);
      });
      
      suggestionDropdown.classList.add('show');
    }

    // Find & Replace Modal Functions
    function showFindReplaceModal() {
      findReplaceModal.classList.add('show');
      findInput.focus();
      lastFindIndex = -1;
    }

    function findNext() {
      const searchText = findInput.value;
      if (!searchText) {
        showToast('Please enter text to find', 'error');
        return;
      }
      
      const text = editor.value;
      const index = text.indexOf(searchText, lastFindIndex + 1);
      
      if (index !== -1) {
        editor.focus();
        editor.setSelectionRange(index, index + searchText.length);
        lastFindIndex = index;
        showToast(`Found at position ${index}`, 'success');
      } else {
        lastFindIndex = -1;
        showToast('Text not found', 'error');
      }
    }

    function replaceAll() {
      const findText = findInput.value;
      const replaceText = replaceInput.value;
      
      if (!findText) {
        showToast('Please enter text to find', 'error');
        return;
      }
      
      addToHistory();
      const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const count = (editor.value.match(regex) || []).length;
      editor.value = editor.value.replace(regex, replaceText);
      updateAndHighlight();
      findReplaceModal.classList.remove('show');
      showToast(`Replaced ${count} occurrence(s)`, 'success');
    }

    // Stats Modal
    function showStatsModal() {
      const text = editor.value;
      const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      const charCount = text.length;
      const charCountNoSpaces = text.replace(/\s/g, '').length;
      const lineCount = text.split('\n').length;
      
      document.getElementById('statWords').textContent = wordCount.toLocaleString();
      document.getElementById('statChars').textContent = charCount.toLocaleString();
      document.getElementById('statCharsNoSpace').textContent = charCountNoSpaces.toLocaleString();
      document.getElementById('statLines').textContent = lineCount.toLocaleString();
      
      // Reading time (avg 200 wpm)
      const readingTime = Math.ceil(wordCount / 200);
      document.getElementById('readingTime').textContent = readingTime <= 1 ? '< 1 min' : `${readingTime} min`;
      
      // Speaking time (avg 130 wpm)
      const speakingTime = Math.ceil(wordCount / 130);
      document.getElementById('speakingTime').textContent = speakingTime <= 1 ? '< 1 min' : `${speakingTime} min`;
      
      statsModal.classList.add('show');
    }

    // Emoji Modal
    function showEmojiModal() {
      emojiModal.classList.add('show');
    }

    function insertEmoji(emoji) {
      const start = editor.selectionStart;
      editor.value = editor.value.substring(0, start) + emoji + editor.value.substring(editor.selectionEnd);
      editor.setSelectionRange(start + emoji.length, start + emoji.length);
      editor.focus();
      updateAndHighlight();
      emojiModal.classList.remove('show');
      showToast('Emoji inserted', 'success');
    }

    // Keyboard Shortcuts
    function handleShortcuts(e) {
      if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.altKey && document.activeElement !== editor) {
        e.preventDefault();
        downloadBtn.click();
        return;
      }

      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) performRedo();
            else performUndo();
            break;
          case 'y':
            e.preventDefault();
            performRedo();
            break;
          case 'f':
            e.preventDefault();
            showFindReplaceModal();
            break;
          case 'd':
            e.preventDefault();
            duplicateLine();
            break;
          case 'h':
            e.preventDefault();
            fileNameInput.focus();
            fileNameInput.select();
            break;
          case 'k':
            if (e.shiftKey) {
              e.preventDefault();
              deleteLine();
            }
            break;
          case 'm':
            e.preventDefault();
            toggleTheme();
            break;
          case '/':
            e.preventDefault();
            toggleComments();
            break;
          case 'g':
            if (e.shiftKey) {
              e.preventDefault();
              goToLineModal.classList.add('show');
              lineNumberInput.focus();
            }
            break;
        }
      }
    }

    // Core Functions
    function updateAndHighlight() {
      const code = editor.value;
      highlightingCode.textContent = code;
      highlightingCode.className = '';
      const lang = languageMap[currentFile.extension] || 'plaintext';
      highlightingCode.classList.add(`language-${lang}`);
      hljs.highlightElement(highlightingCode);
      updateLineCount();
      updateLineNumbers();
      syncScroll();
      updateWordCountDisplay();
    }

    function updateLineNumbers() {
      const lines = editor.value.split('\n');
      lineNumbers.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
    }

    function syncScroll() {
      highlightingArea.scrollTop = editor.scrollTop;
      highlightingArea.scrollLeft = editor.scrollLeft;
      lineNumbers.scrollTop = editor.scrollTop;
    }

    function updateLineCount() {
      const lines = editor.value.split('\n').length;
      lineCountLabel.textContent = `Lines: ${lines}`;
      totalLinesDisplay.textContent = `${lines.toLocaleString()} Lines`;
      lineNumberInput.max = lines;
    }

    function updateWordCountDisplay() {
      const text = editor.value;
      const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      // Word count display removed from button
    }

    function handleFileSelect(e) {
      if (e.target.files.length) {
        handleFile(e.target.files[0]);
        fileInput.value = null;
      }
    }

    function handleFileDrop(e) {
      e.preventDefault();
      dropZone.classList.remove('active');
      if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
      }
    }

    function handleFile(file) {
      const reader = new FileReader();
      const nameParts = file.name.lastIndexOf('.') > 0 ? file.name.split('.') : [file.name, ''];
      const ext = nameParts.pop().toLowerCase();
      const name = nameParts.join('.');

      currentFile.name = name || 'Untitled';
      currentFile.extension = ext || 'txt';
      fileNameInput.value = `${currentFile.name}.${currentFile.extension}`;

      reader.onload = (e) => {
        editor.value = e.target.result;
        if (isPreviewMode) renderPreviewContent();
        editor.style.opacity = '0';
        editor.scrollTop = 0;
        setTimeout(() => editor.style.opacity = '1', 50);
        showToast(`"${file.name}" loaded successfully!`, 'success');
        autoDetectLanguage();
        updateAndHighlight();
        addToHistory();
      };
      reader.onerror = () => { showToast(`Error reading file: ${file.name}`, 'error'); }
      reader.readAsText(file);
    }

    function updateFileInfoFromInput(e) {
      const nameWithExt = e.target.value.trim();
      const lastDotIndex = nameWithExt.lastIndexOf('.');

      if (lastDotIndex !== -1 && lastDotIndex < nameWithExt.length - 1 && lastDotIndex > 0) {
        currentFile.name = nameWithExt.substring(0, lastDotIndex);
        currentFile.extension = nameWithExt.substring(lastDotIndex + 1).toLowerCase();
      } else {
        currentFile.name = nameWithExt || (currentFile.name || `Untitled-${untitledCounter}`);
        currentFile.extension = nameWithExt.includes('.') ? '' : (currentFile.extension || 'txt');
      }
      updateUIDisplay();
    }

    function setUniqueUntitledName() {
      let newName = `Untitled-${untitledCounter}`;
      currentFile.name = newName;
      currentFile.extension = 'txt';
      fileNameInput.value = `${currentFile.name}.${currentFile.extension}`;
      untitledCounter++;
      updateUIDisplay();
    }

    function updateUIDisplay() {
      currentFile.language = languageMap[currentFile.extension] || 'text';
      const langName = currentFile.language.charAt(0).toUpperCase() + currentFile.language.slice(1);
      languageIndicatorText.textContent = langName;
      const ext = currentFile.extension;
      languageIndicatorDot.style.backgroundColor = iconColors[ext] || iconColors.default;
      
      if (iconImages[ext]) {
        fileIconImg.src = iconImages[ext];
        fileIconImg.style.display = 'inline-block';
        fileIconText.style.display = 'none';
        fileIcon.style.backgroundColor = 'transparent';
      } else {
        fileIconImg.style.display = 'none';
        fileIconText.style.display = 'inline-block';
        fileIconText.textContent = ext ? ext.toUpperCase() : '?';
        fileIcon.style.backgroundColor = iconColors[ext] || iconColors.default;
        fileIcon.style.color = iconTextColors[ext] || iconTextColors.default;
      }

      const matchingOption = fileExtSelect.querySelector(`option[value="${ext}"]`);
      fileExtSelect.value = matchingOption ? ext : 'auto';

      if (currentFile.language === 'html' || currentFile.language === 'markdown') {
        previewBtn.disabled = false;
        previewBtn.style.opacity = '1';
      } else {
        previewBtn.disabled = true;
        previewBtn.style.opacity = '0.5';
        if (isPreviewMode) togglePreview();
      }
      updateAndHighlight();
    }

    function handlePasteEvent(e) {
      e.preventDefault();
      if (isPreviewMode) {
        showToast('Pasting is disabled in preview mode', 'info');
        return;
      }
      const text = (e.clipboardData || window.clipboardData).getData('text');
      if (text) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + text + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + text.length;
        editor.focus();
        showToast('Pasted from clipboard!', 'success');
        autoDetectLanguage();
        updateAndHighlight();
        addToHistory();
      }
    }

    function copyToClipboard() {
      if (isPreviewMode) {
        showToast('Copying is disabled in preview mode', 'info');
        return;
      }
      if (!editor.value) {
        showToast('Nothing to copy!', 'info');
        return;
      }
      navigator.clipboard.writeText(editor.value)
        .then(() => showToast('Copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy!', 'error'));
    }

    function triggerDownloadAnimation() {
      if (isPreviewMode) {
        showToast('Download is disabled in preview mode', 'info');
        return;
      }
      spinner.style.display = 'inline-block';
      downloadBtn.disabled = true;
      
      setTimeout(() => {
        downloadFile();
        spinner.style.display = 'none';
        downloadBtn.disabled = false;
      }, 10);
    }

    function downloadFile() {
      let originalFilename = fileNameInput.value.trim() || `${currentFile.name}.${currentFile.extension}`;
      let downloadName = originalFilename;
      const selectedExt = fileExtSelect.value;
      let finalExt = currentFile.extension || 'txt';

      if (selectedExt && selectedExt !== 'auto') {
        finalExt = selectedExt;
        const lastDotIndex = originalFilename.lastIndexOf('.');
        const baseName = lastDotIndex > 0 ? originalFilename.substring(0, lastDotIndex) : originalFilename;
        downloadName = `${baseName}.${finalExt}`;
      } else if (!downloadName.includes('.')) {
        downloadName += `.${finalExt}`;
      }

      if (finalExt === 'pdf') {
        generateAndDownloadPDF(downloadName);
        return;
      }

      try {
        const blob = new Blob([editor.value], { type: `text/plain;charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
        showToast(`Downloading "${downloadName}"...`, 'success');
      } catch (error) {
        showToast('Error preparing download!', 'error');
      }
    }

    function generateAndDownloadPDF(pdfName) {
      try {
        const doc = new jsPDF();
        doc.setFont('Helvetica');
        doc.setFontSize(11);
        const text = editor.value;
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        const maxWidth = pageWidth - margin * 2;
        doc.text(text, margin, margin, { maxWidth: maxWidth });
        doc.save(pdfName);
        showToast(`Downloading "${pdfName}"...`, 'success');
      } catch (error) {
        showToast('Failed to generate PDF!', 'error');
      }
    }

    function showToast(message, type = 'info') {
      toastMessage.textContent = message;
      toast.className = 'toast';
      toast.classList.add('show');

      let iconSVG = '';
      switch (type) {
        case 'success':
          toast.classList.add('success');
          iconSVG = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
          break;
        case 'error':
          toast.classList.add('error');
          iconSVG = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>';
          break;
        default:
          iconSVG = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>';
      }
      toastIcon.innerHTML = iconSVG;

      setTimeout(() => { toast.classList.remove('show'); }, 3500);
    }

    // Advanced Auto-Detect Language
    function autoDetectLanguage() {
      const content = editor.value.substring(0, 5000).trim();
      if (!content) return;
      
      let detectedExt = currentFile.extension;
      let confidence = 0;

      // HTML Detection
      if (content.match(/<!DOCTYPE\s+html>/i) || 
          content.match(/<html[\s>]/i) || 
          (content.match(/<head[\s>]/i) && content.match(/<body[\s>]/i))) {
        detectedExt = 'html';
        confidence = 95;
      }
      // Jupyter Notebook
      else if (content.match(/"nbformat"\s*:\s*\d+/) && content.match(/"cells"\s*:\s*\[/)) {
        detectedExt = 'ipynb';
        confidence = 90;
      }
      // AutoHotkey
      else if (content.match(/(^|\n)\s*;.*/m) && content.match(/::|:=|MsgBox|Send/i)) {
        detectedExt = 'ahk';
        confidence = 85;
      }
      // Python
      else if (content.match(/(^|\s)(def|class|import|from)\s+\w+/) && 
               content.match(/:\s*($|\n)/m)) {
        detectedExt = 'py';
        confidence = 90;
      }
      // JavaScript/TypeScript
      else if (content.match(/(const|let|var)\s+\w+\s*=/) || 
               content.match(/function\s+\w*\s*\(/) ||
               content.match(/=>\s*[{\(]/)) {
        if (content.match(/:\s*(string|number|boolean|any|void)\s*[;,=)]/)) {
          detectedExt = 'ts';
          confidence = 80;
        } else if (content.match(/import\s+.*\s+from\s+['"]|export\s+(default\s+)?/)) {
          detectedExt = 'js';
          confidence = 85;
        } else {
          detectedExt = 'js';
          confidence = 75;
        }
      }
      // JSX/TSX
      else if (content.match(/<\w+.*\/>/) || content.match(/<\w+>.*<\/\w+>/s)) {
        if (content.match(/:\s*(string|number|boolean|any)/)) {
          detectedExt = 'tsx';
          confidence = 85;
        } else {
          detectedExt = 'jsx';
          confidence = 80;
        }
      }
      // CSS/SCSS
      else if (content.match(/[.#]\w+\s*\{/) || content.match(/@media|@import/)) {
        if (content.match(/\$\w+\s*:/)) {
          detectedExt = 'scss';
          confidence = 90;
        } else {
          detectedExt = 'css';
          confidence = 85;
        }
      }
      // JSON
      else if ((content.startsWith('{') && content.endsWith('}')) || 
               (content.startsWith('[') && content.endsWith(']'))) {
        try {
          JSON.parse(content);
          detectedExt = 'json';
          confidence = 95;
        } catch (e) {}
      }
      // SQL
      else if (content.match(/SELECT\s+.*\s+FROM/i) || 
               content.match(/CREATE\s+(TABLE|DATABASE)/i) ||
               content.match(/INSERT\s+INTO/i)) {
        detectedExt = 'sql';
        confidence = 90;
      }
      // YAML
      else if (content.match(/^---\s*$/m) || 
               (content.match(/^\w+:\s*\w+/m) && content.match(/^\s+-\s+\w+/m))) {
        detectedExt = 'yaml';
        confidence = 80;
      }
      // Markdown
      else if (content.match(/^#{1,6}\s+\w+/m) || 
               content.match(/\[.*\]\(.*\)/) || 
               content.match(/`{3}\w*\n[\s\S]*?\n`{3}/)) {
        detectedExt = 'md';
        confidence = 85;
      }
      // Java
      else if (content.match(/public\s+(class|interface)\s+\w+/) ||
               content.match(/import\s+java\./)) {
        detectedExt = 'java';
        confidence = 90;
      }
      // C/C++
      else if (content.match(/#include\s*<.*>/) || content.match(/int\s+main\s*\(/)) {
        if (content.match(/std::|cout\s*<</)) {
          detectedExt = 'cpp';
          confidence = 90;
        } else {
          detectedExt = 'c';
          confidence = 85;
        }
      }
      // C#
      else if (content.match(/using\s+System/) || content.match(/namespace\s+\w+/)) {
        detectedExt = 'cs';
        confidence = 90;
      }
      // PHP
      else if (content.match(/<\?php/) || content.match(/\$\w+\s*=/)) {
        detectedExt = 'php';
        confidence = 90;
      }
      // Ruby
      else if (content.match(/def\s+\w+\s*(\(|\n)/) || content.match(/puts\s+/)) {
        detectedExt = 'rb';
        confidence = 85;
      }
      // Go
      else if (content.match(/package\s+\w+/) || content.match(/func\s+\w+\s*\(/)) {
        detectedExt = 'go';
        confidence = 90;
      }
      // Rust
      else if (content.match(/fn\s+\w+\s*\(/) || content.match(/let\s+mut\s+/)) {
        detectedExt = 'rs';
        confidence = 90;
      }
      // Shell
      else if (content.match(/^#!/m) && content.match(/bash|sh\s/)) {
        detectedExt = 'sh';
        confidence = 85;
      }
      // Docker
      else if (content.match(/^FROM\s+\w+/m) || content.match(/^RUN\s+/m)) {
        detectedExt = 'dockerfile';
        confidence = 90;
      }

      if (currentFile.extension !== detectedExt && languageMap[detectedExt] && confidence > 70) {
        currentFile.extension = detectedExt;
        
        const currentNameLower = currentFile.name.toLowerCase();
        if (currentNameLower.startsWith('untitled') || !fileNameInput.value.includes('.')) {
          fileNameInput.value = `${currentFile.name}.${currentFile.extension}`;
        } else {
          const parts = fileNameInput.value.split('.');
          if (parts.length > 1 && languageMap[parts[parts.length - 1].toLowerCase()]) parts.pop();
          fileNameInput.value = parts.join('.') + '.' + currentFile.extension;
        }
        updateUIDisplay();
        showToast(`Auto-detected: ${detectedExt.toUpperCase()} (${confidence}% confidence)`, 'info');
      }
    }

    function handleExtensionChange(e) {
      let selectedExt = fileExtSelect.value;
      if (selectedExt === 'auto') {
        autoDetectLanguage();
        return;
      }
      currentFile.extension = selectedExt;
      currentFile.language = languageMap[selectedExt] || 'text';
      let nameWithExt = fileNameInput.value.trim();
      let lastDotIndex = nameWithExt.lastIndexOf('.');
      let baseName = (lastDotIndex > 0) ? nameWithExt.substring(0, lastDotIndex) : nameWithExt;
      fileNameInput.value = baseName + '.' + selectedExt;
      updateUIDisplay();
    }

    function toggleTheme() {
      const isDark = body.classList.toggle('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeIcon(isDark);
      updateAndHighlight();
    }

    function updateThemeIcon(isDark) {
      themeIconImg.src = isDark 
        ? 'https://cdn-icons-png.flaticon.com/512/869/869869.png' 
        : 'https://cdn-icons-png.flaticon.com/512/740/740878.png';
    }

    function togglePreview() {
      isPreviewMode = !isPreviewMode;
      if (isPreviewMode) {
        renderPreviewContent();
        editorContainer.style.display = 'none';
        previewArea.style.display = 'block';
        previewBtn.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/2926/2926214.png" alt="Code"> Show Code`;
      } else {
        editorContainer.style.display = 'flex';
        previewArea.style.display = 'none';
        previewBtn.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/709/709612.png" alt="Preview"> Preview`;
        editor.focus();
      }
    }

    function renderPreviewContent() {
      if (!isPreviewMode) return;
      const content = editor.value;
      if (currentFile.language === 'html') {
        previewArea.innerHTML = content;
        const scripts = previewArea.querySelectorAll("script");
        scripts.forEach(oldScript => {
          const newScript = document.createElement("script");
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
      } else if (currentFile.language === 'markdown') {
        previewArea.innerHTML = renderSimpleMarkdown(content);
      } else {
        previewArea.innerHTML = '<p style="text-align:center; margin-top:50px; color: #888;">Preview not available for this file type.</p>';
      }
    }

    function renderSimpleMarkdown(mdText) {
      let html = mdText;
      html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
      html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
      html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
      html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
      html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
      html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
      html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
      html = html.replace(/\!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2">');
      html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>');
      html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
      html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');
      html = html.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/gim, '<em>$1</em>');
      html = html.replace(/(?<!_)_(?!_)(.*?)(?<!_)_(?!_)/gim, '<em>$1</em>');
      html = html.replace(/\~\~(.*?)\~\~/gim, '<del>$1</del>');
      html = html.replace(/^\s*[\*\-\+]\s+(.*)/gim, '<ul>\n  <li>$1</li>\n</ul>');
      html = html.replace(/<\/ul>\s*<ul>/gim, '');
      html = html.replace(/^\s*\d+\.\s+(.*)/gim, '<ol>\n  <li>$1</li>\n</ol>');
      html = html.replace(/<\/ol>\s*<ol>/gim, '');
      html = html.replace(/```(\w*)\n([\s\S]*?)\n```/gim, (match, lang, code) => {
        const langClass = lang ? `language-${lang}` : '';
        const escapedCode = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        return `<pre><code class="${langClass}">${escapedCode.trim()}</code></pre>`;
      });
      html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
      html = html.replace(/^\s*(?:---|\*\*\*|___)\s*$/gim, '<hr>');
      html = html.split(/\n\s*\n/).map(p => p.trim() ? `<p>${p.replace(/\n/g, '<br>')}</p>` : '').join('');
      html = html.replace(/<p><(h[1-6]|ul|ol|li|hr|blockquote|pre)/gim, '<$1');
      html = html.replace(/<\/(h[1-6]|ul|ol|li|hr|blockquote|pre)><\/p>/gim, '</$1>');
      return html;
    }

    // Go To Line
    function processGoToLine() {
      const totalLines = editor.value.split('\n').length;
      const targetLine = parseInt(lineNumberInput.value, 10);

      if (isNaN(targetLine) || targetLine < 1 || targetLine > totalLines) {
        showToast(`Invalid line number. Must be between 1 and ${totalLines}.`, 'error');
        lineNumberInput.focus();
        return;
      }

      const lineInfo = getLineStartEnd(editor.value, targetLine);
      if (!lineInfo) return;

      const computedStyle = window.getComputedStyle(editor);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const editorPaddingTop = parseFloat(computedStyle.paddingTop);

      editor.scrollTop = (targetLine - 1) * lineHeight;
      editor.focus();
      editor.setSelectionRange(lineInfo.start, lineInfo.end);

      const lineText = editor.value.substring(lineInfo.start, lineInfo.end);
      linePreview.textContent = lineText.trim() || '(This line is empty)';
      linePreview.style.display = 'block';

      const highlighterDiv = document.createElement('div');
      highlighterDiv.className = 'line-highlighter';
      highlighterDiv.style.top = `${(targetLine - 1) * lineHeight + editorPaddingTop}px`;
      highlighterDiv.style.height = `${lineHeight}px`;
      editorContainer.appendChild(highlighterDiv);
      setTimeout(() => highlighterDiv.remove(), 1000);

      setTimeout(() => goToLineModal.classList.remove('show'), 400);
    }

    function getLineStartEnd(text, lineNumber) {
      const lines = text.split('\n');
      if (lineNumber > lines.length || lineNumber < 1) return null;
      let start = 0;
      for (let i = 0; i < lineNumber - 1; i++) {
        start += lines[i].length + 1;
      }
      const end = start + lines[lineNumber - 1].length;
      return { start, end };
    }

    // History (Undo/Redo)
    function addToHistory() {
      const state = {
        content: editor.value,
        selectionStart: editor.selectionStart,
        selectionEnd: editor.selectionEnd
      };
      if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
      }
      history.push(state);
      if (history.length > MAX_HISTORY) history.shift();
      else historyIndex++;
      updateUndoRedoButtons();
    }

    function performUndo() {
      if (historyIndex > 0) {
        historyIndex--;
        const state = history[historyIndex];
        editor.value = state.content;
        editor.setSelectionRange(state.selectionStart, state.selectionEnd);
        updateAndHighlight();
        updateUndoRedoButtons();
        showToast('Undo', 'info');
      }
    }

    function performRedo() {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        const state = history[historyIndex];
        editor.value = state.content;
        editor.setSelectionRange(state.selectionStart, state.selectionEnd);
        updateAndHighlight();
        updateUndoRedoButtons();
        showToast('Redo', 'info');
      }
    }

    function updateUndoRedoButtons() {
      undoBtn.style.opacity = historyIndex <= 0 ? '0.5' : '1';
      redoBtn.style.opacity = historyIndex >= history.length - 1 ? '0.5' : '1';
    }

    // Line Operations
    function duplicateLine() {
      addToHistory();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const value = editor.value;

      if (start === end) {
        const lines = value.split('\n');
        let charCount = 0;
        let lineIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (charCount + lines[i].length >= start) {
            lineIndex = i;
            break;
          }
          charCount += lines[i].length + 1;
        }
        const lineToDuplicate = lines[lineIndex];
        lines.splice(lineIndex + 1, 0, lineToDuplicate);
        editor.value = lines.join('\n');
        editor.setSelectionRange(start, end);
      } else {
        const selectedText = value.substring(start, end);
        editor.value = value.substring(0, end) + selectedText + value.substring(end);
        editor.setSelectionRange(end, end + selectedText.length);
      }
      updateAndHighlight();
      showToast('Duplicated', 'success');
    }

    function deleteLine() {
      addToHistory();
      const start = editor.selectionStart;
      const value = editor.value;
      const lines = value.split('\n');
      let charCount = 0;
      let lineIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= start) {
          lineIndex = i;
          break;
        }
        charCount += lines[i].length + 1;
      }
      lines.splice(lineIndex, 1);
      editor.value = lines.join('\n');
      editor.setSelectionRange(Math.min(start, editor.value.length), Math.min(start, editor.value.length));
      updateAndHighlight();
      showToast('Line deleted', 'info');
    }

    function trimSpaces() {
      addToHistory();
      const lines = editor.value.split('\n');
      const trimmedLines = lines.map(line => line.trimEnd());
      while (trimmedLines.length > 0 && trimmedLines[trimmedLines.length - 1].trim() === '') trimmedLines.pop();
      editor.value = trimmedLines.join('\n');
      updateAndHighlight();
      showToast('Extra spaces trimmed', 'success');
    }

    function sortLines() {
      addToHistory();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      if (start === end) {
        const lines = editor.value.split('\n');
        lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        editor.value = lines.join('\n');
      } else {
        const beforeSelection = editor.value.substring(0, start);
        const selection = editor.value.substring(start, end);
        const afterSelection = editor.value.substring(end);
        const lines = selection.split('\n');
        lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        const sorted = lines.join('\n');
        editor.value = beforeSelection + sorted + afterSelection;
        editor.setSelectionRange(start, start + sorted.length);
      }
      updateAndHighlight();
      showToast('Lines sorted', 'success');
    }

    function insertTimestamp() {
      const timestamp = new Date().toLocaleString();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + timestamp + editor.value.substring(end);
      editor.setSelectionRange(start + timestamp.length, start + timestamp.length);
      editor.focus();
      updateAndHighlight();
      showToast('Timestamp inserted', 'success');
    }

    function toggleLineNumbers() {
      editorContainer.classList.toggle('line-numbers-enabled');
      showToast(editorContainer.classList.contains('line-numbers-enabled') ? 'Line numbers ON' : 'Line numbers OFF', 'info');
    }

    function toggleComments() {
      addToHistory();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const lines = editor.value.split('\n');

      let charCount = 0;
      let startLine = 0, endLine = 0;
      for (let i = 0; i < lines.length; i++) {
        if (charCount <= start && charCount + lines[i].length >= start) startLine = i;
        if (charCount <= end && charCount + lines[i].length >= end) { endLine = i; break; }
        charCount += lines[i].length + 1;
      }

      const commentChar = ['py', 'sh', 'yaml', 'yml', 'rb'].includes(currentFile.extension) ? '#' : '//';
      const allCommented = lines.slice(startLine, endLine + 1).every(line => line.trim().startsWith(commentChar));

      for (let i = startLine; i <= endLine; i++) {
        if (allCommented) {
          lines[i] = lines[i].replace(new RegExp(`^\\s*${commentChar}\\s?`), '');
        } else {
          lines[i] = commentChar + ' ' + lines[i];
        }
      }

      editor.value = lines.join('\n');
      updateAndHighlight();
      showToast(allCommented ? 'Uncommented' : 'Commented', 'success');
    }

    function indentLines() {
      addToHistory();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const lines = editor.value.split('\n');
      let charCount = 0;

      for (let i = 0; i < lines.length; i++) {
        const lineStart = charCount;
        const lineEnd = charCount + lines[i].length;
        if (lineEnd >= start && lineStart <= end) lines[i] = '    ' + lines[i];
        charCount += lines[i].length + 1;
      }

      editor.value = lines.join('\n');
      updateAndHighlight();
      showToast('Indented', 'success');
    }

    function outdentLines() {
      addToHistory();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const lines = editor.value.split('\n');
      let charCount = 0;

      for (let i = 0; i < lines.length; i++) {
        const lineStart = charCount;
        const lineEnd = charCount + lines[i].length;
        if (lineEnd >= start && lineStart <= end) lines[i] = lines[i].replace(/^    /, '');
        charCount += lines[i].length + 1;
      }

      editor.value = lines.join('\n');
      updateAndHighlight();
      showToast('Outdented', 'success');
    }

    // Capture changes for undo/redo
    let lastContent = editor.value;
    editor.addEventListener('input', () => {
      if (editor.value !== lastContent) {
        addToHistory();
        lastContent = editor.value;
      }
    });