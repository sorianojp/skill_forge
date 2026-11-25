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
};
