/**
 * ==============================================================================
 * PYTHON COURSE INTERACTIVE & PROGRESS ENGINE
 * ==============================================================================
 * Handles sidebar toggling, interactive quizzes, simulated code execution,
 * copy snippet actions, and persistent course progress via LocalStorage.
 * ==============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'python_course_progress_v1';
  const TOTAL_LESSONS = 5;

  // --- Storage Helper Functions ---
  function getProgress() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { completed: [], currentLesson: 1 };
    } catch (e) {
      console.warn('LocalStorage not accessible:', e);
      return { completed: [], currentLesson: 1 };
    }
  }

  function saveProgress(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save progress to localStorage:', e);
    }
  }

  function markLessonCompleted(lessonNum) {
    const data = getProgress();
    const key = `lesson-${lessonNum}`;
    if (!data.completed.includes(key)) {
      data.completed.push(key);
      saveProgress(data);
    }
    updateUIProgress();
  }

  function updateUIProgress() {
    const data = getProgress();
    const count = data.completed.length;
    const currentLessonNum = getCurrentLessonNumber();
    
    // Header text & bar
    const counterEl = document.getElementById('progress-count-text');
    const percentEl = document.getElementById('progress-percent-text');
    const barFillEl = document.getElementById('progress-bar-fill');

    const percent = Math.min(100, Math.round((count / TOTAL_LESSONS) * 100));

    if (counterEl) {
      counterEl.textContent = `${count} из ${TOTAL_LESSONS} уроков завершено`;
    }
    if (percentEl) {
      percentEl.textContent = `${percent}%`;
    }
    if (barFillEl) {
      barFillEl.style.width = `${Math.max(10, percent)}%`;
    }

    // Sidebar items
    for (let i = 1; i <= TOTAL_LESSONS; i++) {
      const navItem = document.getElementById(`nav-lesson-${i}`);
      if (navItem) {
        if (data.completed.includes(`lesson-${i}`)) {
          navItem.classList.add('completed');
          const statusIcon = navItem.querySelector('.status-badge-icon');
          if (statusIcon) {
            statusIcon.innerHTML = `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>`;
          }
        }
      }
    }
  }

  function getCurrentLessonNumber() {
    const body = document.body;
    const lessonAttr = body.getAttribute('data-lesson');
    if (lessonAttr) return parseInt(lessonAttr, 10);

    const match = window.location.pathname.match(/0(\d)-/);
    if (match) return parseInt(match[1], 10);

    return 1;
  }

  // --- Sidebar Logic ---
  function setupSidebar() {
    const sidebar = document.getElementById('course-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const overlay = document.getElementById('sidebar-overlay');

    if (!sidebar || !toggleBtn) return;

    toggleBtn.addEventListener('click', function () {
      if (window.innerWidth <= 1024) {
        sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
      } else {
        sidebar.classList.toggle('collapsed');
      }
    });

    if (overlay) {
      overlay.addEventListener('click', function () {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
      });
    }
  }

  // --- Code Copy Buttons ---
  function setupCopyButtons() {
    const copyBtns = document.querySelectorAll('.code-copy-btn');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const parentWindow = btn.closest('.code-window');
        if (!parentWindow) return;
        const codeElement = parentWindow.querySelector('.code-body pre') || parentWindow.querySelector('.code-body code') || parentWindow.querySelector('.code-body');
        if (!codeElement) return;

        const codeText = codeElement.innerText;
        navigator.clipboard.writeText(codeText).then(() => {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#10b981;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span style="color:#10b981;">Скопировано!</span>
          `;
          setTimeout(() => {
            btn.innerHTML = originalHTML;
          }, 2000);
        }).catch(err => {
          console.error('Copy failed: ', err);
        });
      });
    });
  }

  // --- Interactive Mini-Quizzes ---
  function setupQuizzes() {
    const quizContainers = document.querySelectorAll('.quiz-section');
    quizContainers.forEach(container => {
      const options = container.querySelectorAll('.quiz-btn');
      const feedback = container.querySelector('.quiz-feedback');
      const currentLessonNum = getCurrentLessonNumber();

      options.forEach(btn => {
        btn.addEventListener('click', function () {
          const isCorrect = btn.getAttribute('data-correct') === 'true';
          const explanation = btn.getAttribute('data-explanation') || '';

          // Reset other buttons state in this container
          options.forEach(opt => {
            opt.classList.remove('correct', 'incorrect');
            opt.disabled = true;
          });

          if (isCorrect) {
            btn.classList.add('correct');
            if (feedback) {
              feedback.className = 'quiz-feedback show-feedback success';
              feedback.innerHTML = `<strong>Верно! 🎉</strong> ${explanation || 'Отличная работа, концепция усвоена безупречно!'}`;
            }
            // Mark current lesson as completed upon right answer!
            markLessonCompleted(currentLessonNum);
          } else {
            btn.classList.add('incorrect');
            // Also reveal the correct answer
            const correctBtn = container.querySelector('.quiz-btn[data-correct="true"]');
            if (correctBtn) correctBtn.classList.add('correct');

            if (feedback) {
              feedback.className = 'quiz-feedback show-feedback error';
              feedback.innerHTML = `<strong>Не совсем так 🤔</strong> ${explanation || 'Обратите внимание на детали синтаксиса и попробуйте снова.'}`;
            }
          }
        });
      });
    });
  }

  // --- Interactive Playground / Code Runner ---
  function setupRunners() {
    const runButtons = document.querySelectorAll('.btn-run-code');
    runButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const box = btn.closest('.playground-box');
        if (!box) return;

        const terminalOutput = box.querySelector('.playground-live-terminal .terminal-output');
        const customPrompt = box.querySelector('.playground-input');
        const runnerAction = btn.getAttribute('data-action');

        if (!terminalOutput) return;

        // Visual loading effect
        const originalBtnHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `
          <svg class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg> Выполняю...
        `;

        terminalOutput.textContent = 'Интерпретатор Python запускается...';

        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalBtnHTML;

          // Dispatch based on lesson
          if (runnerAction === 'print-hello') {
            terminalOutput.innerHTML = `<span style="color:#38bdf8;">Привет, Мир!</span><br><span style="color:#94a3b8; font-size:0.8rem;">[Программа завершилась с кодом 0 (OK)]</span>`;
          } else if (runnerAction === 'run-variables') {
            const userName = (customPrompt && customPrompt.value.trim()) ? customPrompt.value.trim() : 'Алекс';
            terminalOutput.innerHTML = `
              <span style="color:#cbd5e1;">Имя игрока: <strong>${userName}</strong></span><br>
              <span style="color:#cbd5e1;">Уровень: <strong>1</strong> (тип: int)</span><br>
              <span style="color:#cbd5e1;">Здоровье: <strong>100.0</strong> HP (тип: float)</span><br>
              <span style="color:#34d399;">f-строка: "Добро пожаловать в игру, ${userName}! У тебя 100.0 HP."</span>
            `;
          } else if (runnerAction === 'run-conditions') {
            const ageInput = box.querySelector('.playground-age-input');
            const age = ageInput ? parseInt(ageInput.value, 10) : 18;
            let result = '';
            if (isNaN(age) || age < 0) {
              result = `<span style="color:#f43f5e;">Ошибка: введите корректный возраст!</span>`;
            } else if (age < 14) {
              result = `<span style="color:#fbbf24;">Доступ запрещен: детям до 14 вход только с родителями.</span>`;
            } else if (age < 18) {
              result = `<span style="color:#38bdf8;">Подростковый доступ активирован: добро пожаловать!</span>`;
            } else {
              result = `<span style="color:#34d399;">Полный доступ разрешен: добро пожаловать во взрослую категорию!</span>`;
            }
            terminalOutput.innerHTML = result;
          } else if (runnerAction === 'run-loops') {
            terminalOutput.innerHTML = `
              <span style="color:#94a3b8;"># Цикл for по списку покупок:</span><br>
              <span style="color:#38bdf8;">1. 🍎 Яблоки</span><br>
              <span style="color:#38bdf8;">2. 🥖 Свежий хлеб</span><br>
              <span style="color:#38bdf8;">3. 🧀 Сыр</span><br>
              <span style="color:#38bdf8;">4. ☕ Кофе</span><br>
              <span style="color:#34d399;">Все 4 товара загружены в корзину!</span>
            `;
          } else if (runnerAction === 'run-functions') {
            const a = 15;
            const b = 25;
            const sum = a + b;
            terminalOutput.innerHTML = `
              <span style="color:#94a3b8;"># Вызов функции calculate_discount(price=1000, discount=15):</span><br>
              <span style="color:#cbd5e1;">Исходная цена: 1000 ₽</span><br>
              <span style="color:#cbd5e1;">Скидка: 15% (150 ₽)</span><br>
              <span style="color:#34d399; font-weight:bold;">Итого к оплате: 850 ₽ (получено через return)</span>
            `;
          } else {
            terminalOutput.innerHTML = `<span style="color:#34d399;">Код успешно выполнен!</span>`;
          }
        }, 400);
      });
    });
  }

  // --- Complete Lesson Button Handler ---
  function setupCompleteButtons() {
    const finishBtns = document.querySelectorAll('.btn-finish-lesson');
    finishBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const lessonNum = getCurrentLessonNumber();
        markLessonCompleted(lessonNum);
      });
    });
  }

  // Initialize all components on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    setupSidebar();
    setupCopyButtons();
    setupQuizzes();
    setupRunners();
    setupCompleteButtons();
    updateUIProgress();
  });
})();
