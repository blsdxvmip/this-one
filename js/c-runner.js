/**
 * C Course Runner & Practice Arena Engine
 * In-browser C execution simulator, test case validator, and UI controller for c-practice.html
 */

(function () {
  'use strict';

  // --- Task Definitions ---
  const TASKS = {
    task1: {
      id: 'task1',
      num: 1,
      title: 'Задача 1: Привет, Си!',
      category: 'Вывод и printf',
      diff: 'Легко',
      desc: `
        <h3>Условие задачи:</h3>
        <p>Каждый программист начинает свой путь с первой классической программы на Си. Ваша задача — написать код, который выводит на экран приветствие:</p>
        <pre><code>Привет, Мир!</code></pre>
        <p>Для вывода используйте стандартную функцию <code>printf()</code> из библиотеки <code>&lt;stdio.h&gt;</code>. Не забудьте символ переноса строки <code>\\n</code> в конце текста и точку с запятой в конце инструкции.</p>
      `,
      hints: `
        <p>1. В Си вывод строк выполняется через: <code>printf("Ваш текст\\n");</code></p>
        <p>2. Точка с запятой <code>;</code> обязательна после каждой команды.</p>
        <p>3. Функция <code>main()</code> должна завершаться строкой <code>return 0;</code>.</p>
      `,
      starterCode: `#include <stdio.h>

int main(void) {
    // TODO: Используйте printf, чтобы вывести:
    // Привет, Мир!
    // Не забудьте символ \\n в конце строки!
    
    return 0;
}
`,
      runTests: function (code, runResult) {
        const tests = [];
        const output = runResult.stdout.join('\n').trim();

        // Test 1: Check output exists
        const hasOutput = output.length > 0;
        tests.push({
          name: 'Программа компилируется и выводит текст',
          passed: hasOutput,
          expected: 'Не пустой вывод в терминал',
          actual: hasOutput ? output.split('\n')[0] : '(консоль пуста)'
        });

        // Test 2: Contains "Привет, Мир!"
        const hasGreeting = output.includes('Привет, Мир!') || output.includes('Привет, мир!');
        tests.push({
          name: 'Выведена точная фраза "Привет, Мир!"',
          passed: hasGreeting,
          expected: 'Привет, Мир!',
          actual: output.split('\n')[0] || '(нет текста)'
        });

        // Test 3: Used printf
        const usedPrintf = /printf\s*\(/.test(code);
        tests.push({
          name: 'Использована стандартная функция printf',
          passed: usedPrintf,
          expected: 'Вызов printf(...)',
          actual: usedPrintf ? 'printf обнаружен' : 'printf не найден в коде'
        });

        return tests;
      }
    },

    task2: {
      id: 'task2',
      num: 2,
      title: 'Задача 2: Калькулятор сдачи',
      category: 'Арифметика и типы данных',
      diff: 'Легко',
      desc: `
        <h3>Условие задачи:</h3>
        <p>Покупатель передал в кассу сумму <code>bill</code> (в рублях), а стоимость покупки составляет <code>cost</code> (в рублях).</p>
        <p>Напишите функцию <code>int calculate_change(int bill, int cost)</code>, которая рассчитывает и возвращает сумму сдачи:</p>
        <ul>
          <li>Если денег достаточно (<code>bill &gt;= cost</code>), функция должна вернуть величину сдачи (<code>bill - cost</code>).</li>
          <li>Если покупатель дал недостаточно денег (<code>bill &lt; cost</code>), функция должна вернуть <code>-1</code> как индикатор ошибки.</li>
        </ul>
        <p><strong>Пример:</strong> <code>calculate_change(500, 364)</code> возвращает <code>136</code>.</p>
        <p><strong>Пример:</strong> <code>calculate_change(100, 150)</code> возвращает <code>-1</code>.</p>
      `,
      hints: `
        <p>1. Проверьте условие: <code>if (bill &lt; cost) return -1;</code></p>
        <p>2. Иначе рассчитайте разницу: <code>return bill - cost;</code></p>
        <p>3. Все переменные имеют тип <code>int</code>.</p>
      `,
      starterCode: `#include <stdio.h>

int calculate_change(int bill, int cost) {
    // TODO: Рассчитайте сдачу (bill - cost).
    // Если bill < cost (недостаточно денег), верните -1.
    // Иначе верните сумму сдачи.
    
    return 0;
}

int main(void) {
    // Вы можете протестировать вызов здесь:
    printf("Сдача: %d\\n", calculate_change(500, 364));
    return 0;
}
`,
      runTests: function (code, runResult) {
        const tests = [];
        const fn = runResult.env.calculate_change;

        if (typeof fn !== 'function') {
          return [{
            name: 'Функция calculate_change объявлена',
            passed: false,
            expected: 'int calculate_change(int bill, int cost)',
            actual: 'Функция не найдена в коде'
          }];
        }

        // Test 1: 500, 364 -> 136
        try {
          const res1 = fn(500, 364);
          tests.push({
            name: 'Тест 1: calculate_change(500, 364)',
            passed: res1 === 136,
            expected: 136,
            actual: res1
          });
        } catch (e) {
          tests.push({ name: 'Тест 1: calculate_change(500, 364)', passed: false, expected: 136, actual: e.message });
        }

        // Test 2: 100, 100 -> 0
        try {
          const res2 = fn(100, 100);
          tests.push({
            name: 'Тест 2: Покупка без сдачи: calculate_change(100, 100)',
            passed: res2 === 0,
            expected: 0,
            actual: res2
          });
        } catch (e) {
          tests.push({ name: 'Тест 2', passed: false, expected: 0, actual: e.message });
        }

        // Test 3: 50, 120 -> -1
        try {
          const res3 = fn(50, 120);
          tests.push({
            name: 'Тест 3: Недостаточно средств: calculate_change(50, 120)',
            passed: res3 === -1,
            expected: -1,
            actual: res3
          });
        } catch (e) {
          tests.push({ name: 'Тест 3', passed: false, expected: -1, actual: e.message });
        }

        // Test 4: 1000, 245 -> 755
        try {
          const res4 = fn(1000, 245);
          tests.push({
            name: 'Тест 4: calculate_change(1000, 245)',
            passed: res4 === 755,
            expected: 755,
            actual: res4
          });
        } catch (e) {
          tests.push({ name: 'Тест 4', passed: false, expected: 755, actual: e.message });
        }

        return tests;
      }
    },

    task3: {
      id: 'task3',
      num: 3,
      title: 'Задача 3: Фейсконтроль доступа',
      category: 'Ветвления и логические операторы',
      diff: 'Средне',
      desc: `
        <h3>Условие задачи:</h3>
        <p>Напишите функцию контроля доступа в систему безопасности: <code>int check_access(int age, int has_pass, int pin)</code>.</p>
        <p>Правила пропуска:</p>
        <ul>
          <li><strong>VIP доступ:</strong> Если передан секретный PIN-код <code>pin == 7777</code>, доступ разрешается всегда (вернуть <code>1</code>), независимо от возраста и наличия пропуска.</li>
          <li><strong>Стандартный доступ:</strong> Если возраст <code>age &gt;= 18</code> <strong>И</strong> есть пропуск (<code>has_pass == 1</code>), доступ разрешается (вернуть <code>1</code>).</li>
          <li><strong>Отказ:</strong> Во всех остальных случаях вход запрещен — функция должна вернуть <code>0</code>.</li>
        </ul>
        <p><strong>Примечание:</strong> В Си истина обозначается числом <code>1</code>, а ложь — числом <code>0</code>.</p>
      `,
      hints: `
        <p>1. Сначала проверьте VIP код: <code>if (pin == 7777) return 1;</code></p>
        <p>2. Затем проверьте стандартный доступ с логическим оператором <code>&amp;&amp;</code>: <code>if (age &gt;= 18 &amp;&amp; has_pass == 1) return 1;</code></p>
        <p>3. В конце функции верните <code>0</code>.</p>
      `,
      starterCode: `#include <stdio.h>

int check_access(int age, int has_pass, int pin) {
    // TODO: Реализуйте проверку доступа:
    // 1. Если pin равен 7777 — вернуть 1 (VIP)
    // 2. Если age >= 18 и has_pass == 1 — вернуть 1 (Стандарт)
    // 3. Во всех остальных случаях — вернуть 0
    
    return 0;
}

int main(void) {
    // Проверка работы:
    printf("Доступ (20 лет, пропуск, pin 0): %d\\n", check_access(20, 1, 0));
    printf("Доступ (16 лет, без пропуска, VIP 7777): %d\\n", check_access(16, 0, 7777));
    return 0;
}
`,
      runTests: function (code, runResult) {
        const tests = [];
        const fn = runResult.env.check_access;

        if (typeof fn !== 'function') {
          return [{
            name: 'Функция check_access объявлена',
            passed: false,
            expected: 'int check_access(int age, int has_pass, int pin)',
            actual: 'Функция не найдена'
          }];
        }

        // Test 1: 20, 1, 1234 -> 1
        try {
          const res1 = fn(20, 1, 1234);
          tests.push({
            name: 'Тест 1: Совершеннолетний с пропуском (20, 1, 1234)',
            passed: res1 === 1,
            expected: 1,
            actual: res1
          });
        } catch (e) {
          tests.push({ name: 'Тест 1', passed: false, expected: 1, actual: e.message });
        }

        // Test 2: 17, 1, 1234 -> 0
        try {
          const res2 = fn(17, 1, 1234);
          tests.push({
            name: 'Тест 2: Несовершеннолетний с пропуском (17, 1, 1234)',
            passed: res2 === 0,
            expected: 0,
            actual: res2
          });
        } catch (e) {
          tests.push({ name: 'Тест 2', passed: false, expected: 0, actual: e.message });
        }

        // Test 3: 25, 0, 1234 -> 0
        try {
          const res3 = fn(25, 0, 1234);
          tests.push({
            name: 'Тест 3: Совершеннолетний БЕЗ пропуска (25, 0, 1234)',
            passed: res3 === 0,
            expected: 0,
            actual: res3
          });
        } catch (e) {
          tests.push({ name: 'Тест 3', passed: false, expected: 0, actual: e.message });
        }

        // Test 4: 15, 0, 7777 -> 1 (VIP)
        try {
          const res4 = fn(15, 0, 7777);
          tests.push({
            name: 'Тест 4: VIP PIN-код 7777 (15, 0, 7777)',
            passed: res4 === 1,
            expected: 1,
            actual: res4
          });
        } catch (e) {
          tests.push({ name: 'Тест 4', passed: false, expected: 1, actual: e.message });
        }

        return tests;
      }
    },

    task4: {
      id: 'task4',
      num: 4,
      title: 'Задача 4: Анализ массива',
      category: 'Циклы for и массивы',
      diff: 'Средне',
      desc: `
        <h3>Условие задачи:</h3>
        <p>В языке Си массив передается в функцию вместе со своим размером <code>size</code>. Напишите функцию <code>int sum_evens(int arr[], int size)</code>, которая подсчитывает сумму всех <strong>четных</strong> чисел в переданном массиве.</p>
        <ul>
          <li>Число является четным, если остаток от деления на 2 равен нулю: <code>arr[i] % 2 == 0</code>.</li>
          <li>Если массив пуст или размер <code>size &lt;= 0</code>, функция должна вернуть <code>0</code>.</li>
        </ul>
        <p><strong>Пример:</strong> Для массива <code>{1, 2, 3, 4, 5, 6}</code> и размера <code>6</code> четными являются 2, 4 и 6. Сумма: <code>12</code>.</p>
      `,
      hints: `
        <p>1. Заведите переменную-аккумулятор: <code>int total = 0;</code></p>
        <p>2. Запустите цикл: <code>for (int i = 0; i &lt; size; i++)</code></p>
        <p>3. Проверяйте четность: <code>if (arr[i] % 2 == 0) total += arr[i];</code></p>
        <p>4. Верните <code>total;</code> после окончания цикла.</p>
      `,
      starterCode: `#include <stdio.h>

int sum_evens(int arr[], int size) {
    // TODO: Посчитайте и верните сумму четных чисел в массиве.
    // Если size <= 0, верните 0.
    
    return 0;
}

int main(void) {
    int test[] = {1, 2, 3, 4, 5, 6};
    printf("Сумма четных: %d\\n", sum_evens(test, 6)); // Ожидается 12
    return 0;
}
`,
      runTests: function (code, runResult) {
        const tests = [];
        const fn = runResult.env.sum_evens;

        if (typeof fn !== 'function') {
          return [{
            name: 'Функция sum_evens объявлена',
            passed: false,
            expected: 'int sum_evens(int arr[], int size)',
            actual: 'Функция не найдена'
          }];
        }

        // Test 1: [1, 2, 3, 4, 5, 6], 6 -> 12
        try {
          const res1 = fn([1, 2, 3, 4, 5, 6], 6);
          tests.push({
            name: 'Тест 1: Массив {1, 2, 3, 4, 5, 6}',
            passed: res1 === 12,
            expected: 12,
            actual: res1
          });
        } catch (e) {
          tests.push({ name: 'Тест 1', passed: false, expected: 12, actual: e.message });
        }

        // Test 2: [1, 3, 5, 7], 4 -> 0
        try {
          const res2 = fn([1, 3, 5, 7], 4);
          tests.push({
            name: 'Тест 2: Только нечетные числа {1, 3, 5, 7}',
            passed: res2 === 0,
            expected: 0,
            actual: res2
          });
        } catch (e) {
          tests.push({ name: 'Тест 2', passed: false, expected: 0, actual: e.message });
        }

        // Test 3: [10, -2, 5, 8], 4 -> 16
        try {
          const res3 = fn([10, -2, 5, 8], 4);
          tests.push({
            name: 'Тест 3: С отрицательными числами {10, -2, 5, 8}',
            passed: res3 === 16,
            expected: 16,
            actual: res3
          });
        } catch (e) {
          tests.push({ name: 'Тест 3', passed: false, expected: 16, actual: e.message });
        }

        // Test 4: [], 0 -> 0
        try {
          const res4 = fn([], 0);
          tests.push({
            name: 'Тест 4: Пустой массив (size = 0)',
            passed: res4 === 0,
            expected: 0,
            actual: res4
          });
        } catch (e) {
          tests.push({ name: 'Тест 4', passed: false, expected: 0, actual: e.message });
        }

        return tests;
      }
    },

    task5: {
      id: 'task5',
      num: 5,
      title: 'Задача 5: Возведение в степень',
      category: 'Функции и циклы',
      diff: 'Интересно',
      desc: `
        <h3>Условие задачи:</h3>
        <p>В стандартной библиотеке Си есть функция <code>pow()</code> из <code>&lt;math.h&gt;</code>, но настоящий программист должен уметь реализовать алгоритм самостоятельно!</p>
        <p>Напишите функцию <code>int power(int base, int exp)</code>, которая возводит целое число <code>base</code> в целую неотрицательную степень <code>exp</code> без использования внешних библиотек:</p>
        <ul>
          <li>Любое число в степени <code>0</code> равно <code>1</code> (например, <code>power(5, 0) == 1</code>).</li>
          <li>Если <code>exp &lt; 0</code>, функция должна вернуть <code>0</code> (ограничимся целыми неотрицательными степенями).</li>
          <li>Для <code>exp &gt; 0</code> вычислите произведение <code>base</code> на себя <code>exp</code> раз.</li>
        </ul>
        <p><strong>Пример:</strong> <code>power(2, 3)</code> &rarr; <code>8</code> (2 * 2 * 2).</p>
      `,
      hints: `
        <p>1. Обработайте граничные условия: <code>if (exp &lt; 0) return 0; if (exp == 0) return 1;</code></p>
        <p>2. Инициализируйте результат: <code>int result = 1;</code></p>
        <p>3. В цикле от <code>0</code> до <code>exp</code> умножайте: <code>result *= base;</code></p>
        <p>4. Верните <code>result;</code>.</p>
      `,
      starterCode: `#include <stdio.h>

int power(int base, int exp) {
    // TODO: Вычислите и верните base в степени exp.
    // При exp == 0 верните 1.
    // При exp < 0 верните 0.
    
    return 0;
}

int main(void) {
    printf("2 в степени 3 = %d\\n", power(2, 3)); // 8
    printf("5 в степени 0 = %d\\n", power(5, 0)); // 1
    return 0;
}
`,
      runTests: function (code, runResult) {
        const tests = [];
        const fn = runResult.env.power;

        if (typeof fn !== 'function') {
          return [{
            name: 'Функция power объявлена',
            passed: false,
            expected: 'int power(int base, int exp)',
            actual: 'Функция не найдена'
          }];
        }

        // Test 1: 2, 3 -> 8
        try {
          const res1 = fn(2, 3);
          tests.push({
            name: 'Тест 1: power(2, 3)',
            passed: res1 === 8,
            expected: 8,
            actual: res1
          });
        } catch (e) {
          tests.push({ name: 'Тест 1', passed: false, expected: 8, actual: e.message });
        }

        // Test 2: 5, 0 -> 1
        try {
          const res2 = fn(5, 0);
          tests.push({
            name: 'Тест 2: Нулевая степень: power(5, 0)',
            passed: res2 === 1,
            expected: 1,
            actual: res2
          });
        } catch (e) {
          tests.push({ name: 'Тест 2', passed: false, expected: 1, actual: e.message });
        }

        // Test 3: 3, 4 -> 81
        try {
          const res3 = fn(3, 4);
          tests.push({
            name: 'Тест 3: power(3, 4)',
            passed: res3 === 81,
            expected: 81,
            actual: res3
          });
        } catch (e) {
          tests.push({ name: 'Тест 3', passed: false, expected: 81, actual: e.message });
        }

        // Test 4: 10, 5 -> 100000
        try {
          const res4 = fn(10, 5);
          tests.push({
            name: 'Тест 4: power(10, 5)',
            passed: res4 === 100000,
            expected: 100000,
            actual: res4
          });
        } catch (e) {
          tests.push({ name: 'Тест 4', passed: false, expected: 100000, actual: e.message });
        }

        // Test 5: 7, 1 -> 7
        try {
          const res5 = fn(7, 1);
          tests.push({
            name: 'Тест 5: Первая степень: power(7, 1)',
            passed: res5 === 7,
            expected: 7,
            actual: res5
          });
        } catch (e) {
          tests.push({ name: 'Тест 5', passed: false, expected: 7, actual: e.message });
        }

        return tests;
      }
    }
  };

  // --- C to JavaScript Transpiler & Simulator ---
  function transpileC(code) {
    // 1. Remove multi-line comments /* ... */
    let clean = code.replace(/\/\*[\s\S]*?\*\//g, '');

    const lines = clean.split('\n');
    const jsLines = [];

    // Runtime helpers
    jsLines.push(`
      let __stepCount = 0;
      function __tick() {
        if (++__stepCount > 100000) {
          throw new Error('Превышен лимит шагов (возможно, бесконечный цикл)!');
        }
      }
      const __stdout = [];
      function printf(fmt, ...args) {
        if (fmt === undefined || fmt === null) return;
        let argIdx = 0;
        let s = String(fmt);
        s = s.replace(/%(?:d|i|f|lf|s|c|u|ld|lld)/g, function (match) {
          if (argIdx < args.length) {
            let val = args[argIdx++];
            if (match === '%c') {
              return typeof val === 'number' ? String.fromCharCode(val) : String(val);
            }
            if (match === '%f' || match === '%lf') {
              return Number(val).toFixed(6);
            }
            if (match === '%d' || match === '%i' || match === '%u' || match === '%ld' || match === '%lld') {
              return Math.trunc(Number(val));
            }
            return String(val);
          }
          return match;
        });

        // Split by real or escaped newlines
        s = s.replace(/\\\\n/g, '\\n');
        const parts = s.split('\\n');
        for (let i = 0; i < parts.length; i++) {
          let chunk = parts[i];
          if (i === 0 && __stdout.length > 0 && !__stdout[__stdout.length - 1].endsWith('\\n')) {
            __stdout[__stdout.length - 1] += chunk;
          } else if (chunk.length > 0 || i < parts.length - 1) {
            __stdout.push(chunk);
          }
        }
      }
    `);

    const knownFunctions = ['calculate_change', 'check_access', 'sum_evens', 'power', 'main'];

    for (let i = 0; i < lines.length; i++) {
      let rawLine = lines[i];
      let line = rawLine.trim();

      // Skip empty lines or preprocessor directives
      if (!line || line.startsWith('#include') || line.startsWith('#define')) {
        continue;
      }

      // Check if line defines one of our C functions
      let fnMatch = line.match(/^(?:int|void|float|double|char\*?)\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*\{?$/);
      if (fnMatch) {
        let fnName = fnMatch[1];
        let rawParams = fnMatch[2].trim();
        let cleanParams = '';

        if (rawParams && rawParams !== 'void') {
          // clean types like "int bill, int cost" or "int arr[], int size" -> "bill, cost", "arr, size"
          cleanParams = rawParams.split(',').map(p => {
            let pTrim = p.trim();
            pTrim = pTrim.replace(/\s*\[\s*\]/g, ''); // arr[] -> arr
            let parts = pTrim.split(/\s+/);
            return parts[parts.length - 1].replace(/^\*/, ''); // *ptr -> ptr
          }).join(', ');
        }

        let hasBrace = line.includes('{');
        jsLines.push(`function ${fnName}(${cleanParams}) ${hasBrace ? '{' : ''}`);
        continue;
      }

      // Transform C array literal in assignment: int test[] = {1, 2, 3}; -> let test = [1, 2, 3];
      if (/^(?:int|float|double|char)\s+([a-zA-Z0-9_]+)\s*\[\s*\]\s*=\s*\{([\s\S]*?)\};/.test(line)) {
        line = line.replace(/^(?:int|float|double|char)\s+([a-zA-Z0-9_]+)\s*\[\s*\]\s*=\s*\{([\s\S]*?)\};/, 'let $1 = [$2];');
      }

      // Transform variable declarations with initialization: int a = 5; -> let a = 5;
      line = line.replace(/^(?:int|float|double|char|long|unsigned|short|size_t)\s+([a-zA-Z0-9_]+)\s*=/g, 'let $1 =');

      // Transform variable declarations without initialization: int a; -> let a = 0;
      line = line.replace(/^(?:int|float|double|char|long|unsigned|short|size_t)\s+([a-zA-Z0-9_]+);/g, 'let $1 = 0;');

      // Transform for loop declaration: for (int i = 0; i < n; i++) -> for (let i = 0; i < n; i++)
      line = line.replace(/for\s*\(\s*(?:int|size_t)\s+/g, 'for (let ');

      // Insert tick counter in for / while loops to prevent infinite loops
      if (line.startsWith('for ') || line.startsWith('for(') || line.startsWith('while ') || line.startsWith('while(')) {
        if (line.endsWith('{')) {
          line = line + ' __tick();';
        }
      }

      jsLines.push(line);
    }

    return jsLines.join('\n');
  }

  function executeCCode(code) {
    try {
      const transpiled = transpileC(code);
      const runnerFn = new Function(`
        ${transpiled}
        
        // Execute main if defined
        if (typeof main === 'function') {
          try {
            main();
          } catch (e) {
            __stdout.push('Ошибка во время выполнения main(): ' + e.message);
          }
        }

        return {
          stdout: __stdout,
          env: {
            calculate_change: typeof calculate_change === 'function' ? calculate_change : null,
            check_access: typeof check_access === 'function' ? check_access : null,
            sum_evens: typeof sum_evens === 'function' ? sum_evens : null,
            power: typeof power === 'function' ? power : null,
            main: typeof main === 'function' ? main : null
          }
        };
      `);

      const result = runnerFn();
      return {
        success: true,
        stdout: result.stdout || [],
        env: result.env || {}
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        stdout: []
      };
    }
  }

  // --- UI Controller ---
  let currentTaskId = 'task1';

  function initPracticeUI() {
    const editor = document.getElementById('code-editor');
    const lineNumbers = document.getElementById('editor-line-numbers');
    const runBtn = document.getElementById('run-code-btn');
    const testBtn = document.getElementById('test-code-btn');
    const resetBtn = document.getElementById('reset-code-btn');
    const clearBtn = document.getElementById('clear-console-btn');
    const resetAllBtn = document.getElementById('reset-all-tasks-btn');
    const nextBtn = document.getElementById('next-task-btn');
    const terminalScreen = document.getElementById('terminal-screen');
    const taskNavBtns = document.querySelectorAll('.task-nav-item');

    if (!editor) return;

    // Load progress from localStorage
    function getSolvedTasks() {
      try {
        const stored = localStorage.getItem('c_practice_solved_tasks');
        return stored ? JSON.parse(stored) : {};
      } catch (e) {
        return {};
      }
    }

    function saveSolvedTask(taskId) {
      const solved = getSolvedTasks();
      solved[taskId] = true;
      try {
        localStorage.setItem('c_practice_solved_tasks', JSON.stringify(solved));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      updateProgressDisplay();
    }

    function getSavedCode(taskId) {
      try {
        return localStorage.getItem(`c_practice_code_${taskId}`);
      } catch (e) {
        return null;
      }
    }

    function saveCode(taskId, code) {
      try {
        localStorage.setItem(`c_practice_code_${taskId}`, code);
      } catch (e) {
        // quota exceeded or blocked
      }
    }

    function updateLineNumbers() {
      const linesCount = editor.value.split('\n').length;
      let html = '';
      for (let i = 1; i <= Math.max(linesCount, 5); i++) {
        html += `<span>${i}</span>`;
      }
      lineNumbers.innerHTML = html;
    }

    function updateProgressDisplay() {
      const solved = getSolvedTasks();
      let count = 0;
      const total = 5;

      ['task1', 'task2', 'task3', 'task4', 'task5'].forEach(id => {
        const icon = document.getElementById(`status-${id}`);
        if (solved[id]) {
          count++;
          if (icon) icon.textContent = '✅';
        } else {
          if (icon) icon.textContent = '⭕';
        }
      });

      const pct = Math.round((count / total) * 100);
      const headerText = document.getElementById('header-progress-text');
      const headerFill = document.getElementById('header-progress-fill');
      const solvedCounter = document.getElementById('solved-count');

      if (headerText) headerText.textContent = `${pct}%`;
      if (headerFill) headerFill.style.width = `${pct}%`;
      if (solvedCounter) solvedCounter.textContent = `${count} / ${total} решено`;
    }

    function loadTask(taskId) {
      currentTaskId = taskId;
      const task = TASKS[taskId];
      if (!task) return;

      // Update sidebar nav active
      taskNavBtns.forEach(btn => {
        if (btn.getAttribute('data-task') === taskId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update header details
      const titleEl = document.getElementById('current-task-title');
      const catEl = document.getElementById('current-task-category');
      const descEl = document.getElementById('task-description-content');
      const hintsEl = document.getElementById('task-hints-content');

      if (titleEl) titleEl.textContent = task.title;
      if (catEl) catEl.textContent = task.category;
      if (descEl) descEl.innerHTML = task.desc;
      if (hintsEl) hintsEl.innerHTML = task.hints;

      // Hide success card
      const successBanner = document.getElementById('task-success-banner');
      if (successBanner) successBanner.style.display = 'none';

      // Load saved code or starter code
      const saved = getSavedCode(taskId);
      editor.value = saved !== null ? saved : task.starterCode;
      updateLineNumbers();

      // Reset test panel
      const summaryBadge = document.getElementById('tests-summary-badge');
      const testList = document.getElementById('test-results-list');
      if (summaryBadge) {
        summaryBadge.textContent = 'Тесты не запускались';
        summaryBadge.className = 'test-badge';
      }
      if (testList) {
        testList.innerHTML = '<div class="empty-tests-state">Нажмите «Проверить решение», чтобы запустить тест-кейсы.</div>';
      }
    }

    // Terminal Logging
    function clearTerminal() {
      terminalScreen.innerHTML = '';
    }

    function appendTerminal(text, type = 'info') {
      const line = document.createElement('div');
      line.className = `terminal-line text-${type}`;
      line.textContent = text;
      terminalScreen.appendChild(line);
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }

    // Execution handler
    function runUserCode() {
      const code = editor.value;
      saveCode(currentTaskId, code);

      clearTerminal();
      appendTerminal('>>> Компиляция и запуск C-кода...', 'dim');

      const res = executeCCode(code);

      if (!res.success) {
        appendTerminal('Ошибка компиляции / выполнения:', 'error');
        appendTerminal(res.error, 'error');
        return res;
      }

      if (res.stdout.length === 0) {
        appendTerminal('(Программа завершилась без вывода в консоль)', 'dim');
      } else {
        res.stdout.forEach(line => appendTerminal(line, 'output'));
      }
      appendTerminal('>>> Программа завершена (код возврата 0)', 'dim');
      return res;
    }

    // Tests runner handler
    function testUserCode() {
      const runResult = runUserCode();
      const task = TASKS[currentTaskId];
      if (!task) return;

      const summaryBadge = document.getElementById('tests-summary-badge');
      const testList = document.getElementById('test-results-list');
      const successBanner = document.getElementById('task-success-banner');

      if (!runResult.success) {
        if (summaryBadge) {
          summaryBadge.textContent = 'Ошибка выполнения';
          summaryBadge.className = 'test-badge badge-fail';
        }
        if (testList) {
          testList.innerHTML = `
            <div class="test-item fail">
              <span class="test-icon">❌</span>
              <div class="test-info">
                <strong>Код не смог выполниться</strong>
                <span class="test-detail">${runResult.error}</span>
              </div>
            </div>
          `;
        }
        return;
      }

      const tests = task.runTests(editor.value, runResult);
      let passedCount = 0;
      let html = '';

      tests.forEach((t, idx) => {
        if (t.passed) {
          passedCount++;
          html += `
            <div class="test-item pass">
              <span class="test-icon">✅</span>
              <div class="test-info">
                <strong>${t.name}</strong>
                <span class="test-detail">Ожидалось: ${t.expected} | Получено: ${t.actual}</span>
              </div>
            </div>
          `;
        } else {
          html += `
            <div class="test-item fail">
              <span class="test-icon">❌</span>
              <div class="test-info">
                <strong>${t.name}</strong>
                <span class="test-detail">Ожидалось: ${t.expected} | Получено: ${t.actual}</span>
              </div>
            </div>
          `;
        }
      });

      if (testList) testList.innerHTML = html;

      const allPassed = passedCount === tests.length;
      if (summaryBadge) {
        summaryBadge.textContent = `${passedCount} / ${tests.length} пройдено`;
        summaryBadge.className = `test-badge ${allPassed ? 'badge-pass' : 'badge-fail'}`;
      }

      if (allPassed) {
        saveSolvedTask(currentTaskId);
        if (successBanner) successBanner.style.display = 'flex';
        appendTerminal(`🎉 Поздравляем! Все ${tests.length} тестов успешно пройдены!`, 'pass');
      } else {
        if (successBanner) successBanner.style.display = 'none';
        appendTerminal(`⚠️ Пройдено тестов: ${passedCount} из ${tests.length}. Проверьте замечания выше.`, 'warning');
      }
    }

    // Event Listeners
    editor.addEventListener('input', () => {
      updateLineNumbers();
      saveCode(currentTaskId, editor.value);
    });

    editor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        testUserCode();
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
        updateLineNumbers();
      }
    });

    if (runBtn) runBtn.addEventListener('click', runUserCode);
    if (testBtn) testBtn.addEventListener('click', testUserCode);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Сбросить код текущей задачи к исходному шаблону?')) {
          const task = TASKS[currentTaskId];
          if (task) {
            editor.value = task.starterCode;
            saveCode(currentTaskId, task.starterCode);
            updateLineNumbers();
            clearTerminal();
            appendTerminal('Код сброшен к исходному виду.', 'dim');
          }
        }
      });
    }

    if (clearBtn) clearBtn.addEventListener('click', clearTerminal);

    if (resetAllBtn) {
      resetAllBtn.addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите сбросить весь прогресс и сохраненный код всех 5 задач на Си?')) {
          localStorage.removeItem('c_practice_solved_tasks');
          ['task1', 'task2', 'task3', 'task4', 'task5'].forEach(id => {
            localStorage.removeItem(`c_practice_code_${id}`);
          });
          updateProgressDisplay();
          loadTask(currentTaskId);
          clearTerminal();
          appendTerminal('Весь прогресс задач Си успешно сброшен.', 'dim');
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const order = ['task1', 'task2', 'task3', 'task4', 'task5'];
        const curIdx = order.indexOf(currentTaskId);
        if (curIdx < order.length - 1) {
          loadTask(order[curIdx + 1]);
        } else {
          alert('Поздравляем! Вы решили все 5 практических задач курса по языку Си!');
        }
      });
    }

    taskNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-task');
        if (taskId) loadTask(taskId);
      });
    });

    // Initialize state
    updateProgressDisplay();
    loadTask('task1');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPracticeUI);
  } else {
    initPracticeUI();
  }
})();
