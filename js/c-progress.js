/**
 * ==============================================================================
 * C PROGRAMMING COURSE - PROGRESS & INTERACTIVE ENGINE
 * ==============================================================================
 * Handles C-specific course progress, interactive playgrounds, memory simulators,
 * quizzes with pedagogical explanations, and sidebar navigation.
 * ==============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'c_course_progress_v1';
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

  function getCurrentLessonNumber() {
    const body = document.body;
    const lessonAttr = body.getAttribute('data-lesson');
    if (lessonAttr) return parseInt(lessonAttr, 10);

    const match = window.location.pathname.match(/0(\d)-/);
    if (match) return parseInt(match[1], 10);

    return 1;
  }

  function updateUIProgress() {
    const data = getProgress();
    const count = data.completed.length;

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
      barFillEl.style.width = `${Math.max(8, percent)}%`;
    }

    // Update sidebar lesson items
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
            markLessonCompleted(currentLessonNum);
          } else {
            btn.classList.add('incorrect');
            const correctBtn = container.querySelector('.quiz-btn[data-correct="true"]');
            if (correctBtn) correctBtn.classList.add('correct');

            if (feedback) {
              feedback.className = 'quiz-feedback show-feedback error';
              feedback.innerHTML = `<strong>Не совсем так 🤔</strong> ${explanation || 'Обратите внимание на детали синтаксиса и устройство языка Си.'}`;
            }
          }
        });
      });
    });
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // --- Interactive C Playgrounds ---
  function setupRunners() {
    const runButtons = document.querySelectorAll('.btn-run-code');
    runButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const box = btn.closest('.playground-box');
        if (!box) return;

        const terminalOutput = box.querySelector('.playground-live-terminal .terminal-output');
        const runnerAction = btn.getAttribute('data-action');

        if (!terminalOutput) return;

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
          </svg> Компиляция GCC...
        `;

        terminalOutput.textContent = 'Компилятор GCC запускает препроцессор и линковщик...';

        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalBtnHTML;

          // Dispatch based on lesson
          if (runnerAction === 'c-run-intro') {
            const textInput = box.querySelector('.c-playground-text');
            const addNewline = box.querySelector('.c-playground-newline');
            const text = (textInput && textInput.value) ? textInput.value : 'Привет из языка Си!';
            const hasNewline = addNewline ? addNewline.checked : true;

            terminalOutput.innerHTML = `
              <span style="color:#64748b;">$ gcc -Wall -O2 main.c -o program</span><br>
              <span style="color:#64748b;">$ ./program</span><br>
              <span style="color:#38bdf8; font-weight:600;">${escapeHTML(text)}</span>${hasNewline ? '<br>' : '<span style="color:#f59e0b; font-size:0.8rem;"> % (нет переноса строки \\n — курсор остался здесь)</span><br>'}
              <span style="color:#10b981; font-size:0.8rem;">[Процесс завершился с кодом 0 (OK) • return 0;]</span>
            `;
          } else if (runnerAction === 'c-run-variables') {
            const typeSelect = box.querySelector('.c-var-type');
            const valInput = box.querySelector('.c-var-val');
            const withAmpersand = box.querySelector('.c-var-ampersand');

            const type = typeSelect ? typeSelect.value : 'int';
            const rawVal = valInput ? valInput.value.trim() : '42';
            const hasAmp = withAmpersand ? withAmpersand.checked : true;

            let size = 4;
            let specifier = '%d';
            let formattedVal = rawVal;
            let mockAddress = '0x7ffd5b89a244';

            if (type === 'int') {
              size = 4;
              specifier = '%d';
              formattedVal = parseInt(rawVal, 10) || 0;
            } else if (type === 'float') {
              size = 4;
              specifier = '%f';
              formattedVal = (parseFloat(rawVal) || 0).toFixed(4);
            } else if (type === 'double') {
              size = 8;
              specifier = '%lf';
              formattedVal = (parseFloat(rawVal) || 0).toFixed(6);
            } else if (type === 'char') {
              size = 1;
              specifier = '%c';
              formattedVal = rawVal.charAt(0) || 'A';
              const ascii = formattedVal.charCodeAt(0);
              mockAddress = '0x7ffd5b89a248';
              formattedVal = `'${formattedVal}' (ASCII код: ${ascii})`;
            }

            if (!hasAmp) {
              terminalOutput.innerHTML = `
                <span style="color:#f43f5e; font-weight:bold;">⚠️ ОШИБКА В scanf! Забыт знак &amp;:</span><br>
                <code style="color:#fbbf24;">scanf("${specifier}", val); // Передано значение вместо адреса!</code><br><br>
                <span style="color:#ef4444;">[1] 3482 Segmentation fault (core dumped)</span><br>
                <span style="color:#94a3b8; font-size:0.85rem;">Функция scanf попыталась записать ввод по адресу, равному числу ${escapeHTML(String(rawVal))}, вместо реального адреса памяти переменной (${mockAddress}). Память защищена ОС!</span>
              `;
            } else {
              terminalOutput.innerHTML = `
                <span style="color:#94a3b8;">// Карта оперативной памяти (RAM):</span><br>
                <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:0.6rem; margin:0.4rem 0;">
                  <div>Ячейка памяти: <strong style="color:#a855f7;">${mockAddress}</strong> <span style="color:#64748b;">(&amp;my_var)</span></div>
                  <div>Тип: <strong style="color:#38bdf8;">${type}</strong> | Занимает: <strong style="color:#fbbf24;">${size} байт(а)</strong> (sizeof)</div>
                  <div>Спецификатор формата: <strong style="color:#34d399;">${specifier}</strong></div>
                  <div>Хранимое значение: <strong style="color:#10b981;">${escapeHTML(String(formattedVal))}</strong></div>
                </div>
                <span style="color:#94a3b8;">Команда scanf("%s", &amp;my_var) успешно записала байты напрямую в ячейку ${mockAddress}!</span>
              `;
            }
          } else if (runnerAction === 'c-run-conditions') {
            const numInput = box.querySelector('.c-cond-input');
            const useSwitch = box.querySelector('.c-cond-mode');
            const val = numInput ? parseInt(numInput.value, 10) : 0;
            const mode = useSwitch ? useSwitch.value : 'if';

            let out = '';
            if (mode === 'truthiness') {
              const isTruth = val !== 0;
              out = `
                <span style="color:#94a3b8;">// Проверка истинности значения ${val} в языке Си:</span><br>
                <span style="color:#cbd5e1;">Выражение: <code>if (${val}) { ... }</code></span><br>
                Результат: ${isTruth ? '<strong style="color:#10b981;">ИСТИНА (True)</strong>' : '<strong style="color:#ef4444;">ЛОЖЬ (False)</strong>'}<br>
                <span style="color:#94a3b8; font-size:0.85rem;">Правило Си: строго 0 — это ложь. Любое ненулевое число (1, -1, 42) интерпретируется как ИСТИНА.</span>
              `;
            } else if (mode === 'switch') {
              out = `<span style="color:#94a3b8;">// Выполнение конструкции switch (${val}):</span><br>`;
              switch (val) {
                case 1:
                  out += `<span style="color:#38bdf8;">case 1: Режим «Новичок» активирован. break;</span>`;
                  break;
                case 2:
                  out += `<span style="color:#fbbf24;">case 2: Режим «Мастер» активирован. break;</span>`;
                  break;
                case 3:
                  out += `<span style="color:#a855f7;">case 3: Режим «Бог Си (указатели)» активирован. break;</span>`;
                  break;
                default:
                  out += `<span style="color:#f43f5e;">default: Неизвестная команда ${val}! Сработала ветка по умолчанию.</span>`;
                  break;
              }
            } else {
              out = `<span style="color:#94a3b8;">// Выполнение if (${val} > 0) ... else if ... else:</span><br>`;
              if (val > 0) {
                out += `<span style="color:#10b981;">✅ Число ${val} положительное (ветка if (x > 0))</span>`;
              } else if (val < 0) {
                out += `<span style="color:#38bdf8;">❄️ Число ${val} отрицательное (ветка else if (x < 0))</span>`;
              } else {
                out += `<span style="color:#fbbf24;">⚪ Число равно точно нулю (ветка else)</span>`;
              }
            }
            terminalOutput.innerHTML = out;
          } else if (runnerAction === 'c-run-loops') {
            const idxInput = box.querySelector('.c-array-idx');
            const targetIdx = idxInput ? parseInt(idxInput.value, 10) : 2;
            const arr = [10, 20, 30, 40, 50];

            let html = `<span style="color:#94a3b8;">// Массив int arr[5] = {10, 20, 30, 40, 50};</span><br>`;
            html += `<div style="display:flex; gap:6px; margin:0.5rem 0; flex-wrap:wrap;">`;
            for (let i = 0; i < 5; i++) {
              const isTarget = (i === targetIdx);
              html += `
                <div style="border:1px solid ${isTarget ? '#10b981' : 'rgba(255,255,255,0.15)'}; background:${isTarget ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)'}; padding:6px 12px; border-radius:6px; text-align:center;">
                  <div style="font-size:0.75rem; color:#94a3b8;">arr[${i}]</div>
                  <div style="font-size:1.1rem; font-weight:bold; color:${isTarget ? '#10b981' : '#fff'};">${arr[i]}</div>
                  <div style="font-size:0.65rem; color:#64748b;">+${i * 4}B</div>
                </div>
              `;
            }
            html += `</div>`;

            if (targetIdx >= 0 && targetIdx < 5) {
              html += `<span style="color:#10b981;">Безопасное чтение arr[${targetIdx}] = ${arr[targetIdx]}. Адрес: (arr + ${targetIdx})</span>`;
            } else {
              html += `
                <div style="background:rgba(239,68,68,0.12); border:1px solid #ef4444; border-radius:6px; padding:0.6rem; margin-top:0.5rem; color:#fca5a5;">
                  <strong>🚨 ВЫХОД ЗА ГРАНИЦЫ МАССИВА (Buffer Overflow / UB)!</strong><br>
                  Индекс [${targetIdx}] выходит за пределы диапазона 0..4. Язык Си ради скорости не выполняет bounds checking. Вы читаете/перезаписываете чужую память (мусор или адрес возврата)!
                </div>
              `;
            }
            terminalOutput.innerHTML = html;
          } else if (runnerAction === 'c-run-pointers') {
            const valInput = box.querySelector('.c-ptr-val');
            const modifyViaPtr = box.querySelector('.c-ptr-mode');
            const newVal = valInput ? parseInt(valInput.value, 10) : 99;
            const usePointer = modifyViaPtr ? modifyViaPtr.checked : true;

            const memAddr = '0x7ffeb08';
            const ptrAddr = '0x7ffeb10';

            terminalOutput.innerHTML = `
              <span style="color:#94a3b8;">// Интерактивная карта памяти:</span><br>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:0.5rem 0;">
                <div style="background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.3); border-radius:6px; padding:0.6rem;">
                  <div style="font-size:0.75rem; color:#93c5fd;">Переменная <strong>int x</strong></div>
                  <div style="font-size:0.75rem; color:#64748b;">Адрес (&amp;x): <span style="color:#a855f7;">${memAddr}</span></div>
                  <div style="font-size:1.2rem; font-weight:bold; color:#fff; margin-top:4px;">Значение: <span style="color:#34d399;">${newVal}</span></div>
                </div>
                <div style="background:rgba(168,85,247,0.1); border:1px solid rgba(168,85,247,0.3); border-radius:6px; padding:0.6rem;">
                  <div style="font-size:0.75rem; color:#d8b4fe;">Указатель <strong>int *p = &amp;x</strong></div>
                  <div style="font-size:0.75rem; color:#64748b;">Собственный адрес (&amp;p): ${ptrAddr}</div>
                  <div style="font-size:1.2rem; font-weight:bold; color:#a855f7; margin-top:4px;">Хранит: ${memAddr}</div>
                </div>
              </div>
              <div style="color:${usePointer ? '#a855f7' : '#38bdf8'}; font-size:0.9rem;">
                ${usePointer ? `Выполнено разыменование: <code>*p = ${newVal};</code>. Мы пошли по адресу ${memAddr} и записали туда новое число! Теперь x == ${newVal}.` : `Прямое присваивание: <code>x = ${newVal};</code>. Значение в ячейке ${memAddr} обновлено.`}
              </div>
            `;
          } else {
            terminalOutput.innerHTML = `<span style="color:#10b981;">[GCC] Код скомпилирован и выполнен успешно.</span>`;
          }
        }, 400);
      });
    });
  }

  // --- Complete Lesson Navigation Handler ---
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
