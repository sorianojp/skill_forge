export interface ExamQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const COURSE_EXAMS: Record<string, ExamQuestion[]> = {
  'html-fundamentals': [
    {
      question: 'Why must <!doctype html> be the very first line of an HTML document?',
      options: [
        'It loads external CSS files automatically',
        'It puts the browser into standards mode instead of legacy quirks mode',
        'It enables JavaScript execution',
      ],
      answer: 1,
      explanation: '<!doctype html> triggers standards-compliant rendering across all modern browsers.',
    },
    {
      question: 'Which landmark should wrap the dominant, unique content of a page (only one visible per page)?',
      options: ['<section>', '<main>', '<article>'],
      answer: 1,
      explanation: '<main> identifies the primary document content and supports skip-to-content navigation.',
    },
    {
      question: 'What happens if you write <button disabled="false">Save</button>?',
      options: [
        'The button stays disabled because disabled is a boolean attribute',
        'The button is enabled',
        'The browser ignores the button',
      ],
      answer: 0,
      explanation: 'For HTML boolean attributes, mere presence evaluates to true regardless of the attribute value.',
    },
    {
      question: 'How should you mark up a purely decorative image so screen readers skip it?',
      options: ['Omit the alt attribute', 'Use alt="" (empty string)', 'Use alt="decorative"'],
      answer: 1,
      explanation: 'An empty alt="" signals assistive technology to ignore the decorative image cleanly.',
    },
    {
      question: 'Why should width and height attributes be included on <img> elements?',
      options: [
        'To prevent Cumulative Layout Shift (CLS) by reserving aspect-ratio space before load',
        'To disable responsive CSS scaling',
        'To convert images to WebP automatically',
      ],
      answer: 0,
      explanation: 'Declaring intrinsic dimensions allows the browser to reserve exact layout space immediately.',
    },
    {
      question: 'Which attribute marks the current active page link inside a <nav> or breadcrumb?',
      options: ['aria-selected="true"', 'aria-current="page"', 'data-active="true"'],
      answer: 1,
      explanation: 'aria-current="page" is the standard semantic attribute for indicating the current page in navigation.',
    },
    {
      question: 'Which pair of elements creates an accessible, zero-JS collapsible disclosure/accordion?',
      options: ['<details> and <summary>', '<dialog> and <caption>', '<fieldset> and <legend>'],
      answer: 0,
      explanation: '<details> with a <summary> child provides built-in keyboard and screen-reader disclosure behavior.',
    },
    {
      question: 'How do you explicitly associate a <label> with an <input>?',
      options: [
        'Put them inside the same <div>',
        'Match the label\'s for attribute to the input\'s id attribute',
        'Give both the same name attribute',
      ],
      answer: 1,
      explanation: 'Matching for="..." with id="..." links the label for screen readers and click-to-focus.',
    },
    {
      question: 'Which JavaScript method opens a native <dialog> as a true blocking modal with ::backdrop and Escape handling?',
      options: ['dialog.show()', 'dialog.open()', 'dialog.showModal()'],
      answer: 2,
      explanation: 'showModal() renders the dialog in the top layer, makes the page inert, and enables Esc dismissal.',
    },
    {
      question: 'Which of these is a valid Custom Element tag name for Web Components?',
      options: ['<badge>', '<course-badge>', '<CourseBadge>'],
      answer: 1,
      explanation: 'Custom Element names must be lowercase and contain at least one hyphen.',
    },
  ],

  'css-layout': [
    {
      question: 'Which CSS selector has the highest specificity?',
      options: ['.nav ul li a:hover', '#header a', 'main article p.intro'],
      answer: 1,
      explanation: 'An ID selector (#header) outranks any combination of class, pseudo-class, and element selectors.',
    },
    {
      question: 'With box-sizing: border-box, what is the total width of an element with width: 200px, padding: 20px, and border: 2px solid?',
      options: ['200px', '240px', '244px'],
      answer: 0,
      explanation: 'border-box includes padding and border inside the declared width.',
    },
    {
      question: 'Why is rem preferred over px for typography?',
      options: [
        'rem scales with the user\'s browser font-size preference for accessibility',
        'px cannot be used inside CSS Grid',
        'rem automatically loads web fonts faster',
      ],
      answer: 0,
      explanation: 'Relative rem units respect user accessibility zoom and root font-size settings.',
    },
    {
      question: 'What does text-wrap: balance do on headings?',
      options: [
        'Centers text horizontally',
        'Balances line lengths across wrapped lines to avoid single-word orphans',
        'Adds letter spacing automatically',
      ],
      answer: 1,
      explanation: 'text-wrap: balance creates visually even line breaks in short multi-line headings.',
    },
    {
      question: 'Which CSS Grid rule creates responsive auto-wrapping cards without media queries?',
      options: [
        'grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr))',
        'grid-template-columns: 300px 300px 300px',
        'grid-auto-flow: column',
      ],
      answer: 0,
      explanation: 'repeat(auto-fit, minmax(..., 1fr)) dynamically fits as many columns as available width allows.',
    },
    {
      question: 'What problem does grid-template-rows: subgrid solve?',
      options: [
        'It aligns nested elements (titles, bodies, buttons) across sibling cards on shared parent tracks',
        'It hides overflowing text with an ellipsis',
        'It enables sticky headers',
      ],
      answer: 0,
      explanation: 'Subgrid lets child grids participate directly in their parent grid\'s track sizing.',
    },
    {
      question: 'Which property must be set on a parent before querying its width with @container?',
      options: ['display: container', 'container-type: inline-size', 'position: relative'],
      answer: 1,
      explanation: 'container-type: inline-size establishes an inline-axis size query container.',
    },
    {
      question: 'What is the specificity of :where(#hero, .card, h1)?',
      options: ['(1, 0, 0)', '(0, 1, 1)', '(0, 0, 0): always zero'],
      answer: 2,
      explanation: ':where() always has zero specificity, making base styles easy to override.',
    },
    {
      question: 'Which two CSS properties are most performant to animate at 60fps?',
      options: ['width and height', 'transform and opacity', 'top and margin-left'],
      answer: 1,
      explanation: 'transform and opacity can be animated on the GPU compositor without triggering layout reflow.',
    },
    {
      question: 'Given @layer base, components, utilities; which layer wins when rules target the same element?',
      options: ['@layer base', '@layer utilities (later layers always outrank earlier layers)', 'Whichever has a longer selector'],
      answer: 1,
      explanation: 'Cascade layer order takes precedence over selector specificity.',
    },
  ],

  'javascript-essentials': [
    {
      question: 'What does `0 ?? 100` evaluate to in JavaScript?',
      options: ['100', '0', 'undefined'],
      answer: 1,
      explanation: 'Nullish coalescing (??) only falls back when the left side is null or undefined, not 0.',
    },
    {
      question: 'Which loop allows exiting early with the break statement?',
      options: ['array.forEach()', 'for...of', 'array.map()'],
      answer: 1,
      explanation: 'for...of (and classic for/while loops) support break and continue.',
    },
    {
      question: 'What is a closure in JavaScript?',
      options: [
        'A syntax error caused by missing braces',
        'An inner function that retains access to variables from its outer lexical scope even after the outer function returns',
        'A way to freeze DOM nodes',
      ],
      answer: 1,
      explanation: 'Closures remember their lexical environment, enabling private state and factory functions.',
    },
    {
      question: 'What does `user?.profile?.name` return when `user.profile` is undefined?',
      options: ['Throws a TypeError', 'Returns undefined safely', 'Returns null'],
      answer: 1,
      explanation: 'Optional chaining (?.) short-circuits and returns undefined instead of crashing.',
    },
    {
      question: 'What does `[...new Set([1, 2, 2, 3])].length` return?',
      options: ['4', '3', '2'],
      answer: 1,
      explanation: 'Set automatically removes duplicates, leaving [1, 2, 3] with length 3.',
    },
    {
      question: 'Which DOM property is safest for inserting plain user-supplied text?',
      options: ['element.innerHTML', 'element.textContent', 'element.outerHTML'],
      answer: 1,
      explanation: 'textContent treats input strictly as text, preventing Cross-Site Scripting (XSS).',
    },
    {
      question: 'Why is event.target.closest("button") useful in event delegation?',
      options: [
        'It reliably finds the button even if the user clicked an icon or span nested inside it',
        'It prevents default form submission',
        'It disables bubbling',
      ],
      answer: 0,
      explanation: 'closest() walks up the DOM tree from event.target to find the matching ancestor.',
    },
    {
      question: 'How should you store a JavaScript object inside localStorage?',
      options: [
        'Pass the raw object directly to setItem()',
        'Serialize it with JSON.stringify() and read it back with JSON.parse()',
        'Convert it with toString()',
      ],
      answer: 1,
      explanation: 'localStorage only stores strings, so JSON.stringify() / JSON.parse() is required for objects.',
    },
    {
      question: 'What does debouncing a search input accomplish?',
      options: [
        'Waits until the user pauses typing for a short delay before running the search callback',
        'Prevents users from typing fast',
        'Caches results on the server',
      ],
      answer: 0,
      explanation: 'Debouncing clears and restarts a timer on every keystroke so work runs once typing pauses.',
    },
    {
      question: 'Which block in try / catch / finally always executes whether an async call succeeds or throws?',
      options: ['try', 'catch', 'finally'],
      answer: 2,
      explanation: 'finally always runs, making it ideal for clearing loading states or re-enabling buttons.',
    },
  ],

  'sql-essentials': [
    {
      question: 'Which SQL clause filters which rows are returned by a SELECT query?',
      options: ['FILTER BY', 'WHERE', 'HAVING'],
      answer: 1,
      explanation: 'WHERE filters individual rows before any grouping or sorting occurs.',
    },
    {
      question: 'Which keyword removes duplicate values from a SELECT output?',
      options: ['UNIQUE', 'DISTINCT', 'ONLY'],
      answer: 1,
      explanation: 'SELECT DISTINCT returns each unique value once.',
    },
    {
      question: 'How do you sort rows from highest score to lowest score?',
      options: ['SORT BY score HIGH', 'ORDER BY score DESC', 'ORDER BY score ASC'],
      answer: 1,
      explanation: 'ORDER BY column DESC sorts in descending order (highest first).',
    },
    {
      question: 'Which wildcard matches zero or more characters inside a SQL LIKE pattern?',
      options: ['*', '%', '?'],
      answer: 1,
      explanation: 'In standard SQL, % matches any sequence of zero or more characters.',
    },
    {
      question: 'What is the difference between WHERE and HAVING?',
      options: [
        'WHERE filters individual rows before GROUP BY; HAVING filters grouped aggregates after GROUP BY',
        'HAVING is faster than WHERE for all queries',
        'They are identical aliases',
      ],
      answer: 0,
      explanation: 'WHERE runs before aggregation, while HAVING filters groups using aggregate functions like COUNT(*) or AVG().',
    },
    {
      question: 'Which aggregate function returns the total number of rows in a group?',
      options: ['TOTAL(*)', 'COUNT(*)', 'SUM(*)'],
      answer: 1,
      explanation: 'COUNT(*) counts all rows in each group.',
    },
    {
      question: 'Which JOIN preserves all rows from the left table even when no matching row exists in the right table?',
      options: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN'],
      answer: 1,
      explanation: 'LEFT JOIN keeps every row from the left table and fills unmatched right columns with NULL.',
    },
    {
      question: 'Which clause specifies how two joined tables match each other?',
      options: ['USING KEY', 'ON', 'MATCH'],
      answer: 1,
      explanation: 'JOIN table2 ON table1.id = table2.foreign_id defines the join condition.',
    },
    {
      question: 'What happens if you run `DELETE FROM tasks;` without a WHERE clause?',
      options: [
        'Only the first row is deleted',
        'Every row in the tasks table is deleted',
        'Nothing happens without WHERE',
      ],
      answer: 1,
      explanation: 'Omitting WHERE on DELETE or UPDATE applies the change to every row in the table.',
    },
    {
      question: 'Which clause caps the maximum number of rows returned by a query?',
      options: ['MAX', 'LIMIT', 'STOP'],
      answer: 1,
      explanation: 'LIMIT n restricts the result set to at most n rows.',
    },
  ],

  'php-essentials': [
    {
      question: 'Which character starts every variable name in PHP?',
      options: ['@', '$', '#'],
      answer: 1,
      explanation: 'All PHP variables start with a dollar sign, such as $course.',
    },
    {
      question: 'Which quote style interpolates variables like $name inside a PHP string?',
      options: ["Single quotes ('Hello $name')", 'Double quotes ("Hello $name")', 'Both behave identically'],
      answer: 1,
      explanation: 'Double-quoted strings evaluate embedded variables, while single-quoted strings stay literal.',
    },
    {
      question: 'What does `declare(strict_types=1);` enable in PHP 8?',
      options: [
        'Strict type checking for function arguments and return values',
        'Automatic SQL escaping',
        'Case-insensitive variable names',
      ],
      answer: 0,
      explanation: 'Strict types prevent silent coercion when passing the wrong scalar type to a typed function.',
    },
    {
      question: 'How does PHP 8 match() differ from switch?',
      options: [
        'match() uses strict === comparisons, returns a value, and never falls through',
        'match() requires break after every branch',
        'match() only works on strings',
      ],
      answer: 0,
      explanation: 'match() is a strict expression that returns its matched arm without fall-through bugs.',
    },
    {
      question: 'Which keyword creates a short single-expression arrow function in PHP?',
      options: ['func', 'fn', 'def'],
      answer: 1,
      explanation: 'PHP uses fn($x) => $x * 2 for concise arrow functions.',
    },
    {
      question: 'Why is array_values() often wrapped around array_filter() results?',
      options: [
        'To re-index the filtered array cleanly starting from 0',
        'To convert the array to uppercase',
        'To remove duplicate strings',
      ],
      answer: 0,
      explanation: 'array_filter() preserves original keys; array_values() resets them to sequential 0-based indexes.',
    },
    {
      question: 'Which operator accesses an instance property or method on a PHP object?',
      options: ['.', '->', '=>'],
      answer: 1,
      explanation: 'PHP uses -> for object instances ($course->summary()).',
    },
    {
      question: 'What is constructor property promotion in PHP 8?',
      options: [
        'Declaring class properties directly in __construct() parameters with visibility keywords',
        'Automatically making all properties global',
        'Running constructors twice',
      ],
      answer: 0,
      explanation: 'Constructor property promotion reduces boilerplate by declaring and assigning properties directly in __construct().',
    },
    {
      question: 'Which function safely escapes untrusted text before rendering it into HTML?',
      options: ['strip_slashes()', 'htmlspecialchars($s, ENT_QUOTES, "UTF-8")', 'md5()'],
      answer: 1,
      explanation: 'htmlspecialchars() converts special HTML characters into safe entities to prevent XSS.',
    },
    {
      question: 'What is the safest way to pass user input into a SQL query in PHP?',
      options: [
        'PDO prepared statements with bound parameters',
        'String concatenation inside double quotes',
        'Using base64_encode() on the query',
      ],
      answer: 0,
      explanation: 'PDO prepared statements keep SQL structure separate from user data, preventing SQL injection.',
    },
  ],

  'python-fundamentals': [
    {
      question: 'How are boolean values written in Python 3?',
      options: ['true and false', 'True and False', 'TRUE and FALSE'],
      answer: 1,
      explanation: 'Python boolean literals are always capitalized: True and False.',
    },
    {
      question: 'Which prefix creates a formatted f-string in Python?',
      options: ['s"Hello {name}"', 'f"Hello {name}"', '$"Hello {name}"'],
      answer: 1,
      explanation: 'Prefixing a string with f evaluates expressions inside curly braces.',
    },
    {
      question: 'What naming convention is standard for Python variables and functions?',
      options: ['camelCase', 'snake_case', 'PascalCase'],
      answer: 1,
      explanation: 'PEP 8 recommends snake_case for variable and function names.',
    },
    {
      question: 'Which keyword introduces an additional conditional branch after if in Python?',
      options: ['else if', 'elif', 'elsif'],
      answer: 1,
      explanation: 'Python uses elif instead of else if.',
    },
    {
      question: 'What sequence of integers does range(1, 5) produce?',
      options: ['1, 2, 3, 4, 5', '1, 2, 3, 4', '0, 1, 2, 3, 4'],
      answer: 1,
      explanation: 'range(start, stop) starts at start and stops before stop.',
    },
    {
      question: 'What does a Python function return if it has no return statement?',
      options: ['0', 'undefined', 'None'],
      answer: 2,
      explanation: 'Python functions implicitly return None when no return value is specified.',
    },
    {
      question: 'How do you read a dictionary key safely without risking a KeyError?',
      options: ['d[key]', 'd.get(key, default)', 'd.fetch(key)'],
      answer: 1,
      explanation: 'dict.get(key, default) returns the default value if the key is absent.',
    },
    {
      question: 'In Python, what does `items[-1]` access?',
      options: ['The first element', 'The last element', 'Raises an IndexError'],
      answer: 1,
      explanation: 'Negative indexes count from the end of the sequence, so -1 is the last item.',
    },
    {
      question: 'What does `[x * 2 for x in [1, 2, 3]]` evaluate to?',
      options: ['[2, 4, 6]', '[1, 2, 3, 1, 2, 3]', '{2, 4, 6}'],
      answer: 0,
      explanation: 'The list comprehension doubles each item and returns [2, 4, 6].',
    },
    {
      question: 'Which built-in helper yields both the index and value while looping over a list?',
      options: ['index()', 'enumerate()', 'entries()'],
      answer: 1,
      explanation: 'enumerate(items) yields (index, item) pairs cleanly in a for loop.',
    },
  ],
};
