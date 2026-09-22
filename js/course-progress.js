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

        function escapeHTML(str) {
          return String(str).replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
          }[tag] || tag));
        }

        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalBtnHTML;

          // Dispatch based on lesson
          if (runnerAction === 'print-hello') {
            const customMsgInput = box.querySelector('.playground-text-input') || customPrompt;
            const msg = (customMsgInput && customMsgInput.value.trim()) ? customMsgInput.value.trim() : 'Привет, Мир!';
            terminalOutput.innerHTML = `
              <span style="color:#38bdf8;">${escapeHTML(msg)}</span><br>
              <span style="color:#94a3b8; font-size:0.8rem;">[Команда print() выполнена. Вывод передан в stdout. Код 0 (OK)]</span>
            `;
          } else if (runnerAction === 'run-variables') {
            const userNameInput = box.querySelector('.playground-name-input') || customPrompt;
            const userRoleInput = box.querySelector('.playground-role-input');
            const userLevelInput = box.querySelector('.playground-level-input');

            const userName = (userNameInput && userNameInput.value.trim()) ? userNameInput.value.trim() : 'Кибер-Ниндзя';
            const userRole = (userRoleInput && userRoleInput.value) ? userRoleInput.value : 'Маг';
            const userLevel = (userLevelInput && !isNaN(parseInt(userLevelInput.value, 10))) ? parseInt(userLevelInput.value, 10) : 7;
            const hp = (userLevel * 14.5).toFixed(1);
            const isAlive = true;

            terminalOutput.innerHTML = `
              <span style="color:#94a3b8;"># Создание и типизация переменных:</span><br>
              <span style="color:#cbd5e1;">hero_name = <strong>"${escapeHTML(userName)}"</strong> <em style="color:#64748b;">(тип: str)</em></span><br>
              <span style="color:#cbd5e1;">role = <strong>"${escapeHTML(userRole)}"</strong> <em style="color:#64748b;">(тип: str)</em></span><br>
              <span style="color:#cbd5e1;">level = <strong>${userLevel}</strong> <em style="color:#64748b;">(тип: int)</em></span><br>
              <span style="color:#cbd5e1;">hp = <strong>${hp}</strong> <em style="color:#64748b;">(тип: float)</em></span><br>
              <span style="color:#cbd5e1;">is_alive = <strong>${isAlive}</strong> <em style="color:#64748b;">(тип: bool)</em></span><br>
              <div style="margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px dashed rgba(255,255,255,0.15); color:#34d399;">
                f-строка: "Герой [${escapeHTML(userName)}] класса ${escapeHTML(userRole)} достиг уровня ${userLevel}! Здоровье: ${hp} HP."
              </div>
            `;
          } else if (runnerAction === 'run-conditions') {
            const ageInput = box.querySelector('.playground-age-input');
            const vipInput = box.querySelector('.playground-vip-input');
            const age = ageInput ? parseInt(ageInput.value, 10) : 18;
            const isVip = vipInput ? vipInput.checked : false;

            let result = '';
            if (isNaN(age) || age < 0) {
              result = `<span style="color:#f43f5e;">❌ Ошибка: укажите корректный неотрицательный возраст!</span>`;
            } else if (age >= 18 && isVip) {
              result = `<span style="color:#a855f7; font-weight:bold;">👑 VIP-статус подтвержден:</span> <span style="color:#cbd5e1;">Возраст ${age} лет + VIP-билет. Добро пожаловать в закрытый клуб!</span>`;
            } else if (age >= 18) {
              result = `<span style="color:#34d399; font-weight:bold;">✅ Полный доступ:</span> <span style="color:#cbd5e1;">Возраст ${age} лет (условие age &gt;= 18 истинно). Добро пожаловать!</span>`;
            } else if (age >= 14 && isVip) {
              result = `<span style="color:#38bdf8; font-weight:bold;">🎟️ Подростковый VIP-доступ:</span> <span style="color:#cbd5e1;">Возраст ${age} лет. Доступ разрешен с молодежным куратором.</span>`;
            } else if (age >= 14) {
              result = `<span style="color:#fbbf24; font-weight:bold;">⚠️ Ограниченный доступ:</span> <span style="color:#cbd5e1;">Возраст ${age} лет. Доступ разрешен только в дневную зону.</span>`;
            } else {
              result = `<span style="color:#f43f5e; font-weight:bold;">⛔ Доступ запрещен:</span> <span style="color:#cbd5e1;">Возраст ${age} лет. Детям до 14 лет вход строго с родителями.</span>`;
            }
            terminalOutput.innerHTML = result;
          } else if (runnerAction === 'run-loops') {
            const countInput = box.querySelector('.playground-loop-count');
            const count = countInput ? Math.min(10, Math.max(1, parseInt(countInput.value, 10) || 4)) : 4;
            const items = ["🍎 Яблоки", "🥖 Свежий хлеб", "🧀 Сыр", "☕ Кофе", "🥛 Молоко", "🍊 Апельсины", "🍫 Шоколад", "🥑 Авокадо", "🍯 Мёд", "🍇 Виноград"];
            const selectedItems = items.slice(0, count);

            let outHTML = `<span style="color:#94a3b8;"># Выполнение цикла for idx, item in enumerate(cart[:${count}], 1):</span><br>`;
            selectedItems.forEach((item, idx) => {
              outHTML += `<span style="color:#38bdf8;">  Итерация ${idx + 1}: упакован ${item}</span><br>`;
            });
            outHTML += `<span style="color:#34d399; font-weight:600;">✓ Цикл завершен успешно! Обработано элементов: ${count}</span>`;
            terminalOutput.innerHTML = outHTML;
          } else if (runnerAction === 'run-functions') {
            const priceInput = box.querySelector('.playground-price-input');
            const discountInput = box.querySelector('.playground-discount-input');

            const price = priceInput ? Math.max(0, parseFloat(priceInput.value) || 1000) : 1000;
            const discount = discountInput ? Math.min(100, Math.max(0, parseFloat(discountInput.value) || 15)) : 15;

            const discountRub = (price * (discount / 100));
            const finalPrice = (price - discountRub);

            terminalOutput.innerHTML = `
              <span style="color:#94a3b8;"># Вызов: calc_discount(price=${price}, discount_percent=${discount})</span><br>
              <span style="color:#cbd5e1;">1. Переданы аргументы: цена = <strong>${price} ₽</strong>, скидка = <strong>${discount}%</strong></span><br>
              <span style="color:#cbd5e1;">2. Внутри функции рассчитана экономия: <strong>${discountRub.toFixed(1)} ₽</strong></span><br>
              <span style="color:#cbd5e1;">3. Инструкция <code>return final_price</code> возвращает число <strong>${finalPrice.toFixed(1)}</strong></span><br>
              <div style="margin-top:0.4rem; padding-top:0.4rem; border-top:1px dashed rgba(255,255,255,0.15); color:#34d399; font-weight:bold;">
                Итого к оплате сохранено в переменную: ${finalPrice.toFixed(1)} ₽
              </div>
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
