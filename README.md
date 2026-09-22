# 💻 DevStarter — Интерактивная платформа обучения Python & Си (C)

<p align="center">
  <img src="https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github" alt="Live Demo">
  <img src="https://img.shields.io/badge/Python%20Track-5%20Lessons%20%2B%205%20Tasks-yellow?style=for-the-badge&logo=python" alt="Python Track">
  <img src="https://img.shields.io/badge/C%20Track-5%20Lessons%20%2B%205%20Tasks-blue?style=for-the-badge&logo=c" alt="C Track">
  <img src="https://img.shields.io/badge/Design-Calm%20Docs%20Theme-27272a?style=for-the-badge" alt="Calm Theme">
  <img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" alt="MIT License">
</p>

<p align="center">
  <b>Бесплатный открытый образовательный портал для изучения программирования с абсолютного нуля.</b><br>
  Два полноценных образовательных трека (Python и Си), интерактивные песочницы, визуализаторы памяти и два браузерных тренажера с автоматической проверкой решений.
</p>

<p align="center">
  👉 <b><a href="https://blsdxvmip.github.io/this-one/">Главная страница (Live Demo)</a></b><br>
  🐍 <b><a href="https://blsdxvmip.github.io/this-one/practice.html">Тренажер Python (5 задач)</a></b> | 
  ⚡ <b><a href="https://blsdxvmip.github.io/this-one/c-practice.html">Тренажер Си (5 задач)</a></b>
</p>

---

## 🌟 Главные особенности

- 🎓 **Обучение с нуля**: не требуется опыт в программировании или знание высшей математики.
- 📐 **Два фундаментальных направления**:
  - **Python**: выразительный, легкий для старта язык для автоматизации, скриптов и алгоритмов.
  - **Си (C)**: системный язык для понимания архитектуры компьютеров, типов данных, указателей и управления памятью.
- 💻 **Встроенные тренажеры (Practice Arenas)**: пишите и тестируйте код прямо в браузере без установки компиляторов и IDE.
- 🤖 **Автоматическая проверка автотестами**: мгновенная валидация решений с показом входных данных, ожидаемого и фактического результата.
- 🎯 **Честные шаблоны задач**: решения не предзаполнены — студент сам пишет логику согласно комментариям `// TODO:` и `pass`.
- 📊 **Сохранение прогресса**: завершенные уроки и решенные задачи надежно сохраняются в браузере (`localStorage`) с возможностью быстрого сброса.
- 🕊️ **Спокойный интерфейс**: сдержанная тема технической документации в стиле Linear / Stripe Docs (матовый цинк `#09090b`, чистые 1px границы, мягкая типографика Inter и JetBrains Mono, отсутствие агрессивных RGB-эффектов).
- 🚀 **Zero Dependencies**: чистый нативный веб-стек (HTML5, CSS3, ES6+). Запускается везде без сторонних сборщиков и серверов.

---

## 📚 Программа курсов

### 🐍 Трек 1: Язык Python (5 интерактивных уроков)

| Урок | Название темы | Описание | Ключевые концепции |
|:---:|:---|:---|:---|
| **01** | [**Первая строка кода**](https://blsdxvmip.github.io/this-one/lessons/01-intro.html) | Как работает интерпретатор, зачем нужен Python и первая программа | `print()`, строки, комментарии `#`, `SyntaxError` |
| **02** | [**Переменные и типы данных**](https://blsdxvmip.github.io/this-one/lessons/02-variables.html) | Метафора подписанных коробок, числа, текст и пользовательский ввод | `int`, `float`, `str`, `bool`, `input()`, f-строки |
| **03** | [**Ветвления if / elif / else**](https://blsdxvmip.github.io/this-one/lessons/03-conditions.html) | Логика принятия решений, правила отступов и булевы операции | `if`, `elif`, `else`, отступы в 4 пробела, `and`, `or`, `not` |
| **04** | [**Списки и циклы**](https://blsdxvmip.github.io/this-one/lessons/04-loops.html) | Автоматизация рутины, списки элементов и диапазоны чисел | `for ... in`, генератор `range()`, списки `[]`, цикл `while` |
| **05** | [**Функции**](https://blsdxvmip.github.io/this-one/lessons/05-functions.html) | Создание собственных переиспользуемых инструментов и чистый код | Принцип DRY, `def`, параметры, отличие `print()` от `return` |

**Практикум Python:** [practice.html](https://blsdxvmip.github.io/this-one/practice.html) (Приветствие f-строкой, Калькулятор сдачи, Фейсконтроль, Анализатор чисел, Шифр Цезаря).

---

### ⚡ Трек 2: Язык Си (C) (5 интерактивных уроков)

| Урок | Название темы | Описание | Ключевые концепции |
|:---:|:---|:---|:---|
| **01** | [**Введение в Си и компилятор**](https://blsdxvmip.github.io/this-one/c-lessons/01-intro.html) | Зачем учить Си, компиляция vs интерпретация, точка входа `main`, `printf` | `#include <stdio.h>`, `main()`, `printf()`, `\n`, точка с запятой `;` |
| **02** | [**Переменные, типы и ввод**](https://blsdxvmip.github.io/this-one/c-lessons/02-variables.html) | Статическая типизация, размер в байтах, чтение ввода и оператор адреса | `int` (%d), `float` (%f), `double` (%lf), `char` (%c), `scanf()`, `&` |
| **03** | [**Ветвления и логика в Си**](https://blsdxvmip.github.io/this-one/c-lessons/03-conditions.html) | Условия `if/else`, булева истина (0 — ложь, не 0 — истина) и `switch/case` | `if`, `else`, логика `&&`, `||`, `!`, оператор `switch`, `break` |
| **04** | [**Циклы и массивы**](https://blsdxvmip.github.io/this-one/c-lessons/04-loops.html) | Циклы `for`, `while`, непрерывные массивы в памяти и Buffer Overflow | `for (int i=0; i<N; i++)`, `int arr[N]`, индексация с 0 |
| **05** | [**Функции и указатели**](https://blsdxvmip.github.io/this-one/c-lessons/05-functions.html) | Прототипы функций, передача по значению, адреса памяти и разыменование | Прототипы, указатель `*ptr`, оператор взятия адреса `&var` |

**Практикум Си:** [c-practice.html](https://blsdxvmip.github.io/this-one/c-practice.html) (Привет Си, Калькулятор сдачи, Фейсконтроль доступа, Сумма четных в массиве, Возведение в степень).

---

## 📂 Структура репозитория

```text
this-one/
├── index.html                  # Главная страница: выбор трека (Python / Си) и программа курсов
├── practice.html               # Интерактивный практикум Python (5 задач с автотестами)
├── c-practice.html             # Интерактивный практикум Си (5 задач с автотестами)
├── lessons/                    # Уроки по языку Python
│   ├── 01-intro.html           # Урок 1: Первая строка кода
│   ├── 02-variables.html       # Урок 2: Переменные и типы данных
│   ├── 03-conditions.html      # Урок 3: Ветвления и логика
│   ├── 04-loops.html           # Урок 4: Списки и циклы
│   └── 05-functions.html       # Урок 5: Функции
├── c-lessons/                  # Уроки по языку Си (C)
│   ├── 01-intro.html           # Урок 1: Введение и компилятор
│   ├── 02-variables.html       # Урок 2: Переменные и ввод (scanf)
│   ├── 03-conditions.html      # Урок 3: Ветвления и switch
│   ├── 04-loops.html           # Урок 4: Циклы и статические массивы
│   └── 05-functions.html       # Урок 5: Функции и указатели
├── styles/
│   ├── main.css                # Дизайн-система: матовый цинк, 1px границы, сдержанная типографика
│   └── python-course.css       # Стили учебных страниц, сайдбаров и практикумов
├── js/
│   ├── app.js                  # Базовая интерактивность (навигация, вкладки)
│   ├── course-progress.js      # Трекер прогресса курса Python в LocalStorage
│   ├── course-runner.js        # Браузерный движок тестов и исполнения Python
│   ├── c-progress.js           # Трекер прогресса курса Си и симуляторы в уроках
│   └── c-runner.js             # Браузерный движок компиляции, исполнения и автотестов Си
└── README.md                   # Документация проекта
```

---

## 🚀 Локальный запуск

Репозиторий готов к запуску прямо из коробки — без установки Node.js, компиляторов или серверов:

```bash
# 1. Клонировать репозиторий
git clone https://github.com/blsdxvmip/this-one.git
cd this-one

# 2. Открыть в любом современном браузере напрямую:
# просто дважды кликните по index.html или запустите:
start index.html
```

---

## 📄 Лицензия

Проект распространяется под открытой лицензией [MIT](LICENSE).
Любой желающий может форкать, дополнять уроки и использовать платформу в образовательных целях.