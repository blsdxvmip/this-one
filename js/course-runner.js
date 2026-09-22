/**
 * Course Runner & Practice Arena Engine
 * Handles in-browser Python execution, test case validation, and interactive UI for practice.html
 */

(function () {
  'use strict';

  // --- Task Definitions ---
  const TASKS = {
    task1: {
      id: 'task1',
      num: 1,
      title: 'Задача 1: Привет, исследователь!',
      category: 'Вывод и f-строки',
      diff: 'Легко',
      desc: `
        <h3>Условие задачи:</h3>
        <p>Напишите программу, которая объявляет две переменные:</p>
        <ul>
          <li><code>name</code> — строка с вашим именем (например, <code>"Алексей"</code>)</li>
          <li><code>language</code> — строка с названием языка (<code>"Python"</code>)</li>
        </ul>
        <p>Затем выведите на экран приветствие с использованием <strong>f-строки</strong> в точности такого формата:</p>
        <pre><code>Привет, Алексей! Добро пожаловать в мир Python.</code></pre>
        <p><strong>Примечание:</strong> Имя может быть любым, но шаблон приветствия должен строго соответствовать примеру.</p>
      `,
      hints: `
        <p>1. Переменные в Python создаются просто знаком <code>=</code>: <code>name = "Анна"</code></p>
        <p>2. Для f-строк перед открывающей кавычкой ставится буква <code>f</code>: <code>f"Текст {переменная}..."</code></p>
        <p>3. Вывод на экран осуществляется функцией <code>print(...)</code>.</p>
      `,
      starterCode: `# Задача 1: Приветствие на Python
name = "Исследователь"
language = "Python"

# Напишите print с f-строкой ниже:
print(f"Привет, {name}! Добро пожаловать в мир {language}.")
`,
      runTests: function (code, runResult) {
        const tests = [];
        const output = runResult.stdout.join('\n').trim();

        // Test 1: Check output exists
        const hasOutput = output.length > 0;
        tests.push({
          name: 'Программа выводит текст в консоль',
          passed: hasOutput,
          expected: 'Не пустой вывод',
          actual: hasOutput ? output.split('\n')[0] : '(ничего не выведено)'
        });

        // Test 2: Contains "Привет," and "Добро пожаловать в мир"
        const hasGreeting = output.includes('Привет,') && output.includes('Добро пожаловать в мир');
        tests.push({
          name: 'Использован корректный шаблон приветствия',
          passed: hasGreeting,
          expected: 'Содержит "Привет, <имя>! Добро пожаловать в мир <язык>."',
          actual: output.split('\n')[0] || '(пусто)'
        });

        // Test 3: Language is Python
        const hasPython = output.includes('Python');
        tests.push({
          name: 'Язык указан как Python',
          passed: hasPython,
          expected: 'Слово "Python" в выводе',
          actual: hasPython ? 'Присутствует' : 'Не найдено'
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
        <p>Покупатель отдал в кассу купюру <code>bill</code>, а сумма покупки составляет <code>cost</code>.</p>
        <p>Напишите функцию <code>calculate_change(bill, cost)</code>, которая возвращает словарь со сдачей и количеством монет:</p>
        <ul>
          <li><code>change</code> — общая сумма сдачи (<code>bill - cost</code>)</li>
          <li><code>coins_10</code> — количество монет номиналом 10 рублей (целочисленное деление <code>// 10</code>)</li>
          <li><code>remainder</code> — остаток сдачи после выдачи десятирублевых монет (остаток от деления <code>% 10</code>)</li>
        </ul>
        <p><strong>Пример:</strong> <code>calculate_change(500, 364)</code> &rarr; <code>{"change": 136, "coins_10": 13, "remainder": 6}</code></p>
      `,
      hints: `
        <p>1. Функция объявляется через: <code>def calculate_change(bill, cost):</code></p>
        <p>2. Сдача: <code>change = bill - cost</code></p>
        <p>3. Целочисленное деление на 10: <code>coins_10 = change // 10</code></p>
        <p>4. Остаток: <code>remainder = change % 10</code></p>
        <p>5. Верните словарь: <code>return {"change": change, "coins_10": coins_10, "remainder": remainder}</code></p>
      `,
      starterCode: `# Задача 2: Функция расчета сдачи
def calculate_change(bill, cost):
    change = bill - cost
    coins_10 = change // 10
    remainder = change % 10
    return {
        "change": change,
        "coins_10": coins_10,
        "remainder": remainder
    }

# Проверка:
print(calculate_change(500, 364))
`,
      runTests: function (code, runResult) {
        const tests = [];
        const fn = runResult.env.calculate_change;

        if (typeof fn !== 'function') {
          return [{
            name: 'Функция calculate_change объявлена',
            passed: false,
            expected: 'def calculate_change(bill, cost)',
            actual: 'Функция не найдена'
          }];
        }

        // Test 1: 500, 364
        try {
          const res1 = fn(500, 364);
          const p1 = res1 && res1.change === 136 && res1.coins_10 === 13 && res1.remainder === 6;
          tests.push({
            name: 'Тест 1: calculate_change(500, 364)',
            passed: !!p1,
            expected: 'change: 136, coins_10: 13, remainder: 6',
            actual: res1 ? `change: ${res1.change}, coins_10: ${res1.coins_10}, remainder: ${res1.remainder}` : 'null'
          });
        } catch (e) {
          tests.push({ name: 'Тест 1: calculate_change(500, 364)', passed: false, expected: 'Успешный вызов', actual: e.message });
        }

        // Test 2: 100, 100
        try {
          const res2 = fn(100, 100);
          const p2 = res2 && res2.change === 0 && res2.coins_10 === 0 && res2.remainder === 0;
          tests.push({
            name: 'Тест 2: Покупка без сдачи (100, 100)',
            passed: !!p2,
            expected: 'change: 0, coins_10: 0, remainder: 0',
            actual: res2 ? `change: ${res2.change}, coins_10: ${res2.coins_10}, remainder: ${res2.remainder}` : 'null'
          });
        } catch (e) {
          tests.push({ name: 'Тест 2: Покупка без сдачи', passed: false, expected: 'Успешный вызов', actual: e.message });
        }

        // Test 3: 1000, 245
        try {
          const res3 = fn(1000, 245);
          const p3 = res3 && res3.change === 755 && res3.coins_10 === 75 && res3.remainder === 5;
          tests.push({
            name: 'Тест 3: calculate_change(1000, 245)',
            passed: !!p3,
            expected: 'change: 755, coins_10: 75, remainder: 5',
            actual: res3 ? `change: ${res3.change}, coins_10: ${res3.coins_10}, remainder: ${res3.remainder}` : 'null'
          });
        } catch (e) {
          tests.push({ name: 'Тест 3', passed: false, expected: 'Успешный вызов', actual: e.message });
        }

        return tests;
      }
    },

    task3: {
      id: 'task3',
      num: 3,
      title: 'Задача 3: Фейсконтроль в клуб',
      category: 'Ветвления if / elif / else',
      diff: 'Средне',
      desc: `
        <h3>Условие задачи:</h3>
        <p>Создайте функцию проверки доступа: <code>check_access(age, has_pass, password)</code>.</p>
        <p>Правила проверки должны выполняться строго по порядку:</p>
        <ol>
          <li>Если <code>age &lt; 18</code> &rarr; вернуть <code>"Доступ запрещен: несовершеннолетний"</code></li>
          <li>Иначе, если <code>has_pass</code> равно <code>False</code> &rarr; вернуть <code>"Доступ запрещен: отсутствует пропуск"</code></li>
          <li>Иначе, если <code>password != "secret123"</code> &rarr; вернуть <code>"Доступ запрещен: неверный пароль"</code></li>
          <li>Во всех остальных случаях &rarr; вернуть <code>"Доступ разрешен"</code></li>
        </ol>
      `,
      hints: `
        <p>1. Используйте цепочку <code>if / elif / else</code>.</p>
        <p>2. Отрицание булевой переменной: <code>if not has_pass:</code> или <code>if has_pass == False:</code></p>
        <p>3. Проверка пароля: <code>elif password != "secret123":</code></p>
        <p>4. В конце: <code>else: return "Доступ разрешен"</code></p>
      `,
      starterCode: `# Задача 3: Фейсконтроль
def check_access(age, has_pass, password):
    if age < 18:
        return "Доступ запрещен: несовершеннолетний"
    elif not has_pass:
        return "Доступ запрещен: отсутствует пропуск"
    elif password != "secret123":
        return "Доступ запрещен: неверный пароль"
    else:
        return "Доступ разрешен"

# Проверка:
print(check_access(20, True, "secret123"))
print(check_access(16, True, "secret123"))
`,
      runTests: function (code, runResult) {
        const tests = [];
        const fn = runResult.env.check_access;

        if (typeof fn !== 'function') {
          return [{
            name: 'Функция check_access объявлена',
            passed: false,
            expected: 'def check_access(age, has_pass, password)',
            actual: 'Функция не найдена'
          }];
        }

        // Test 1: Full access
        try {
          const res1 = fn(22, true, "secret123");
          tests.push({
            name: 'Тест 1: Все условия соблюдены (22, True, "secret123")',
            passed: res1 === "Доступ разрешен",
            expected: "Доступ разрешен",
            actual: String(res1)
          });
        } catch (e) {
          tests.push({ name: 'Тест 1', passed: false, expected: 'Доступ разрешен', actual: e.message });
        }

        // Test 2: Minor
        try {
          const res2 = fn(16, true, "secret123");
          tests.push({
            name: 'Тест 2: Несовершеннолетний (16, True, "secret123")',
            passed: res2 === "Доступ запрещен: несовершеннолетний",
            expected: "Доступ запрещен: несовершеннолетний",
            actual: String(res2)
          });
        } catch (e) {
          tests.push({ name: 'Тест 2', passed: false, expected: 'Отказ по возрасту', actual: e.message });
        }

        // Test 3: No pass
        try {
          const res3 = fn(25, false, "secret123");
          tests.push({
            name: 'Тест 3: Нет пропуска (25, False, "secret123")',
            passed: res3 === "Доступ запрещен: отсутствует пропуск",
            expected: "Доступ запрещен: отсутствует пропуск",
            actual: String(res3)
          });
        } catch (e) {
          tests.push({ name: 'Тест 3', passed: false, expected: 'Отказ по пропуску', actual: e.message });
        }

        // Test 4: Wrong password
        try {
          const res4 = fn(30, true, "wrong_pass");
          tests.push({
            name: 'Тест 4: Неверный пароль (30, True, "wrong_pass")',
            passed: res4 === "Доступ запрещен: неверный пароль",
            expected: "Доступ запрещен: неверный пароль",
            actual: String(res4)
          });
        } catch (e) {
          tests.push({ name: 'Тест 4', passed: false, expected: 'Отказ по паролю', actual: e.message });
        }

        return tests;
      }
    },

    task4: {
      id: 'task4',
      num: 4,
      title: 'Задача 4: Анализатор чисел',
      category: 'Списки и цикл for',
      diff: 'Средне',
      desc: `
        <h3>Условие задачи:</h3>
        <p>Напишите функцию <code>analyze_numbers(numbers)</code>, принимающую список целых чисел.</p>
        <p>Функция должна вернуть словарь с тремя ключами:</p>
        <ul>
          <li><code>"evens"</code> — список только <strong>четных</strong> чисел из исходного списка (в исходном порядке).</li>
          <li><code>"count"</code> — количество найденных четных чисел.</li>
          <li><code>"average"</code> — среднее арифметическое четных чисел (если четных чисел нет, вернуть <code>0.0</code>).</li>
        </ul>
        <p><strong>Пример:</strong> <code>analyze_numbers([1, 2, 3, 4, 5, 6])</code> &rarr; <code>{"evens": [2, 4, 6], "count": 3, "average": 4.0}</code></p>
      `,
      hints: `
        <p>1. Число четное, если остаток от деления на 2 равен нулю: <code>num % 2 == 0</code></p>
        <p>2. Создайте пустой список: <code>evens = []</code> и добавляйте числа: <code>evens.append(num)</code></p>
        <p>3. Среднее арифметическое: <code>sum(evens) / len(evens)</code> при условии, что <code>len(evens) &gt; 0</code>.</p>
      `,
      starterCode: `# Задача 4: Фильтрация и подсчет среднего
def analyze_numbers(numbers):
    evens = []
    for num in numbers:
        if num % 2 == 0:
            evens.append(num)
    
    count = len(evens)
    avg = sum(evens) / count if count > 0 else 0.0
    
    return {
        "evens": evens,
        "count": count,
        "average": avg
    }

# Проверка:
print(analyze_numbers([1, 2, 3, 4, 5, 6]))
`,
      runTests: function (code, runResult) {
        const tests = [];
        const fn = runResult.env.analyze_numbers;

        if (typeof fn !== 'function') {
          return [{
            name: 'Функция analyze_numbers объявлена',
            passed: false,
            expected: 'def analyze_numbers(numbers)',
            actual: 'Функция не найдена'
          }];
        }

        // Test 1: [1, 2, 3, 4, 5, 6]
        try {
          const res1 = fn([1, 2, 3, 4, 5, 6]);
          const ok1 = res1 && Array.isArray(res1.evens) &&
                      res1.evens.join(',') === '2,4,6' &&
                      res1.count === 3 &&
                      Math.abs(res1.average - 4.0) < 0.001;
          tests.push({
            name: 'Тест 1: [1, 2, 3, 4, 5, 6]',
            passed: !!ok1,
            expected: 'evens: [2, 4, 6], count: 3, average: 4.0',
            actual: res1 ? `evens: [${res1.evens}], count: ${res1.count}, avg: ${res1.average}` : 'null'
          });
        } catch (e) {
          tests.push({ name: 'Тест 1', passed: false, expected: 'Корректный результат', actual: e.message });
        }

        // Test 2: [1, 3, 5] (no evens)
        try {
          const res2 = fn([1, 3, 5]);
          const ok2 = res2 && Array.isArray(res2.evens) &&
                      res2.evens.length === 0 &&
                      res2.count === 0 &&
                      res2.average === 0.0;
          tests.push({
            name: 'Тест 2: Только нечетные [1, 3, 5]',
            passed: !!ok2,
            expected: 'evens: [], count: 0, average: 0.0',
            actual: res2 ? `evens: [${res2.evens}], count: ${res2.count}, avg: ${res2.average}` : 'null'
          });
        } catch (e) {
          tests.push({ name: 'Тест 2', passed: false, expected: 'Корректный результат', actual: e.message });
        }

        // Test 3: [10, 20, 30]
        try {
          const res3 = fn([10, 20, 30]);
          const ok3 = res3 && res3.count === 3 && Math.abs(res3.average - 20.0) < 0.001;
          tests.push({
            name: 'Тест 3: Все четные [10, 20, 30]',
            passed: !!ok3,
            expected: 'evens: [10, 20, 30], count: 3, average: 20.0',
            actual: res3 ? `evens: [${res3.evens}], count: ${res3.count}, avg: ${res3.average}` : 'null'
          });
        } catch (e) {
          tests.push({ name: 'Тест 3', passed: false, expected: 'Корректный результат', actual: e.message });
        }

        return tests;
      }
    },

    task5: {
      id: 'task5',
      num: 5,
      title: 'Задача 5: Шифр Цезаря',
      category: 'Функции и алгоритмы',
      diff: 'Интересно',
      desc: `
        <h3>Условие задачи:</h3>
        <p>Шифр Цезаря — древнейший способ защиты информации, при котором каждая буква в тексте сдвигается на фиксированное число позиций <code>shift</code>.</p>
        <p>Напишите функцию <code>encrypt_caesar(text, shift)</code> для латинского алфавита в нижнем регистре (<code>'a'..'z'</code>):</p>
        <ul>
          <li>Каждая буква от <code>'a'</code> до <code>'z'</code> сдвигается вперед по алфавиту на <code>shift</code> (с циклическим переносом через <code>'z'</code> обратно в <code>'a'</code>).</li>
          <li>Пробелы, знаки препинания и цифры остаются <strong>без изменений</strong>.</li>
        </ul>
        <p><strong>Примеры:</strong></p>
        <ul>
          <li><code>encrypt_caesar("abc", 1)</code> &rarr; <code>"bcd"</code></li>
          <li><code>encrypt_caesar("xyz", 2)</code> &rarr; <code>"zab"</code></li>
          <li><code>encrypt_caesar("hello world!", 3)</code> &rarr; <code>"khoor zruog!"</code></li>
        </ul>
      `,
      hints: `
        <p>1. В Python код символа можно получить функцией <code>ord(char)</code>, а символ по коду — <code>chr(code)</code>.</p>
        <p>2. Код буквы 'a': <code>ord('a')</code> = 97. Количество букв в латинском алфавите: 26.</p>
        <p>3. Формула сдвига с зацикливанием: <code>new_code = ord('a') + (ord(char) - ord('a') + shift) % 26</code></p>
        <p>4. Проверка латинской буквы: <code>if 'a' &lt;= char &lt;= 'z':</code></p>
      `,
      starterCode: `# Задача 5: Шифр Цезаря для латинских букв
def encrypt_caesar(text, shift):
    result = ""
    for char in text:
        if 'a' <= char <= 'z':
            # Сдвиг внутри алфавита (26 букв):
            new_char = chr(ord('a') + (ord(char) - ord('a') + shift) % 26)
            result += new_char
        else:
            result += char
    return result

# Проверка:
print(encrypt_caesar("hello world!", 3))
print(encrypt_caesar("xyz", 2))
`,
      runTests: function (code, runResult) {
        const tests = [];
        const fn = runResult.env.encrypt_caesar;

        if (typeof fn !== 'function') {
          return [{
            name: 'Функция encrypt_caesar объявлена',
            passed: false,
            expected: 'def encrypt_caesar(text, shift)',
            actual: 'Функция не найдена'
          }];
        }

        // Test 1: "abc", 1 -> "bcd"
        try {
          const r1 = fn("abc", 1);
          tests.push({
            name: 'Тест 1: Сдвиг на 1 ("abc", 1)',
            passed: r1 === "bcd",
            expected: '"bcd"',
            actual: `"${r1}"`
          });
        } catch (e) {
          tests.push({ name: 'Тест 1', passed: false, expected: '"bcd"', actual: e.message });
        }

        // Test 2: "xyz", 2 -> "zab" (wrap-around)
        try {
          const r2 = fn("xyz", 2);
          tests.push({
            name: 'Тест 2: Зацикливание через z ("xyz", 2)',
            passed: r2 === "zab",
            expected: '"zab"',
            actual: `"${r2}"`
          });
        } catch (e) {
          tests.push({ name: 'Тест 2', passed: false, expected: '"zab"', actual: e.message });
        }

        // Test 3: "hello world!", 3 -> "khoor zruog!"
        try {
          const r3 = fn("hello world!", 3);
          tests.push({
            name: 'Тест 3: Текст с пробелом и знаком ("hello world!", 3)',
            passed: r3 === "khoor zruog!",
            expected: '"khoor zruog!"',
            actual: `"${r3}"`
          });
        } catch (e) {
          tests.push({ name: 'Тест 3', passed: false, expected: '"khoor zruog!"', actual: e.message });
        }

        return tests;
      }
    }
  };

  // --- Lightweight In-Browser Python Transpiler & Simulator ---
  function transpilePython(pyCode) {
    const lines = pyCode.split('\n');
    let jsLines = [];
    let indentStack = [0];

    // Helper functions preamble
    jsLines.push(`
      const __stdout = [];
      const print = (...args) => {
        const str = args.map(a => {
          if (a === null) return 'None';
          if (a === true) return 'True';
          if (a === false) return 'False';
          if (typeof a === 'object') return JSON.stringify(a);
          return String(a);
        }).join(' ');
        __stdout.push(str);
        return str;
      };
      const len = (x) => (x ? (Array.isArray(x) || typeof x === 'string' ? x.length : Object.keys(x).length) : 0);
      const sum = (x) => (Array.isArray(x) ? x.reduce((a, b) => a + Number(b), 0) : 0);
      const range = (start, stop, step) => {
        if (stop === undefined) { stop = start; start = 0; }
        step = step || 1;
        const res = [];
        if (step > 0) {
          for (let i = start; i < stop; i += step) res.push(i);
        } else {
          for (let i = start; i > stop; i += step) res.push(i);
        }
        return res;
      };
      const ord = (c) => String(c).charCodeAt(0);
      const chr = (n) => String.fromCharCode(n);
      const int = (x) => parseInt(x, 10);
      const float = (x) => parseFloat(x);
      const str = (x) => String(x);
      if (!Array.prototype.append) {
        Object.defineProperty(Array.prototype, 'append', {
          value: function (v) { this.push(v); return this; },
          writable: true, configurable: true
        });
      }
    `);

    for (let i = 0; i < lines.length; i++) {
      let rawLine = lines[i];
      // Skip empty or comment-only lines
      if (!rawLine.trim() || rawLine.trim().startsWith('#')) {
        continue;
      }

      // Calculate leading indent spaces
      const indent = rawLine.match(/^(\s*)/)[1].length;
      let line = rawLine.trim();

      // Adjust indentation stack
      while (indent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        jsLines.push('}');
      }

      // 1. Remove comments at the end of code
      line = line.replace(/(['"].*?['"])|(#.*$)/g, (m, str, com) => str || '');

      // 2. Transform f-strings: f"Hello {name}" -> `Hello ${name}`
      line = line.replace(/f(["'])(.*?)\1/g, (match, q, content) => {
        let inside = content.replace(/\{([^{}]+)\}/g, '${$1}');
        return '`' + inside + '`';
      });

      // 3. Boolean constants
      line = line.replace(/\bTrue\b/g, 'true');
      line = line.replace(/\bFalse\b/g, 'false');
      line = line.replace(/\bNone\b/g, 'null');

      // 4. Logical operators
      line = line.replace(/\band\b/g, '&&');
      line = line.replace(/\bor\b/g, '||');
      line = line.replace(/\bnot\s+/g, '!');

      // 5. Integer division: a // b -> Math.floor(a / b)
      line = line.replace(/([a-zA-Z0-9_]+)\s*\/\/\s*([a-zA-Z0-9_]+)/g, 'Math.floor($1 / $2)');

      // 6. Ternary: val if cond else other -> (cond ? val : other)
      line = line.replace(/([a-zA-Z0-9_().+\-*/\s]+?)\s+if\s+([a-zA-Z0-9_().<>=!+\-*/\s]+?)\s+else\s+([a-zA-Z0-9_().+\-*/\s]+)/g, '($2 ? $1 : $3)');

      // 7. Chained comparisons: 'a' <= char <= 'z'
      line = line.replace(/([a-zA-Z0-9_'"().]+)\s*<=\s*([a-zA-Z0-9_]+)\s*<=\s*([a-zA-Z0-9_'"().]+)/g, '($2 >= $1 && $2 <= $3)');

      // 8. Control structures:
      if (line.startsWith('def ')) {
        const m = line.match(/^def\s+([a-zA-Z0-9_]+)\s*\((.*?)\):/);
        if (m) {
          indentStack.push(indent + 4);
          jsLines.push(`function ${m[1]}(${m[2]}) {`);
          continue;
        }
      }

      if (line.startsWith('if ')) {
        const cond = line.slice(3, line.endsWith(':') ? -1 : undefined);
        indentStack.push(indent + 4);
        jsLines.push(`if (${cond}) {`);
        continue;
      }

      if (line.startsWith('elif ')) {
        const cond = line.slice(5, line.endsWith(':') ? -1 : undefined);
        // replace previous closing bracket
        jsLines.push('}');
        indentStack.pop();
        indentStack.push(indent + 4);
        jsLines.push(`else if (${cond}) {`);
        continue;
      }

      if (line.startsWith('else:')) {
        jsLines.push('}');
        indentStack.pop();
        indentStack.push(indent + 4);
        jsLines.push(`else {`);
        continue;
      }

      if (line.startsWith('for ')) {
        // for item in iter:
        const m = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?):/);
        if (m) {
          indentStack.push(indent + 4);
          jsLines.push(`for (let ${m[1]} of ${m[2]}) {`);
          continue;
        }
      }

      if (line.startsWith('while ')) {
        const cond = line.slice(6, line.endsWith(':') ? -1 : undefined);
        indentStack.push(indent + 4);
        jsLines.push(`while (${cond}) {`);
        continue;
      }

      // Simple variable assignment or statements
      jsLines.push(line + ';');
    }

    // Close remaining open blocks
    while (indentStack.length > 1) {
      indentStack.pop();
      jsLines.push('}');
    }

    return jsLines.join('\n');
  }

  function executePythonCode(code) {
    try {
      const transpiled = transpilePython(code);
      // Create execution environment
      const env = {};
      const runnerFn = new Function('__env', `
        ${transpiled}
        // Export variables and functions
        return {
          stdout: __stdout,
          env: typeof calculate_change !== 'undefined' ? { calculate_change, check_access: typeof check_access !== 'undefined' ? check_access : null, analyze_numbers: typeof analyze_numbers !== 'undefined' ? analyze_numbers : null, encrypt_caesar: typeof encrypt_caesar !== 'undefined' ? encrypt_caesar : null } : {
            check_access: typeof check_access !== 'undefined' ? check_access : null,
            analyze_numbers: typeof analyze_numbers !== 'undefined' ? analyze_numbers : null,
            encrypt_caesar: typeof encrypt_caesar !== 'undefined' ? encrypt_caesar : null
          }
        };
      `);

      const result = runnerFn(env);
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
    const nextBtn = document.getElementById('next-task-btn');
    const terminalScreen = document.getElementById('terminal-screen');
    const navItems = document.querySelectorAll('.task-nav-item');

    if (!editor) return;

    // Line numbers synchronizer
    function updateLineNumbers() {
      const count = editor.value.split('\n').length;
      let nums = '';
      for (let i = 1; i <= Math.max(5, count); i++) {
        nums += `<span>${i}</span>`;
      }
      if (lineNumbers) lineNumbers.innerHTML = nums;
    }

    editor.addEventListener('input', updateLineNumbers);
    editor.addEventListener('scroll', () => {
      if (lineNumbers) lineNumbers.scrollTop = editor.scrollTop;
    });

    // Tab key support in textarea
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
        updateLineNumbers();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (testBtn) testBtn.click();
      }
    });

    // Task Switcher
    function selectTask(taskId) {
      currentTaskId = taskId;
      const task = TASKS[taskId];
      if (!task) return;

      // Update Active Navigation Item
      navItems.forEach(item => {
        if (item.getAttribute('data-task') === taskId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Update Task Meta
      const titleEl = document.getElementById('current-task-title');
      const catEl = document.getElementById('current-task-category');
      const descEl = document.getElementById('task-description-content');
      const hintsEl = document.getElementById('task-hints-content');
      const successCard = document.getElementById('task-success-banner');

      if (titleEl) titleEl.textContent = task.title;
      if (catEl) catEl.textContent = task.category;
      if (descEl) descEl.innerHTML = task.desc;
      if (hintsEl) hintsEl.innerHTML = task.hints;
      if (successCard) successCard.style.display = 'none';

      // Load saved code from localStorage or default starter code
      const savedCode = localStorage.getItem(`python_task_${taskId}_code`);
      editor.value = savedCode || task.starterCode;
      updateLineNumbers();

      // Reset tests view
      const resultsContainer = document.getElementById('test-results-list');
      const badge = document.getElementById('tests-summary-badge');
      if (resultsContainer) resultsContainer.innerHTML = '<div class="empty-tests-state">Нажмите «Проверить решение», чтобы запустить тест-кейсы.</div>';
      if (badge) {
        badge.textContent = 'Тесты не запускались';
        badge.className = 'test-badge';
      }
    }

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        selectTask(item.getAttribute('data-task'));
      });
    });

    // Run Code Button (Pure execution)
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const code = editor.value;
        const res = executePythonCode(code);

        if (terminalScreen) {
          terminalScreen.innerHTML = '';
          if (res.success) {
            if (res.stdout.length > 0) {
              res.stdout.forEach(line => {
                const div = document.createElement('div');
                div.className = 'terminal-line';
                div.textContent = line;
                terminalScreen.appendChild(div);
              });
            } else {
              terminalScreen.innerHTML = '<div class="terminal-line text-dim"># Код выполнен без вывода в консоль (return значения вычисляются функциями).</div>';
            }
          } else {
            terminalScreen.innerHTML = `<div class="terminal-line text-error">❌ Ошибка выполнения: ${res.error}</div>`;
          }
        }
      });
    }

    // Test Code Button (Validation)
    if (testBtn) {
      testBtn.addEventListener('click', () => {
        const code = editor.value;
        // Save current code to localStorage
        localStorage.setItem(`python_task_${currentTaskId}_code`, code);

        const res = executePythonCode(code);
        const task = TASKS[currentTaskId];
        const resultsContainer = document.getElementById('test-results-list');
        const badge = document.getElementById('tests-summary-badge');
        const successCard = document.getElementById('task-success-banner');

        if (terminalScreen) {
          terminalScreen.innerHTML = '';
          if (res.success && res.stdout.length > 0) {
            res.stdout.forEach(line => {
              const div = document.createElement('div');
              div.className = 'terminal-line';
              div.textContent = line;
              terminalScreen.appendChild(div);
            });
          } else if (!res.success) {
            terminalScreen.innerHTML = `<div class="terminal-line text-error">❌ Ошибка: ${res.error}</div>`;
          }
        }

        if (!res.success) {
          if (badge) {
            badge.textContent = 'Синтаксическая ошибка';
            badge.className = 'test-badge fail';
          }
          if (resultsContainer) {
            resultsContainer.innerHTML = `<div class="test-item fail"><strong>Ошибка выполнения:</strong> ${res.error}</div>`;
          }
          return;
        }

        // Run automated unit tests
        const testResults = task.runTests(code, res);
        const passedCount = testResults.filter(t => t.passed).length;
        const allPassed = passedCount === testResults.length && testResults.length > 0;

        if (resultsContainer) {
          resultsContainer.innerHTML = '';
          testResults.forEach(t => {
            const row = document.createElement('div');
            row.className = `test-result-row ${t.passed ? 'pass' : 'fail'}`;
            row.innerHTML = `
              <div class="test-name">
                <span>${t.passed ? '✅' : '❌'}</span>
                <strong>${t.name}</strong>
              </div>
              <div class="test-details">
                <span class="test-expected">Ожидалось: <code>${t.expected}</code></span>
                <span class="test-actual">Получено: <code>${t.actual}</code></span>
              </div>
            `;
            resultsContainer.appendChild(row);
          });
        }

        if (badge) {
          badge.textContent = `${passedCount} / ${testResults.length} тестов пройдено`;
          badge.className = `test-badge ${allPassed ? 'pass' : 'fail'}`;
        }

        if (allPassed) {
          if (successCard) successCard.style.display = 'flex';
          // Mark in local storage
          markTaskSolvedInStorage(currentTaskId);
          updateTaskIcons();
        } else {
          if (successCard) successCard.style.display = 'none';
        }
      });
    }

    // Reset Code Button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Сбросить ваш код к начальному шаблону?')) {
          const task = TASKS[currentTaskId];
          if (task) {
            editor.value = task.starterCode;
            localStorage.removeItem(`python_task_${currentTaskId}_code`);
            updateLineNumbers();
          }
        }
      });
    }

    // Clear Console
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (terminalScreen) {
          terminalScreen.innerHTML = '<div class="terminal-line text-dim"># Консоль очищена.</div>';
        }
      });
    }

    // Next Task Button
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const order = ['task1', 'task2', 'task3', 'task4', 'task5'];
        const idx = order.indexOf(currentTaskId);
        if (idx !== -1 && idx < order.length - 1) {
          selectTask(order[idx + 1]);
        } else {
          alert('🎉 Поздравляем! Вы решили все 5 практических задач курса!');
        }
      });
    }

    // Helper: Mark task solved in localStorage
    function markTaskSolvedInStorage(taskId) {
      try {
        const stored = localStorage.getItem('python_solved_tasks');
        const tasks = stored ? JSON.parse(stored) : [];
        if (!tasks.includes(taskId)) {
          tasks.push(taskId);
          localStorage.setItem('python_solved_tasks', JSON.stringify(tasks));
        }
      } catch (e) {
        console.warn(e);
      }
    }

    // Helper: Update icons and counter
    function updateTaskIcons() {
      try {
        const stored = localStorage.getItem('python_solved_tasks');
        const tasks = stored ? JSON.parse(stored) : [];
        let solved = 0;

        ['task1', 'task2', 'task3', 'task4', 'task5'].forEach(tid => {
          const icon = document.getElementById(`status-${tid}`);
          if (tasks.includes(tid)) {
            if (icon) icon.textContent = '✅';
            solved++;
          } else {
            if (icon) icon.textContent = '⭕';
          }
        });

        const countEl = document.getElementById('solved-count');
        if (countEl) countEl.textContent = `${solved} / 5 решено`;

        // Update overall progress bar in header
        const progText = document.getElementById('header-progress-text');
        const progFill = document.getElementById('header-progress-fill');
        const pct = Math.round((solved / 5) * 100);
        if (progText) progText.textContent = `${pct}%`;
        if (progFill) progFill.style.width = `${pct}%`;
      } catch (e) {
        console.warn(e);
      }
    }

    // Initial load
    selectTask('task1');
    updateTaskIcons();
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPracticeUI);
  } else {
    initPracticeUI();
  }
})();
