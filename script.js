/* JavaScript Block 8 */
if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

/* JavaScript Block 9 */
const { jsPDF } = window.jspdf;
    // Maximum number of untitled files to prevent infinite loop in naming
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
    const themeIcon = document.getElementById('themeIcon');

    // ADDED: Go To Line Elements
    const goToLineBtn = document.getElementById('goToLineBtn');
    const lineCountLabel = document.getElementById('lineCountLabel');
    const goToLineModal = document.getElementById('goToLineModal');
    const closeGoToLineModal = document.getElementById('closeGoToLineModal');
    const lineNumberInput = document.getElementById('lineNumberInput');
    const submitGoToLineBtn = document.getElementById('submitGoToLineBtn');
    const linePreview = document.getElementById('linePreview');

    // NEW: Basic Tool Elements
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const findBtn = document.getElementById('findBtn');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const duplicateLineBtn = document.getElementById('duplicateLineBtn');
    const deleteLineBtn = document.getElementById('deleteLineBtn');

    let untitledCounter = 1;
    let isPreviewMode = false; // To track if preview is active

    // NEW: Undo/Redo History
    let history = [];
    let historyIndex = -1;
    const MAX_HISTORY = 100;

    // Current file state
    let currentFile = {
      name: `Untitled-${untitledCounter}`,
      extension: 'txt',
      language: 'text'
    };

    // Mapping file extensions to programming languages for highlighting
    const languageMap = {
      'js': 'javascript', 'ts': 'typescript', 'jsx': 'jsx', 'tsx': 'tsx',
      'py': 'python', 'java': 'java', 'c': 'c', 'cpp': 'cpp', 'cs': 'csharp', 'go': 'go', 'rb': 'ruby', 'php': 'php', 'swift': 'swift', 'kt': 'kotlin',
      'html': 'html', 'xml': 'xml', 'svg': 'xml',
      'css': 'css', 'scss': 'scss', 'less': 'less',
      'json': 'json', 'yaml': 'yaml', 'yml': 'yaml', 'toml': 'toml', 'ipynb': 'json', 'ahk': 'autohotkey',
      'md': 'markdown', 'sh': 'bash', 'bat': 'batch', 'ps1': 'powershell',
      'sql': 'sql', 'txt': 'text', 'log': 'text', 'ini': 'ini', 'conf': 'text', 'csv': 'text', 'pdf': 'text',
      'dockerfile': 'dockerfile', 'graphql': 'graphql'
    };

    // Colors for file type icons and indicators
    const iconColors = {
      'js': '#f7df1e', 'ts': '#3178c6', 'jsx': '#61dafb', 'tsx': '#3178c6',
      'py': '#3572A5', 'java': '#b07219', 'c': '#555555', 'cpp': '#f34b7d', 'cs': '#178600', 'go': '#00ADD8', 'rb': '#CC342D', 'php': '#777BB4', 'swift': '#F05138', 'kt': '#7F52FF', 'ahk': '#9546a3',
      'html': '#e34c26', 'xml': '#005A9C', 'svg': '#FFB13B',
      'css': '#1572B6', 'scss': '#C6538C', 'less': '#1D365D',
      'json': '#1e88e5', 'yaml': '#cb171e', 'yml': '#cb171e', 'toml': '#99424F', 'ipynb': '#F37626',
      'md': '#083fa1', 'sh': '#89e051', 'bat': '#C1F12E', 'ps1': '#012456',
      'sql': '#f29111', 'txt': '#6c757d', 'log': '#adb5bd', 'ini': '#495057', 'conf': '#495057', 'csv': '#2dce89', 'pdf': '#d32f2f',
      'dockerfile': '#384d54', 'graphql': '#E10098',
      default: '#6c757d'
    };
    const iconTextColors = { // For better contrast on certain background colors
      'js': '#000000', 'jsx': '#000000', 'svg': '#000000', 'sh': '#000000', 'bat': '#000000', 'ipynb': '#ffffff', 'pdf': '#ffffff', 'ahk': '#ffffff',
      default: '#ffffff'
    };

    // Custom icon images for file types with online CDN URLs
    const iconImages = {
      // Programming Languages
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
      // Web
      html: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      css: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      scss: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
      jsx: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      tsx: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      // Data
      json: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg',
      xml: 'https://iili.io/2XcYAYu.png',
      yaml: 'https://iili.io/2XcYegs.png',
      yml: 'https://iili.io/2XcYegs.png',
      csv: 'https://iili.io/2XcYCUG.png',
      sql: 'https://iili.io/FcqijqJ.png',
      // Shell
      sh: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
      ahk: 'https://iili.io/FcqiVzF.jpg',
      // Documents
      md: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg',
      txt: 'https://iili.io/FcqieJp.png',
      pdf: 'https://iili.io/2XcYjZB.png',
      // Images
      jpg: 'https://iili.io/2XcYxOl.png',
      jpeg: 'https://iili.io/2XcYxOl.png',
      png: 'https://iili.io/2XcY1vV.png',
      gif: 'https://iili.io/2XcY6Rv.png',
      // Other
      ipynb: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg',
      log: 'https://iili.io/2XcYOTB.png'
    };

    // --- Event Listeners ---
    selectBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('active'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));
    dropZone.addEventListener('drop', handleFileDrop);

    downloadBtn.addEventListener('click', triggerDownloadAnimation);
    copyBtn.addEventListener('click', copyToClipboard);
    previewBtn.addEventListener('click', togglePreview);
    themeToggleBtn.addEventListener('click', toggleTheme);

    // ADDED: Go To Line Listeners
    goToLineBtn.addEventListener('click', () => {
      goToLineModal.classList.add('show');
      lineNumberInput.focus();
      lineNumberInput.value = '';
      linePreview.style.display = 'none';
      linePreview.textContent = '';
    });
    closeGoToLineModal.addEventListener('click', () => goToLineModal.classList.remove('show'));
    goToLineModal.addEventListener('click', (e) => {
      if (e.target === goToLineModal) {
        goToLineModal.classList.remove('show');
      }
    });
    submitGoToLineBtn.addEventListener('click', processGoToLine);
    lineNumberInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        processGoToLine();
      }
    });

    // NEW: Basic Tool Event Listeners
    undoBtn.addEventListener('click', performUndo);
    redoBtn.addEventListener('click', performRedo);
    findBtn.addEventListener('click', showFindDialog);
    selectAllBtn.addEventListener('click', () => { editor.select(); });
    duplicateLineBtn.addEventListener('click', duplicateLine);
    deleteLineBtn.addEventListener('click', deleteLine);

    // NEW: Selection Persistence - Save selection when leaving tab/window
    window.addEventListener('blur', saveSelection);
    window.addEventListener('focus', restoreSelection);
    editor.addEventListener('blur', saveSelection);
    editor.addEventListener('select', saveSelection);
    window.addEventListener('beforeunload', saveSelection);


    fileNameInput.addEventListener('input', updateFileInfoFromInput);
    fileNameInput.addEventListener('blur', () => { // If empty on blur, set a unique name
      if (!fileNameInput.value.trim()) {
        setUniqueUntitledName();
      }
    });

    editor.addEventListener('paste', handlePasteEvent);
    document.addEventListener('keydown', handleShortcuts);

    // Sync highlighting with editor
    editor.addEventListener('input', () => {
      autoDetectLanguage();
      updateAndHighlight();
      if (isPreviewMode) { renderPreviewContent(); }
    });
    editor.addEventListener('scroll', syncScroll);

    // --- Dropdown extension change event ---
    fileExtSelect.addEventListener('change', handleExtensionChange);

    function handleExtensionChange(e) {
      let selectedExt = fileExtSelect.value;
      if (selectedExt === 'auto') {
        // Auto-detect based on content
        autoDetectLanguage();
        return;
      }
      // Update currentFile extension and language
      currentFile.extension = selectedExt;
      currentFile.language = languageMap[selectedExt] || 'text';
      // Update filename extension
      let nameWithExt = fileNameInput.value.trim();
      let lastDotIndex = nameWithExt.lastIndexOf('.');
      let baseName = (lastDotIndex > 0) ? nameWithExt.substring(0, lastDotIndex) : nameWithExt;
      fileNameInput.value = baseName + '.' + selectedExt;
      updateUIDisplay();
    }

    // --- Initialization ---
    document.addEventListener('DOMContentLoaded', () => {
      setUniqueUntitledName();
      // Apply theme from local storage on load
      const savedTheme = localStorage.getItem('theme') || 'light';
      if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
      }
      updateAndHighlight(); // Initial highlight and line count
    });

    // --- Core Functions ---

    /**
     * Handles keyboard shortcuts for the application.
     * @param {KeyboardEvent} e - The keydown event.
     */
    function handleShortcuts(e) {
      // TAB key for downloading the file.
      if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault(); // Prevents default tabbing behavior.
        downloadBtn.click();
        return;
      }

      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            if (!e.shiftKey) {
              e.preventDefault();
              performUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            performRedo();
            break;
          case 'f':
            e.preventDefault();
            showFindDialog();
            break;
          case 'a':
            // Let browser handle Ctrl+A naturally for select all
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
        }
      }
    }

    /**
     * Updates the highlighted code view and line count based on the textarea content.
     */
    function updateAndHighlight() {
      const code = editor.value;
      highlightingCode.textContent = code;

      // Update language class for highlight.js
      highlightingCode.className = ''; // Clear existing classes
      const lang = languageMap[currentFile.extension] || 'plaintext';
      highlightingCode.classList.add(`language-${lang}`);

      // Highlight
      hljs.highlightElement(highlightingCode);

      // ADDED: Update line count
      updateLineCount();

      // Sync scroll
      syncScroll();
    }

    /**
     * Syncs the scroll position of the textarea and the highlighting area.
     */
    function syncScroll() {
      highlightingArea.scrollTop = editor.scrollTop;
      highlightingArea.scrollLeft = editor.scrollLeft;
    }


    /**
     * Handles file selection from the input element.
     */
    function handleFileSelect(e) {
      if (e.target.files.length) {
        handleFile(e.target.files[0]);
        fileInput.value = null; // Clear input
      }
    }

    /**
     * Handles file drop onto the drop zone.
     */
    function handleFileDrop(e) {
      e.preventDefault();
      dropZone.classList.remove('active');
      if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
      }
    }

    /**
     * Processes a selected or dropped file.
     */
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
        if (isPreviewMode) { renderPreviewContent(); }
        editor.style.opacity = '0';
        editor.scrollTop = 0;
        setTimeout(() => editor.style.opacity = '1', 50);
        showToast(`"${file.name}" loaded successfully!`, 'success');
        autoDetectLanguage();
        updateAndHighlight(); // Highlight new content and update line count
      };
      reader.onerror = () => { showToast(`Error reading file: ${file.name}`, 'error'); }
      reader.readAsText(file);
    }

    /**
     * Updates file information based on user input in the filename field.
     */
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

    /**
     * Sets a unique "Untitled" name for new files.
     */
    function setUniqueUntitledName() {
      let newName = `Untitled-${untitledCounter}`;
      currentFile.name = newName;
      currentFile.extension = 'txt';
      fileNameInput.value = `${currentFile.name}.${currentFile.extension}`;
      untitledCounter++;
      updateUIDisplay();
    }

    /**
     * Updates the UI elements (language indicator, file icon) based on current file info.
     */
    function updateUIDisplay() {
      currentFile.language = languageMap[currentFile.extension] || 'text';
      const langName = currentFile.language.charAt(0).toUpperCase() + currentFile.language.slice(1);
      languageIndicatorText.textContent = langName;
      const ext = currentFile.extension;
      languageIndicatorDot.style.backgroundColor = iconColors[ext] || iconColors.default;
      // Custom icon logic
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
        previewBtn.title = "Toggle Preview";
      } else {
        previewBtn.disabled = true;
        previewBtn.style.opacity = '0.5';
        previewBtn.title = "Preview not available for this file type";
        if (isPreviewMode) { togglePreview(); }
      }
      updateAndHighlight(); // Re-highlight when language changes
    }

    /**
     * Handles the paste event to insert clipboard content into the editor.
     */
    function handlePasteEvent(e) {
      e.preventDefault();
      if (isPreviewMode) {
        showToast('Pasting is disabled in preview mode. Switch to code view.', 'info');
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
      } else {
        showToast('Failed to paste. No text data found.', 'error');
      }
    }

    /**
     * Copies editor content to clipboard.
     */
    function copyToClipboard() {
      if (isPreviewMode) {
        showToast('Copying is disabled in preview mode. Switch to code view.', 'info');
        return;
      }
      if (!editor.value) {
        showToast('Nothing to copy!', 'info');
        return;
      }
      navigator.clipboard.writeText(editor.value)
        .then(() => {
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
          `;
          setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
          showToast('Copied to clipboard!', 'success');
        })
        .catch(err => {
          showToast('Failed to copy! Please use Ctrl+C.', 'error');
          console.error('Copy failed:', err);
        });
    }

    /**
     * Triggers a visual animation for the download button.
     */
    function triggerDownloadAnimation() {
      if (isPreviewMode) {
        showToast('Download is disabled in preview mode. Switch to code view.', 'info');
        return;
      }
      spinner.style.display = 'inline-block';
      downloadBtn.disabled = true;
      downloadBtn.querySelector('svg:not(.spinner)').style.display = 'none';

      setTimeout(() => {
        downloadFile();
        spinner.style.display = 'none';
        downloadBtn.disabled = false;
        downloadBtn.querySelector('svg:not(.spinner)').style.display = 'inline-block';
      }, 10);
    }

    /**
     * Initiates the file download.
     */
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
        console.error('Download error:', error);
      }
    }

    /**
     * Generates a PDF from the editor content and downloads it.
     */
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
        console.error('PDF Generation Error:', error);
      }
    }

    /**
     * Displays a toast notification.
     */
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
        case 'warning':
          toast.classList.add('warning');
          iconSVG = '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>';
          break;
        default: // 'info'
          toast.classList.add('info');
          iconSVG = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>';
      }
      toastIcon.innerHTML = iconSVG;

      toast.style.transform = 'translateX(-50%) translateY(0) scale(1.05)';
      setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(0) scale(1)'; }, 150);
      setTimeout(() => { toast.classList.remove('show'); }, 3500);
    }

    /**
     * Attempts to auto-detect the language of the content in the editor.
     */
    function autoDetectLanguage() {
      const content = editor.value.substring(0, 3000).trim();
      let detectedExt = currentFile.extension;

      if (content.startsWith('<!DOCTYPE html>') || /<html[^>]*>/i.test(content.substring(0, 500)) || (/<body[^>]*>/i.test(content.substring(0, 500)) && /<head[^>]*>/i.test(content.substring(0, 500)))) {
        detectedExt = 'html';
      } else if ((content.includes('"nbformat"') && content.includes('"cells"')) && (content.startsWith('{') && content.endsWith('}'))) {
        detectedExt = 'ipynb';
      } else if (/(^|\n)\s*;.*/.test(content.substring(0, 1000)) || /::/.test(content.substring(0, 500)) || /:=/.test(content.substring(0, 500))) {
        detectedExt = 'ahk';
      } else if (/(^|\s)(def|class|import|from)\s[a-zA-Z_]/.test(content.substring(0, 1000)) && /:/.test(content.substring(0, 500))) {
        detectedExt = 'py';
      } else if (/(^|\s)(function|const|let|var)\s.*\{/.test(content.substring(0, 500)) || /=>\s*\{/.test(content.substring(0, 500))) {
        detectedExt = 'js';
      } else if (/\/\*[\s\S]*?\*\/|\/\/.*/.test(content.substring(0, 500)) && /\{[\s\S]*?\}/.test(content.substring(0, 500)) && /:[^=]/.test(content.substring(0, 500))) {
        if (/@import|@media|@font-face|#[a-zA-Z][\w-]*/.test(content.substring(0, 500)) || /\.[a-zA-Z][\w-]*/.test(content.substring(0, 500))) {
          detectedExt = 'css';
        }
      } else if (content.startsWith('{') && content.endsWith('}') || content.startsWith('[') && content.endsWith(']')) {
        try { JSON.parse(content.substring(0, Math.min(content.length, 5000))); detectedExt = 'json'; } catch (e) { /* not json */ }
      } else if (/SELECT\s[\s\S]*?\sFROM\s/i.test(content.substring(0, 500)) || /CREATE\sTABLE/i.test(content.substring(0, 500))) {
        detectedExt = 'sql';
      } else if (content.startsWith('---') && content.includes(': ') && content.split('\n').length > 2) {
        detectedExt = 'yaml';
      } else if ((content.startsWith('#') && !content.startsWith('#!')) || /^#{1,6}\s/.test(content.substring(0, 200)) || /\[.*\]\(.*\)/.test(content.substring(0, 500)) || /`[^`]+`/.test(content.substring(0, 500))) {
        detectedExt = 'md';
      }

      if (currentFile.extension !== detectedExt && languageMap[detectedExt]) {
        currentFile.extension = detectedExt;

        const currentNameLower = currentFile.name.toLowerCase();
        if (currentNameLower.startsWith('untitled') || currentNameLower === 'output' || currentNameLower === 'newfile' || !fileNameInput.value.includes('.')) {
          fileNameInput.value = `${currentFile.name}.${currentFile.extension}`;
        } else {
          const parts = fileNameInput.value.split('.');
          if (parts.length > 1 && languageMap[parts[parts.length - 1].toLowerCase()]) parts.pop();
          fileNameInput.value = parts.join('.') + '.' + currentFile.extension;
        }
        updateUIDisplay();
        showToast(`Language auto-detected: ${currentFile.language.toUpperCase()}`, 'info');
      }
    }

    // --- Theme Toggle ---
    /**
     * Toggles the dark/light theme for the page.
     */
    function toggleTheme() {
      const isDark = body.classList.toggle('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeIcon(isDark);
      // No need to change highlight.js theme, it's always dark.
      updateAndHighlight();
    }

    /**
     * Updates the theme icon to a sun or moon.
     * @param {boolean} isDark - True if dark mode is active.
     */
    function updateThemeIcon(isDark) {
      const sunIcon = '<path d="M12 1v2"></path><path d="M12 21v2"></path><path d="m4.22 4.22 1.42 1.42"></path><path d="m18.36 18.36 1.42 1.42"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="m4.22 19.78 1.42-1.42"></path><path d="m18.36 5.64 1.42-1.42"></path><circle cx="12" cy="12" r="5"></circle>';
      const moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
      themeIcon.innerHTML = isDark ? sunIcon : moonIcon;
    }


    // --- Preview Functionality ---

    /**
     * Toggles between editor view and preview view.
     */
    function togglePreview() {
      isPreviewMode = !isPreviewMode;
      if (isPreviewMode) {
        renderPreviewContent();
        editorContainer.style.display = 'none';
        previewArea.style.display = 'block';
        previewBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Show Code`;
        previewBtn.title = "Show Code";
      } else {
        editorContainer.style.display = 'block';
        previewArea.style.display = 'none';
        previewBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Preview`;
        previewBtn.title = "Toggle Preview";
        editor.focus();
      }
    }

    /**
     * Renders the editor content into the preview area.
     */
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

    /**
     * A simple Markdown to HTML renderer.
     */
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

    // --- ADDED: Go To Line Functionality ---

    /**
     * Updates the line count display on the button.
     */
    function updateLineCount() {
      const lines = editor.value.split('\n').length;
      lineCountLabel.textContent = `Lines: ${lines}`;
      lineNumberInput.max = lines; // Set max for the input field
    }

    /**
     * Gets the start and end character indices for a given line number.
     * @param {string} text - The full text content.
     * @param {number} lineNumber - The 1-based line number.
     * @returns {{start: number, end: number}|null}
     */
    function getLineStartEnd(text, lineNumber) {
      const lines = text.split('\n');
      if (lineNumber > lines.length || lineNumber < 1) {
        return null;
      }
      let start = 0;
      for (let i = 0; i < lineNumber - 1; i++) {
        start += lines[i].length + 1; // +1 for the newline character
      }
      const end = start + lines[lineNumber - 1].length;
      return { start, end };
    }

    /**
     * Handles the logic for jumping to a specific line.
     */
    function processGoToLine() {
      const totalLines = editor.value.split('\n').length;
      const targetLine = parseInt(lineNumberInput.value, 10);

      if (isNaN(targetLine) || targetLine < 1 || targetLine > totalLines) {
        showToast(`Invalid line number. Must be between 1 and ${totalLines}.`, 'error');
        lineNumberInput.focus();
        lineNumberInput.select();
        return;
      }

      const lineInfo = getLineStartEnd(editor.value, targetLine);
      if (!lineInfo) return; // Should not happen due to previous check

      // 1. Get line height and editor padding for accurate positioning
      const computedStyle = window.getComputedStyle(editor);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const editorPaddingTop = parseFloat(computedStyle.paddingTop);

      // 2. Scroll to line
      editor.scrollTop = (targetLine - 1) * lineHeight;

      // 3. Select the line in the textarea
      editor.focus();
      editor.setSelectionRange(lineInfo.start, lineInfo.end);

      // 4. Show line content in the popup's preview area
      const lineText = editor.value.substring(lineInfo.start, lineInfo.end);
      linePreview.textContent = lineText.trim() || '(This line is empty)';
      linePreview.style.display = 'block';

      // 5. Create and animate the blinking highlighter div
      const highlighterDiv = document.createElement('div');
      highlighterDiv.className = 'line-highlighter';
      highlighterDiv.style.top = `${(targetLine - 1) * lineHeight + editorPaddingTop}px`;
      highlighterDiv.style.height = `${lineHeight}px`;

      editorContainer.appendChild(highlighterDiv);
      setTimeout(() => {
        highlighterDiv.remove();
      }, 1000); // Remove after 1s animation is complete

      // 6. Close the modal after a short delay to show the preview
      setTimeout(() => {
        goToLineModal.classList.remove('show');
      }, 400);
    }

    // --- NEW BASIC TOOL FUNCTIONS ---

    /**
     * Saves current selection to localStorage for persistence across tab switches
     */
    function saveSelection() {
      if (document.activeElement === editor || editor.contains(document.activeElement)) {
        const selection = {
          start: editor.selectionStart,
          end: editor.selectionEnd,
          content: editor.value
        };
        localStorage.setItem('editor_selection', JSON.stringify(selection));
      }
    }

    /**
     * Restores saved selection when returning to the tab
     */
    function restoreSelection() {
      try {
        const saved = localStorage.getItem('editor_selection');
        if (saved) {
          const selection = JSON.parse(saved);
          // Only restore if content matches (hasn't changed)
          if (selection.content === editor.value && selection.start !== undefined) {
            setTimeout(() => {
              editor.focus();
              editor.setSelectionRange(selection.start, selection.end);
            }, 100);
          }
        }
      } catch (e) {
        console.error('Failed to restore selection:', e);
      }
    }

    /**
     * Adds current state to history for undo/redo
     */
    function addToHistory() {
      const state = {
        content: editor.value,
        selectionStart: editor.selectionStart,
        selectionEnd: editor.selectionEnd
      };

      // Remove any future history if we're not at the end
      if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
      }

      history.push(state);
      if (history.length > MAX_HISTORY) {
        history.shift();
      } else {
        historyIndex++;
      }
      updateUndoRedoButtons();
    }

    /**
     * Performs undo operation
     */
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

    /**
     * Performs redo operation
     */
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

    /**
     * Updates undo/redo button states
     */
    function updateUndoRedoButtons() {
      undoBtn.disabled = historyIndex <= 0;
      redoBtn.disabled = historyIndex >= history.length - 1;
      undoBtn.style.opacity = historyIndex <= 0 ? '0.5' : '1';
      redoBtn.style.opacity = historyIndex >= history.length - 1 ? '0.5' : '1';
    }

    /**
     * Shows find and replace dialog
     */
    function showFindDialog() {
      const findText = prompt('Enter text to find:');
      if (findText === null || findText === '') return;

      const replaceText = prompt('Enter replacement text (leave empty to just find):');

      if (replaceText === null) {
        // Just find and select
        const index = editor.value.indexOf(findText, editor.selectionEnd);
        if (index !== -1) {
          editor.focus();
          editor.setSelectionRange(index, index + findText.length);
          showToast(`Found at position ${index}`, 'success');
        } else {
          showToast('Text not found', 'error');
        }
      } else {
        // Replace all
        addToHistory();
        const count = (editor.value.match(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        editor.value = editor.value.split(findText).join(replaceText);
        updateAndHighlight();
        showToast(`Replaced ${count} occurrence(s)`, 'success');
      }
    }

    /**
     * Duplicates the current line or selection
     */
    function duplicateLine() {
      addToHistory();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const value = editor.value;

      if (start === end) {
        // No selection - duplicate current line
        const lines = value.split('\n');
        let charCount = 0;
        let lineIndex = 0;

        for (let i = 0; i < lines.length; i++) {
          if (charCount + lines[i].length >= start) {
            lineIndex = i;
            break;
          }
          charCount += lines[i].length + 1; // +1 for newline
        }


        const lineToDuplicate = lines[lineIndex];
        lines.splice(lineIndex + 1, 0, lineToDuplicate);
        editor.value = lines.join('\n');
        editor.setSelectionRange(start, end);
      } else {
        // Duplicate selection
        const selectedText = value.substring(start, end);
        editor.value = value.substring(0, end) + selectedText + value.substring(end);
        editor.setSelectionRange(end, end + selectedText.length);
      }

      updateAndHighlight();
      showToast('Line duplicated', 'success');
    }

    /**
     * Deletes the current line
     */
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

    // Initialize history with initial state
    addToHistory();

    // Capture changes for undo/redo
    let lastContent = editor.value;
    editor.addEventListener('input', () => {
      if (editor.value !== lastContent) {
        addToHistory();
        lastContent = editor.value;
      }
    });

    // === NEW TOOL IMPLEMENTATIONS ===
    const wordCountBtn = document.getElementById('wordCountBtn');
    const wordCountDisplay = document.getElementById('wordCountDisplay');
    const trimSpacesBtn = document.getElementById('trimSpacesBtn');
    const sortLinesBtn = document.getElementById('sortLinesBtn');
    const timestampBtn = document.getElementById('timestampBtn');
    const toggleLineNumbersBtn = document.getElementById('toggleLineNumbersBtn');

    if (wordCountBtn) wordCountBtn.addEventListener('click', showWordCount);
    if (trimSpacesBtn) trimSpacesBtn.addEventListener('click', trimSpaces);
    if (sortLinesBtn) sortLinesBtn.addEventListener('click', sortLines);
    if (timestampBtn) timestampBtn.addEventListener('click', insertTimestamp);
    if (toggleLineNumbersBtn) toggleLineNumbersBtn.addEventListener('click', toggleLineNumbers);
    editor.addEventListener('input', updateWordCountDisplay);

    function updateWordCountDisplay() {
      const text = editor.value;
      const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      if (wordCountDisplay) wordCountDisplay.textContent = wordCount;
    }

    function showWordCount() {
      const text = editor.value;
      const charCount = text.length;
      const charCountNoSpaces = text.replace(/\s/g, '').length;
      const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      const lineCount = text.split('\n').length;
      alert(`Words: ${wordCount}\nCharacters: ${charCount}\nCharacters (no spaces): ${charCountNoSpaces}\nLines: ${lineCount}`);
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
        lines.sort();
        editor.value = lines.join('\n');
      } else {
        const beforeSelection = editor.value.substring(0, start);
        const selection = editor.value.substring(start, end);
        const afterSelection = editor.value.substring(end);
        const lines = selection.split('\n');
        lines.sort();
        const sorted = lines.join('\n');
        editor.value = beforeSelection + sorted + afterSelection;
        editor.setSelectionRange(start, start + sorted.length);
      }
      updateAndHighlight();
      showToast('Lines sorted alphabetically', 'success');
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
      const container = document.getElementById('editor-container');
      if (container) {
        container.classList.toggle('line-numbers-enabled');
        showToast(container.classList.contains('line-numbers-enabled') ? 'Line numbers ON' : 'Line numbers OFF', 'info');
      }
    }

    updateWordCountDisplay();

    // ===== PDF VIEWER IMPLEMENTATION =====
    let currentPDF = null;
    let isPDFMode = false;

    async function renderPDF(file) {
      if (typeof pdfjsLib === 'undefined') {
        showToast('PDF.js not loaded', 'error');
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        try {
          const typedarray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          currentPDF = pdf;
          isPDFMode = true;

          // Hide editor, show PDF content in editor area
          editor.style.display = 'none';
          highlightingArea.style.display = 'none';

          // Create PDF container if doesn't exist
          let pdfContainer = document.getElementById('pdf-viewer-container');
          if (!pdfContainer) {
            pdfContainer = document.createElement('div');
            pdfContainer.id = 'pdf-viewer-container';
            pdfContainer.style.cssText = 'padding:20px; background:#fff; border-radius:8px; overflow-y:auto; max-height:600px;';
            editorContainer.appendChild(pdfContainer);
          }
          pdfContainer.style.display = 'block';
          pdfContainer.innerHTML = '<h3 style="color:#333; margin-top:0;">PDF Preview (' + pdf.numPages + ' pages)</h3>';

          // Render all pages
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.style.cssText = 'display:block; margin:10px auto; box-shadow:0 2px 8px rgba(0,0,0,0.1); max-width:100%; height:auto;';
            pdfContainer.appendChild(canvas);

            await page.render({ canvasContext: context, viewport: viewport }).promise;
          }

          showToast(`PDF loaded: ${pdf.numPages} pages`, 'success');
        } catch (error) {
          showToast('Error loading PDF', 'error');
          console.error(error);
        }
      };
      fileReader.readAsArrayBuffer(file);
    }

    function closePDFViewer() {
      isPDFMode = false;
      const pdfContainer = document.getElementById('pdf-viewer-container');
      if (pdfContainer) pdfContainer.style.display = 'none';
      editor.style.display = 'block';
      highlightingArea.style.display = 'block';
      currentPDF = null;
    }

    // ===== AUTO SELECT ON TAB RETURN =====
    let wasVisible = true;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !wasVisible) {
        setTimeout(() => {
          editor.select();
          showToast('All text selected', 'info');
        }, 200);
      }
      wasVisible = (document.visibilityState === 'visible');
    });

    // ===== EMOJI TOOLS =====
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{238C}-\u{2454}\u{20D0}-\u{20FF}]/gu;

    function updateEmojiCount() {
      const matches = editor.value.match(emojiRegex);
      const count = matches ? matches.length : 0;
      const emojiCountDisplay = document.getElementById('emojiCount');
      if (emojiCountDisplay) emojiCountDisplay.textContent = count;
    }

    function countEmojis() {
      const matches = editor.value.match(emojiRegex);
      const count = matches ? matches.length : 0;
      const emojiList = matches ? [...new Set(matches)].join(' ') : 'None';
      alert(`Emoji Count: ${count}\n\nUnique Emojis: ${emojiList}`);
    }

    function removeAllEmojis() {
      if (confirm('Remove all emojis from text?')) {
        addToHistory();
        editor.value = editor.value.replace(emojiRegex, '');
        updateAndHighlight();
        updateEmojiCount();
        showToast('All emojis removed', 'success');
      }
    }

    function insertEmojiPicker() {
      const emojis = ['😀', '😂', '😍', '🎉', '👍', '❤️', '🔥', '✨', '💯', '🚀', '😎', '🤔', '👏', '🙌', '💪', '🎯', '✅', '⭐', '📝', '💡', '🌟', '💻', '🖥️', '⌨️', '🖱️'];
      const selected = prompt('Choose emoji number:\n' + emojis.map((e, i) => `${i}: ${e}`).join('  '));
      if (selected !== null && !isNaN(selected) && emojis[selected]) {
        const start = editor.selectionStart;
        editor.value = editor.value.substring(0, start) + emojis[selected] + editor.value.substring(editor.selectionEnd);
        editor.setSelectionRange(start + 2, start + 2);
        editor.focus();
        updateAndHighlight();
        updateEmojiCount();
      }
    }

    // ===== COMMENT/UNCOMMENT TOOL =====
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

      const allCommented = lines.slice(startLine, endLine + 1).every(line => line.trim().startsWith('//') || line.trim().startsWith('#'));

      for (let i = startLine; i <= endLine; i++) {
        if (allCommented) {
          lines[i] = lines[i].replace(/^\s*(\/\/|#)\s?/, '');
        } else {
          const ext = currentFile.extension || 'txt';
          const commentChar = ['py', 'sh', 'yaml', 'yml'].includes(ext) ? '#' : '//';
          lines[i] = commentChar + ' ' + lines[i];
        }
      }

      editor.value = lines.join('\n');
      updateAndHighlight();
      showToast(allCommented ? 'Uncommented' : 'Commented', 'success');
    }

    // ===== INDENT/OUTDENT TOOLS =====
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

    // EVENT LISTENERS FOR NEW TOOLS
    editor.addEventListener('input', updateEmojiCount);
    const emojiCountBtn = document.getElementById('emojiCountBtn');
    const removeEmojisBtn = document.getElementById('removeEmojisBtn');
    const insertEmojiBtn = document.getElementById('insertEmojiBtn');
    const commentToggleBtn = document.getElementById('commentToggleBtn');
    const indentBtn = document.getElementById('indentBtn');
    const outdentBtn = document.getElementById('outdentBtn');

    if (emojiCountBtn) emojiCountBtn.addEventListener('click', countEmojis);
    if (removeEmojisBtn) removeEmojisBtn.addEventListener('click', removeAllEmojis);
    if (insertEmojiBtn) insertEmojiBtn.addEventListener('click', insertEmojiPicker);
    if (commentToggleBtn) commentToggleBtn.addEventListener('click', toggleComments);
    if (indentBtn) indentBtn.addEventListener('click', indentLines);
    if (outdentBtn) outdentBtn.addEventListener('click', outdentLines);

    // Initialize emoji count
    updateEmojiCount();

    // ===== CUSTOM STATS MODAL & LINE COUNT =====
    function updateLineCountDisplay() {
      const lineCount = editor.value.split('\n').length;
      const lineCountValue = document.getElementById('lineCountValue');
      const lineCountLabel = document.getElementById('lineCountLabel');
      if (lineCountValue) lineCountValue.textContent = lineCount;
      if (lineCountLabel) lineCountLabel.textContent = `Lines: ${lineCount}`;
    }

    // Custom modal for word count
    window.showWordCount = function () {
      const text = editor.value;
      const charCount = text.length;
      const charCountNoSpaces = text.replace(/\s/g, '').length;
      const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      const lineCount = text.split('\n').length;

      // Update modal content
      const modalWordCount = document.getElementById('modalWordCount');
      const modalCharCount = document.getElementById('modalCharCount');
      const modalCharNoSpaces = document.getElementById('modalCharNoSpaces');
      const modalLineCount = document.getElementById('modalLineCount');

      if (modalWordCount) modalWordCount.textContent = wordCount;
      if (modalCharCount) modalCharCount.textContent = charCount;
      if (modalCharNoSpaces) modalCharNoSpaces.textContent = charCountNoSpaces;
      if (modalLineCount) modalLineCount.textContent = lineCount;

      // Show modal
      const modal = document.getElementById('statsModal');
      const overlay = document.getElementById('statsModalOverlay');
      if (modal) modal.classList.add('show');
      if (overlay) overlay.classList.add('show');
    };

    window.closeStatsModal = function () {
      const modal = document.getElementById('statsModal');
      const overlay = document.getElementById('statsModalOverlay');
      if (modal) modal.classList.remove('show');
      if (overlay) overlay.classList.remove('show');
    };

    // Close on overlay click
    const statsModalOverlay = document.getElementById('statsModalOverlay');
    const closeStatsModalBtn = document.getElementById('closeStatsModal');
    if (statsModalOverlay) statsModalOverlay.addEventListener('click', closeStatsModal);
    if (closeStatsModalBtn) closeStatsModalBtn.addEventListener('click', closeStatsModal);

    // Update line count on input
    editor.addEventListener('input', updateLineCountDisplay);
    updateLineCountDisplay();