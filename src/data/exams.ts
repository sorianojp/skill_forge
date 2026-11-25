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
  'git-essentials': [
    {
      question: 'Which command moves modified files from your working tree into the staging area?',
      options: ['git commit', 'git add', 'git status'],
      answer: 1,
      explanation: 'git add stages changes so they are included in the next commit snapshot.',
    },
    {
      question: 'What does git status display?',
      options: [
        'The current branch plus staged, unstaged, and untracked files',
        'Every commit ever pushed to GitHub',
        'Only deleted branches',
      ],
      answer: 0,
      explanation: 'git status summarizes your current branch and working tree state.',
    },
    {
      question: 'Which command creates a new branch named feat/auth and switches to it immediately?',
      options: ['git branch feat/auth', 'git checkout -b feat/auth', 'git merge feat/auth'],
      answer: 1,
      explanation: 'git checkout -b (or git switch -c) creates and switches to the new branch in one step.',
    },
    {
      question: 'Before running git merge feat/nav to bring changes into main, which branch should be active?',
      options: ['feat/nav', 'main', 'Any detached HEAD'],
      answer: 1,
      explanation: 'git merge integrates the specified branch into your currently checked-out branch.',
    },
    {
      question: 'How does git fetch differ from git pull?',
      options: [
        'git fetch downloads remote commits without modifying your current working branch',
        'git fetch automatically pushes local commits',
        'git fetch deletes untracked files',
      ],
      answer: 0,
      explanation: 'git fetch updates remote-tracking refs safely; git pull runs fetch followed by merge or rebase.',
    },
    {
      question: 'What does the -u flag do in git push -u origin feat/cards?',
      options: [
        'Forces an overwrite of main',
        'Sets upstream tracking so future pushes only need git push',
        'Undoes the last commit before pushing',
      ],
      answer: 1,
      explanation: '-u (--set-upstream) links your local branch to its remote counterpart.',
    },
    {
      question: 'Which command temporarily shelves uncommitted edits so you can switch branches cleanly?',
      options: ['git stash', 'git revert', 'git tag'],
      answer: 0,
      explanation: 'git stash saves dirty working tree changes on a stack; git stash pop restores them later.',
    },
    {
      question: 'Which command safely undoes a buggy commit that was already pushed to main?',
      options: ['git reset --hard HEAD~1', 'git revert <hash>', 'git push --force'],
      answer: 1,
      explanation: 'git revert creates a new inverse commit without rewriting shared history.',
    },
    {
      question: 'Why do teams often choose Squash and Merge on GitHub Pull Requests?',
      options: [
        'It combines intermediate WIP commits into one clean commit on main',
        'It bypasses all CI checks',
        'It deletes the repository history',
      ],
      answer: 0,
      explanation: 'Squashing keeps main history linear and easy to read or revert.',
    },
    {
      question: 'What does git log --oneline output?',
      options: [
        'A compact one-line summary (short hash + subject) per commit',
        'Only uncommitted files',
        'The full diff of every binary file',
      ],
      answer: 0,
      explanation: 'git log --oneline displays each commit on a single readable line.',
    },
  ],
  'oop-fundamentals': [
    {
      question: 'What is the difference between a class and an object?',
      options: [
        'A class is a blueprint; an object is a concrete instance created from that blueprint',
        'A class holds runtime data; an object holds only static functions',
        'They are identical terms in OOP',
      ],
      answer: 0,
      explanation: 'Classes define structure and behavior, while objects are individual instances with their own state.',
    },
    {
      question: 'What is the main goal of encapsulation?',
      options: [
        'To make every field globally mutable',
        'To hide internal state and enforce invariants through controlled public methods',
        'To force every class to inherit from three parents',
      ],
      answer: 1,
      explanation: 'Encapsulation protects object state from invalid external mutations.',
    },
    {
      question: 'Which relationship is best modeled with composition rather than inheritance?',
      options: ['A Car has an Engine', 'A Dog is an Animal', 'A SavingsAccount is a BankAccount'],
      answer: 0,
      explanation: 'Composition models has-a relationships cleanly and avoids brittle inheritance hierarchies.',
    },
    {
      question: 'What does calling super() inside a subclass constructor do?',
      options: [
        'Deletes the parent class',
        'Invokes the parent class constructor to initialize inherited state',
        'Marks the method as private',
      ],
      answer: 1,
      explanation: 'super() runs the superclass constructor before the subclass finishes initializing.',
    },
    {
      question: 'How does polymorphism help eliminate long if/else or switch chains?',
      options: [
        'Callers invoke a shared method contract and each concrete class runs its own implementation',
        'It automatically removes all classes at compile time',
        'It forces all objects to share one static variable',
      ],
      answer: 0,
      explanation: 'Polymorphism dispatches the same method call to the right implementation for each object type.',
    },
    {
      question: 'What does the S in SOLID (Single Responsibility Principle) state?',
      options: [
        'A class should have only one focused reason to change',
        'A program should have only a single class',
        'Every method should accept only a single parameter',
      ],
      answer: 0,
      explanation: 'Single Responsibility keeps classes cohesive and easier to maintain.',
    },
    {
      question: 'What does the Open/Closed Principle encourage?',
      options: [
        'Open for extension, closed for modification',
        'Keep all fields open (public) and close all constructors',
        'Never add new classes to a project',
      ],
      answer: 0,
      explanation: 'You should be able to add new behavior via new classes/implementations without editing stable code.',
    },
    {
      question: 'Which SOLID principle is violated if a subclass throws an unexpected error when used in place of its parent?',
      options: ['Liskov Substitution Principle', 'Interface Segregation Principle', 'Single Responsibility Principle'],
      answer: 0,
      explanation: 'Liskov Substitution requires subclasses to honor their parent contract seamlessly.',
    },
    {
      question: 'Why is Dependency Injection (passing a repository into a constructor) valuable?',
      options: [
        'It decouples business logic from concrete storage and makes unit testing easy with fakes',
        'It prevents classes from having methods',
        'It forces code to connect directly to production databases during tests',
      ],
      answer: 0,
      explanation: 'Constructor injection applies Dependency Inversion so dependencies can be swapped cleanly.',
    },
    {
      question: 'What does the Interface Segregation Principle recommend?',
      options: [
        'Prefer small, focused interfaces over large bloated interfaces',
        'Put every method in the application into one giant interface',
        'Avoid interfaces altogether',
      ],
      answer: 0,
      explanation: 'Clients should not be forced to implement methods they do not use.',
    },
  ],
  'c-fundamentals': [
    {
      question: 'What does returning 0 from int main(void) indicate to the operating system?',
      options: ['Execution succeeded without error', 'An out-of-memory error', 'A syntax warning'],
      answer: 0,
      explanation: 'Exit status 0 signals normal, successful termination.',
    },
    {
      question: 'Which printf format specifier prints a signed int?',
      options: ['%s', '%d', '%c'],
      answer: 1,
      explanation: '%d formats signed decimal integers in printf.',
    },
    {
      question: 'How many bytes does the C string literal "Go" occupy in memory?',
      options: ['2 bytes', '3 bytes (including the null terminator \\0)', '4 bytes'],
      answer: 1,
      explanation: 'C strings end with a null byte \\0, so "Go" uses 3 bytes.',
    },
    {
      question: 'Given int x = 10; int *p = &x;, what does &x produce?',
      options: ['The memory address of x', 'The value 10 doubled', 'A copy of x on the heap'],
      answer: 0,
      explanation: 'The & operator takes the memory address of a variable.',
    },
    {
      question: 'Given int x = 10; int *p = &x;, what does *p = 20; do?',
      options: ['Changes x to 20 by writing through the pointer', 'Changes the address stored in p to 20', 'Causes a compile error'],
      answer: 0,
      explanation: 'Dereferencing p (*p) accesses the integer stored at the address p points to.',
    },
    {
      question: 'Why should you pass a length parameter alongside an array to a C function?',
      options: [
        'Arrays decay to pointers when passed to functions and do not carry their length',
        'C arrays cannot hold more than 4 elements without a length parameter',
        'Otherwise printf will not compile',
      ],
      answer: 0,
      explanation: 'Inside a function, sizeof(arr) returns the pointer size, not the array byte size.',
    },
    {
      question: 'Given Student *s, how do you access the score member of the struct?',
      options: ['s.score', 's->score', 's::score'],
      answer: 1,
      explanation: 'The arrow operator (->) dereferences a struct pointer and accesses its field.',
    },
    {
      question: 'Which pair of stdlib.h functions allocates and releases dynamic heap memory in C?',
      options: ['alloc / delete', 'malloc / free', 'new / drop'],
      answer: 1,
      explanation: 'malloc() allocates heap bytes and free() releases them to prevent memory leaks.',
    },
    {
      question: 'What happens if you omit break at the end of a C switch case?',
      options: [
        'Execution falls through into the next case automatically',
        'The compiler rejects the program',
        'The function returns 0 immediately',
      ],
      answer: 0,
      explanation: 'C switch cases fall through unless terminated with break or return.',
    },
    {
      question: 'Why do C functions mark read-only pointer parameters as const int *arr?',
      options: [
        'To prevent accidental mutation of the caller array and document read-only intent',
        'To allocate the array on the heap',
        'To enable garbage collection',
      ],
      answer: 0,
      explanation: 'const pointers enforce immutability at compile time.',
    },
  ],
  'cpp-fundamentals': [
    {
      question: 'Why is std::string preferred over raw char* arrays in Modern C++?',
      options: [
        'It manages memory automatically, tracks length in O(1), and avoids buffer overflows',
        'It is only for ASCII single characters',
        'It disables type checking',
      ],
      answer: 0,
      explanation: 'std::string owns its buffer via RAII and resizes safely.',
    },
    {
      question: 'How should you pass a large std::vector to a function that only reads it?',
      options: ['By value (std::vector<int> v)', 'By const reference (const std::vector<int>& v)', 'As void*'],
      answer: 1,
      explanation: 'const T& avoids copying the entire container while preventing mutation.',
    },
    {
      question: 'How does a C++ reference (int&) differ from a raw pointer (int*)?',
      options: [
        'A reference cannot be null and cannot be reseated to another variable',
        'A reference requires manual free()',
        'A reference can only point to heap memory',
      ],
      answer: 0,
      explanation: 'References are non-null aliases bound once at initialization.',
    },
    {
      question: 'Which STL container should be your default choice for a dynamic sequence?',
      options: ['std::vector', 'std::list', 'Raw new[] array'],
      answer: 0,
      explanation: 'std::vector stores elements contiguously for optimal CPU cache performance and RAII safety.',
    },
    {
      question: 'What does RAII (Resource Acquisition Is Initialization) guarantee in C++?',
      options: [
        'Resources acquired in a constructor are released deterministically in the destructor when leaving scope',
        'A background garbage collector frees memory periodically',
        'All objects must be allocated with malloc',
      ],
      answer: 0,
      explanation: 'RAII ties resource lifetime to object scope, guaranteeing cleanup even when exceptions occur.',
    },
    {
      question: 'What does a trailing const on a member function (double balance() const) promise?',
      options: [
        'Calling the method will not modify the object state',
        'The return value is always zero',
        'The method can only be called once',
      ],
      answer: 0,
      explanation: 'const member functions can be safely called on const objects and const references.',
    },
    {
      question: 'Which smart pointer provides exclusive ownership of a heap object with zero overhead?',
      options: ['std::unique_ptr', 'std::raw_ptr', 'std::auto_free'],
      answer: 0,
      explanation: 'std::unique_ptr owns a single heap object and deletes it automatically on destruction.',
    },
    {
      question: 'Why should you initialize class fields in a constructor member initializer list?',
      options: [
        'Fields are constructed directly instead of default-constructed and reassigned',
        'It makes all fields public',
        'It disables destructors',
      ],
      answer: 0,
      explanation: 'Initializer lists avoid redundant work and are required for const or reference members.',
    },
    {
      question: 'What does template <typename T> enable in C++?',
      options: [
        'Zero-cost generic functions and classes that compile to specialized code for any type T',
        'Dynamic JavaScript-style typing at runtime',
        'Automatic SQL table generation',
      ],
      answer: 0,
      explanation: 'C++ templates generate type-safe specialized code at compile time.',
    },
    {
      question: 'Which <algorithm> helper counts elements matching a lambda predicate?',
      options: ['std::count_if', 'std::push_back', 'std::make_unique'],
      answer: 0,
      explanation: 'std::count_if(begin, end, predicate) returns the number of elements satisfying the lambda.',
    },
  ],
  'java-fundamentals': [
    {
      question: 'How should you compare two Java String values for equal character content?',
      options: ['a == b', 'a.equals(b)', 'a === b'],
      answer: 1,
      explanation: '.equals() compares character content; == compares object references in memory.',
    },
    {
      question: 'What is a key benefit of Java arrow switch expressions (->)?',
      options: [
        'No accidental fall-through and the switch can directly return a value',
        'They only accept boolean inputs',
        'They replace constructors',
      ],
      answer: 0,
      explanation: 'Modern switch expressions eliminate break boilerplate and check exhaustiveness.',
    },
    {
      question: 'What does a Java record automatically generate?',
      options: [
        'Final fields, constructor, accessors, equals(), hashCode(), and toString()',
        'Public mutable setters for every field',
        'A REST controller',
      ],
      answer: 0,
      explanation: 'Java records provide concise, immutable data carriers with minimal boilerplate.',
    },
    {
      question: 'How many interfaces can a single Java class implement?',
      options: ['At most one', 'Multiple interfaces (comma-separated after implements)', 'Zero'],
      answer: 1,
      explanation: 'Java supports single class inheritance (extends) and multiple interface implementation (implements).',
    },
    {
      question: 'Why should you place @Override above methods that implement an interface or override a superclass method?',
      options: [
        'The compiler verifies the signature matches and catches typos at compile time',
        'It makes the method private',
        'It disables garbage collection for that class',
      ],
      answer: 0,
      explanation: '@Override protects against accidental signature mismatches.',
    },
    {
      question: 'What problem do Java Generics (like List<String>) solve?',
      options: [
        'They enforce element type safety at compile time without unsafe runtime casts',
        'They convert lists into arrays automatically',
        'They allow null primitives',
      ],
      answer: 0,
      explanation: 'Generics catch type mismatches during compilation rather than throwing ClassCastException at runtime.',
    },
    {
      question: 'What kind of list does List.of("a", "b") return?',
      options: ['An unmodifiable (immutable) list', 'A thread-unsafe mutable ArrayList', 'A linked list of bytes'],
      answer: 0,
      explanation: 'List.of() creates a compact unmodifiable list; attempting to add() throws UnsupportedOperationException.',
    },
    {
      question: 'What does Optional<T> represent in modern Java?',
      options: [
        'A container that may or may not hold a non-null value, helping prevent NullPointerException',
        'An optional method parameter with a default value',
        'A lazy database connection',
      ],
      answer: 0,
      explanation: 'Optional makes absent values explicit and encourages safe handling with .orElse().',
    },
    {
      question: 'In the Java Streams API, which operation keeps only elements matching a predicate?',
      options: ['.map()', '.filter()', '.sorted()'],
      answer: 1,
      explanation: '.filter(predicate) retains only elements for which the predicate returns true.',
    },
    {
      question: 'What is OrderItem::subtotal in items.stream().mapToDouble(OrderItem::subtotal)?',
      options: [
        'A method reference shorthand for item -> item.subtotal()',
        'A static field import',
        'A bitwise operator',
      ],
      answer: 0,
      explanation: 'Method references cleanly pass an existing method as a functional interface implementation.',
    },
  ],
  'csharp-fundamentals': [
    {
      question: 'How do you write an interpolated string in C#?',
      options: ['$"Hello, {name}!"', 'f"Hello, {name}!"', '`Hello, ${name}!`'],
      answer: 0,
      explanation: 'Prefixing a C# string literal with $ enables {expression} interpolation.',
    },
    {
      question: 'What does the null-coalescing operator (??) return in C#?',
      options: [
        'The left operand if non-null, otherwise the right fallback operand',
        'True if both operands are null',
        'Always throws NullReferenceException',
      ],
      answer: 0,
      explanation: 'a ?? b returns a when a is not null, and b otherwise.',
    },
    {
      question: 'How does == behave on two C# string values?',
      options: [
        'It compares the text content by value',
        'It only compares memory addresses',
        'It is a compile-time error',
      ],
      answer: 0,
      explanation: 'C# overloads == for string to compare character content directly.',
    },
    {
      question: 'In a C# switch expression, what does the discard pattern (_) represent?',
      options: ['The catch-all default arm', 'Only negative integers', 'A null check only'],
      answer: 0,
      explanation: '_ matches any value not matched by earlier pattern arms.',
    },
    {
      question: 'What does public int Count { get; private set; } enforce?',
      options: [
        'Callers can read Count publicly, but only the class itself can modify it',
        'Anyone can read and write Count freely',
        'Count cannot be read outside the class',
      ],
      answer: 0,
      explanation: 'private set restricts mutation to the owning class while keeping reads public.',
    },
    {
      question: 'What does var updated = user with { Score = 95 }; do on a C# record?',
      options: [
        'Creates a new record copy with Score updated to 95, leaving user unchanged',
        'Mutates user in place',
        'Deletes the Score property',
      ],
      answer: 0,
      explanation: 'The with expression performs non-destructive mutation on records.',
    },
    {
      question: 'Which LINQ method filters a collection by a boolean condition?',
      options: ['.Select()', '.Where()', '.OrderBy()'],
      answer: 1,
      explanation: '.Where(predicate) filters elements matching the condition; .Select() transforms them.',
    },
    {
      question: 'When does a LINQ query like items.Where(x => x > 10) actually execute?',
      options: [
        'Lazily when iterated (foreach) or materialized (.ToList(), .Count(), .Sum())',
        'Immediately on the line where Where() is called',
        'Only after the program exits',
      ],
      answer: 0,
      explanation: 'LINQ uses deferred execution until results are enumerated or materialized.',
    },
    {
      question: 'Why should async C# code avoid calling .Result or .Wait() on a Task?',
      options: [
        'Blocking synchronously wastes threads and can cause deadlocks; use await instead',
        '.Result deletes the task result',
        'They only work on integers',
      ],
      answer: 0,
      explanation: 'Always propagate async/await instead of blocking synchronously on Tasks.',
    },
    {
      question: 'How do you run two independent async Tasks concurrently and wait for both to finish?',
      options: ['await Task.WhenAll(t1, t2)', 't1.Wait(); t2.Wait();', 'new Thread(t1)'],
      answer: 0,
      explanation: 'Task.WhenAll awaits multiple concurrent tasks cleanly without blocking threads.',
    },
  ],
  'typescript-essentials': [
    {
      question: 'Why is unknown safer than any in TypeScript?',
      options: [
        'unknown forces you to narrow or verify the type before using the value',
        'unknown disables type checking completely',
        'unknown runs faster at runtime',
      ],
      answer: 0,
      explanation: 'unknown preserves compile-time safety by requiring explicit narrowing.',
    },
    {
      question: 'What does adding ? after a property name in an interface (hours?: number) mean?',
      options: ['The property is optional', 'The property must be boolean', 'The property is private'],
      answer: 0,
      explanation: 'Optional properties may be omitted or undefined.',
    },
    {
      question: 'What does readonly id: string enforce on an interface property?',
      options: [
        'The compiler prevents reassigning id after object creation',
        'The property is hidden from JSON.stringify',
        'The property can only hold uppercase strings',
      ],
      answer: 0,
      explanation: 'readonly catches accidental mutations at compile time.',
    },
    {
      question: 'Why are discriminated unions preferred over multiple boolean flags like isLoading and isError?',
      options: [
        'They prevent impossible state combinations and provide automatic type narrowing per variant',
        'Booleans are not supported in TypeScript',
        'Unions execute in parallel threads',
      ],
      answer: 0,
      explanation: 'Each variant in a discriminated union carries only the properties valid for that state.',
    },
    {
      question: 'What does <T, K extends keyof T> guarantee on a generic function?',
      options: [
        'K must be a valid property key of type T',
        'K must be a number',
        'T must be an array',
      ],
      answer: 0,
      explanation: 'keyof T extracts the union of property names of T for compile-time safe indexing.',
    },
    {
      question: 'Which utility type makes every property of User optional for PATCH updates?',
      options: ['Partial<User>', 'Required<User>', 'Record<User>'],
      answer: 0,
      explanation: 'Partial<T> marks every property on T as optional.',
    },
    {
      question: 'Which utility type removes passwordHash from a User type?',
      options: ['Omit<User, "passwordHash">', 'Pick<User, "passwordHash">', 'Partial<User>'],
      answer: 0,
      explanation: 'Omit<T, K> creates a new type excluding the listed keys.',
    },
    {
      question: 'How do you type a dictionary mapping string keys to number values in TypeScript?',
      options: ['Record<string, number>', 'Dict<string, number>', 'Partial<number>'],
      answer: 0,
      explanation: 'Record<K, V> defines a strongly typed object map.',
    },
    {
      question: 'What happens to TypeScript type annotations after compilation to JavaScript?',
      options: [
        'They are completely erased with zero runtime overhead',
        'They are converted into runtime if-checks on every line',
        'They are saved in localStorage',
      ],
      answer: 0,
      explanation: 'TypeScript performs static checking at compile time and emits plain JavaScript.',
    },
    {
      question: 'What is structural typing in TypeScript?',
      options: [
        'Any object with the required property shapes satisfies an interface even without naming it',
        'Classes must inherit from Object.Struct',
        'Types only work on structs',
      ],
      answer: 0,
      explanation: 'TypeScript checks compatibility by shape (structure), not nominal class names.',
    },
  ],
  'react-fundamentals': [
    {
      question: 'How does data flow between parent and child components in React?',
      options: [
        'One-way downward via props; children notify parents using callback props',
        'Children mutate parent props directly',
        'Only via global window variables',
      ],
      answer: 0,
      explanation: 'Unidirectional data flow keeps React state predictable.',
    },
    {
      question: 'Why does mutating an array in place (items.push(x); setItems(items)) fail to re-render?',
      options: [
        'React compares references with Object.is and sees the exact same array reference',
        'push() is disabled in React',
        'setItems only accepts strings',
      ],
      answer: 0,
      explanation: 'Always pass a new array reference like [...prev, x] when updating state.',
    },
    {
      question: 'When should you use a functional state updater like setCount(c => c + 1)?',
      options: [
        'Whenever the next state depends on the previous state value',
        'Only inside CSS files',
        'Never, always mutate state directly',
      ],
      answer: 0,
      explanation: 'Functional updaters always receive the latest queued state even across batched updates.',
    },
    {
      question: 'Why should dynamic lists avoid using array index as the React key prop?',
      options: [
        'Reordering, inserting, or deleting items shifts indexes and breaks component state reconciliation',
        'Numbers are invalid React keys',
        'Index keys cause syntax errors',
      ],
      answer: 0,
      explanation: 'Use a stable unique ID (item.id or item.slug) as the key.',
    },
    {
      question: 'Should a filtered list derived from items + query be duplicated in a second useState?',
      options: [
        'No, compute it directly during render to maintain a single source of truth',
        'Yes, always duplicate derived values in useState and sync with useEffect',
        'Only store it in document.title',
      ],
      answer: 0,
      explanation: 'Deriving values during render prevents stale state synchronization bugs.',
    },
    {
      question: 'What does an empty dependency array [] on useEffect(() => { ... }, []) do?',
      options: [
        'Runs the effect once on mount and runs its cleanup function on unmount',
        'Runs the effect on every render',
        'Disables the component',
      ],
      answer: 0,
      explanation: 'Empty dependencies mean the effect only synchronizes on mount and cleans up on unmount.',
    },
    {
      question: 'Why should useEffect return a cleanup function when registering a window event listener?',
      options: [
        'To detach the listener on unmount or re-run and prevent memory leaks',
        'To force an infinite render loop',
        'To clear localStorage automatically',
      ],
      answer: 0,
      explanation: 'Cleanup functions keep subscriptions and timers leak-free.',
    },
    {
      question: 'What makes an <input> a controlled component in React?',
      options: [
        'Its value is driven by React state and updated via its onChange handler',
        'It has the disabled attribute set',
        'It is wrapped in a <form> with no props',
      ],
      answer: 0,
      explanation: 'Controlled inputs keep form state as the single source of truth.',
    },
    {
      question: 'What is the naming rule for custom React hooks?',
      options: [
        'They must start with the prefix "use" and be called only at the top level',
        'They must start with "hook_"',
        'They must be static class methods',
      ],
      answer: 0,
      explanation: 'The use* prefix lets React and linters enforce the Rules of Hooks.',
    },
    {
      question: 'How do you immutably toggle done on one task inside a tasks array state?',
      options: [
        'setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))',
        'tasks[0].done = !tasks[0].done; setTasks(tasks);',
        'setTasks(tasks.pop())',
      ],
      answer: 0,
      explanation: '.map() with object spread produces new references for both the array and updated item.',
    },
  ],
  'nodejs-essentials': [
    {
      question: 'Why should Node.js request handlers avoid synchronous blocking calls like fs.readFileSync()?',
      options: [
        'Blocking the single-threaded event loop stalls all other concurrent requests',
        'Node.js has no file system API',
        'readFileSync() deletes files',
      ],
      answer: 0,
      explanation: 'Async I/O keeps the event loop free to serve concurrent traffic.',
    },
    {
      question: 'Why is importing built-ins as node:fs/promises recommended in Node.js 20?',
      options: [
        'It explicitly marks the import as a built-in Node core module, not an npm package',
        'It makes the module synchronous',
        'It disables TypeScript',
      ],
      answer: 0,
      explanation: 'The node: protocol prevents ambiguity or shadowing by third-party packages.',
    },
    {
      question: 'Which executes first after synchronous code: a resolved Promise .then() or setTimeout(fn, 0)?',
      options: ['The Promise .then() microtask', 'setTimeout(fn, 0)', 'They run on separate CPU cores'],
      answer: 0,
      explanation: 'Microtasks always drain completely before the event loop moves to timers.',
    },
    {
      question: 'How do you run two independent async calls concurrently in Node.js?',
      options: ['await Promise.all([a(), b()])', 'await a(); await b();', 'setTimeout(a, b)'],
      answer: 0,
      explanation: 'Promise.all executes independent promises in parallel.',
    },
    {
      question: 'What does fs.readFile("a.txt") return if you omit the "utf8" encoding?',
      options: ['A binary Buffer', 'A parsed JSON object', 'null'],
      answer: 0,
      explanation: 'Specifying "utf8" decodes the Buffer into a string.',
    },
    {
      question: 'Which HTTP status code indicates a POST endpoint successfully created a new resource?',
      options: ['201 Created', '404 Not Found', '500 Internal Server Error'],
      answer: 0,
      explanation: '201 Created is the standard REST status for newly created resources.',
    },
    {
      question: 'Why should you use streams instead of fs.readFile() for gigabyte-sized files?',
      options: [
        'Streams process small chunks incrementally with constant memory usage',
        'Streams bypass the filesystem',
        'fs.readFile() cannot read text files',
      ],
      answer: 0,
      explanation: 'Streams avoid exhausting server RAM on large payloads.',
    },
    {
      question: 'Which built-in Node API generates cryptographically secure random tokens or UUIDs?',
      options: ['node:crypto (crypto.randomBytes / crypto.randomUUID)', 'Math.random()', 'Date.now()'],
      answer: 0,
      explanation: 'node:crypto provides CSPRNG randomness suitable for security tokens.',
    },
    {
      question: 'How do you safely build a cross-platform file path in Node.js?',
      options: ['path.join(dir, "file.json")', 'dir + "\\\\" + "file.json"', 'url.parse(dir)'],
      answer: 0,
      explanation: 'path.join() handles OS-specific path separators cleanly.',
    },
    {
      question: 'What HTTP status code should an API return when client input fails validation?',
      options: ['400 Bad Request', '200 OK', '503 Service Unavailable'],
      answer: 0,
      explanation: '400 Bad Request signals invalid client-supplied parameters or JSON.',
    },
  ],
  'linux-cli': [
    {
      question: 'What does mkdir -p a/b/c do?',
      options: [
        'Creates missing parent directories and succeeds cleanly if they already exist',
        'Deletes directory a/b/c',
        'Changes permissions to 777',
      ],
      answer: 0,
      explanation: 'mkdir -p creates the entire nested path idempotently.',
    },
    {
      question: 'Which ls flag combination shows hidden dotfiles with human-readable sizes?',
      options: ['ls -lah', 'ls -x', 'ls --only'],
      answer: 0,
      explanation: '-l (long), -a (all including dotfiles), -h (human-readable sizes).',
    },
    {
      question: 'What is the difference between > and >> in Bash redirection?',
      options: [
        '> overwrites the target file, while >> appends to the end',
        '>> overwrites and > appends',
        'They are identical',
      ],
      answer: 0,
      explanation: 'Use >> when appending log lines so previous content is preserved.',
    },
    {
      question: 'What does the pipe operator (|) do in cmd1 | cmd2?',
      options: [
        'Sends stdout of cmd1 into stdin of cmd2',
        'Runs cmd2 only if cmd1 fails',
        'Deletes the output of cmd1',
      ],
      answer: 0,
      explanation: 'Pipes let you compose small Unix tools into powerful data pipelines.',
    },
    {
      question: 'What permissions does chmod 600 set on an SSH private key?',
      options: [
        'Read and write for owner only; zero access for group and others',
        'Full access for everyone',
        'Execute-only for everyone',
      ],
      answer: 0,
      explanation: '6 = read(4) + write(2) for owner; 0 for group and others.',
    },
    {
      question: 'Which command makes a Bash script file executable?',
      options: ['chmod +x script.sh', 'mkdir +x script.sh', 'cat +x script.sh'],
      answer: 0,
      explanation: 'chmod +x adds the execute bit so the script can be run directly.',
    },
    {
      question: 'Which command displays human-readable disk usage across mounted filesystems?',
      options: ['df -h', 'free -h', 'ps -h'],
      answer: 0,
      explanation: 'df -h reports disk free and used space per mount.',
    },
    {
      question: 'Which command displays RAM and swap usage on a Linux server?',
      options: ['free -h', 'ls -h', 'pwd -h'],
      answer: 0,
      explanation: 'free -h summarizes total, used, and available memory.',
    },
    {
      question: 'What does set -euo pipefail do at the top of a Bash script?',
      options: [
        'Fails immediately on errors, unset variables, and failed pipeline stages',
        'Ignores all errors silently',
        'Runs the script in the background',
      ],
      answer: 0,
      explanation: 'Strict mode catches bugs early instead of continuing blindly.',
    },
    {
      question: 'Why must you pipe through sort before uniq -c?',
      options: [
        'uniq only collapses adjacent identical lines',
        'uniq deletes unsorted files',
        'sort is required to print numbers',
      ],
      answer: 0,
      explanation: 'Sorting brings matching lines together so uniq -c counts every occurrence accurately.',
    },
  ],
  'docker-essentials': [
    {
      question: 'What is the difference between a Docker image and a Docker container?',
      options: [
        'An image is an immutable blueprint; a container is a running instance of that image',
        'A container is read-only; an image is a running process',
        'They are identical terms',
      ],
      answer: 0,
      explanation: 'You can launch many isolated containers from a single read-only image.',
    },
    {
      question: 'In docker run -p 8080:80 nginx, which port do you visit on the host machine?',
      options: ['8080', '80', '443'],
      answer: 0,
      explanation: '-p always maps HOST_PORT:CONTAINER_PORT.',
    },
    {
      question: 'Why should COPY package*.json ./ and RUN npm ci come before COPY . . in a Dockerfile?',
      options: [
        'To maximize Docker layer caching so code edits do not re-download dependencies',
        'Because COPY . . cannot copy JSON files',
        'To expose port 80 automatically',
      ],
      answer: 0,
      explanation: 'Docker reuses cached layers until an instruction or its copied files change.',
    },
    {
      question: 'What is the purpose of a .dockerignore file?',
      options: [
        'Prevents local folders like node_modules, .git, and .env from being sent into the Docker build context',
        'Stops containers from connecting to the internet',
        'Deletes unused volumes automatically',
      ],
      answer: 0,
      explanation: '.dockerignore speeds up builds and prevents baking secrets into images.',
    },
    {
      question: 'What is the primary benefit of a multi-stage Dockerfile?',
      options: [
        'Keeps production images small and secure by copying only compiled artifacts into a minimal runtime stage',
        'Starts multiple containers automatically',
        'Replaces Docker Compose',
      ],
      answer: 0,
      explanation: 'Build SDKs and dev tools stay in the builder stage and never ship to production.',
    },
    {
      question: 'Why should production Dockerfiles include a non-root USER instruction?',
      options: [
        'It reduces security blast radius if the application process is ever compromised',
        'Root cannot bind ports in Linux',
        'Docker refuses to run as root',
      ],
      answer: 0,
      explanation: 'Running with least privilege is a core container security best practice.',
    },
    {
      question: 'How do you persist database files safely across container rebuilds?',
      options: [
        'Mount a named Docker volume (-v pgdata:/var/lib/postgresql/data)',
        'Write them to /tmp inside the container',
        'Never restart the container',
      ],
      answer: 0,
      explanation: 'Named volumes survive container removal and upgrades.',
    },
    {
      question: 'In Docker Compose, how does an api service connect to a sibling db service?',
      options: [
        'By using the Compose service name (db) as the hostname',
        'By connecting to localhost',
        'By hardcoding a random container IP',
      ],
      answer: 0,
      explanation: 'Compose provides internal DNS resolving every service by its service name.',
    },
    {
      question: 'Which command streams live logs from a running container named api?',
      options: ['docker logs -f api', 'docker ps -f api', 'docker build -f api'],
      answer: 0,
      explanation: 'docker logs -f follows stdout and stderr output in real time.',
    },
    {
      question: 'Why should production Dockerfiles pin base image versions (node:20-alpine) instead of :latest?',
      options: [
        'To guarantee reproducible builds and avoid unexpected breaking major upgrades',
        'Because :latest images have no shell',
        'Pinned tags disable caching',
      ],
      answer: 0,
      explanation: 'Floating tags can silently change underneath your CI/CD pipeline.',
    },
  ],
  'dsa-fundamentals': [
    {
      question: 'What is the Big-O time complexity of two sequential (non-nested) loops each running n times?',
      options: ['O(n)', 'O(n^2)', 'O(log n)'],
      answer: 0,
      explanation: '2n drops the constant factor and simplifies to O(n).',
    },
    {
      question: 'What is the average time complexity of Hash Map get() and set() operations?',
      options: ['O(1)', 'O(n)', 'O(n log n)'],
      answer: 0,
      explanation: 'Hash tables compute bucket indices directly for constant-time average lookups.',
    },
    {
      question: 'How does the Hash Map Two Sum solution improve on the nested-loop brute force?',
      options: [
        'Reduces time complexity from O(n^2) to O(n) using O(n) space',
        'Reduces space complexity to O(0)',
        'Requires sorting the array first in O(n^2)',
      ],
      answer: 0,
      explanation: 'Looking up target - nums[i] in a Map takes O(1) per element.',
    },
    {
      question: 'Which data structure follows LIFO (Last In, First Out) ordering?',
      options: ['Stack', 'Queue', 'Binary Search Tree'],
      answer: 0,
      explanation: 'Stacks push and pop from the top in LIFO order.',
    },
    {
      question: 'Which data structure is ideal for validating balanced parentheses ({[]})?',
      options: ['Stack', 'Queue', 'Min Heap'],
      answer: 0,
      explanation: 'Each closing bracket must match the most recently opened bracket on top of the stack.',
    },
    {
      question: 'What precondition is required for standard Binary Search?',
      options: [
        'The search space must be sorted (or monotonic)',
        'All numbers must be even',
        'The array must be stored in a linked list',
      ],
      answer: 0,
      explanation: 'Binary Search halves the search range each step using ordering.',
    },
    {
      question: 'Roughly how many comparisons does Binary Search need in the worst case on 1,000,000 sorted items?',
      options: ['About 20', 'About 500,000', 'About 1,000'],
      answer: 0,
      explanation: 'log2(1,000,000) is approximately 20.',
    },
    {
      question: 'Which data structure powers Breadth-First Search (BFS)?',
      options: ['FIFO Queue', 'LIFO Stack', 'Hash Set only'],
      answer: 0,
      explanation: 'A queue visits nodes level by level in order of distance from the start.',
    },
    {
      question: 'Which traversal guarantees the shortest path (fewest edges) in an unweighted graph?',
      options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'In-order traversal'],
      answer: 0,
      explanation: 'BFS explores all nodes at distance d before distance d + 1.',
    },
    {
      question: 'What two properties indicate a problem is a good fit for Dynamic Programming?',
      options: [
        'Overlapping subproblems and optimal substructure',
        'Sorted input and O(1) memory',
        'Random graph weights',
      ],
      answer: 0,
      explanation: 'Caching overlapping subproblems eliminates redundant exponential recursion.',
    },
  ],
};
