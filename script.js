/* === JS Block 1 === */
const { jsPDF } = window.jspdf;
    const MAX_UNTITLED_FILES = 1000;

    // DOM Elements
    const body = document.body;
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectBtn = document.getElementById('selectBtn');
    const mergeFilesCheckbox = document.getElementById('mergeFilesCheckbox');
    const editor = document.getElementById('editor');
    const editorContainer = document.getElementById('editor-container');
    const highlightingArea = document.getElementById('highlighting-area');
    const highlightingCode = document.getElementById('highlighting-code');
    const previewArea = document.getElementById('previewArea');
    const previewFrame = document.getElementById('previewFrame');
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
    const fileIconImg = document.getElementById('fileIconImg');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIconImg = document.getElementById('themeIconImg');
    const goToLineBtn = document.getElementById('goToLineBtn');
    const lineCountLabel = document.getElementById('lineCountLabel');
    const goToLineModal = document.getElementById('goToLineModal');
    const closeGoToLineModal = document.getElementById('closeGoToLineModal');
    const lineNumberInput = document.getElementById('lineNumberInput');
    const submitGoToLineBtn = document.getElementById('submitGoToLineBtn');
    const suggestNameBtn = document.getElementById('suggestNameBtn');
    const suggestionPopup = document.getElementById('suggestionPopup');
    const closeSuggestionPopup = document.getElementById('closeSuggestionPopup');
    const suggestionList = document.getElementById('suggestionList');
    const popupOverlay = document.getElementById('popupOverlay');
    const historyBtn = document.getElementById('historyBtn');
    const historyPopup = document.getElementById('historyPopup');
    const closeHistoryPopup = document.getElementById('closeHistoryPopup');
    const historyGrid = document.getElementById('historyGrid');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
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
    const printBtn = document.getElementById('printBtn');
    const duplicateLineBtn = document.getElementById('duplicateLineBtn');
    const deleteLineBtn = document.getElementById('deleteLineBtn');
    const toggleLineNumbersBtn = document.getElementById('toggleLineNumbersBtn');

    const statsBtn = document.getElementById('statsBtn');

    // Modals
    const statsModal = document.getElementById('statsModal');
    const closeStatsModal = document.getElementById('closeStatsModal');

    let untitledCounter = 1;
    let isPreviewMode = false;
    let history = [];
    let historyIndex = -1;
    const MAX_HISTORY = 100;
    let downloadHistory = JSON.parse(localStorage.getItem('downloadHistory') || '[]');

    // Current file state
    let currentFile = {
      name: `Untitled-${untitledCounter}`,
      extension: 'txt',
      language: 'text',
      loadedFromDisk: false
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

    // Icon Images - Better quality PNG icons from Flaticon
    const iconImages = {
      py: 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png',
      js: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png',
      ts: 'https://cdn-icons-png.flaticon.com/512/5968/5968381.png',
      java: 'https://cdn-icons-png.flaticon.com/512/5968/5968282.png',
      cpp: 'https://cdn-icons-png.flaticon.com/512/6132/6132222.png',
      c: 'https://cdn-icons-png.flaticon.com/512/6132/6132221.png',
      cs: 'https://cdn-icons-png.flaticon.com/512/6132/6132223.png',
      go: 'https://cdn-icons-png.flaticon.com/512/919/919836.png',
      rb: 'https://cdn-icons-png.flaticon.com/512/919/919842.png',
      php: 'https://cdn-icons-png.flaticon.com/512/5968/5968334.png',
      swift: 'https://cdn-icons-png.flaticon.com/512/5968/5968371.png',
      kt: 'https://cdn-icons-png.flaticon.com/512/5968/5968282.png',
      rs: 'https://cdn-icons-png.flaticon.com/512/5968/5968319.png',
      scala: 'https://cdn-icons-png.flaticon.com/512/5968/5968349.png',
      r: 'https://cdn-icons-png.flaticon.com/512/5968/5968371.png',
      dart: 'https://cdn-icons-png.flaticon.com/512/5968/5968371.png',
      lua: 'https://cdn-icons-png.flaticon.com/512/5968/5968371.png',
      html: 'https://cdn-icons-png.flaticon.com/512/5968/5968267.png',
      css: 'https://cdn-icons-png.flaticon.com/512/5968/5968242.png',
      scss: 'https://cdn-icons-png.flaticon.com/512/5968/5968358.png',
      jsx: 'https://cdn-icons-png.flaticon.com/512/1126/1126012.png',
      tsx: 'https://cdn-icons-png.flaticon.com/512/1126/1126012.png',
      json: 'https://cdn-icons-png.flaticon.com/512/136/136443.png',
      xml: 'https://cdn-icons-png.flaticon.com/512/2306/2306046.png',
      yaml: 'https://cdn-icons-png.flaticon.com/512/2306/2306046.png',
      csv: 'https://cdn-icons-png.flaticon.com/512/2306/2306050.png',
      sql: 'https://cdn-icons-png.flaticon.com/512/2306/2306072.png',
      sh: 'https://cdn-icons-png.flaticon.com/512/2306/2306080.png',
      ahk: 'https://iili.io/q9a6K8X.png',
      md: 'https://cdn-icons-png.flaticon.com/512/2306/2306102.png',
      txt: 'https://iili.io/q9a6Fat.png',
      pdf: 'https://cdn-icons-png.flaticon.com/512/179/179483.png',
      ipynb: 'https://cdn-icons-png.flaticon.com/512/5195/5195562.png',
      log: 'https://cdn-icons-png.flaticon.com/512/2306/2306112.png',
      ini: 'https://cdn-icons-png.flaticon.com/512/2306/2306122.png',
      conf: 'https://cdn-icons-png.flaticon.com/512/2306/2306122.png',
      dockerfile: 'https://cdn-icons-png.flaticon.com/512/919/919853.png',
      yml: 'https://cdn-icons-png.flaticon.com/512/2306/2306046.png',
      toml: 'https://cdn-icons-png.flaticon.com/512/2306/2306046.png',
      ps1: 'https://cdn-icons-png.flaticon.com/512/2306/2306080.png',
      bat: 'https://cdn-icons-png.flaticon.com/512/2306/2306080.png'
    };

    // Smart Filename Suggestions - 7 names per extension
    const filenameSuggestions = {
      html: ['index.html', 'main.html', 'home.html', 'about.html', 'contact.html', 'style.html', 'script.html'],
      css: ['style.css', 'main.css', 'app.css', 'custom.css', 'theme.css', 'layout.css', 'design.css'],
      js: ['script.js', 'main.js', 'app.js', 'index.js', 'utils.js', 'helpers.js', 'config.js'],
      py: ['main.py', 'app.py', 'script.py', 'utils.py', 'helpers.py', 'config.py', 'server.py'],
      json: ['package.json', 'config.json', 'data.json', 'settings.json', 'manifest.json', 'tsconfig.json', '.eslintrc.json'],
      md: ['README.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE.md', 'TODO.md', 'INSTALL.md', 'GUIDE.md'],
      txt: ['notes.txt', 'readme.txt', 'log.txt', 'data.txt', 'output.txt', 'input.txt', 'backup.txt'],
      java: ['Main.java', 'App.java', 'Utils.java', 'Helper.java', 'Config.java', 'Server.java', 'Client.java'],
      cpp: ['main.cpp', 'app.cpp', 'utils.cpp', 'helper.cpp', 'config.cpp', 'server.cpp', 'client.cpp'],
      c: ['main.c', 'app.c', 'utils.c', 'helper.c', 'config.c', 'server.c', 'client.c'],
      cs: ['Program.cs', 'Main.cs', 'App.cs', 'Utils.cs', 'Config.cs', 'Server.cs', 'Client.cs'],
      php: ['index.php', 'config.php', 'utils.php', 'functions.php', 'api.php', 'server.php', 'client.php'],
      rb: ['main.rb', 'app.rb', 'Gemfile', 'Rakefile', 'config.ru', 'server.rb', 'client.rb'],
      go: ['main.go', 'app.go', 'utils.go', 'helper.go', 'server.go', 'client.go', 'config.go'],
      ts: ['main.ts', 'app.ts', 'index.ts', 'utils.ts', 'types.ts', 'config.ts', 'server.ts'],
      jsx: ['App.jsx', 'index.jsx', 'Main.jsx', 'Component.jsx', 'Layout.jsx', 'Header.jsx', 'Footer.jsx'],
      tsx: ['App.tsx', 'index.tsx', 'Main.tsx', 'Component.tsx', 'Layout.tsx', 'Header.tsx', 'Footer.tsx'],
      sql: ['schema.sql', 'data.sql', 'queries.sql', 'init.sql', 'migration.sql', 'seed.sql', 'backup.sql'],
      xml: ['config.xml', 'data.xml', 'manifest.xml', 'settings.xml', 'layout.xml', 'strings.xml', 'pom.xml'],
      yaml: ['docker-compose.yml', 'config.yml', 'ci.yml', 'kubernetes.yml', 'ansible.yml', 'travis.yml', 'appveyor.yml'],
      yml: ['docker-compose.yml', 'config.yml', 'ci.yml', 'kubernetes.yml', 'ansible.yml', 'travis.yml', 'appveyor.yml'],
      sh: ['script.sh', 'deploy.sh', 'build.sh', 'setup.sh', 'run.sh', 'install.sh', 'backup.sh'],
      bat: ['script.bat', 'build.bat', 'run.bat', 'setup.bat', 'install.bat', 'backup.bat', 'deploy.bat'],
      ps1: ['script.ps1', 'deploy.ps1', 'build.ps1', 'setup.ps1', 'run.ps1', 'install.ps1', 'backup.ps1'],
      dockerfile: ['Dockerfile', 'Dockerfile.prod', 'Dockerfile.dev', 'Dockerfile.test', 'Dockerfile.build', 'Dockerfile.alpine', 'Dockerfile.ubuntu'],
      ahk: ['script.ahk', 'hotkeys.ahk', 'macros.ahk', 'automation.ahk', 'shortcuts.ahk', 'launcher.ahk', 'tools.ahk']
    };



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
    });
    closeGoToLineModal.addEventListener('click', () => goToLineModal.classList.remove('show'));
    goToLineModal.addEventListener('click', (e) => { if (e.target === goToLineModal) goToLineModal.classList.remove('show'); });
    submitGoToLineBtn.addEventListener('click', processGoToLine);
    lineNumberInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); processGoToLine(); } });

    // Tool buttons
    undoBtn.addEventListener('click', performUndo);
    redoBtn.addEventListener('click', performRedo);
    printBtn.addEventListener('click', printEditorContent);
    duplicateLineBtn.addEventListener('click', duplicateLine);
    deleteLineBtn.addEventListener('click', deleteLine);
    toggleLineNumbersBtn.addEventListener('click', toggleLineNumbers);

    statsBtn.addEventListener('click', showStatsModal);
    lineCountBadge.addEventListener('click', showStatsModal);

    // Stats Modal
    closeStatsModal.addEventListener('click', () => statsModal.classList.remove('show'));
    statsModal.addEventListener('click', (e) => { if (e.target === statsModal) statsModal.classList.remove('show'); });

    // Filename suggestions popup
    suggestNameBtn.addEventListener('click', showFilenameSuggestions);
    closeSuggestionPopup.addEventListener('click', hideSuggestionPopup);
    popupOverlay.addEventListener('click', hideAllPopups);

    // History popup
    historyBtn.addEventListener('click', showHistoryPopup);
    closeHistoryPopup.addEventListener('click', hideHistoryPopup);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Mobile menu
    mobileMenuBtn.addEventListener('click', showMobileMenu);
    closeMobileMenu.addEventListener('click', () => mobileMenuOverlay.classList.remove('show'));
    mobileMenuOverlay.addEventListener('click', (e) => { if (e.target === mobileMenuOverlay) mobileMenuOverlay.classList.remove('show'); });

    // Filename input
    fileNameInput.addEventListener('input', updateFileInfoFromInput);
    fileNameInput.addEventListener('blur', () => {
      if (!fileNameInput.value.trim()) setUniqueUntitledName();
    });

    editor.addEventListener('paste', handlePasteEvent);
    editor.addEventListener('input', () => {
      autoDetectLanguage();
      updateAndHighlight();
      if (isPreviewMode) renderPreviewContent();
    });
    editor.addEventListener('scroll', syncScroll);
    fileExtSelect.addEventListener('change', handleExtensionChange);

    // Visibility change - auto select all text
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && editor) {
        setTimeout(() => {
          editor.select();
        }, 100);
      }
    });

    // Window focus - auto select all text
    window.addEventListener('focus', () => {
      setTimeout(() => {
        if (editor && document.activeElement !== editor) {
          editor.select();
        }
      }, 100);
    });

    // Keyboard shortcuts - only when not in editor or filename input
    document.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts when typing in editor or filename input
      if (document.activeElement === editor || document.activeElement === fileNameInput) {
        // BUT still allow Tab key for download from anywhere
        if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
          e.preventDefault();
          downloadBtn.click();
          return;
        }

        // Allow Ctrl+H even when in editor or filename (to focus filename)
        if (e.ctrlKey && e.key.toLowerCase() === 'h') {
          e.preventDefault();
          fileNameInput.focus();
          fileNameInput.select();
        }

        // Allow Ctrl+I even in editor (Print/PDF settings)
        if (e.ctrlKey && e.key.toLowerCase() === 'i') {
          e.preventDefault();
          printEditorContent();
        }
        return;
      }

      // Tab key - download file (works everywhere except when typing)
      if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        downloadBtn.click();
        return;
      }

      // F key - fullscreen
      if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // P key - preview mode
      if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        togglePreview();
        return;
      }

      // H key or Ctrl+H - jump to filename
      if (e.key.toLowerCase() === 'h' || (e.ctrlKey && e.key.toLowerCase() === 'h')) {
        e.preventDefault();
        fileNameInput.focus();
        fileNameInput.select();
        return;
      }

      // Ctrl+I - open Print/PDF settings
      if (e.ctrlKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        printEditorContent();
        return;
      }

      // Shift+? - open Keyboard Shortcut Guide
      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        toggleKbdGuide();
        return;
      }
    });

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      setUniqueUntitledName();
      const savedTheme = localStorage.getItem('theme') || 'light';
      if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
      }
      updateAndHighlight();
      initMobileMenu();
      addToHistory();
    });

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          showToast(`Error attempting to enable fullscreen: ${err.message}`, 'error');
        });
      } else {
        document.exitFullscreen();
      }
    }

    function showFilenameSuggestions() {
      const ext = currentFile.extension;
      const suggestions = filenameSuggestions[ext] || filenameSuggestions['txt'];

      suggestionList.innerHTML = '';
      suggestions.forEach(name => {
        const item = document.createElement('div');
        item.className = 'suggestion-item-popup';
        const iconUrl = iconImages[ext] || iconImages['txt'];
        item.innerHTML = `<img src="${iconUrl}" alt="${ext}"><span>${name}</span>`;
        item.addEventListener('click', () => {
          fileNameInput.value = name;
          updateFileInfoFromInput({ target: { value: name } });
          hideSuggestionPopup();
          showToast(`Filename set to: ${name}`, 'success');
        });
        suggestionList.appendChild(item);
      });

      popupOverlay.classList.add('show');
      suggestionPopup.classList.add('show');
    }

    function hideSuggestionPopup() {
      popupOverlay.classList.remove('show');
      suggestionPopup.classList.remove('show');
    }

    function showHistoryPopup() {
      updateHistoryGrid();
      popupOverlay.classList.add('show');
      historyPopup.classList.add('show');
    }

    function hideHistoryPopup() {
      popupOverlay.classList.remove('show');
      historyPopup.classList.remove('show');
    }

    function hideAllPopups() {
      hideSuggestionPopup();
      hideHistoryPopup();
    }

    function formatHistoryDate(isoStr) {
      const d = new Date(isoStr);
      const now = new Date();
      const diff = now - d;
      const mins = Math.floor(diff / 60000);
      const hrs = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins} min ago`;
      if (hrs < 24) return `${hrs}h ago`;
      if (days < 7) return `${days}d ago`;
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function updateHistoryGrid() {
      historyGrid.innerHTML = '';

      if (downloadHistory.length === 0) {
        historyGrid.innerHTML = '<div class="empty-history">📭 No download history yet</div>';
        return;
      }

      downloadHistory.slice().reverse().forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.style.animationDelay = `${index * 0.06}s`;
        const ext = item.filename.split('.').pop();
        const iconUrl = iconImages[ext] || iconImages['txt'];
        const dateStr = item.timestamp ? formatHistoryDate(item.timestamp) : '';

        historyItem.innerHTML = `
          <img src="${iconUrl}" alt="${ext}">
          <div class="filename">${item.filename}</div>
          ${dateStr ? `<div class="history-date">📅 ${dateStr}</div>` : ''}
          <div class="download-overlay">
            <img src="https://cdn-icons-png.flaticon.com/512/2926/2926214.png" alt="Download">
          </div>
        `;

        historyItem.addEventListener('click', () => {
          downloadFromHistory(item);
        });

        historyGrid.appendChild(historyItem);
      });
    }

    function downloadFromHistory(item) {
      const blob = new Blob([item.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
      showToast(`Re-downloaded "${item.filename}"`, 'success');
    }

    function clearHistory() {
      downloadHistory = [];
      localStorage.removeItem('downloadHistory');
      updateHistoryGrid();
      showToast('History cleared', 'info');
    }

    function addToDownloadHistory(filename, content) {
      const existingIndex = downloadHistory.findIndex(item => item.filename === filename);
      if (existingIndex !== -1) {
        downloadHistory.splice(existingIndex, 1);
      }

      downloadHistory.push({
        filename: filename,
        content: content,
        timestamp: new Date().toISOString()
      });

      // Keep only last 50 items
      if (downloadHistory.length > 50) {
        downloadHistory = downloadHistory.slice(-50);
      }

      localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
    }



    function initMobileMenu() {
      const tools = [
        { id: 'undoBtn', name: 'Undo', icon: 'https://cdn-icons-png.flaticon.com/512/318/318275.png', action: performUndo },
        { id: 'redoBtn', name: 'Redo', icon: 'https://cdn-icons-png.flaticon.com/512/318/318276.png', action: performRedo },
        { id: 'printBtn', name: 'Print Code', icon: 'https://cdn-icons-png.flaticon.com/512/2358/2358854.png', action: printEditorContent },
        { id: 'duplicateLineBtn', name: 'Duplicate Line', icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png', action: duplicateLine },
        { id: 'deleteLineBtn', name: 'Delete Line', icon: 'https://cdn-icons-png.flaticon.com/512/3096/3096673.png', action: deleteLine },
        { id: 'toggleLineNumbersBtn', name: 'Toggle Line Numbers', icon: 'https://cdn-icons-png.flaticon.com/512/2232/2232501.png', action: toggleLineNumbers },

        { id: 'themeToggleBtn', name: 'Toggle Theme', icon: 'https://cdn-icons-png.flaticon.com/512/740/740878.png', action: toggleTheme },
        { id: 'goToLineBtn', name: 'Go to Line', icon: 'https://cdn-icons-png.flaticon.com/512/2928/2928981.png', action: () => { goToLineModal.classList.add('show'); lineNumberInput.focus(); } },
        { id: 'previewBtn', name: 'Toggle Preview', icon: 'https://cdn-icons-png.flaticon.com/512/709/709612.png', action: togglePreview },
        { id: 'copyBtn', name: 'Copy to Clipboard', icon: 'https://cdn-icons-png.flaticon.com/512/1621/1621635.png', action: copyToClipboard },
        { id: 'statsBtn', name: 'Statistics', icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920276.png', action: showStatsModal },
        { id: 'settingsBtn', name: 'Settings', icon: 'https://cdn-icons-png.flaticon.com/512/3524/3524659.png', action: () => settingsOverlay.classList.add('show') }
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

      const readingTime = Math.ceil(wordCount / 200);
      document.getElementById('readingTime').textContent = readingTime <= 1 ? '< 1 min' : `${readingTime} min`;

      const speakingTime = Math.ceil(wordCount / 130);
      document.getElementById('speakingTime').textContent = speakingTime <= 1 ? '< 1 min' : `${speakingTime} min`;

      statsModal.classList.add('show');
    }



    function updateAndHighlight() {
      const code = editor.value;
      highlightingCode.textContent = code;
      highlightingCode.className = '';

      // Skip colorful syntax highlighting for plain text files
      if (currentFile.extension === 'txt' || currentFile.extension === 'log') {
        highlightingCode.classList.add('language-plaintext');
        // Don't apply syntax highlighting for .txt and .log files
      } else {
        const lang = languageMap[currentFile.extension] || 'plaintext';
        highlightingCode.classList.add(`language-${lang}`);
        hljs.highlightElement(highlightingCode);
      }

      updateLineCount();
      updateLineNumbers();
      syncScroll();
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

    function handleFileSelect(e) {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const mergeFiles = mergeFilesCheckbox.checked;

      if (mergeFiles && files.length > 1) {
        mergeAndLoadFiles(files);
      } else {
        handleFile(files[0]);
      }
      fileInput.value = null;
    }

    function handleFileDrop(e) {
      e.preventDefault();
      dropZone.classList.remove('active');
      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      const mergeFiles = mergeFilesCheckbox.checked;

      if (mergeFiles && files.length > 1) {
        mergeAndLoadFiles(files);
      } else {
        handleFile(files[0]);
      }
    }

    async function mergeAndLoadFiles(files) {
      let mergedContent = '';
      const fileNames = [];

      for (const file of files) {
        try {
          const content = await readFileAsText(file);
          mergedContent += `\n/* ===== ${file.name} ===== */\n\n${content}\n\n`;
          fileNames.push(file.name);
        } catch (err) {
          showToast(`Error reading ${file.name}`, 'error');
        }
      }

      editor.value = mergedContent.trim();
      currentFile.name = 'merged';
      currentFile.extension = 'txt';
      fileNameInput.value = 'merged.txt';

      if (isPreviewMode) renderPreviewContent();
      showToast(`Merged ${files.length} files successfully!`, 'success');
      autoDetectLanguage();
      updateAndHighlight();
      addToHistory();
    }

    function readFileAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
    }

    function handleFile(file) {
      const reader = new FileReader();
      const nameParts = file.name.lastIndexOf('.') > 0 ? file.name.split('.') : [file.name, ''];
      const ext = nameParts.pop().toLowerCase();
      const name = nameParts.join('.');

      currentFile.name = name || 'Untitled';
      currentFile.extension = ext || 'txt';
      currentFile.loadedFromDisk = true;
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
      currentFile.loadedFromDisk = false;
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
      } else {
        fileIconImg.src = iconImages['txt'];
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

    let downloadCooldown = false;
    function triggerDownloadAnimation() {
      if (isPreviewMode) {
        showToast('Download is disabled in preview mode', 'info');
        return;
      }
      if (downloadCooldown) {
        showToast('Please wait 10 seconds before downloading again', 'info');
        return;
      }
      downloadCooldown = true;
      spinner.style.display = 'inline-block';
      downloadBtn.disabled = true;

      setTimeout(async () => {
        await downloadFile();
        spinner.style.display = 'none';
        // Keep button disabled for 10 second cooldown
        setTimeout(() => {
          downloadBtn.disabled = false;
          downloadCooldown = false;
        }, 10000);
      }, 10);
    }

    async function downloadFile() {
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
        await generateAndDownloadPDF(downloadName);
        return;
      }

      try {
        const content = editor.value;
        const blob = new Blob([content], { type: `text/plain;charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);

        // Add to history
        addToDownloadHistory(downloadName, content);

        showToast(`Downloading "${downloadName}"...`, 'success');
      } catch (error) {
        showToast('Error preparing download!', 'error');
      }
    }

    // ===== PRINT SETTINGS MODAL =====
    const printModalOverlay = document.getElementById('printModalOverlay');
    const closePrintModalBtn = document.getElementById('closePrintModal');
    const printGoBtn = document.getElementById('printGoBtn');
    const printSavePdfBtn = document.getElementById('printSavePdfBtn');
    const printResetBtn = document.getElementById('printResetBtn');
    const printFontSizeSlider = document.getElementById('printFontSize');
    const printFontSizeVal = document.getElementById('printFontSizeVal');
    const printLineSpacingSlider = document.getElementById('printLineSpacing');
    const printLineSpacingVal = document.getElementById('printLineSpacingVal');
    const pmPreviewContent = document.getElementById('pmPreviewContent');
    const pmPreviewTitle = document.getElementById('pmPreviewTitle');
    const pmPreviewDate = document.getElementById('pmPreviewDate');
    const pmPreviewHeaderBar = document.getElementById('pmPreviewHeaderBar');

    function printEditorContent() {
      const text = editor.value;
      if (!text.trim()) {
        showToast('Editor खाली है! कुछ लिखें पहले।', 'error');
        return;
      }
      // Update right-column preview with editor content
      const fileName = fileNameInput.value.trim() || `${currentFile.name}.${currentFile.extension}`;
      if (pmPreviewTitle) pmPreviewTitle.textContent = fileName;
      if (pmPreviewDate) pmPreviewDate.textContent = new Date().toLocaleDateString('hi-IN');
      if (pmPreviewContent) pmPreviewContent.textContent = text.substring(0, 500) + (text.length > 500 ? '...' : '');
      updatePrintPreview();
      printModalOverlay.classList.add('show');
    }

    // Close modal
    closePrintModalBtn.addEventListener('click', () => printModalOverlay.classList.remove('show'));
    printModalOverlay.addEventListener('click', (e) => { if (e.target === printModalOverlay) printModalOverlay.classList.remove('show'); });

    // Slider updates
    printFontSizeSlider.addEventListener('input', () => {
      printFontSizeVal.textContent = printFontSizeSlider.value + 'px';
      updatePrintPreview();
    });
    printLineSpacingSlider.addEventListener('input', () => {
      printLineSpacingVal.textContent = (printLineSpacingSlider.value / 10).toFixed(1);
      updatePrintPreview();
    });

    // All settings update preview — listen to EVERYTHING
    const allPrintSettingIds = [
      'printFontFamily', 'printTextColor', 'printBgColor', 'printAlignment',
      'printWordWrap', 'printLineNumbers', 'printShowHeader', 'printPageBorder',
      'printPaperSize', 'printMargins', 'printOrientation', 'printPageFit',
      'printBoldText', 'printTextTransform', 'printWatermark', 'printCustomTitle'
    ];
    allPrintSettingIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', updatePrintPreview);
        el.addEventListener('input', updatePrintPreview);
        // Checkboxes need click event for immediate toggle response
        if (el.type === 'checkbox') {
          el.addEventListener('click', () => setTimeout(updatePrintPreview, 10));
        }
      }
    });

    function updatePrintPreview() {
      const fontFamily = document.getElementById('printFontFamily').value;
      const fontSize = printFontSizeSlider.value + 'px';
      const color = document.getElementById('printTextColor').value;
      const bg = document.getElementById('printBgColor').value;
      const lineHeight = (printLineSpacingSlider.value / 10).toFixed(1);
      const align = document.getElementById('printAlignment').value;
      const wrap = document.getElementById('printWordWrap').checked;
      const bold = document.getElementById('printBoldText').checked;
      const textTransform = document.getElementById('printTextTransform').value;
      const showHeader = document.getElementById('printShowHeader').checked;
      const showLineNumbers = document.getElementById('printLineNumbers').checked;
      const pageBorder = document.getElementById('printPageBorder').checked;
      const orientation = document.getElementById('printOrientation').value;
      const margins = document.getElementById('printMargins').value;
      const pageFit = document.getElementById('printPageFit').value;
      const watermark = document.getElementById('printWatermark').value.trim();
      const customTitle = document.getElementById('printCustomTitle').value.trim();

      // Update right-column preview doc content
      if (pmPreviewContent) {
        pmPreviewContent.style.fontFamily = fontFamily;
        pmPreviewContent.style.fontSize = fontSize;
        pmPreviewContent.style.color = color;
        pmPreviewContent.style.lineHeight = lineHeight;
        pmPreviewContent.style.textAlign = align;
        pmPreviewContent.style.whiteSpace = wrap ? 'pre-wrap' : 'pre';
        pmPreviewContent.style.fontWeight = bold ? 'bold' : 'normal';
        pmPreviewContent.style.textTransform = textTransform;

        // Margins as padding on preview content
        const marginScale = Math.round(parseInt(margins) * 0.8);
        pmPreviewContent.style.padding = marginScale + 'px';

        // Page fitting - scale text
        if (pageFit === 'compact') {
          pmPreviewContent.style.fontSize = '10px';
          pmPreviewContent.style.lineHeight = '1.3';
        } else if (pageFit === 'fit1') {
          pmPreviewContent.style.fontSize = '11px';
          pmPreviewContent.style.lineHeight = '1.4';
        } else if (pageFit === 'fit2') {
          pmPreviewContent.style.fontSize = '12px';
          pmPreviewContent.style.lineHeight = '1.5';
        }

        // Line numbers in preview
        const text = editor.value || 'यह एक प्रीव्यू है।\nThis is a live preview.\nEdit settings to see changes.';
        const previewText = text.substring(0, 500) + (text.length > 500 ? '...' : '');
        if (showLineNumbers) {
          const lines = previewText.split('\n');
          pmPreviewContent.innerHTML = lines.map((line, i) =>
            `<div style="display:flex;gap:10px;"><span style="color:#999;min-width:28px;text-align:right;user-select:none;flex-shrink:0;font-size:0.8em;opacity:0.6;">${i + 1}</span><span>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;') || '&nbsp;'}</span></div>`
          ).join('');
        } else {
          pmPreviewContent.textContent = previewText;
        }
      }

      // Update doc background
      const previewDoc = document.getElementById('pmPreviewDoc');
      if (previewDoc) {
        previewDoc.style.background = bg;
        // Page border
        previewDoc.style.border = pageBorder ? '2px solid #333' : 'none';
        previewDoc.style.boxShadow = pageBorder
          ? '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(0,0,0,0.1)'
          : '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)';
        // Orientation
        if (orientation === 'landscape') {
          previewDoc.classList.add('pm-landscape');
        } else {
          previewDoc.classList.remove('pm-landscape');
        }
      }

      // Header show/hide
      if (pmPreviewHeaderBar) {
        pmPreviewHeaderBar.style.display = showHeader ? 'flex' : 'none';
      }

      // Custom title
      if (pmPreviewTitle && customTitle) {
        pmPreviewTitle.textContent = customTitle;
      } else if (pmPreviewTitle) {
        const fileName = fileNameInput.value.trim() || `${currentFile.name}.${currentFile.extension}`;
        pmPreviewTitle.textContent = fileName;
      }

      // Watermark overlay
      const wmOverlay = document.getElementById('pmWatermarkOverlay');
      if (wmOverlay) {
        if (watermark) {
          wmOverlay.textContent = watermark;
          wmOverlay.classList.add('pm-visible');
        } else {
          wmOverlay.textContent = '';
          wmOverlay.classList.remove('pm-visible');
        }
      }
    }

    // Reset button
    printResetBtn.addEventListener('click', () => {
      document.getElementById('printFontFamily').value = "'Noto Sans Devanagari', sans-serif";
      printFontSizeSlider.value = 14; printFontSizeVal.textContent = '14px';
      document.getElementById('printTextColor').value = '#1a1a1a';
      document.getElementById('printBgColor').value = '#ffffff';
      printLineSpacingSlider.value = 18; printLineSpacingVal.textContent = '1.8';
      document.getElementById('printPaperSize').value = 'a4';
      document.getElementById('printMargins').value = '15';
      document.getElementById('printOrientation').value = 'portrait';
      document.getElementById('printAlignment').value = 'left';
      document.getElementById('printShowHeader').checked = true;
      document.getElementById('printLineNumbers').checked = false;
      document.getElementById('printWordWrap').checked = true;
      document.getElementById('printPageBorder').checked = false;
      document.getElementById('printPageFit').value = 'normal';
      document.getElementById('printBoldText').checked = false;
      document.getElementById('printTextTransform').value = 'none';
      document.getElementById('printWatermark').value = '';
      document.getElementById('printCustomTitle').value = '';
      updatePrintPreview();
      showToast('Settings reset! 🔄', 'info');
    });

    // Get all settings as object
    function getPrintSettings() {
      return {
        fontFamily: document.getElementById('printFontFamily').value,
        fontSize: printFontSizeSlider.value,
        textColor: document.getElementById('printTextColor').value,
        bgColor: document.getElementById('printBgColor').value,
        lineSpacing: (printLineSpacingSlider.value / 10).toFixed(1),
        paperSize: document.getElementById('printPaperSize').value,
        margins: document.getElementById('printMargins').value,
        orientation: document.getElementById('printOrientation').value,
        alignment: document.getElementById('printAlignment').value,
        showHeader: document.getElementById('printShowHeader').checked,
        lineNumbers: document.getElementById('printLineNumbers').checked,
        wordWrap: document.getElementById('printWordWrap').checked,
        pageBorder: document.getElementById('printPageBorder').checked,
        pageFit: document.getElementById('printPageFit').value,
        bold: document.getElementById('printBoldText').checked,
        textTransform: document.getElementById('printTextTransform').value,
        watermark: document.getElementById('printWatermark').value.trim(),
        customTitle: document.getElementById('printCustomTitle').value.trim()
      };
    }

    // Build print HTML from settings
    function buildPrintHTML(text, title, settings) {
      const safeText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const displayTitle = settings.customTitle || title;

      let contentHTML = '';
      if (settings.lineNumbers) {
        const lines = safeText.split('\n');
        contentHTML = lines.map((line, i) =>
          `<div style="display:flex;gap:15px;"><span style="color:#999;min-width:40px;text-align:right;user-select:none;flex-shrink:0;">${i + 1}</span><span>${line || '&nbsp;'}</span></div>`
        ).join('');
      } else {
        contentHTML = safeText;
      }

      const headerHTML = settings.showHeader ? `
        <div style="text-align:center;margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid #e0e0e0;">
          <h2 style="font-size:16px;color:${settings.textColor};margin:0 0 4px 0;">${displayTitle}</h2>
          <div style="font-size:10px;color:#999;">Supreme Code Editor Pro | ${new Date().toLocaleString('hi-IN')}</div>
        </div>` : '';

      const fitStyles = {
        'normal': '',
        'fit1': 'transform-origin:top left; transform:scale(0.6); width:166%;',
        'fit2': 'transform-origin:top left; transform:scale(0.8); width:125%;',
        'compact': 'font-size:9px !important; line-height:1.3 !important;'
      };

      const borderStyle = settings.pageBorder ? 'border:1.5px solid #333; padding:20px; margin:10px;' : '';

      const watermarkHTML = settings.watermark ? `
        <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-45deg);font-size:80px;color:rgba(0,0,0,0.06);font-weight:900;pointer-events:none;white-space:nowrap;z-index:0;letter-spacing:10px;">${settings.watermark}</div>` : '';

      return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>${displayTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Fira+Code:wght@400;500;700&family=Mangal&display=swap" rel="stylesheet">
  <style>
    * {
      margin:0; padding:0; box-sizing:border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      font-family: ${settings.fontFamily};
      padding: ${settings.margins}mm;
      font-size: ${settings.fontSize}px;
      line-height: ${settings.lineSpacing};
      color: ${settings.textColor};
      background: ${settings.bgColor} !important;
      text-align: ${settings.alignment};
      white-space: ${settings.wordWrap ? 'pre-wrap' : 'pre'};
      word-wrap: break-word;
      overflow-wrap: break-word;
      font-weight: ${settings.bold ? 'bold' : 'normal'};
      text-transform: ${settings.textTransform};
      ${fitStyles[settings.pageFit] || ''}
      ${borderStyle}
    }
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      body {
        padding: 0; margin: 0;
        background: ${settings.bgColor} !important;
        background-color: ${settings.bgColor} !important;
        ${borderStyle}
      }
      @page { size: ${settings.paperSize} ${settings.orientation}; margin: ${settings.margins}mm; }
      .no-print { display: none !important; }
    }
    .action-bar {
      position:fixed; top:10px; right:10px;
      display:flex; gap:8px; z-index:9999;
    }
    .action-bar button {
      padding:10px 20px; border:none; border-radius:8px;
      font-size:14px; font-weight:600; cursor:pointer;
      color:white; font-family:'Poppins',sans-serif;
      transition:all 0.2s;
    }
    .action-bar button:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.3); }
    .btn-print { background:linear-gradient(135deg,#5e72e4,#11cdef); }
    .btn-close { background:linear-gradient(135deg,#f5365c,#ff6b6b); }
    .content { position:relative; z-index:1; }
  </style>
</head>
<body>
  ${watermarkHTML}
  <div class="action-bar no-print">
    <button class="btn-print" onclick="window.print()">🖨️ Save Selectable PDF</button>
    <button class="btn-close" onclick="window.close()">✕ Close</button>
  </div>
  ${headerHTML}
  <div class="content">${contentHTML}</div>
</body>
</html>`;
    }

    // Print Now button
    printGoBtn.addEventListener('click', () => {
      const text = editor.value;
      if (!text.trim()) { showToast('Editor खाली है!', 'error'); return; }
      const settings = getPrintSettings();
      const fileName = fileNameInput.value.trim() || `${currentFile.name}.${currentFile.extension}`;
      const html = buildPrintHTML(text, fileName, settings);

      const printWin = window.open('', '_blank', 'width=900,height=700');
      if (!printWin) { showToast('Pop-up blocked!', 'error'); return; }
      printWin.document.write(html);
      printWin.document.close();
      setTimeout(() => { printWin.focus(); printWin.print(); }, 2000);

      printModalOverlay.classList.remove('show');
      showToast('Print window opened! 🖨️', 'success');
    });

    // Save as PDF button - AUTO DOWNLOAD using Canvas with settings
    printSavePdfBtn.addEventListener('click', async () => {
      const text = editor.value;
      if (!text.trim()) { showToast('Editor खाली है!', 'error'); return; }
      const settings = getPrintSettings();
      const fileName = fileNameInput.value.trim() || `${currentFile.name}.${currentFile.extension}`;
      const lastDot = fileName.lastIndexOf('.');
      const pdfName = (lastDot > 0 ? fileName.substring(0, lastDot) : fileName) + '.pdf';
      printModalOverlay.classList.remove('show');
      await generateAndDownloadPDF(pdfName, settings);
    });

    // ===== FONT CACHE for PDF =====
    let cachedFontBase64 = null;

    // ===== LIVE PREVIEW button =====
    document.getElementById('printLivePreviewBtn').addEventListener('click', () => {
      const text = editor.value;
      if (!text.trim()) { showToast('Editor खाली है!', 'error'); return; }
      const settings = getPrintSettings();
      const fileName = fileNameInput.value.trim() || `${currentFile.name}.${currentFile.extension}`;
      const html = buildPrintHTML(text, fileName, settings);
      const previewWin = window.open('', '_blank', 'width=900,height=700');
      if (!previewWin) { showToast('Pop-up blocked!', 'error'); return; }
      previewWin.document.write(html);
      previewWin.document.close();
      showToast('Live Preview opened! 👁️', 'success');
    });

    // ===== AUTO PDF DOWNLOAD using Canvas API (Perfect Hindi text, Selectable via invisible overlay) =====
    async function generateAndDownloadPDF(pdfName, settings) {
      const text = editor.value;
      if (!text.trim()) {
        showToast('Editor खाली है! कुछ लिखें पहले।', 'error');
        return;
      }

      const s = settings || {
        fontSize: '13', textColor: '#1a1a1a', bgColor: '#ffffff',
        bold: false, textTransform: 'none', watermark: ''
      };

      showToast('PDF बन रहा है... ⏳', 'info');

      try {
        const JsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
        if (!JsPDFClass) throw new Error('jsPDF not found');

        const fontSize = parseInt(s.fontSize) || 13;

        // 1. Load Hindi font for canvas (Visual render)
        try { await document.fonts.load("14px 'Noto Sans Devanagari'", "हिंदी"); } catch (e) { }
        await document.fonts.ready;

        // 2. Fetch TTF font for jsPDF (Invisible selectable text layer)
        if (!cachedFontBase64) {
          const fontUrls = [
            'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansdevanagari/NotoSansDevanagari%5Bwdth%2Cwght%5D.ttf',
            'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansdevanagari/NotoSansDevanagari%5Bwdth%2Cwght%5D.ttf'
          ];
          for (const url of fontUrls) {
            try {
              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), 6000);
              const resp = await fetch(url, { signal: controller.signal });
              clearTimeout(timeout);
              if (resp.ok) {
                const ab = await resp.arrayBuffer();
                const u8 = new Uint8Array(ab);
                let binary = '';
                const chunk = 8192;
                for (let i = 0; i < u8.length; i += chunk) {
                  binary += String.fromCharCode.apply(null, u8.subarray(i, Math.min(i + chunk, u8.length)));
                }
                cachedFontBase64 = btoa(binary);
                break;
              }
            } catch (e) { console.warn('Font fetch failed'); }
          }
        }

        const lineH = fontSize * 2.2;
        const scale = 2;
        const pageWidthPx = 595 * scale;
        const pageHeightPx = 842 * scale;
        const marginPx = 40 * scale;
        const contentW = pageWidthPx - marginPx * 2;
        const contentH = pageHeightPx - marginPx * 2;
        const boldStr = s.bold ? 'bold ' : '';
        const fontStr = `${boldStr}${fontSize * scale}px 'Noto Sans Devanagari', 'Mangal', 'Arial Unicode MS', sans-serif`;

        const mCanvas = document.createElement('canvas');
        const mCtx = mCanvas.getContext('2d');
        mCtx.font = fontStr;

        let processedText = text;
        if (s.textTransform === 'uppercase') processedText = text.toUpperCase();
        else if (s.textTransform === 'lowercase') processedText = text.toLowerCase();

        const rawLines = processedText.split('\n');
        const allLines = [];
        rawLines.forEach(raw => {
          if (!raw.trim()) { allLines.push(''); return; }
          let current = '';
          const parts = raw.split(/(\s+)/);
          for (const part of parts) {
            // If a single word/part is wider than contentW, break it char-by-char
            if (mCtx.measureText(part).width > contentW) {
              if (current) { allLines.push(current); current = ''; }
              let chunk = '';
              for (const ch of part) {
                const testCh = chunk + ch;
                if (mCtx.measureText(testCh).width > contentW && chunk) {
                  allLines.push(chunk);
                  chunk = ch;
                } else {
                  chunk = testCh;
                }
              }
              current = chunk;
            } else {
              const test = current + part;
              if (mCtx.measureText(test).width > contentW && current) {
                allLines.push(current);
                current = part.trimStart();
              } else {
                current = test;
              }
            }
          }
          if (current) allLines.push(current);
        });

        const lineHScaled = lineH * scale;
        const linesPerPage = Math.floor(contentH / lineHScaled);
        const pages = [];
        for (let i = 0; i < allLines.length; i += linesPerPage) {
          pages.push(allLines.slice(i, i + linesPerPage));
        }
        if (pages.length === 0) pages.push(['']);

        const pdf = new JsPDFClass('p', 'pt', 'a4');

        // Setup font for inline PDF
        let fontLoaded = false;
        if (cachedFontBase64) {
          try {
            pdf.addFileToVFS('NotoSansDevanagari.ttf', cachedFontBase64);
            pdf.addFont('NotoSansDevanagari.ttf', 'NotoSansDevanagari', 'normal');
            pdf.setFont('NotoSansDevanagari');
            pdf.setFontSize(fontSize);
            fontLoaded = true;
          } catch (e) { console.warn('Could not setup jsPDF font'); }
        }

        for (let p = 0; p < pages.length; p++) {
          if (p > 0) pdf.addPage();
          const canvas = document.createElement('canvas');
          canvas.width = pageWidthPx;
          canvas.height = pageHeightPx;
          const ctx = canvas.getContext('2d');

          // Draw Canvas visual
          ctx.fillStyle = s.bgColor || '#ffffff';
          ctx.fillRect(0, 0, pageWidthPx, pageHeightPx);

          ctx.fillStyle = s.textColor || '#1a1a1a';
          ctx.font = fontStr;
          ctx.textBaseline = 'top';

          pages[p].forEach((line, i) => {
            ctx.fillText(line, marginPx, marginPx + i * lineHScaled);
          });

          if (s.watermark) {
            ctx.save();
            ctx.translate(pageWidthPx / 2, pageHeightPx / 2);
            ctx.rotate(-Math.PI / 4);
            ctx.font = `bold ${60 * scale}px 'Noto Sans Devanagari', sans-serif`;
            ctx.fillStyle = 'rgba(0,0,0,0.04)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(s.watermark, 0, 0);
            ctx.restore();
          }

          const imgData = canvas.toDataURL('image/png');
          const pW = pdf.internal.pageSize.getWidth();
          const pH = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'PNG', 0, 0, pW, pH);

          // OVERLAY INVISIBLE SELECTABLE TEXT
          if (fontLoaded) {
            const marginPdf = 40;
            pages[p].forEach((line, i) => {
              try {
                // renderingMode 3 = invisible text (searchable/selectable)
                pdf.text(line, marginPdf, marginPdf + i * lineH, { renderingMode: 3, baseline: 'top' });
              } catch (e) { }
            });
          }
        }

        pdf.save(pdfName);
        addToDownloadHistory(pdfName, text);
        showToast(`"${pdfName}" downloaded! ✅`, 'success');
      } catch (error) {
        console.error('PDF Error:', error);
        showToast('Auto-download failed, opening print... 🖨️', 'info');
        const safeText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const pw = window.open('', '_blank', 'width=900,height=700');
        if (pw) {
          pw.document.write(`<!DOCTYPE html><html lang="hi"><head><meta charset="UTF-8"><title>${pdfName}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}body{font-family:'Noto Sans Devanagari',sans-serif;padding:40px;font-size:${s.fontSize || 14}px;line-height:1.8;color:${s.textColor || '#1a1a1a'};background:${s.bgColor || '#fff'};white-space:pre-wrap;word-wrap:break-word;font-weight:${s.bold ? 'bold' : 'normal'}}@media print{body{padding:0}@page{margin:15mm}.no-print{display:none!important}}</style>
</head><body><div class="no-print" style="position:fixed;top:10px;right:10px;z-index:9999"><button onclick="window.print()" style="padding:10px 20px;border:none;border-radius:8px;background:#2dce89;color:white;font-size:14px;font-weight:600;cursor:pointer">📄 Save as PDF</button></div>${safeText}</body></html>`);
          pw.document.close();
          setTimeout(() => { pw.focus(); pw.print(); }, 2000);
        }
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

    // ================================================================
    // === ADVANCED AUTO-DETECT LANGUAGE ENGINE (Improved v2.0) =======
    // === 100+ pattern rules for accurate file type detection ========
    // ================================================================
    function autoDetectLanguage() {
      // CRITICAL FIX: Don't auto-detect if file was loaded from disk with known extension
      if (currentFile.loadedFromDisk) return;

      const content = editor.value.substring(0, 15000).trim();
      if (!content || content.length < 15) return;

      let detectedExt = currentFile.extension;
      let confidence = 0;

      // ============ HELPER: Count pattern matches ============
      function countMatches(regex) {
        return (content.match(regex) || []).length;
      }

      // ============ HELPER: Check if content looks like plain text ============
      function looksLikePlainText() {
        const sentences = countMatches(/[.!?]\s+[A-Z]/g);
        const commonWords = countMatches(/\b(the|is|are|was|were|have|has|had|will|would|could|should|this|that|with|from|they|their|been|being|each|which|about|into|than|then|when|where|what|some|more|your|also|just|very|much|only|like|make|over|such|even|most|after|know|because|good|back|well|them|time|here|want|give|does|many|these|other|upon|said|each)\b/gi);
        return sentences >= 3 || commonWords >= 10;
      }

      // ============ HELPER: Score-based detection ============
      function scorePatterns(patterns) {
        let score = 0;
        patterns.forEach(([regex, points]) => {
          if (content.match(regex)) score += points;
        });
        return score;
      }

      // ======================================================
      // ========= DETECTION ENGINE - PRIORITY ORDER ==========
      // ======================================================

      // 1. HTML Detection - Unmistakable structural patterns
      const htmlScore = scorePatterns([
        [/<\!DOCTYPE\s+html>/i, 10],
        [/<html[\s>]/i, 5],
        [/<\/html>/i, 5],
        [/<head[\s>]/i, 4],
        [/<body[\s>]/i, 4],
        [/<div[\s>]/i, 3],
        [/<\/div>/i, 3],
        [/<script[\s>]/i, 3],
        [/<\/script>/i, 3],
        [/<link\s+/i, 2],
        [/<meta\s+/i, 2],
        [/<style[\s>]/i, 2],
        [/<p[\s>]/i, 1],
        [/<span[\s>]/i, 1],
        [/<img\s+/i, 1],
        [/<a\s+href/i, 1],
        [/<form[\s>]/i, 1],
        [/<input[\s>]/i, 1],
        [/<button[\s>]/i, 1],
        [/<table[\s>]/i, 1],
        [/<h[1-6][\s>]/i, 1]
      ]);
      if (htmlScore >= 8) {
        detectedExt = 'html';
        confidence = Math.min(100, 85 + htmlScore);
      }

      // 2. Jupyter Notebook (must check before JSON)
      else if (content.match(/"nbformat"\s*:\s*\d+/) && content.match(/"cells"\s*:\s*\[/)) {
        detectedExt = 'ipynb';
        confidence = 100;
      }

      // 3. AutoHotkey - Rich pattern matching
      else if ((() => {
        const ahkScore = scorePatterns([
          [/^\s*;.*$/m, 1],
          [/::/, 3],
          [/\bMsgBox\b/i, 3],
          [/\bSend\b/i, 2],
          [/\bHotkey\b/i, 3],
          [/\bReturn\b/i, 1],
          [/\bIfWinExist\b/i, 3],
          [/\bWinActivate\b/i, 3],
          [/\bInputBox\b/i, 2],
          [/\bGui\s*,/i, 3],
          [/\bGuiCreate\b/i, 3],
          [/\bSetTimer\b/i, 2],
          [/\bGosub\b/i, 2],
          [/\bSleep\b/i, 1],
          [/#Include/i, 2],
          [/#NoEnv/i, 3],
          [/#SingleInstance/i, 3],
          [/#Persistent/i, 3],
          [/\bFileAppend\b/i, 2],
          [/\bFileRead\b/i, 2],
          [/\bLoop\s*,/i, 2],
          [/\bExitApp\b/i, 2],
          [/\bSendInput\b/i, 3],
          [/\bToolTip\b/i, 2],
          [/\bWinWait\b/i, 2],
          [/\bRun\s*,/i, 2],
          [/\bClipboard\s*:?=/i, 2],
          [/\bA_\w+/i, 2],
          [/\bRegExMatch\b/i, 2],
          [/\bStrReplace\b/i, 2]
        ]);
        return ahkScore >= 5;
      })()) {
        detectedExt = 'ahk';
        confidence = 96;
      }

      // 4. Python - Strong multi-pattern detection
      else if ((() => {
        const pyScore = scorePatterns([
          [/(^|\s)def\s+\w+\s*\(/, 4],
          [/(^|\s)class\s+\w+.*:/, 4],
          [/:\s*($|\n)/m, 1],
          [/^import\s+\w+/m, 3],
          [/^from\s+\w+\s+import/m, 4],
          [/print\s*\(/, 3],
          [/if\s+__name__\s*==\s*['"]__main__['"]/, 5],
          [/self\.(\w+)/, 3],
          [/except\s+(\w+|\()/, 3],
          [/elif\s+/, 3],
          [/\bNone\b/, 1],
          [/\bTrue\b.*\bFalse\b/s, 2],
          [/\blambda\s+/, 2],
          [/\bwith\s+open\(/, 4],
          [/\bfor\s+\w+\s+in\s+/, 2],
          [/\bwhile\s+.*:/, 1],
          [/@\w+\s*\n/, 2],
          [/\bpip\s+install/, 2],
          [/\braise\s+\w+/, 2],
          [/\byield\s+/, 2],
          [/\basync\s+def\s+/, 3],
          [/\bawait\s+/, 2]
        ]);
        return pyScore >= 6;
      })()) {
        detectedExt = 'py';
        confidence = 98;
      }

      // 5. JavaScript / TypeScript
      else if ((() => {
        const jsScore = scorePatterns([
          [/(const|let|var)\s+\w+\s*=/, 3],
          [/function\s+\w*\s*\(/, 4],
          [/=>\s*[{\(]/, 4],
          [/console\.log\s*\(/, 4],
          [/document\.getElementById/, 5],
          [/addEventListener\(/, 4],
          [/require\s*\(['"]/, 3],
          [/module\.exports/, 4],
          [/export\s+(default\s+)?/, 3],
          [/import\s+.*from\s+['"]/, 3],
          [/\bnew\s+Promise\(/, 3],
          [/async\s+function/, 3],
          [/\.then\s*\(/, 2],
          [/\.catch\s*\(/, 2],
          [/\bJSON\.(parse|stringify)\s*\(/, 3],
          [/\bwindow\./, 2],
          [/\bnull\b/, 1],
          [/\bundefined\b/, 2],
          [/===|!==/, 2],
          [/\bclass\s+\w+\s*(extends|{)/, 3],
          [/\bthis\./, 2],
          [/\.map\s*\(|.filter\s*\(|.reduce\s*\(/, 2]
        ]);
        if (jsScore >= 6) {
          if (content.match(/:\s*(string|number|boolean|any|void)\s*[;,=)]/) ||
            content.match(/interface\s+\w+\s*\{/) ||
            content.match(/type\s+\w+\s*=/) ||
            content.match(/<\w+>/) && content.match(/:\s*\w+\[\]/)) {
            detectedExt = 'ts';
            confidence = 95;
          } else {
            detectedExt = 'js';
            confidence = 95;
          }
          return true;
        }
        return false;
      })()) { /* detected above */ }

      // 6. CSS/SCSS
      else if ((() => {
        const cssScore = scorePatterns([
          [/[.#]\w+\s*\{/, 4],
          [/@media\s*\(/, 4],
          [/@import\s+/, 3],
          [/:\s*(flex|grid|block|inline|none|relative|absolute|fixed)\s*;/, 3],
          [/background(-color)?\s*:/, 2],
          [/margin\s*:/, 2],
          [/padding\s*:/, 2],
          [/font-(size|family|weight)\s*:/, 2],
          [/display\s*:/, 2],
          [/color\s*:/, 1],
          [/border(-radius)?\s*:/, 2],
          [/:hover\s*\{/, 3],
          [/@keyframes\s+/, 3],
          [/transition\s*:/, 2],
          [/transform\s*:/, 2],
          [/z-index\s*:/, 1],
          [/\!important/, 1]
        ]);
        if (cssScore >= 8) {
          if (content.match(/\$\w+\s*:|@mixin|@include|@extend/)) {
            detectedExt = 'scss';
            confidence = 96;
          } else {
            detectedExt = 'css';
            confidence = 96;
          }
          return true;
        }
        return false;
      })()) { /* detected above */ }

      // 7. JSON - Must actually parse
      else if ((content.startsWith('{') && content.endsWith('}')) ||
        (content.startsWith('[') && content.endsWith(']'))) {
        try {
          JSON.parse(content);
          if (content.match(/"nbformat"\s*:\s*\d+/) && content.match(/"cells"\s*:\s*\[/)) {
            detectedExt = 'ipynb';
          } else {
            detectedExt = 'json';
          }
          confidence = 100;
        } catch (e) { /* not valid JSON */ }
      }

      // 8. SQL
      else if ((() => {
        const sqlScore = scorePatterns([
          [/SELECT\s+.*\s+FROM/i, 5],
          [/CREATE\s+(TABLE|DATABASE|INDEX|VIEW)/i, 5],
          [/INSERT\s+INTO/i, 5],
          [/UPDATE\s+\w+\s+SET/i, 5],
          [/DELETE\s+FROM/i, 5],
          [/ALTER\s+TABLE/i, 4],
          [/DROP\s+(TABLE|DATABASE)/i, 4],
          [/WHERE\s+/i, 2],
          [/JOIN\s+\w+/i, 3],
          [/GROUP\s+BY/i, 3],
          [/ORDER\s+BY/i, 3],
          [/PRIMARY\s+KEY/i, 3],
          [/FOREIGN\s+KEY/i, 3],
          [/VARCHAR|INT|TEXT|BOOLEAN|DATETIME/i, 2],
          [/BEGIN|COMMIT|ROLLBACK/i, 2]
        ]);
        return sqlScore >= 6;
      })()) {
        detectedExt = 'sql';
        confidence = 98;
      }

      // 9. Java
      else if ((() => {
        const javaScore = scorePatterns([
          [/public\s+(class|interface|enum)\s+\w+/, 5],
          [/import\s+java\./, 5],
          [/System\.out\.print(ln)?/, 5],
          [/private\s+(static\s+)?\w+\s+\w+/, 3],
          [/protected\s+/, 2],
          [/@Override/, 3],
          [/throws\s+\w+Exception/, 3],
          [/new\s+\w+\(/, 2],
          [/\.equals\(/, 2],
          [/\.toString\(/, 2],
          [/\bvoid\s+main\s*\(/, 5],
          [/\bfinal\s+/, 1],
          [/\bextends\s+/, 2],
          [/\bimplements\s+/, 3],
          [/\bpackage\s+[\w.]+;/, 4]
        ]);
        return javaScore >= 6;
      })()) {
        detectedExt = 'java';
        confidence = 98;
      }

      // 10. C/C++
      else if (content.match(/#include\s*<.*>/) || content.match(/int\s+main\s*\(/)) {
        if (content.match(/std::|cout\s*<<|cin\s*>>|namespace\s+/) || content.match(/\.cpp$/m)) {
          detectedExt = 'cpp';
          confidence = 95;
        } else {
          detectedExt = 'c';
          confidence = 92;
        }
      }

      // 11. C#
      else if (content.match(/using\s+System/) ||
        (content.match(/namespace\s+\w+/) && content.match(/class\s+\w+/)) ||
        content.match(/Console\.WriteLine/)) {
        detectedExt = 'cs';
        confidence = 95;
      }

      // 12. PHP
      else if (content.match(/<\?php/) ||
        (content.match(/\$\w+\s*=/) && content.match(/echo\s+/) && content.match(/;\s*$/m))) {
        detectedExt = 'php';
        confidence = 95;
      }

      // 13. Go
      else if ((content.match(/^package\s+\w+/m) && content.match(/func\s+/)) ||
        content.match(/fmt\.Print/) ||
        (content.match(/import\s*\(/) && content.match(/func\s+\w+\s*\(/))) {
        detectedExt = 'go';
        confidence = 95;
      }

      // 14. Rust
      else if ((content.match(/fn\s+\w+\s*\(/) && content.match(/->\s*\w+/)) ||
        content.match(/let\s+mut\s+/) ||
        content.match(/println!\s*\(/) ||
        content.match(/use\s+std::/) ||
        content.match(/impl\s+\w+/)) {
        detectedExt = 'rs';
        confidence = 95;
      }

      // 15. Ruby
      else if ((content.match(/def\s+\w+/) && content.match(/^\s*end\s*$/m)) ||
        content.match(/puts\s+/) ||
        (content.match(/require\s+['"]/) && content.match(/end\s*$/m)) ||
        content.match(/class\s+\w+\s*<\s*\w+/)) {
        detectedExt = 'rb';
        confidence = 90;
      }

      // 16. Markdown - Requires multiple markdown-specific patterns (not just one)
      else if ((() => {
        const mdScore =
          (content.match(/^#{1,6}\s+\w+/m) ? 2 : 0) +
          (content.match(/\[.*\]\(.*\)/) ? 2 : 0) +
          (content.match(/`{3}\w*\n[\s\S]*?\n`{3}/) ? 3 : 0) +
          (content.match(/\*\*.*?\*\*/) ? 1 : 0) +
          (content.match(/^[-*+]\s+/m) ? 1 : 0) +
          (content.match(/^>\s+/m) ? 1 : 0) +
          (content.match(/^\d+\.\s+/m) ? 1 : 0) +
          (content.match(/!\[.*\]\(.*\)/) ? 2 : 0);
        return mdScore >= 4;
      })()) {
        detectedExt = 'md';
        confidence = 92;
      }

      // 17. Shell Script
      else if ((content.match(/^#!.*\b(bash|sh|zsh)\b/m)) ||
        (content.match(/^#!/m) && content.match(/echo\s+/)) ||
        (content.match(/\bfi\b/) && content.match(/\bif\s+\[/)) ||
        (content.match(/\bdone\b/) && content.match(/\bfor\s+\w+\s+in\b/))) {
        detectedExt = 'sh';
        confidence = 92;
      }

      // 18. Batch Script
      else if (content.match(/@echo\s+(off|on)/i) ||
        (countMatches(/^(IF|SET|FOR|ECHO|GOTO|CALL|REM)\s/gim) >= 2 && content.match(/%\w+%/))) {
        detectedExt = 'bat';
        confidence = 92;
      }

      // 19. PowerShell
      else if (content.match(/\$\w+\s*=/) &&
        (content.match(/Write-Host|Get-|Set-|New-|Remove-/i) ||
          content.match(/\[Parameter\(/) ||
          content.match(/param\s*\(/i))) {
        detectedExt = 'ps1';
        confidence = 90;
      }

      // 20. Docker
      else if (content.match(/^FROM\s+\w+/m) &&
        (content.match(/^RUN\s+/m) || content.match(/^CMD\s+/m) ||
          content.match(/^COPY\s+/m) || content.match(/^WORKDIR\s+/m))) {
        detectedExt = 'dockerfile';
        confidence = 98;
      }

      // 21. YAML - VERY STRICT detection (prevents txt→yml false positive)
      else if ((() => {
        // Must have MULTIPLE YAML-specific structural patterns
        const yamlKeyValues = countMatches(/^\w[\w\s.-]*:\s*.+$/gm);
        const yamlListItems = countMatches(/^\s+-\s+\w+/gm);
        const yamlNested = countMatches(/^\s{2,}\w+:\s/gm);
        const hasTripleDash = content.match(/^---\s*$/m) ? 1 : 0;

        const yamlScore =
          (hasTripleDash ? 3 : 0) +
          (yamlKeyValues >= 5 ? 3 : yamlKeyValues >= 3 ? 2 : 0) +
          (yamlListItems >= 2 ? 2 : 0) +
          (yamlNested >= 2 ? 2 : 0);

        // CRITICAL: Reject if text looks like plain English
        if (looksLikePlainText()) return false;

        // Also reject if it looks like INI, TOML, or key=value config
        if (countMatches(/^\w+\s*=\s*.+$/gm) > yamlKeyValues) return false;

        return yamlScore >= 5;
      })()) {
        detectedExt = 'yaml';
        confidence = 90;
      }

      // 22. TOML
      else if (content.match(/^\[[\w.]+\]\s*$/m) &&
        content.match(/^\w+\s*=\s*["'\d\[]/m) &&
        countMatches(/^\[[\w.]+\]\s*$/gm) >= 2) {
        detectedExt = 'toml';
        confidence = 90;
      }

      // 23. INI / Config
      else if (content.match(/^\[\w+\]\s*$/m) &&
        countMatches(/^\w+\s*=\s*.+$/gm) >= 3 &&
        !looksLikePlainText()) {
        detectedExt = 'ini';
        confidence = 85;
      }

      // 24. XML / SVG
      else if (content.match(/<\?xml\s+version/i) ||
        (content.match(/<\w+[\s>]/) && content.match(/<\/\w+>/) &&
          !content.match(/<(html|body|head|div|span|p|a|script|style)[\s>]/i) &&
          countMatches(/<\w+[\s>]/g) >= 3)) {
        if (content.match(/<svg[\s>]/i)) {
          detectedExt = 'xml'; // treat SVG as XML
        } else {
          detectedExt = 'xml';
        }
        confidence = 88;
      }

      // ======================================================
      // ========= APPLY DETECTION RESULT =====================
      // ======================================================
      if (currentFile.extension !== detectedExt && languageMap[detectedExt] && confidence > 80) {
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
        showToast(`Detected: ${detectedExt.toUpperCase()} (${confidence}%)`, 'info');
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

    // ===== THEME PICKER (RIGHT-CLICK) =====
    const themeDefinitions = [
      // === DEFAULT (1) ===
      {
        id: 'default-light',
        name: 'Default Light',
        emoji: '☀️',
        desc: 'The original clean & bright theme',
        colors: ['#89f7fe', '#66a6ff', '#5e72e4', '#2dce89'],
        bar: 'linear-gradient(90deg, #89f7fe, #66a6ff)',
        cardBg: 'linear-gradient(135deg, #1e293b, #0f172a)',
        vars: {
          '--primary': '#5e72e4', '--secondary': '#f5365c', '--accent': '#2dce89',
          '--light': '#f8f9fe', '--dark': '#212529', '--success': '#2dce89',
          '--info': '#11cdef', '--warning': '#fb6340', '--text-color': '#333',
          '--bg-gradient-start': '#89f7fe', '--bg-gradient-end': '#66a6ff'
        },
        dark: false
      },
      // === LIGHT THEMES ===
      {
        id: 'ocean-breeze',
        name: 'Ocean Breeze',
        emoji: '🌊',
        desc: 'Deep sea blues with fresh aqua tones',
        colors: ['#0a2463', '#1b4b8a', '#1ee3cf', '#6df0d9'],
        bar: 'linear-gradient(90deg, #0a2463, #1ee3cf)',
        cardBg: 'linear-gradient(135deg, #091b33, #0a2463)',
        vars: {
          '--primary': '#1b6cc5', '--secondary': '#1ee3cf', '--accent': '#6df0d9',
          '--light': '#f0fafa', '--dark': '#0a2463', '--success': '#1ee3cf',
          '--info': '#55d8fe', '--warning': '#ff8a5c', '--text-color': '#1a3a5c',
          '--bg-gradient-start': '#dff6f0', '--bg-gradient-end': '#b8e4f0'
        },
        dark: false
      },
      {
        id: 'sunset-blaze',
        name: 'Sunset Blaze',
        emoji: '🌅',
        desc: 'Warm orange, pink & golden sunset vibes',
        colors: ['#ff6a00', '#ee0979', '#ff6e7f', '#ffd700'],
        bar: 'linear-gradient(90deg, #ee0979, #ff6a00)',
        cardBg: 'linear-gradient(135deg, #2d1018, #3d1520)',
        vars: {
          '--primary': '#ff6a00', '--secondary': '#ee0979', '--accent': '#ffd700',
          '--light': '#fff7f0', '--dark': '#3d1520', '--success': '#ff9a44',
          '--info': '#ff6e7f', '--warning': '#ff4757', '--text-color': '#4a2030',
          '--bg-gradient-start': '#ffecd2', '--bg-gradient-end': '#fcb69f'
        },
        dark: false
      },
      {
        id: 'forest-mystic',
        name: 'Forest Mystic',
        emoji: '🌿',
        desc: 'Earthy greens with emerald nature feel',
        colors: ['#1b4332', '#2d6a4f', '#40916c', '#95d5b2'],
        bar: 'linear-gradient(90deg, #1b4332, #95d5b2)',
        cardBg: 'linear-gradient(135deg, #0b1f17, #1b4332)',
        vars: {
          '--primary': '#2d6a4f', '--secondary': '#d4a373', '--accent': '#95d5b2',
          '--light': '#f0f7f4', '--dark': '#1b4332', '--success': '#40916c',
          '--info': '#74c69d', '--warning': '#d4a373', '--text-color': '#1b4332',
          '--bg-gradient-start': '#d8f3dc', '--bg-gradient-end': '#b7e4c7'
        },
        dark: false
      },
      {
        id: 'cherry-blossom',
        name: 'Cherry Blossom',
        emoji: '🌸',
        desc: 'Soft sakura petals in spring breeze',
        colors: ['#ffb7c5', '#e88fa2', '#c75b7a', '#f9e4e8'],
        bar: 'linear-gradient(90deg, #c75b7a, #ffb7c5)',
        cardBg: 'linear-gradient(135deg, #3d1a2a, #5a2d42)',
        vars: {
          '--primary': '#d4608a', '--secondary': '#c75b7a', '--accent': '#ffb7c5',
          '--light': '#fef5f7', '--dark': '#5a2d42', '--success': '#e88fa2',
          '--info': '#f0a0b8', '--warning': '#e06070', '--text-color': '#5a2d42',
          '--bg-gradient-start': '#fce4ec', '--bg-gradient-end': '#f8bbd0'
        },
        dark: false
      },
      {
        id: 'cotton-candy',
        name: 'Cotton Candy',
        emoji: '🍬',
        desc: 'Sweet pastel dream of pink & blue',
        colors: ['#a0c4ff', '#bdb2ff', '#ffc6ff', '#caffbf'],
        bar: 'linear-gradient(90deg, #a0c4ff, #ffc6ff)',
        cardBg: 'linear-gradient(135deg, #1a1a3e, #2a1a3e)',
        vars: {
          '--primary': '#8fa4d0', '--secondary': '#d4a0d0', '--accent': '#b0e0b0',
          '--light': '#f8f0ff', '--dark': '#3a2a4a', '--success': '#caffbf',
          '--info': '#a0c4ff', '--warning': '#ffc6ff', '--text-color': '#4a3a5a',
          '--bg-gradient-start': '#e8e0f0', '--bg-gradient-end': '#d8e8ff'
        },
        dark: false
      },
      {
        id: 'royal-purple',
        name: 'Royal Purple',
        emoji: '👑',
        desc: 'Majestic purples with regal violet glow',
        colors: ['#2d1b69', '#5b2c8e', '#9b59b6', '#d4a5ff'],
        bar: 'linear-gradient(90deg, #2d1b69, #d4a5ff)',
        cardBg: 'linear-gradient(135deg, #1a0f3c, #2d1b69)',
        vars: {
          '--primary': '#7c3aed', '--secondary': '#ec4899', '--accent': '#d4a5ff',
          '--light': '#f5f0ff', '--dark': '#2d1b69', '--success': '#a78bfa',
          '--info': '#8b5cf6', '--warning': '#f472b6', '--text-color': '#3b1f79',
          '--bg-gradient-start': '#e8dff5', '--bg-gradient-end': '#d4bff9'
        },
        dark: false
      },
      // 5 NEW LIGHT THEMES
      {
        id: 'lavender-dream',
        name: 'Lavender Dream',
        emoji: '💜',
        desc: 'Soft lavender fields with gentle purple',
        colors: ['#e6d5f8', '#c4a3e0', '#9b72c8', '#7b52b0'],
        bar: 'linear-gradient(90deg, #9b72c8, #e6d5f8)',
        cardBg: 'linear-gradient(135deg, #2a1d40, #3d2a5c)',
        vars: {
          '--primary': '#9b72c8', '--secondary': '#c4a3e0', '--accent': '#e6d5f8',
          '--light': '#f8f4fc', '--dark': '#3d2a5c', '--success': '#a78bfa',
          '--info': '#b794f4', '--warning': '#e879a0', '--text-color': '#4a3060',
          '--bg-gradient-start': '#f0e8f8', '--bg-gradient-end': '#e6d5f8'
        },
        dark: false
      },
      {
        id: 'mint-fresh',
        name: 'Mint Fresh',
        emoji: '🍃',
        desc: 'Cool mint green, refreshing & clean',
        colors: ['#a8e6cf', '#88d8b0', '#55c795', '#38b07a'],
        bar: 'linear-gradient(90deg, #38b07a, #a8e6cf)',
        cardBg: 'linear-gradient(135deg, #0f2a1f, #1a3d2c)',
        vars: {
          '--primary': '#38b07a', '--secondary': '#55c795', '--accent': '#a8e6cf',
          '--light': '#f0faf5', '--dark': '#1a3d2c', '--success': '#55c795',
          '--info': '#88d8b0', '--warning': '#f0a060', '--text-color': '#1a4030',
          '--bg-gradient-start': '#e0f7ed', '--bg-gradient-end': '#c8f0dd'
        },
        dark: false
      },
      {
        id: 'peach-glow',
        name: 'Peach Glow',
        emoji: '🍑',
        desc: 'Warm peach tones with golden warmth',
        colors: ['#ffd8b8', '#ffb088', '#ff8860', '#e06840'],
        bar: 'linear-gradient(90deg, #e06840, #ffd8b8)',
        cardBg: 'linear-gradient(135deg, #301a10, #4a2820)',
        vars: {
          '--primary': '#e06840', '--secondary': '#ff8860', '--accent': '#ffd8b8',
          '--light': '#fff5ee', '--dark': '#4a2820', '--success': '#ff8860',
          '--info': '#ffb088', '--warning': '#e04040', '--text-color': '#4a2820',
          '--bg-gradient-start': '#fff0e0', '--bg-gradient-end': '#ffd8b8'
        },
        dark: false
      },
      {
        id: 'sky-blue',
        name: 'Sky Blue',
        emoji: '🩵',
        desc: 'Clear sky blue with cloud white accents',
        colors: ['#b8e0ff', '#88c8f8', '#4aa0e8', '#2878c8'],
        bar: 'linear-gradient(90deg, #2878c8, #b8e0ff)',
        cardBg: 'linear-gradient(135deg, #0a1830, #142848)',
        vars: {
          '--primary': '#2878c8', '--secondary': '#4aa0e8', '--accent': '#b8e0ff',
          '--light': '#f0f8ff', '--dark': '#142848', '--success': '#4aa0e8',
          '--info': '#88c8f8', '--warning': '#f0a030', '--text-color': '#1a3050',
          '--bg-gradient-start': '#e0f0ff', '--bg-gradient-end': '#c8e4ff'
        },
        dark: false
      },
      {
        id: 'lemon-zest',
        name: 'Lemon Zest',
        emoji: '🍋',
        desc: 'Bright sunny yellow with citrus energy',
        colors: ['#fff8a0', '#ffe040', '#f0c020', '#d8a000'],
        bar: 'linear-gradient(90deg, #d8a000, #fff8a0)',
        cardBg: 'linear-gradient(135deg, #2a2000, #3d3010)',
        vars: {
          '--primary': '#d8a000', '--secondary': '#f0c020', '--accent': '#fff8a0',
          '--light': '#fffde8', '--dark': '#3d3010', '--success': '#f0c020',
          '--info': '#ffe040', '--warning': '#e08020', '--text-color': '#4a3800',
          '--bg-gradient-start': '#fff8d0', '--bg-gradient-end': '#fff0a0'
        },
        dark: false
      },
      // === DARK THEMES ===
      {
        id: 'neon-cyber',
        name: 'Neon Cyberpunk',
        emoji: '🌃',
        desc: 'Electric neon lights in the night city',
        colors: ['#0d0221', '#0a0a2e', '#ff00ff', '#00ff88'],
        bar: 'linear-gradient(90deg, #ff00ff, #00ff88)',
        cardBg: 'linear-gradient(135deg, #0d0221, #150535)',
        vars: {
          '--primary': '#bf00ff', '--secondary': '#ff0066', '--accent': '#00ff88',
          '--light': '#1a0a30', '--dark': '#e0e0ff', '--success': '#00ff88',
          '--info': '#00d4ff', '--warning': '#ff6600', '--text-color': '#d0d0e8',
          '--bg-gradient-start': '#0d0221', '--bg-gradient-end': '#150535'
        },
        dark: true
      },
      {
        id: 'midnight-gold',
        name: 'Midnight Gold',
        emoji: '✨',
        desc: 'Luxurious dark with golden elegance',
        colors: ['#0a0a0a', '#1a1a2e', '#c9a227', '#f0d56e'],
        bar: 'linear-gradient(90deg, #1a1a2e, #c9a227)',
        cardBg: 'linear-gradient(135deg, #0a0a0a, #141420)',
        vars: {
          '--primary': '#c9a227', '--secondary': '#e63946', '--accent': '#f0d56e',
          '--light': '#1a1a2e', '--dark': '#f0d56e', '--success': '#c9a227',
          '--info': '#e8c547', '--warning': '#e63946', '--text-color': '#d4c5a0',
          '--bg-gradient-start': '#0a0a0a', '--bg-gradient-end': '#1a1a2e'
        },
        dark: true
      },
      {
        id: 'arctic-aurora',
        name: 'Arctic Aurora',
        emoji: '🏔️',
        desc: 'Northern lights on icy dark mountains',
        colors: ['#0b0c2a', '#1a3a5c', '#00e5a0', '#7b68ee'],
        bar: 'linear-gradient(90deg, #7b68ee, #00e5a0)',
        cardBg: 'linear-gradient(135deg, #070818, #0b0c2a)',
        vars: {
          '--primary': '#7b68ee', '--secondary': '#00e5a0', '--accent': '#00ffc8',
          '--light': '#0e1033', '--dark': '#c8f7e8', '--success': '#00e5a0',
          '--info': '#7b68ee', '--warning': '#ff6e7f', '--text-color': '#b8c8e8',
          '--bg-gradient-start': '#0b0c2a', '--bg-gradient-end': '#1a1a44'
        },
        dark: true
      },
      // 5 NEW DARK THEMES
      {
        id: 'deep-ocean',
        name: 'Deep Ocean',
        emoji: '🐙',
        desc: 'Abyssal depths with bioluminescent glow',
        colors: ['#020818', '#0a1830', '#0066cc', '#00ccff'],
        bar: 'linear-gradient(90deg, #0066cc, #00ccff)',
        cardBg: 'linear-gradient(135deg, #010610, #0a1830)',
        vars: {
          '--primary': '#0077dd', '--secondary': '#00bbee', '--accent': '#00ffee',
          '--light': '#0a1525', '--dark': '#a0d8ff', '--success': '#00ccaa',
          '--info': '#0099dd', '--warning': '#ff7744', '--text-color': '#a0c8e8',
          '--bg-gradient-start': '#010610', '--bg-gradient-end': '#0a1830'
        },
        dark: true
      },
      {
        id: 'blood-moon',
        name: 'Blood Moon',
        emoji: '🌑',
        desc: 'Dark crimson red with lunar shadows',
        colors: ['#0a0000', '#1a0808', '#8b0000', '#ff2020'],
        bar: 'linear-gradient(90deg, #8b0000, #ff2020)',
        cardBg: 'linear-gradient(135deg, #080000, #1a0808)',
        vars: {
          '--primary': '#cc1111', '--secondary': '#ff3333', '--accent': '#ff6666',
          '--light': '#1a0a0a', '--dark': '#ffaaaa', '--success': '#ff4444',
          '--info': '#cc3333', '--warning': '#ff8800', '--text-color': '#d8a0a0',
          '--bg-gradient-start': '#0a0000', '--bg-gradient-end': '#1a0808'
        },
        dark: true
      },
      {
        id: 'matrix-green',
        name: 'Matrix Green',
        emoji: '💻',
        desc: 'Hacker green code rain on black',
        colors: ['#000000', '#001a00', '#00cc00', '#00ff00'],
        bar: 'linear-gradient(90deg, #003300, #00ff00)',
        cardBg: 'linear-gradient(135deg, #000800, #001a00)',
        vars: {
          '--primary': '#00aa00', '--secondary': '#00dd00', '--accent': '#00ff44',
          '--light': '#001100', '--dark': '#88ff88', '--success': '#00ff00',
          '--info': '#00cc44', '--warning': '#ffaa00', '--text-color': '#88cc88',
          '--bg-gradient-start': '#000800', '--bg-gradient-end': '#001a00'
        },
        dark: true
      },
      {
        id: 'violet-dusk',
        name: 'Violet Dusk',
        emoji: '🔮',
        desc: 'Mysterious violet twilight mystique',
        colors: ['#0a0020', '#1a0840', '#6a00cc', '#aa44ff'],
        bar: 'linear-gradient(90deg, #6a00cc, #aa44ff)',
        cardBg: 'linear-gradient(135deg, #06001a, #1a0840)',
        vars: {
          '--primary': '#7722dd', '--secondary': '#aa44ff', '--accent': '#cc88ff',
          '--light': '#120828', '--dark': '#d4aaff', '--success': '#8844cc',
          '--info': '#9944ee', '--warning': '#ff6688', '--text-color': '#b8a0d8',
          '--bg-gradient-start': '#0a0020', '--bg-gradient-end': '#1a0840'
        },
        dark: true
      },
      {
        id: 'charcoal-ember',
        name: 'Charcoal Ember',
        emoji: '🔥',
        desc: 'Smoldering charcoal with glowing embers',
        colors: ['#1a1a1a', '#2a2a2a', '#ff6600', '#ff9933'],
        bar: 'linear-gradient(90deg, #ff6600, #ff9933)',
        cardBg: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)',
        vars: {
          '--primary': '#e05500', '--secondary': '#ff7722', '--accent': '#ffaa44',
          '--light': '#1a1510', '--dark': '#ffd0a0', '--success': '#ff8833',
          '--info': '#ff7722', '--warning': '#ff4400', '--text-color': '#d0b8a0',
          '--bg-gradient-start': '#1a1a1a', '--bg-gradient-end': '#2a2018'
        },
        dark: true
      }
    ];

    let currentThemeId = localStorage.getItem('editorThemeId') || 'default-light';

    // Theme usage tracking
    const THEME_USAGE_KEY = 'supremeEditor_themeUsage';
    let themeUsage = {};
    try { themeUsage = JSON.parse(localStorage.getItem(THEME_USAGE_KEY) || '{}'); } catch (e) { }

    function getThemeStars(id) {
      const count = themeUsage[id] || 0;
      if (count === 0) return '';
      if (count <= 2) return '⭐';
      if (count <= 5) return '⭐⭐';
      if (count <= 10) return '⭐⭐⭐';
      if (count <= 20) return '⭐⭐⭐⭐';
      return '⭐⭐⭐⭐⭐';
    }

    function trackThemeUsage(id) {
      themeUsage[id] = (themeUsage[id] || 0) + 1;
      localStorage.setItem(THEME_USAGE_KEY, JSON.stringify(themeUsage));
    }

    function buildThemePickerGrid() {
      const dayColEl = document.getElementById('tgDayCol');
      const nightColEl = document.getElementById('tgNightCol');
      if (!dayColEl || !nightColEl) return;

      const lightThemes = themeDefinitions.filter(t => !t.dark);
      const darkThemes = themeDefinitions.filter(t => t.dark);

      // Clear existing cards (keep header)
      const dayHeader = dayColEl.querySelector('.tg-col-header');
      const nightHeader = nightColEl.querySelector('.tg-col-header');
      dayColEl.innerHTML = '';
      nightColEl.innerHTML = '';
      if (dayHeader) dayColEl.appendChild(dayHeader);
      if (nightHeader) nightColEl.appendChild(nightHeader);

      lightThemes.forEach((theme, i) => {
        const card = createThemeCard(theme);
        card.style.animationDelay = `${i * 55}ms`;
        dayColEl.appendChild(card);
      });

      darkThemes.forEach((theme, i) => {
        const card = createThemeCard(theme);
        card.style.animationDelay = `${i * 55}ms`;
        nightColEl.appendChild(card);
      });

      // Update count badge
      const badge = document.getElementById('tgThemeCount');
      if (badge) badge.textContent = `${themeDefinitions.length} themes total`;
    }

    function createThemeCard(theme) {
      const card = document.createElement('div');
      card.className = 'theme-card' + (currentThemeId === theme.id ? ' active' : '');
      card.style.background = theme.cardBg;
      const stars = getThemeStars(theme.id);
      const usageCount = themeUsage[theme.id] || 0;

      // Build 4-swatch palette with nice rounded wrapper
      const swatchesHTML = theme.colors.map(c =>
        `<div class="tc-swatch" style="background:${c};"></div>`
      ).join('');

      card.innerHTML = `
        <div class="tc-top">
          <span class="tc-emoji">${theme.emoji}</span>
          <div>
            <div class="tc-name">${theme.name}</div>
            ${usageCount > 0 ? `<div class="tc-stars">${getThemeStars(theme.id)}</div>` : ''}
          </div>
        </div>
        <div class="tc-palette">${swatchesHTML}</div>
        <div class="tc-bar" style="background:${theme.bar};"></div>
        <div class="tc-desc">${theme.desc}</div>
      `;
      card.addEventListener('click', () => applyCustomTheme(theme));
      return card;
    }

    function applyCustomTheme(theme) {
      // Track usage for stars
      trackThemeUsage(theme.id);

      // Apply CSS variables
      const root = document.documentElement;
      Object.entries(theme.vars).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });

      // Handle dark mode class
      if (theme.dark) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon(true);
        document.getElementById('setDarkMode').checked = true;
      } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        updateThemeIcon(false);
        document.getElementById('setDarkMode').checked = false;
      }

      // Dark-mode specific container overrides for custom dark themes
      if (theme.dark) {
        document.querySelector('.container').style.backgroundColor = theme.vars['--light'];
        document.querySelector('.container').style.color = theme.vars['--text-color'];
      } else {
        document.querySelector('.container').style.backgroundColor = '';
        document.querySelector('.container').style.color = '';
      }

      currentThemeId = theme.id;
      localStorage.setItem('editorThemeId', theme.id);
      buildThemePickerGrid();
      updateAndHighlight();
      showToast(`Theme: ${theme.name} ${theme.emoji}`, 'success');
    }

    function resetToDefaultTheme() {
      const root = document.documentElement;
      // Remove all custom properties
      themeDefinitions[0].vars && Object.keys(themeDefinitions[0].vars).forEach(key => {
        root.style.removeProperty(key);
      });
      body.classList.remove('dark-mode');
      document.querySelector('.container').style.backgroundColor = '';
      document.querySelector('.container').style.color = '';
      localStorage.setItem('theme', 'light');
      localStorage.setItem('editorThemeId', 'default-light');
      currentThemeId = 'default-light';
      updateThemeIcon(false);
      document.getElementById('setDarkMode').checked = false;
      buildThemePickerGrid();
      updateAndHighlight();
      showToast('Reset to Default Light theme ☀️', 'success');
    }

    function showThemePicker() {
      buildThemePickerGrid();
      document.getElementById('themePickerOverlay').classList.add('show');
    }

    function hideThemePicker() {
      document.getElementById('themePickerOverlay').classList.remove('show');
    }

    // Right-click on theme button = show theme picker
    themeToggleBtn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showThemePicker();
    });

    // Close theme picker
    document.getElementById('closeThemePicker').addEventListener('click', hideThemePicker);
    document.getElementById('themePickerOverlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('themePickerOverlay')) hideThemePicker();
    });
    document.getElementById('themeResetBtn').addEventListener('click', resetToDefaultTheme);

    // Restore saved theme on page load
    (function restoreSavedTheme() {
      const savedThemeId = localStorage.getItem('editorThemeId');
      if (savedThemeId && savedThemeId !== 'default-light') {
        const theme = themeDefinitions.find(t => t.id === savedThemeId);
        if (theme) {
          const root = document.documentElement;
          Object.entries(theme.vars).forEach(([key, val]) => {
            root.style.setProperty(key, val);
          });
          if (theme.dark) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon(true);
            document.querySelector('.container').style.backgroundColor = theme.vars['--light'];
            document.querySelector('.container').style.color = theme.vars['--text-color'];
          }
        }
      }
    })();

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
        previewFrame.srcdoc = content;
      } else if (currentFile.language === 'markdown') {
        const htmlContent = renderSimpleMarkdown(content);
        previewFrame.srcdoc = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6; 
                padding: 40px; 
                max-width: 900px; 
                margin: 0 auto;
                color: #333;
              }
              h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; }
              code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
              pre { background: #f4f4f4; padding: 16px; border-radius: 6px; overflow-x: auto; }
              blockquote { border-left: 4px solid #ddd; padding-left: 16px; margin-left: 0; color: #666; }
              img { max-width: 100%; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; }
              th { background: #f4f4f4; }
            </style>
          </head>
          <body>${htmlContent}</body>
          </html>
        `;
      } else {
        previewFrame.srcdoc = '<p style="text-align:center; margin-top:50px; color: #888; font-family: sans-serif;">Preview not available for this file type.</p>';
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

      editor.scrollTop = (targetLine - 1) * lineHeight;
      editor.focus();
      editor.setSelectionRange(lineInfo.start, lineInfo.end);

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

    function toggleLineNumbers() {
      editorContainer.classList.toggle('line-numbers-enabled');
      showToast(editorContainer.classList.contains('line-numbers-enabled') ? 'Line numbers ON' : 'Line numbers OFF', 'info');
    }



    let lastContent = editor.value;
    editor.addEventListener('input', () => {
      if (editor.value !== lastContent) {
        addToHistory();
        lastContent = editor.value;
      }
    });

    // ========================================
    // ===== FEATURE 1: FIND & REPLACE ========
    // ========================================
    const findReplacePanel = document.getElementById('findReplacePanel');
    const closeFindReplace = document.getElementById('closeFindReplace');
    const findInput = document.getElementById('findInput');
    const replaceInputField = document.getElementById('replaceInput');
    const frFindBtn = document.getElementById('frFindBtn');
    const frReplaceBtn = document.getElementById('frReplaceBtn');
    const frReplaceAllBtn = document.getElementById('frReplaceAllBtn');
    const frMatchCount = document.getElementById('frMatchCount');
    const findReplaceBtn = document.getElementById('findReplaceBtn');

    let lastFindIndex = 0;

    findReplaceBtn.addEventListener('click', toggleFindReplace);
    closeFindReplace.addEventListener('click', () => findReplacePanel.classList.remove('show'));

    function toggleFindReplace() {
      findReplacePanel.classList.toggle('show');
      if (findReplacePanel.classList.contains('show')) {
        findInput.focus();
        // If text is selected, put it in find box
        const sel = editor.value.substring(editor.selectionStart, editor.selectionEnd);
        if (sel && sel.length < 200) findInput.value = sel;
        updateMatchCount();
      }
    }

    findInput.addEventListener('input', updateMatchCount);

    function updateMatchCount() {
      const query = findInput.value;
      if (!query) { frMatchCount.textContent = ''; return; }
      const text = editor.value;
      let count = 0;
      let pos = -1;
      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      while ((pos = lowerText.indexOf(lowerQuery, pos + 1)) !== -1) count++;
      frMatchCount.textContent = count > 0 ? `${count} match${count > 1 ? 'es' : ''} found` : 'No matches';
      frMatchCount.style.color = count > 0 ? 'var(--accent)' : 'var(--secondary)';
    }

    frFindBtn.addEventListener('click', () => {
      const query = findInput.value;
      if (!query) return;
      const text = editor.value.toLowerCase();
      const pos = text.indexOf(query.toLowerCase(), lastFindIndex);
      if (pos !== -1) {
        editor.focus();
        editor.setSelectionRange(pos, pos + query.length);
        lastFindIndex = pos + 1;
        // scroll to position
        const lineHeight = parseFloat(getComputedStyle(editor).lineHeight);
        const lineNum = editor.value.substring(0, pos).split('\n').length;
        editor.scrollTop = (lineNum - 3) * lineHeight;
      } else {
        lastFindIndex = 0;
        showToast('Reached end, starting from top', 'info');
      }
    });

    frReplaceBtn.addEventListener('click', () => {
      const query = findInput.value;
      const replacement = replaceInputField.value;
      if (!query) return;
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const selected = editor.value.substring(start, end);
      if (selected.toLowerCase() === query.toLowerCase()) {
        addToHistory();
        editor.value = editor.value.substring(0, start) + replacement + editor.value.substring(end);
        editor.setSelectionRange(start + replacement.length, start + replacement.length);
        updateAndHighlight();
        updateMatchCount();
        showToast('Replaced 1 match', 'success');
      } else {
        frFindBtn.click(); // Find next first
      }
    });

    frReplaceAllBtn.addEventListener('click', () => {
      const query = findInput.value;
      const replacement = replaceInputField.value;
      if (!query) return;
      addToHistory();
      const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const count = (editor.value.match(regex) || []).length;
      editor.value = editor.value.replace(regex, replacement);
      updateAndHighlight();
      updateMatchCount();
      if (count > 0) {
        showToast(`Replaced ${count} match${count > 1 ? 'es' : ''}`, 'success');
      } else {
        showToast('No matches found', 'info');
      }
    });

    findInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); frFindBtn.click(); }
      if (e.key === 'Escape') findReplacePanel.classList.remove('show');
    });
    replaceInputField.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') findReplacePanel.classList.remove('show');
    });

    // Ctrl+Shift+H shortcut for Find & Replace
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        toggleFindReplace();
      }
    });



    // ========================================
    // ===== FEATURE 3: TEXT TRANSFORM =========
    // ========================================
    const transformBtn = document.getElementById('transformBtn');
    const transformDropdown = document.getElementById('transformDropdown');

    transformBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      transformDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!transformDropdown.contains(e.target) && e.target !== transformBtn) {
        transformDropdown.classList.remove('show');
      }
    });

    function transformText(type) {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      let text = editor.value;
      let selected = text.substring(start, end);

      // If nothing selected, apply to all text
      const applyAll = (start === end);
      if (applyAll) selected = text;

      addToHistory();
      let transformed = selected;
      switch (type) {
        case 'upper':
          transformed = selected.toUpperCase();
          break;
        case 'lower':
          transformed = selected.toLowerCase();
          break;
        case 'title':
          transformed = selected.replace(/\b\w/g, c => c.toUpperCase());
          break;
        case 'reverse':
          transformed = selected.split('').reverse().join('');
          break;
        case 'trim':
          transformed = selected.split('\n').map(l => l.trim()).join('\n');
          break;
      }

      if (applyAll) {
        editor.value = transformed;
      } else {
        editor.value = text.substring(0, start) + transformed + text.substring(end);
        editor.setSelectionRange(start, start + transformed.length);
      }

      updateAndHighlight();
      transformDropdown.classList.remove('show');
      const labels = { upper: 'UPPERCASE', lower: 'lowercase', title: 'Title Case', reverse: 'Reversed', trim: 'Trimmed' };
      showToast(`Text → ${labels[type]}`, 'success');
    }

    // ========================================
    // ===== FEATURE 4: SORT LINES =============
    // ========================================
    const sortLinesBtn = document.getElementById('sortLinesBtn');
    let sortAscending = true;

    sortLinesBtn.addEventListener('click', () => {
      addToHistory();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      let text = editor.value;

      if (start !== end) {
        // Sort only selected lines
        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end);
        const lines = selected.split('\n');
        lines.sort((a, b) => sortAscending ? a.localeCompare(b) : b.localeCompare(a));
        editor.value = before + lines.join('\n') + after;
      } else {
        // Sort all lines
        const lines = text.split('\n');
        lines.sort((a, b) => sortAscending ? a.localeCompare(b) : b.localeCompare(a));
        editor.value = lines.join('\n');
      }

      const direction = sortAscending ? 'A → Z' : 'Z → A';
      sortAscending = !sortAscending; // Toggle for next click
      updateAndHighlight();
      showToast(`Lines sorted ${direction}`, 'success');
    });



    // Also add these to mobile menu
    (function extendMobileMenu() {
      const newTools = [
        { name: 'Find & Replace', icon: 'https://cdn-icons-png.flaticon.com/512/751/751381.png', action: toggleFindReplace },
        { name: 'Sort Lines', icon: 'https://cdn-icons-png.flaticon.com/512/709/709586.png', action: () => sortLinesBtn.click() },
        { name: 'UPPERCASE', icon: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png', action: () => transformText('upper') },
        { name: 'lowercase', icon: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png', action: () => transformText('lower') }
      ];

      newTools.forEach(tool => {
        const item = document.createElement('div');
        item.className = 'mobile-menu-item';
        item.innerHTML = `<img src="${tool.icon}" alt="${tool.name}"><span>${tool.name}</span>`;
        item.addEventListener('click', () => {
          tool.action();
          mobileMenuOverlay.classList.remove('show');
        });
        mobileMenuItems.appendChild(item);
      });
    })();

    // ========================================
    // ===== GLOBAL ESC KEY CLOSE ALL =========
    // ========================================
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close ALL popups, modals, and panels
        goToLineModal.classList.remove('show');
        statsModal.classList.remove('show');

        popupOverlay.classList.remove('show');
        suggestionPopup.classList.remove('show');
        historyPopup.classList.remove('show');
        mobileMenuOverlay.classList.remove('show');
        findReplacePanel.classList.remove('show');
        transformDropdown.classList.remove('show');
        settingsOverlay.classList.remove('show');
        document.getElementById('kbdGuideOverlay').classList.remove('show');
      }
    });

    // ========================================
    // ===== SETTINGS PANEL LOGIC ==============
    // ========================================
    const settingsOverlay = document.getElementById('settingsOverlay');
    const closeSettingsBtn = document.getElementById('closeSettings');
    const settingsBtn = document.getElementById('settingsBtn');
    const SETTINGS_KEY = 'supremeEditor_settings';

    // Default settings
    const defaultSettings = {
      fontSize: 17, wordWrap: true, tabSize: 4, lineNumbers: false,
      lineHighlight: true, autoBracket: true, spellCheck: false,
      confirmDownload: false, timestamp: false, rememberFile: true,
      darkMode: false, opacity: 100, compactMode: false, syntaxHighlight: true, animations: true,
      autoDetect: true, autoSelect: true, mergeDefault: false, toasts: true,
      showFileSize: true, trimTrailing: false
    };

    let editorSettings = { ...defaultSettings };

    // Load settings
    (function loadSettings() {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        try { editorSettings = { ...defaultSettings, ...JSON.parse(saved) }; } catch (e) { }
      }
      applyAllSettings();
      syncSettingsUI();
    })();

    function saveSettings() {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(editorSettings));
    }

    function syncSettingsUI() {
      document.getElementById('setFontSize').value = editorSettings.fontSize;
      document.getElementById('fontSizeVal').textContent = editorSettings.fontSize;
      document.getElementById('setWordWrap').checked = editorSettings.wordWrap;
      document.getElementById('setTabSize').value = editorSettings.tabSize;
      document.getElementById('setLineNumbers').checked = editorSettings.lineNumbers;
      document.getElementById('setLineHighlight').checked = editorSettings.lineHighlight;
      document.getElementById('setAutoBracket').checked = editorSettings.autoBracket;
      document.getElementById('setSpellCheck').checked = editorSettings.spellCheck;

      document.getElementById('setConfirmDownload').checked = editorSettings.confirmDownload;
      document.getElementById('setTimestamp').checked = editorSettings.timestamp;
      document.getElementById('setRememberFile').checked = editorSettings.rememberFile;
      document.getElementById('setDarkMode').checked = editorSettings.darkMode;
      document.getElementById('setOpacity').value = editorSettings.opacity;
      document.getElementById('opacityVal').textContent = editorSettings.opacity + '%';
      document.getElementById('setCompactMode').checked = editorSettings.compactMode;
      document.getElementById('setSyntaxHighlight').checked = editorSettings.syntaxHighlight;
      document.getElementById('setAnimations').checked = editorSettings.animations;
      document.getElementById('setAutoDetect').checked = editorSettings.autoDetect;
      document.getElementById('setAutoSelect').checked = editorSettings.autoSelect;
      document.getElementById('setMergeDefault').checked = editorSettings.mergeDefault;
      document.getElementById('setToasts').checked = editorSettings.toasts;
      document.getElementById('setShowFileSize').checked = editorSettings.showFileSize;
      document.getElementById('setTrimTrailing').checked = editorSettings.trimTrailing;
    }

    function applyAllSettings() {
      // Font size
      editor.style.fontSize = editorSettings.fontSize + 'px';
      highlightingCode.style.fontSize = editorSettings.fontSize + 'px';
      const lineNumEl = document.getElementById('line-numbers');
      if (lineNumEl) lineNumEl.style.fontSize = editorSettings.fontSize + 'px';

      // Word wrap
      editor.style.whiteSpace = editorSettings.wordWrap ? 'pre-wrap' : 'pre';
      editor.style.wordBreak = editorSettings.wordWrap ? 'break-all' : 'normal';

      // Tab size
      editor.style.tabSize = editorSettings.tabSize;
      highlightingCode.style.tabSize = editorSettings.tabSize;

      // Line numbers
      if (editorSettings.lineNumbers) {
        editorContainer.classList.add('line-numbers-enabled');
      } else {
        editorContainer.classList.remove('line-numbers-enabled');
      }

      // Spell check
      editor.spellcheck = editorSettings.spellCheck;

      // Dark mode
      if (editorSettings.darkMode) {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
      } else {
        body.classList.remove('dark-mode');
        updateThemeIcon(false);
      }

      // Opacity
      const container = document.getElementById('mainContainer');
      container.style.opacity = editorSettings.opacity / 100;

      // Compact mode
      if (editorSettings.compactMode) {
        container.style.padding = '15px 20px';
        editor.style.padding = '12px';
      } else {
        container.style.padding = '';
        editor.style.padding = '';
      }

      // Animations
      if (!editorSettings.animations) {
        document.documentElement.style.setProperty('--anim-duration', '0s');
      } else {
        document.documentElement.style.removeProperty('--anim-duration');
      }

      // Merge default
      mergeFilesCheckbox.checked = editorSettings.mergeDefault;

      // Update highlighting
      updateAndHighlight();
    }

    // Settings button
    settingsBtn.addEventListener('click', () => {
      syncSettingsUI();
      settingsOverlay.classList.add('show');
    });
    closeSettingsBtn.addEventListener('click', () => settingsOverlay.classList.remove('show'));
    settingsOverlay.addEventListener('click', (e) => { if (e.target === settingsOverlay) settingsOverlay.classList.remove('show'); });

    // Wire up each setting
    document.getElementById('setFontSize').addEventListener('input', (e) => {
      editorSettings.fontSize = parseInt(e.target.value);
      document.getElementById('fontSizeVal').textContent = e.target.value;
      applyAllSettings(); saveSettings();
    });
    document.getElementById('setWordWrap').addEventListener('change', (e) => {
      editorSettings.wordWrap = e.target.checked;
      applyAllSettings(); saveSettings();
    });
    document.getElementById('setTabSize').addEventListener('change', (e) => {
      editorSettings.tabSize = parseInt(e.target.value);
      applyAllSettings(); saveSettings();
    });
    document.getElementById('setLineNumbers').addEventListener('change', (e) => {
      editorSettings.lineNumbers = e.target.checked;
      applyAllSettings(); saveSettings();
    });
    document.getElementById('setLineHighlight').addEventListener('change', (e) => {
      editorSettings.lineHighlight = e.target.checked;
      saveSettings();
    });
    document.getElementById('setAutoBracket').addEventListener('change', (e) => {
      editorSettings.autoBracket = e.target.checked;
      saveSettings();
    });
    document.getElementById('setSpellCheck').addEventListener('change', (e) => {
      editorSettings.spellCheck = e.target.checked;
      applyAllSettings(); saveSettings();
    });

    document.getElementById('setConfirmDownload').addEventListener('change', (e) => {
      editorSettings.confirmDownload = e.target.checked;
      saveSettings();
    });
    document.getElementById('setTimestamp').addEventListener('change', (e) => {
      editorSettings.timestamp = e.target.checked;
      saveSettings();
    });
    document.getElementById('setRememberFile').addEventListener('change', (e) => {
      editorSettings.rememberFile = e.target.checked;
      saveSettings();
    });
    document.getElementById('setDarkMode').addEventListener('change', (e) => {
      editorSettings.darkMode = e.target.checked;
      applyAllSettings(); saveSettings();
      localStorage.setItem('theme', e.target.checked ? 'dark' : 'light');
    });
    document.getElementById('setOpacity').addEventListener('input', (e) => {
      editorSettings.opacity = parseInt(e.target.value);
      document.getElementById('opacityVal').textContent = e.target.value + '%';
      applyAllSettings(); saveSettings();
    });
    document.getElementById('setCompactMode').addEventListener('change', (e) => {
      editorSettings.compactMode = e.target.checked;
      applyAllSettings(); saveSettings();
    });
    document.getElementById('setSyntaxHighlight').addEventListener('change', (e) => {
      editorSettings.syntaxHighlight = e.target.checked;
      saveSettings();
      updateAndHighlight();
    });
    document.getElementById('setAnimations').addEventListener('change', (e) => {
      editorSettings.animations = e.target.checked;
      applyAllSettings(); saveSettings();
    });
    document.getElementById('setAutoDetect').addEventListener('change', (e) => {
      editorSettings.autoDetect = e.target.checked;
      saveSettings();
    });
    document.getElementById('setAutoSelect').addEventListener('change', (e) => {
      editorSettings.autoSelect = e.target.checked;
      saveSettings();
    });
    document.getElementById('setMergeDefault').addEventListener('change', (e) => {
      editorSettings.mergeDefault = e.target.checked;
      mergeFilesCheckbox.checked = e.target.checked;
      saveSettings();
    });
    document.getElementById('setToasts').addEventListener('change', (e) => {
      editorSettings.toasts = e.target.checked;
      saveSettings();
    });
    document.getElementById('setShowFileSize').addEventListener('change', (e) => {
      editorSettings.showFileSize = e.target.checked;
      saveSettings();
    });
    document.getElementById('setTrimTrailing').addEventListener('change', (e) => {
      editorSettings.trimTrailing = e.target.checked;
      saveSettings();
    });

    // Reset settings
    document.getElementById('resetSettingsBtn').addEventListener('click', () => {
      editorSettings = { ...defaultSettings };
      saveSettings();
      applyAllSettings();
      syncSettingsUI();
      showToast('Settings reset to defaults!', 'success');
    });

    // Override showToast to respect settings
    const originalShowToast = showToast;
    showToast = function (msg, type) {
      if (editorSettings.toasts) originalShowToast(msg, type);
    };

    // Override autoDetectLanguage to respect settings
    const origAutoDetect = autoDetectLanguage;
    autoDetectLanguage = function () {
      if (editorSettings.autoDetect) origAutoDetect();
    };

    // Override auto-select behavior
    const origVisibility = () => {
      if (!document.hidden && editor && editorSettings.autoSelect) {
        setTimeout(() => editor.select(), 100);
      }
    };

    // Override auto bracket close
    editor.addEventListener('keydown', (e) => {
      if (!editorSettings.autoBracket) return;
      const pairs = { '(': ')', '[': ']', '{': '}', "'": "'", '"': '"', '`': '`' };
      if (pairs[e.key]) {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selected = editor.value.substring(start, end);
        editor.value = editor.value.substring(0, start) + e.key + selected + pairs[e.key] + editor.value.substring(end);
        editor.setSelectionRange(start + 1, start + 1 + selected.length);
        updateAndHighlight();
      }
    });


    // ========================================
    // ===== KEYBOARD SHORTCUT GUIDE ==========
    // ========================================
    const kbdGuideOverlay = document.getElementById('kbdGuideOverlay');
    const kbdGuideBtn = document.getElementById('kbdGuideBtn');
    const closeKbdGuide = document.getElementById('closeKbdGuide');

    function toggleKbdGuide() {
      kbdGuideOverlay.classList.toggle('show');
    }

    kbdGuideBtn.addEventListener('click', toggleKbdGuide);
    closeKbdGuide.addEventListener('click', () => kbdGuideOverlay.classList.remove('show'));
    kbdGuideOverlay.addEventListener('click', (e) => {
      if (e.target === kbdGuideOverlay) kbdGuideOverlay.classList.remove('show');
    });

    // ========================================
    // ===== LIVE FILE SIZE BADGE =============
    // ========================================
    const fileSizeBadge = document.getElementById('fileSizeBadge');
    const fileSizeDisplay = document.getElementById('fileSizeDisplay');

    function formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function updateFileSize() {
      const bytes = new Blob([editor.value]).size;
      fileSizeDisplay.textContent = formatFileSize(bytes);
    }

    // Update on input
    editor.addEventListener('input', updateFileSize);
    // Initial update
    setTimeout(updateFileSize, 500);

    // ========================================
    // ===== TOOLBAR BUTTON SETTINGS ==========
    // ========================================
    const toolbarBtnSettingsMap = {
      'tbEditorActions': { ids: ['undoBtn', 'redoBtn', 'duplicateLineBtn', 'deleteLineBtn'], label: 'Undo / Redo / Duplicate / Delete' },
      'tbPrintPdf': { ids: ['printBtn'], label: 'Print / PDF' },
      'tbLineNumbers': { ids: ['toggleLineNumbersBtn'], label: 'Toggle Line Numbers' },
      'tbTheme': { ids: ['themeToggleBtn'], label: 'Theme Toggle' },
      'tbGoToLine': { ids: ['goToLineBtn'], label: 'Go to Line' },
      'tbPreview': { ids: ['previewBtn'], label: 'Preview' },
      'tbCopy': { ids: ['copyBtn'], label: 'Copy to Clipboard' },
      'tbStats': { ids: ['statsBtn'], label: 'Statistics' },
      'tbFindReplace': { ids: ['findReplaceBtn'], label: 'Find & Replace' },
      'tbTransform': { ids: ['transformBtn'], label: 'Text Transform' },
      'tbSort': { ids: ['sortLinesBtn'], label: 'Sort Lines' },
      'tbKbdGuide': { ids: ['kbdGuideBtn'], label: 'Keyboard Shortcuts' }
    };

    const TOOLBAR_SETTINGS_KEY = 'supremeEditor_toolbarSettings';
    let toolbarSettings = {};

    // Load toolbar settings
    (function loadToolbarSettings() {
      const saved = localStorage.getItem(TOOLBAR_SETTINGS_KEY);
      if (saved) {
        try { toolbarSettings = JSON.parse(saved); } catch (e) { }
      }
      // Default all to enabled
      Object.keys(toolbarBtnSettingsMap).forEach(key => {
        if (toolbarSettings[key] === undefined) toolbarSettings[key] = true;
      });
      applyToolbarSettings();
    })();

    function saveToolbarSettings() {
      localStorage.setItem(TOOLBAR_SETTINGS_KEY, JSON.stringify(toolbarSettings));
    }

    function applyToolbarSettings() {
      Object.keys(toolbarBtnSettingsMap).forEach(key => {
        const mapping = toolbarBtnSettingsMap[key];
        const visible = toolbarSettings[key] !== false;
        mapping.ids.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            // For transform button, also handle parent wrapper
            if (id === 'transformBtn' && el.parentElement.style) {
              el.parentElement.style.display = visible ? '' : 'none';
            } else {
              el.style.display = visible ? '' : 'none';
            }
          }
        });
      });
    }

    // Inject Toolbar Buttons section into Settings panel
    (function injectToolbarSettingsSection() {
      const resetBtnContainer = document.querySelector('#settingsOverlay .settings-panel > div:last-child');
      if (!resetBtnContainer) return;

      const sectionHTML = `
        <div class="settings-section" id="toolbarButtonsSettingsSection">
          <div class="settings-section-title">🔘 Toolbar Buttons</div>
          ${Object.keys(toolbarBtnSettingsMap).map(key => {
        const map = toolbarBtnSettingsMap[key];
        const checked = toolbarSettings[key] !== false ? 'checked' : '';
        return `
              <div class="setting-row">
                <div>
                  <div class="setting-label"><span class="s-icon">⚙️</span> ${map.label}</div>
                  <div class="setting-desc">Show/hide in toolbar</div>
                </div>
                <label class="toggle-switch"><input type="checkbox" data-toolbar-key="${key}" ${checked}><span class="toggle-slider"></span></label>
              </div>
            `;
      }).join('')}
        </div>
      `;
      resetBtnContainer.insertAdjacentHTML('beforebegin', sectionHTML);

      // Wire up events
      document.querySelectorAll('[data-toolbar-key]').forEach(cb => {
        cb.addEventListener('change', (e) => {
          const key = e.target.getAttribute('data-toolbar-key');
          toolbarSettings[key] = e.target.checked;
          saveToolbarSettings();
          applyToolbarSettings();
        });
      });
    })();

    // Add keyboard shortcut guide to mobile menu
    (function addKbdGuideToMobile() {
      const item = document.createElement('div');
      item.className = 'mobile-menu-item';
      item.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/2920/2920276.png" alt="Shortcuts"><span>Keyboard Shortcuts</span>';
      item.addEventListener('click', () => {
        toggleKbdGuide();
        mobileMenuOverlay.classList.remove('show');
      });
      mobileMenuItems.appendChild(item);
    })();