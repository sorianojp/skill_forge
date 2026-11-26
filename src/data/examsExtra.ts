import type { ExamQuestion } from './exams';

export const EXTRA_EXAM_QUESTIONS: Record<string, ExamQuestion[]> = {
  'html-fundamentals': [
    {
      question: 'Which attribute makes an image lazy-load only as the user scrolls near it?',
      options: ['loading="lazy"', 'defer="true"', 'async="lazy"'],
      answer: 0,
      explanation: 'Native loading="lazy" defers offscreen image downloads until needed.',
    },
    {
      question: 'Why should an interactive clickable control use <button> instead of a <div> with an onclick handler?',
      options: [
        '<button> provides built-in keyboard focus, Enter/Space activation, and screen reader semantics automatically',
        '<div> cannot receive click events in HTML5',
        '<button> automatically styles itself blue',
      ],
      answer: 0,
      explanation: 'Native <button> elements guarantee accessibility and keyboard navigation out of the box.',
    },
    {
      question: 'What does rel="noopener noreferrer" protect against on links with target="_blank"?',
      options: [
        'Prevents the newly opened tab from accessing window.opener and leaking the referrer',
        'Blocks CSS stylesheets on the target page',
        'Forces the link to open in the same tab',
      ],
      answer: 0,
      explanation: 'noopener isolates the new tab from manipulating the originating window.',
    },
    {
      question: 'Which HTML element is best for a self-contained collapsible disclosure widget with zero JavaScript?',
      options: ['<details> with <summary>', '<section> with <header>', '<aside> with <p>'],
      answer: 0,
      explanation: '<details> and <summary> provide accessible native expand/collapse behavior.',
    },
    {
      question: 'Where should the <meta name="viewport" content="width=device-width, initial-scale=1.0"> tag be placed?',
      options: ['Inside <head>', 'At the bottom of <body>', 'Inside <main>'],
      answer: 0,
      explanation: 'Viewport metadata belongs in <head> so mobile browsers render at the correct CSS pixel scale.',
    },
  ],
  'css-layout': [
    {
      question: 'What does box-sizing: border-box change about width: 300px; padding: 20px;?',
      options: [
        'Padding and border are included inside the 300px total width instead of expanding it to 340px',
        'Padding is ignored completely',
        'The element becomes inline',
      ],
      answer: 0,
      explanation: 'border-box makes layout sizing predictable by keeping total rendered width equal to declared width.',
    },
    {
      question: 'Which CSS Grid property creates as many 240px+ columns as fit in the container automatically?',
      options: [
        'grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))',
        'grid-columns: auto-240',
        'flex-wrap: grid',
      ],
      answer: 0,
      explanation: 'repeat(auto-fit, minmax(240px, 1fr)) builds responsive grids without media queries.',
    },
    {
      question: 'How does CSS clamp(1rem, 2.5vw, 2rem) behave?',
      options: [
        'Scales fluidly with 2.5vw while never shrinking below 1rem or growing above 2rem',
        'Always picks the average of the three values',
        'Only applies in dark mode',
      ],
      answer: 0,
      explanation: 'clamp(min, preferred, max) creates smooth responsive typography and spacing.',
    },
    {
      question: 'Which CSS media query detects when a user prefers reduced animations?',
      options: ['@media (prefers-reduced-motion: reduce)', '@media (motion: none)', '@media (animation: off)'],
      answer: 0,
      explanation: 'Respecting prefers-reduced-motion improves accessibility for motion-sensitive users.',
    },
    {
      question: 'What is the difference between position: sticky and position: fixed?',
      options: [
        'sticky scrolls normally until hitting its threshold and stays inside its parent container; fixed stays pinned to the viewport',
        'fixed only works on tables',
        'sticky removes the element from document flow immediately',
      ],
      answer: 0,
      explanation: 'position: sticky respects its containing block bounds, while position: fixed pins to the viewport.',
    },
  ],
  'javascript-essentials': [
    {
      question: 'What does the optional chaining operator (?.) do in user?.profile?.email?',
      options: [
        'Safely evaluates to undefined if user or profile is null/undefined instead of throwing TypeError',
        'Creates missing objects automatically',
        'Converts email to a boolean',
      ],
      answer: 0,
      explanation: 'Optional chaining short-circuits safely on nullish values.',
    },
    {
      question: 'How does ?? (nullish coalescing) differ from || (logical OR) when a value is 0?',
      options: [
        '0 ?? 10 returns 0 because 0 is not null/undefined; 0 || 10 returns 10 because 0 is falsy',
        'They both return 10',
        '?? only works on strings',
      ],
      answer: 0,
      explanation: '?? falls back only for null or undefined, preserving valid 0, false, or empty string values.',
    },
    {
      question: 'Why does fetch(url) still resolve its Promise on an HTTP 404 response?',
      options: [
        'fetch only rejects on network failures; check response.ok to handle 4xx/5xx HTTP errors',
        'Because 404 is considered a success status code',
        'Because fetch cannot read HTTP status codes',
      ],
      answer: 0,
      explanation: 'Always check if (!res.ok) throw new Error(...) after awaiting fetch().',
    },
    {
      question: 'What is event delegation in DOM programming?',
      options: [
        'Attaching one listener to a common parent container and checking event.target.closest() for matching child clicks',
        'Adding duplicate listeners to every single list item manually',
        'Preventing events from bubbling',
      ],
      answer: 0,
      explanation: 'Event delegation uses event bubbling to handle dynamic child elements with a single listener.',
    },
    {
      question: 'What does structuredClone(obj) do in modern JavaScript?',
      options: [
        'Performs a deep copy of nested objects, arrays, Dates, Maps, and Sets',
        'Creates a shallow reference to the same object',
        'Serializes functions to JSON',
      ],
      answer: 0,
      explanation: 'structuredClone() is the native deep-cloning API in modern browsers and Node.js.',
    },
  ],
  'sql-essentials': [
    {
      question: 'What is the difference between WHERE and HAVING in a SQL query?',
      options: [
        'WHERE filters individual rows before GROUP BY; HAVING filters aggregated groups after GROUP BY',
        'HAVING runs before FROM',
        'They are completely interchangeable',
      ],
      answer: 0,
      explanation: 'Use WHERE on raw row columns and HAVING on aggregate expressions like COUNT(*) > 5.',
    },
    {
      question: 'What does a LEFT JOIN return when a row in the left table has no match in the right table?',
      options: [
        'Keeps the left row and fills right-table columns with NULL',
        'Drops the left row completely',
        'Throws a foreign key error',
      ],
      answer: 0,
      explanation: 'LEFT JOIN preserves all rows from the left table regardless of whether a right match exists.',
    },
    {
      question: 'What does COALESCE(nickname, full_name, "Guest") return?',
      options: [
        'The first non-NULL value from left to right',
        'All three values concatenated together',
        'NULL if any argument is NULL',
      ],
      answer: 0,
      explanation: 'COALESCE provides clean SQL fallback defaults for NULL columns.',
    },
    {
      question: 'What is the primary purpose of a database B-Tree index on a frequently queried column?',
      options: [
        'Speeds up SELECT/WHERE lookups from full table scans O(n) to O(log n)',
        'Compresses text strings into ZIP archives',
        'Eliminates the need for primary keys',
      ],
      answer: 0,
      explanation: 'Indexes let the query planner jump straight to matching rows at a small write-overhead cost.',
    },
    {
      question: 'Why wrap a multi-step bank transfer (debit + credit) in BEGIN TRANSACTION ... COMMIT?',
      options: [
        'Guarantees atomicity: either both updates succeed together or ROLLBACK undoes everything cleanly',
        'Makes the database skip constraints',
        'Automatically backs up the server to S3',
      ],
      answer: 0,
      explanation: 'Transactions enforce ACID integrity so partial failures never corrupt balances.',
    },
  ],
  'php-essentials': [
    {
      question: 'What does PHP 8\'s match expression do differently from classic switch?',
      options: [
        'Uses strict (===) comparison, never falls through, and returns a value directly',
        'Requires break; on every arm',
        'Uses loose (==) comparison only',
      ],
      answer: 0,
      explanation: 'PHP 8 match expressions are strict, exhaustive, and expression-oriented.',
    },
    {
      question: 'What does the nullsafe operator ($user?->profile?->city) return when $user is null?',
      options: ['null without throwing an error', 'An empty array', 'Throws a fatal TypeError'],
      answer: 0,
      explanation: '?-> short-circuits cleanly to null when any intermediate object is null.',
    },
    {
      question: 'Why should PHP SQL queries always use PDO prepared statements ($stmt->execute([$email]))?',
      options: [
        'Separates SQL syntax from user parameters, preventing SQL injection',
        'Skips connecting to the database',
        'Allows HTML tags inside SQL',
      ],
      answer: 0,
      explanation: 'PDO bound parameters neutralize SQL injection attacks reliably.',
    },
    {
      question: 'Which PHP function safely encodes user text before printing it into HTML to prevent XSS?',
      options: ['htmlspecialchars($text, ENT_QUOTES, "UTF-8")', 'md5($text)', 'json_decode($text)'],
      answer: 0,
      explanation: 'htmlspecialchars escapes <, >, ", and \' so untrusted input cannot execute as HTML/JS.',
    },
    {
      question: 'What does DateTimeImmutable::modify("+7 days") do in PHP?',
      options: [
        'Returns a brand-new DateTimeImmutable 7 days later while leaving the original unchanged',
        'Mutates the original DateTimeImmutable object in place',
        'Deletes the timezone offset',
      ],
      answer: 0,
      explanation: 'DateTimeImmutable prevents accidental shared date mutation bugs.',
    },
  ],
  'python-fundamentals': [
    {
      question: 'Why should you avoid mutable default arguments like `def add(item, items=[]):` in Python?',
      options: [
        'The default list is created once at function definition time and shared across all calls',
        'Python raises a SyntaxError on empty list defaults',
        'It makes the function run slower',
      ],
      answer: 0,
      explanation: 'Use items=None and initialize items = [] inside the function body instead.',
    },
    {
      question: 'What is the main advantage of opening files with `with open("data.txt") as f:`?',
      options: [
        'The context manager closes the file automatically even if an exception occurs',
        'It loads the file into SQLite automatically',
        'It skips UTF-8 decoding',
      ],
      answer: 0,
      explanation: 'with statements guarantee deterministic resource cleanup.',
    },
    {
      question: 'What does the `@dataclass` decorator automatically generate for a Python class?',
      options: [
        '__init__, __repr__, and __eq__ based on typed class fields',
        'A REST API router',
        'Database migrations',
      ],
      answer: 0,
      explanation: 'dataclasses eliminate repetitive constructor and comparison boilerplate.',
    },
    {
      question: 'What is the average time complexity of checking `x in my_set` vs `x in my_list`?',
      options: ['O(1) for set vs O(n) for list', 'O(n) for both', 'O(1) for list vs O(n) for set'],
      answer: 0,
      explanation: 'Sets use hash tables for constant-time membership checks.',
    },
    {
      question: 'What does `sorted(users, key=lambda u: u["score"], reverse=True)` return?',
      options: [
        'A new list sorted by score from highest to lowest without mutating users',
        'Mutates users in place and returns None',
        'Only the single highest user',
      ],
      answer: 0,
      explanation: 'sorted() always returns a fresh sorted list, leaving the input untouched.',
    },
  ],
  'git-essentials': [
    {
      question: 'What is the Golden Rule of `git rebase`?',
      options: [
        'Never rebase commits that have already been pushed to a shared branch like main',
        'Always rebase main onto feature branches',
        'Never commit before rebasing',
      ],
      answer: 0,
      explanation: 'Rebasing rewrites commit hashes, which breaks history for teammates on shared branches.',
    },
    {
      question: 'How do you stop tracking an accidentally committed .env file without deleting it from your local disk?',
      options: ['git rm --cached .env', 'git delete .env', 'git clean -fd'],
      answer: 0,
      explanation: 'git rm --cached removes the file from the Git index while preserving your local file.',
    },
    {
      question: 'Which command copies a single hotfix commit from another branch onto your current branch?',
      options: ['git cherry-pick <hash>', 'git stash pop', 'git tag -a'],
      answer: 0,
      explanation: 'cherry-pick applies just one specific commit without merging the whole branch.',
    },
    {
      question: 'Which Git tool performs a binary search through commit history to pinpoint a regression?',
      options: ['git bisect', 'git blame', 'git status'],
      answer: 0,
      explanation: 'git bisect finds the first bad commit in O(log n) steps.',
    },
    {
      question: 'How can you recover a commit after an accidental `git reset --hard`?',
      options: [
        'Find the previous commit hash with git reflog and create a branch at that hash',
        'Run git pull --force',
        'Committed work is permanently gone immediately',
      ],
      answer: 0,
      explanation: 'git reflog records local HEAD movements for ~30 days, acting as a local safety net.',
    },
  ],
  'oop-fundamentals': [
    {
      question: 'What is the main advantage of a named static factory method like `Duration.fromMinutes(15)`?',
      options: [
        'Makes units and construction intent self-documenting compared to ambiguous constructors',
        'Prevents the class from having fields',
        'Makes every field global',
      ],
      answer: 0,
      explanation: 'Static factories clarify intent and let a class offer multiple named ways to construct instances.',
    },
    {
      question: 'Which design pattern lets you swap algorithms (like shipping calculators) at runtime?',
      options: ['Strategy pattern', 'Singleton pattern', 'Prototype pattern'],
      answer: 0,
      explanation: 'Strategy encapsulates interchangeable algorithms behind a shared interface.',
    },
    {
      question: 'How does the Observer pattern decouple a publisher from subscribers?',
      options: [
        'The publisher emits events to registered callbacks without depending on concrete subscriber classes',
        'The publisher inherits from every subscriber',
        'Subscribers poll the database every millisecond',
      ],
      answer: 0,
      explanation: 'Observer keeps publishers independent of who listens to their events.',
    },
    {
      question: 'How does a Decorator differ from an Adapter?',
      options: [
        'Decorator wraps an object with the same interface to layer behavior; Adapter translates between incompatible interfaces',
        'Adapter deletes methods from a class',
        'Decorator requires multiple inheritance',
      ],
      answer: 0,
      explanation: 'Decorators compose extra behavior (caching, logging); Adapters bridge mismatched APIs.',
    },
    {
      question: 'Why should Value Objects like Money(25, "USD") be immutable?',
      options: [
        'Returning new instances prevents silent shared-mutation bugs across unrelated services',
        'Immutable objects cannot have methods',
        'Value objects cannot be compared for equality',
      ],
      answer: 0,
      explanation: 'Immutability makes Value Objects safe to share and reason about.',
    },
  ],
  'c-fundamentals': [
    {
      question: 'If `int *p` points to address 2000 and `sizeof(int)` is 4, what address is `p + 3`?',
      options: ['2012', '2003', '2004'],
      answer: 0,
      explanation: 'Pointer arithmetic scales by sizeof(*p): 2000 + 3 * 4 = 2012.',
    },
    {
      question: 'Which bitwise expression clears FLAG_EXEC from an unsigned int `perms`?',
      options: ['perms &= ~FLAG_EXEC;', 'perms |= FLAG_EXEC;', 'perms && FLAG_EXEC;'],
      answer: 0,
      explanation: 'Bitwise AND with the inverted mask (~FLAG_EXEC) clears only that bit.',
    },
    {
      question: 'Why was `gets()` removed from C11 in favor of `fgets(buf, sizeof(buf), fp)`?',
      options: [
        'gets() had no buffer size bound and caused stack buffer overflows',
        'gets() could only read numbers',
        'fgets() does not require stdio.h',
      ],
      answer: 0,
      explanation: 'fgets() enforces an explicit maximum byte count and always null-terminates.',
    },
    {
      question: 'Why should you assign `realloc()` to a temporary pointer before overwriting your original pointer?',
      options: [
        'If realloc() fails and returns NULL, assigning directly leaks the original memory block',
        'realloc() only works on stack arrays otherwise',
        'The compiler forbids reusing pointer names',
      ],
      answer: 0,
      explanation: 'Using a temp pointer preserves your original allocation on failure.',
    },
    {
      question: 'Why are `static inline` helper functions generally safer than function-like `#define` macros?',
      options: [
        'They enforce parameter types and evaluate each argument only once',
        'They skip the compiler completely',
        'Macros cannot return values',
      ],
      answer: 0,
      explanation: 'Inline functions eliminate macro double-evaluation bugs like SQUARE(i++).',
    },
  ],
  'cpp-fundamentals': [
    {
      question: 'What does `std::move(vec)` enable when pushing a local vector into a container?',
      options: [
        'Transfers ownership of the internal heap buffer in O(1) without deep copying elements',
        'Deletes the vector immediately',
        'Copies the vector twice for safety',
      ],
      answer: 0,
      explanation: 'std::move casts to an rvalue reference so move constructors steal pointers in O(1).',
    },
    {
      question: 'Why is `std::string_view` ideal for read-only string function parameters?',
      options: [
        'It passes a non-owning (pointer + length) view with zero heap allocation',
        'It compresses text automatically',
        'It mutates the caller string in place',
      ],
      answer: 0,
      explanation: 'string_view avoids allocating a temporary std::string when callers pass literals or slices.',
    },
    {
      question: 'Why must a polymorphic C++ base class define a `virtual` destructor?',
      options: [
        'So deleting a derived object through a base pointer runs the derived destructor cleanly',
        'Because C++ forbids constructors otherwise',
        'To disable std::unique_ptr',
      ],
      answer: 0,
      explanation: 'Without a virtual destructor, deleting via a base pointer causes undefined behavior.',
    },
    {
      question: 'What happens if you read `counts["missing"]` on a non-const `std::unordered_map<std::string, int>`?',
      options: [
        'It inserts "missing" with value 0 into the map',
        'It returns std::nullopt',
        'It throws std::out_of_range',
      ],
      answer: 0,
      explanation: 'Use .contains() or .find() for read-only membership checks without mutating the map.',
    },
    {
      question: 'What is the idiomatic way to catch C++ exceptions?',
      options: [
        'catch (const std::exception& e)',
        'catch (std::exception e)',
        'catch (void* e)',
      ],
      answer: 0,
      explanation: 'Catching by const reference avoids object slicing and unnecessary copies.',
    },
  ],
  'java-fundamentals': [
    {
      question: 'What does Java\'s `try (var res = ...)` (try-with-resources) guarantee?',
      options: [
        'Automatically calls res.close() when the block exits, even if an exception is thrown',
        'Prevents any exception from being thrown',
        'Runs the block on a background thread',
      ],
      answer: 0,
      explanation: 'try-with-resources guarantees AutoCloseable cleanup without manual finally blocks.',
    },
    {
      question: 'What does declaring a `sealed interface Result permits Ok, Err` enable?',
      options: [
        'Restricts implementations to Ok and Err, allowing compiler-verified exhaustive switch expressions',
        'Makes all fields public and mutable',
        'Disables generics',
      ],
      answer: 0,
      explanation: 'Sealed hierarchies let the Java compiler verify that every subtype is handled.',
    },
    {
      question: 'What does `counts.merge(word, 1, Integer::sum)` do on a Java `HashMap<String, Integer>`?',
      options: [
        'Inserts 1 if word is absent, or adds 1 to the existing count if present',
        'Deletes word from the map',
        'Sorts the map alphabetically',
      ],
      answer: 0,
      explanation: 'Map.merge() updates frequency counters cleanly in a single atomic line.',
    },
    {
      question: 'Why should modern Java use `java.time.LocalDate` and `Instant` instead of `java.util.Date`?',
      options: [
        'java.time types are immutable, thread-safe, and have clear timezone semantics',
        'java.util.Date does not store years',
        'java.time runs without a JVM',
      ],
      answer: 0,
      explanation: 'Immutability and explicit UTC/local types eliminate classic Java date bugs.',
    },
    {
      question: 'Why are Java 21 Virtual Threads well suited for high-concurrency I/O services?',
      options: [
        'They are lightweight JVM-managed threads that unmount from OS carrier threads during blocking I/O',
        'They turn off the garbage collector',
        'They only run on single-core CPUs',
      ],
      answer: 0,
      explanation: 'Virtual threads let simple blocking code scale to tens of thousands of concurrent tasks.',
    },
  ],
  'csharp-fundamentals': [
    {
      question: 'What do C# 12 primary constructors (`class Service(IRepo repo)`) simplify?',
      options: [
        'Eliminate repetitive private field declarations and constructor assignments for injected dependencies',
        'Remove the need for interfaces',
        'Make all classes static',
      ],
      answer: 0,
      explanation: 'Primary constructor parameters stay in scope throughout the class body.',
    },
    {
      question: 'How do you constrain a generic type `T` in C# so it must implement `IComparable<T>`?',
      options: ['where T : IComparable<T>', 'T extends IComparable<T>', 'require T is IComparable'],
      answer: 0,
      explanation: 'C# uses the where T : Constraint syntax for generic constraints.',
    },
    {
      question: 'What does `using var reader = new StringReader(text);` guarantee in C#?',
      options: [
        'reader.Dispose() is called automatically when leaving the enclosing scope',
        'reader stays allocated forever',
        'Exceptions inside the scope are swallowed',
      ],
      answer: 0,
      explanation: 'using declarations guarantee IDisposable cleanup even when exceptions occur.',
    },
    {
      question: 'Why is `dict.TryGetValue(key, out var val)` preferred over `ContainsKey` + `dict[key]`?',
      options: [
        'Safely handles missing keys in a single hash lookup without throwing KeyNotFoundException',
        'Sorts the dictionary keys automatically',
        'Deletes the key after reading',
      ],
      answer: 0,
      explanation: 'TryGetValue avoids both exceptions and redundant double hashing.',
    },
    {
      question: 'Which built-in .NET namespace provides high-performance JSON serialization with zero extra packages?',
      options: ['System.Text.Json', 'System.Net.Xml', 'System.Json.Legacy'],
      answer: 0,
      explanation: 'System.Text.Json is .NET\'s built-in, low-allocation JSON serializer.',
    },
  ],
  'typescript-essentials': [
    {
      question: 'What does a custom type predicate return type (`val is User`) tell TypeScript?',
      options: [
        'When the function returns true, TypeScript narrows val to User in that branch',
        'Converts val into a class at runtime',
        'Disables strict null checks',
      ],
      answer: 0,
      explanation: 'Type predicates let reusable boolean helpers drive compile-time type narrowing.',
    },
    {
      question: 'What does the TypeScript `satisfies` operator do?',
      options: [
        'Validates that a value conforms to a type while keeping its narrower inferred literal types',
        'Casts unsafely like `as any`',
        'Freezes the object at runtime',
      ],
      answer: 0,
      explanation: 'satisfies gives compile-time validation without widening specific keys or literals.',
    },
    {
      question: 'What is the return type of an async TypeScript function that returns a number?',
      options: ['Promise<number>', 'number', 'Async<number>'],
      answer: 0,
      explanation: 'Every async function wraps its returned value in a Promise<T>.',
    },
    {
      question: 'How is a mapped type written in TypeScript to transform every property of T?',
      options: ['{ [K in keyof T]: ... }', '{ for K of T: ... }', 'map<T>(K => ...)'],
      answer: 0,
      explanation: 'Mapped types iterate over keyof T using [K in keyof T].',
    },
    {
      question: 'Why is `JSON.parse(raw) as User` risky on untrusted API responses?',
      options: [
        'Type assertions do zero runtime validation, so malformed JSON can still crash at runtime',
        'JSON.parse does not work in TypeScript',
        'It strips all string properties',
      ],
      answer: 0,
      explanation: 'Validate untrusted JSON boundaries at runtime (parse as unknown first) before trusting types.',
    },
  ],
  'react-fundamentals': [
    {
      question: 'When two sibling React components need to share and update the same state, what is the standard pattern?',
      options: [
        'Lift the state up to their closest common parent component',
        'Duplicate the state independently in both siblings',
        'Store it on window.globalState',
      ],
      answer: 0,
      explanation: 'Lifting state up maintains a single source of truth across sibling components.',
    },
    {
      question: 'What kind of state is the best fit for React Context?',
      options: [
        'App-wide, low-frequency state like theme, locale, or current authenticated user',
        'Every keystroke inside a local text input',
        'Temporary loop counters',
      ],
      answer: 0,
      explanation: 'Context avoids deep prop drilling for cross-cutting app state.',
    },
    {
      question: 'What happens in React when you mutate `ref.current = 10` on a `useRef`?',
      options: [
        'The value persists across renders without triggering a re-render',
        'The component immediately re-renders twice',
        'React throws a runtime error',
      ],
      answer: 0,
      explanation: 'Refs hold mutable values or DOM handles without causing re-renders.',
    },
    {
      question: 'Why should a data-fetching `useEffect` abort stale requests with `AbortController` during cleanup?',
      options: [
        'Prevents an older, slower network response from overwriting fresher state after parameters change',
        'Because fetch() cannot return JSON without AbortController',
        'To disable browser caching',
      ],
      answer: 0,
      explanation: 'Aborting in cleanup eliminates out-of-order async race conditions.',
    },
    {
      question: 'When is `useReducer` preferred over several separate `useState` hooks?',
      options: [
        'When multiple state fields transition together through well-defined actions that benefit from a pure reducer function',
        'When a component has zero state',
        'Only when using Redux',
      ],
      answer: 0,
      explanation: 'useReducer centralizes complex state transitions into one pure, testable function.',
    },
  ],
  'nodejs-essentials': [
    {
      question: 'What happens when an Express/Node auth middleware sends a 401 response without calling `next()`?',
      options: [
        'The request pipeline stops immediately and downstream route handlers do not run',
        'The route handler still executes',
        'Node.js exits the process',
      ],
      answer: 0,
      explanation: 'Short-circuiting without next() protects private endpoints cleanly.',
    },
    {
      question: 'Why should Node.js backends hash passwords with `crypto.scryptSync` + per-user random salt instead of SHA-256?',
      options: [
        'scrypt is intentionally slow and memory-hard, resisting GPU brute-force cracking',
        'SHA-256 cannot hash ASCII characters',
        'scrypt allows decrypting passwords back to plaintext',
      ],
      answer: 0,
      explanation: 'Salted KDFs like scrypt and Argon2 protect stored password hashes against offline attacks.',
    },
    {
      question: 'Which HTTP status code should an API return when a client exceeds a rate limit?',
      options: ['429 Too Many Requests', '204 No Content', '401 Unauthorized'],
      answer: 0,
      explanation: '429 signals clients to slow down and retry later.',
    },
    {
      question: 'Which command runs Node.js 20\'s built-in zero-dependency test runner?',
      options: ['node --test', 'node --spec', 'npm --assert'],
      answer: 0,
      explanation: 'node --test runs test files written with node:test and node:assert/strict.',
    },
    {
      question: 'Why should production Node.js servers handle `process.on("SIGTERM", ...)`?',
      options: [
        'To close the HTTP server gracefully so in-flight requests finish before shutdown',
        'To disable SSL certificates',
        'To delete temporary logs',
      ],
      answer: 0,
      explanation: 'Graceful SIGTERM handling enables zero-downtime restarts and deploys.',
    },
  ],
  'linux-cli': [
    {
      question: 'Why should you quote `"*.log"` in `find /var/log -name "*.log"`?',
      options: [
        'Prevents Bash from expanding * in the current directory before passing the pattern to find',
        'find rejects lowercase filenames without quotes',
        'Quoting makes find delete files',
      ],
      answer: 0,
      explanation: 'Quoting ensures find itself evaluates the glob pattern recursively.',
    },
    {
      question: 'In `awk \'{print $2}\'`, what does `$2` represent?',
      options: ['The second whitespace-separated column on each input line', 'The second file on disk', 'The exit code'],
      answer: 0,
      explanation: 'awk automatically splits each line into fields $1, $2, ..., $NF.',
    },
    {
      question: 'Which SSH key file should be added to a remote server\'s `~/.ssh/authorized_keys`?',
      options: ['Only the public key (.pub)', 'The private key', 'Both keys together'],
      answer: 0,
      explanation: 'Keep private keys strictly local; servers only ever need the .pub public key.',
    },
    {
      question: 'What does `curl -sI https://devpath.mycampus.ph` return?',
      options: [
        'Only the HTTP status line and response headers silently',
        'The entire HTML page body',
        'Only DNS A records',
      ],
      answer: 0,
      explanation: '-s hides the progress meter and -I performs a HEAD request for headers.',
    },
    {
      question: 'What does `${PORT:-8787}` evaluate to in Bash when `PORT` is unset?',
      options: ['8787', 'An empty string', 'Throws a syntax error'],
      answer: 0,
      explanation: 'Parameter expansion ${VAR:-default} provides a clean fallback when VAR is unset or empty.',
    },
  ],
  'docker-essentials': [
    {
      question: 'How do you let an `api` container talk to a `postgres` container without exposing port 5432 publicly?',
      options: [
        'Attach both to the same user-defined Docker network and omit -p 5432:5432 on postgres',
        'Run postgres with -p 5432:5432',
        'Disable host networking',
      ],
      answer: 0,
      explanation: 'Containers on a shared Docker network reach each other internally without publishing host ports.',
    },
    {
      question: 'Why should secrets like API keys be passed via `--env-file` at runtime instead of `ENV` in a Dockerfile?',
      options: [
        'Dockerfile layers are baked into the image and inspectable by anyone who pulls it',
        'Dockerfiles do not support ENV',
        'Runtime env vars make images larger',
      ],
      answer: 0,
      explanation: 'Keeping secrets out of images keeps builds portable and secure.',
    },
    {
      question: 'What does `Exited (137)` on a Docker container typically mean?',
      options: [
        'The container was killed with SIGKILL, most commonly due to exceeding its memory limit (OOM)',
        'The container exited cleanly with success',
        'The Dockerfile had a syntax error',
      ],
      answer: 0,
      explanation: 'Exit 137 (128 + 9) indicates SIGKILL, usually from the Linux OOM killer.',
    },
    {
      question: 'What does `restart: unless-stopped` do in Docker Compose?',
      options: [
        'Restarts containers automatically after crashes or server reboots unless manually stopped',
        'Restarts healthy containers every minute',
        'Blocks docker stop',
      ],
      answer: 0,
      explanation: 'unless-stopped provides reliable crash and reboot recovery.',
    },
    {
      question: 'Why is setting `--memory 256m` important on containers running on a small VPS?',
      options: [
        'Prevents a memory leak in one container from exhausting host RAM and crashing other services',
        'Docker refuses to start without --memory',
        'Makes builds compile faster',
      ],
      answer: 0,
      explanation: 'Resource limits isolate services and keep the host OS responsive.',
    },
  ],
  'dsa-fundamentals': [
    {
      question: 'Why does a variable-size Sliding Window with an inner while loop still run in O(n) total time?',
      options: [
        'Both left and right pointers only advance forward at most n times each across the entire run',
        'While loops always execute in O(1)',
        'Sets automatically sort the array',
      ],
      answer: 0,
      explanation: 'Total pointer movements are bounded by 2n, giving O(n) linear time.',
    },
    {
      question: 'How much extra space does Floyd\'s Fast & Slow pointer linked-list cycle detection use?',
      options: ['O(1) constant space', 'O(n) Hash Set space', 'O(log n) stack space'],
      answer: 0,
      explanation: 'Only two pointer references (slow and fast) are stored.',
    },
    {
      question: 'What is the guaranteed worst-case time complexity of Merge Sort?',
      options: ['O(n log n)', 'O(n^2)', 'O(n)'],
      answer: 0,
      explanation: 'Merge Sort always divides evenly into log n levels with O(n) merge work per level.',
    },
    {
      question: 'What are the time complexities of `peek()` and `push()` on a Binary Min-Heap?',
      options: ['peek() is O(1) and push() is O(log n)', 'Both are O(n)', 'Both are O(1)'],
      answer: 0,
      explanation: 'The root is always at index 0 (O(1)), and bubbling up takes at most the tree height O(log n).',
    },
    {
      question: 'What is the time complexity of BFS on a graph with V vertices and E edges using an adjacency list?',
      options: ['O(V + E)', 'O(V * E)', 'O(V^2)'],
      answer: 0,
      explanation: 'Each vertex and edge is visited a constant number of times.',
    },
  ],
  'go-fundamentals': [
    {
      question: 'What is the default zero value of an uninitialized int variable in Go?',
      options: ['0', 'nil', 'undefined'],
      answer: 0,
      explanation: 'All Go types have deterministic zero values: 0 for numeric types, false for bool, and "" for string.',
    },
    {
      question: 'How does a Go switch case behave by default after matching?',
      options: [
        'It breaks automatically without needing an explicit break statement',
        'It falls through to the next case unless break is written',
        'It exits the entire program',
      ],
      answer: 0,
      explanation: 'Go prevents accidental fallthrough bugs by breaking automatically at the end of each case.',
    },
    {
      question: 'What does the comma-ok idiom `val, ok := m[key]` check on a Go map?',
      options: [
        'Whether key actually exists in the map versus returning the zero value',
        'Whether the map is sorted alphabetically',
        'Whether the map is thread-safe',
      ],
      answer: 0,
      explanation: 'ok is true if key is present in the map and false if absent.',
    },
    {
      question: 'When must a Go method use a pointer receiver `(s *Struct)`?',
      options: [
        'When the method mutates fields on the receiver or avoids copying a large struct',
        'Whenever the method returns an integer',
        'Only inside package main',
      ],
      answer: 0,
      explanation: 'Value receivers work on a copy, so mutating state requires a pointer receiver.',
    },
    {
      question: 'How does a struct satisfy an interface in Go?',
      options: [
        'Implicitly, simply by implementing all methods declared in the interface',
        'By adding an explicit `implements` keyword',
        'By extending an abstract class',
      ],
      answer: 0,
      explanation: 'Go uses structural typing for interfaces without explicit declarations.',
    },
    {
      question: 'What does `fmt.Errorf("load failed: %w", err)` accomplish?',
      options: [
        'Wraps err so callers can inspect it with errors.Is and errors.As',
        'Converts the error into a warning string only',
        'Clears the error to nil',
      ],
      answer: 0,
      explanation: 'The %w verb preserves the wrapped error chain while adding call-site context.',
    },
    {
      question: 'When does a `defer` statement execute in Go?',
      options: [
        'Right before the surrounding function returns, in LIFO (last-in, first-out) order',
        'Before the function starts',
        'Only if a panic occurs',
      ],
      answer: 0,
      explanation: 'Deferred calls always run when the enclosing function returns, making resource cleanup reliable.',
    },
    {
      question: 'Why is `sync.WaitGroup` commonly used with goroutines launched in `main()`?',
      options: [
        'To wait for all goroutines to call Done() before main exits and terminates the process',
        'To limit strings to ASCII characters',
        'To convert channels into slices',
      ],
      answer: 0,
      explanation: 'When main() returns, the process exits immediately even if other goroutines are still running.',
    },
    {
      question: 'What happens when sending to an unbuffered channel with no active receiver?',
      options: [
        'The sending goroutine blocks until another goroutine receives the value',
        'The value is silently dropped',
        'Go allocates infinite memory',
      ],
      answer: 0,
      explanation: 'Unbuffered channels synchronize sender and receiver directly.',
    },
    {
      question: 'Why should you always `defer cancel()` after calling `context.WithTimeout`?',
      options: [
        'To release internal timer resources immediately when the function exits',
        'To double the timeout window',
        'To retry the HTTP request automatically',
      ],
      answer: 0,
      explanation: 'Deferring cancel() prevents leaking timers if work completes before the deadline.',
    },
    {
      question: 'Why must struct fields start with an uppercase letter for `encoding/json` to serialize them?',
      options: [
        'Only exported (capitalized) identifiers are visible to external packages like encoding/json',
        'Lowercase fields cannot hold strings',
        'JSON only supports uppercase keys',
      ],
      answer: 0,
      explanation: 'In Go, leading capitalization defines package export visibility.',
    },
    {
      question: 'Which command runs Go tests with the built-in concurrency race detector?',
      options: ['go test -race ./...', 'go vet --threads', 'go run --safe'],
      answer: 0,
      explanation: 'go test -race detects unsynchronized concurrent memory accesses during tests.',
    },
    {
      question: 'What does `select` do in Go concurrency?',
      options: [
        'Waits on multiple channel send/receive operations and proceeds with whichever becomes ready first',
        'Queries a SQL database table',
        'Sorts a slice in place',
      ],
      answer: 0,
      explanation: 'select multiplexes channel operations, timeouts, and cancellation cleanly.',
    },
    {
      question: 'Why do production Go services use bounded worker pools for external HTTP calls?',
      options: [
        'To cap open sockets, memory footprint, and downstream rate-limit pressure',
        'Because Go only allows 2 goroutines per CPU',
        'Because channels cannot transmit structs',
      ],
      answer: 0,
      explanation: 'Bounding concurrency protects both local file descriptors and external dependencies.',
    },
    {
      question: 'What is the difference between `len(s)` and `cap(s)` on a Go slice?',
      options: [
        'len is the current number of elements; cap is the backing array capacity before reallocation',
        'len is bytes and cap is megabytes',
        'They are always identical',
      ],
      answer: 0,
      explanation: 'append() grows the slice up to cap before allocating a larger backing array.',
    },
  ],
  'postgresql-design': [
    {
      question: 'What does a FOREIGN KEY constraint enforce?',
      options: [
        'Referential integrity so every child row points to an existing parent row',
        'Automatic full-text indexing on every column',
        'Automatic JSON serialization',
      ],
      answer: 0,
      explanation: 'Foreign keys prevent orphaned records at the database engine level.',
    },
    {
      question: 'Why should monetary amounts be stored as NUMERIC or integer cents instead of FLOAT?',
      options: [
        'Binary floating-point introduces rounding errors on decimal fractions like 0.1 + 0.2',
        'FLOAT cannot store negative numbers',
        'NUMERIC takes 0 bytes on disk',
      ],
      answer: 0,
      explanation: 'Exact decimal or integer-cent types avoid penny rounding drift in financial data.',
    },
    {
      question: 'Why is copying `price_at_purchase` into `order_items` good relational design?',
      options: [
        'Past orders retain the exact price paid even when catalog prices change later',
        'SQL cannot join numeric columns',
        'It eliminates the need for primary keys',
      ],
      answer: 0,
      explanation: 'Capturing historical snapshots preserves invoice accuracy over time.',
    },
    {
      question: 'What is the main trade-off of adding many indexes to a write-heavy table?',
      options: [
        'Every INSERT, UPDATE, and DELETE must maintain each index, slowing writes and using extra disk',
        'SELECT queries stop returning sorted rows',
        'Transactions are disabled',
      ],
      answer: 0,
      explanation: 'Indexes accelerate reads at the cost of write amplification and storage.',
    },
    {
      question: 'For a composite B-Tree index on `(tenant_id, created_at)`, which query uses it best?',
      options: [
        "WHERE tenant_id = 7 AND created_at >= '2026-01-01'",
        "WHERE created_at >= '2026-01-01' without tenant_id",
        'WHERE tenant_id + 1 = 8',
      ],
      answer: 0,
      explanation: 'Composite B-Tree indexes follow the leftmost-prefix rule: equality on the leading column unlocks range scans on the next.',
    },
    {
      question: 'When is a partial index like `CREATE INDEX ... WHERE status = \'pending\'` most useful?',
      options: [
        'When queries frequently target a small hot subset of rows in a large table',
        'When every row has status = pending',
        'When the table has no primary key',
      ],
      answer: 0,
      explanation: 'Partial indexes stay tiny in RAM and incur zero maintenance overhead on completed rows.',
    },
    {
      question: 'Why does `WHERE LOWER(email) = \'a@b.com\'` normally bypass a plain index on `(email)`?',
      options: [
        'Wrapping the column in a function prevents direct B-Tree lookup unless an expression index on LOWER(email) exists',
        'B-Tree indexes cannot index text columns',
        'LOWER() disables WHERE clauses',
      ],
      answer: 0,
      explanation: 'Expression indexes (or citext) allow indexed case-insensitive searches.',
    },
    {
      question: 'What does Atomicity in ACID guarantee?',
      options: [
        'All statements in a transaction succeed together or roll back together on failure',
        'Queries always finish in under 1ms',
        'Tables never need backups',
      ],
      answer: 0,
      explanation: 'Atomicity prevents half-applied updates if an error or crash occurs mid-transaction.',
    },
    {
      question: 'How does PostgreSQL MVCC prevent readers from blocking writers?',
      options: [
        'Each transaction reads a consistent snapshot of row versions while writers append new versions',
        'PostgreSQL runs only one query at a time',
        'PostgreSQL disables transactions during SELECTs',
      ],
      answer: 0,
      explanation: 'Multi-Version Concurrency Control enables high concurrent read/write throughput.',
    },
    {
      question: 'What does `SELECT ... FOR UPDATE` do inside a transaction?',
      options: [
        'Locks the matched rows so concurrent transactions wait before modifying them',
        'Deletes the matched rows immediately',
        'Converts the table to read-only permanently',
      ],
      answer: 0,
      explanation: 'Row-level locking prevents race conditions like double-spending a wallet balance.',
    },
    {
      question: 'How does a window function (`OVER (...)`) differ from `GROUP BY`?',
      options: [
        'Window functions keep every individual row while adding group or running calculations',
        'Window functions delete duplicate rows',
        'Window functions cannot use ORDER BY',
      ],
      answer: 0,
      explanation: 'GROUP BY collapses rows into one per group; window functions preserve row-level detail.',
    },
    {
      question: 'Which PostgreSQL index type accelerates JSONB containment (`@>`) and full-text search?',
      options: ['GIN (Generalized Inverted Index)', 'Unindexed sequential scan', 'Hash index only'],
      answer: 0,
      explanation: 'GIN indexes map internal keys/tokens inside composite values like JSONB and tsvectors.',
    },
    {
      question: 'Why should you use `CREATE INDEX CONCURRENTLY` on large live tables?',
      options: [
        'It builds the index without blocking concurrent INSERT, UPDATE, and DELETE writes',
        'It skips half the rows to finish faster',
        'It automatically compresses old backups',
      ],
      answer: 0,
      explanation: 'Standard CREATE INDEX takes a write-blocking lock until the build completes.',
    },
    {
      question: 'What is the main benefit of a CTE (`WITH step AS (...)`) in complex analytics queries?',
      options: [
        'Organizes multi-stage logic into readable named steps top-to-bottom',
        'Removes the need for FROM clauses',
        'Automatically shards the database',
      ],
      answer: 0,
      explanation: 'CTEs make layered queries far easier to read, test, and refactor than nested subqueries.',
    },
    {
      question: 'What does `EXPLAIN (ANALYZE, BUFFERS)` show that plain `EXPLAIN` does not?',
      options: [
        'Actual execution times, actual row counts, and shared buffer cache hits/reads',
        'Only table creation DDL',
        'User passwords',
      ],
      answer: 0,
      explanation: 'EXPLAIN ANALYZE actually runs the query to compare planner estimates against real runtime metrics.',
    },
  ],
  'system-design-fundamentals': [
    {
      question: 'Why do backend engineers track p95 and p99 latency instead of only average latency?',
      options: [
        'Averages hide slow tail outliers that hurt real users experiencing cache misses or lock waits',
        'p99 is always smaller than the median',
        'Averages cannot measure milliseconds',
      ],
      answer: 0,
      explanation: 'Tail latency reveals worst-case user experience masked by arithmetic means.',
    },
    {
      question: 'Why should web application servers stay stateless behind a load balancer?',
      options: [
        'Any server can handle any request, enabling effortless horizontal autoscaling and failover',
        'Stateless servers do not need databases',
        'Load balancers cannot route HTTPS otherwise',
      ],
      answer: 0,
      explanation: 'Storing session state externally in Redis or SQL lets instances scale up or down freely.',
    },
    {
      question: 'What happens on a cache miss in the cache-aside (lazy-loading) pattern?',
      options: [
        'The application queries the database, writes the result into the cache with a TTL, and returns it',
        'The request immediately returns HTTP 500',
        'The database restarts automatically',
      ],
      answer: 0,
      explanation: 'Cache-aside populates the cache on demand and keeps read-heavy paths fast.',
    },
    {
      question: 'What is a cache stampede (thundering herd)?',
      options: [
        'Many concurrent requests miss an expired hot key simultaneously and overwhelm the database',
        'A CDN serving static images too quickly',
        'A database backup finishing early',
      ],
      answer: 0,
      explanation: 'Request coalescing, jittered TTLs, or probabilistic early refresh prevent stampedes.',
    },
    {
      question: 'A user updates their profile and refreshes immediately, seeing old data. What is the most likely cause?',
      options: [
        'Replication lag on a read replica that has not yet applied the leader write',
        'DNS expired in 1 second',
        'The browser disabled CSS',
      ],
      answer: 0,
      explanation: 'Reading a user\'s own recent writes from the leader guarantees read-your-own-writes consistency.',
    },
    {
      question: 'What happens if you shard a global table by `country` when 80% of traffic comes from one country?',
      options: [
        'A hot shard forms and bottlenecks 80% of traffic while other shards sit mostly idle',
        'Traffic splits evenly across all shards automatically',
        'Cross-shard joins become O(1)',
      ],
      answer: 0,
      explanation: 'Shard keys need high cardinality and uniform distribution to avoid hot spots.',
    },
    {
      question: 'What problem does consistent hashing solve in distributed caches and sharded stores?',
      options: [
        'Minimizes the fraction of keys that must move when nodes are added or removed',
        'Eliminates the need for network sockets',
        'Compresses JSON payloads by 90%',
      ],
      answer: 0,
      explanation: 'Consistent hashing remaps only ~1/N keys on topology changes instead of rehashing nearly everything.',
    },
    {
      question: 'Why must message queue consumers be idempotent under at-least-once delivery?',
      options: [
        'Retries after timeouts or crashes can deliver the same message twice, so reprocessing must not duplicate side effects',
        'Queues never retry failed jobs',
        'Idempotency shrinks message headers',
      ],
      answer: 0,
      explanation: 'Idempotency keys or unique DB constraints guarantee safe retries.',
    },
    {
      question: 'What is the purpose of a Dead-Letter Queue (DLQ)?',
      options: [
        'Isolates repeatedly failing poison messages so they do not block healthy queue processing',
        'Deletes all messages after 1 second',
        'Replaces the primary relational database',
      ],
      answer: 0,
      explanation: 'DLQs let engineers inspect, fix, and replay failed messages without stalling the main queue.',
    },
    {
      question: 'Why should retry logic combine exponential backoff with random jitter?',
      options: [
        'To prevent synchronized waves of retrying clients from hammering a recovering service together',
        'To increase server CPU usage',
        'To bypass TLS certificates',
      ],
      answer: 0,
      explanation: 'Jitter spreads retry attempts evenly over time so downstream services can recover.',
    },
    {
      question: 'What does a Circuit Breaker pattern do when a downstream dependency keeps failing?',
      options: [
        'Fails fast immediately for a cooldown window instead of piling up slow hanging threads',
        'Shuts down the entire cloud region',
        'Disables authentication',
      ],
      answer: 0,
      explanation: 'Failing fast prevents thread-pool exhaustion and cascading outages across upstream services.',
    },
    {
      question: 'In service observability, what does the RED method measure?',
      options: ['Rate, Errors, and Duration', 'RAM, Ethernet, and Disk', 'Read, Execute, and Delete'],
      answer: 0,
      explanation: 'RED focuses directly on user-facing request throughput, failure rate, and latency.',
    },
    {
      question: 'Why do analytics-enabled URL shorteners usually return HTTP 302 instead of 301?',
      options: [
        '301 is cached aggressively by browsers, bypassing the shortener server so repeat clicks are not counted',
        '302 is encrypted while 301 is plaintext',
        'Browsers block 301 redirects',
      ],
      answer: 0,
      explanation: 'HTTP 302 ensures browsers check the redirect endpoint so click analytics stay accurate.',
    },
    {
      question: 'Why do large social networks use a hybrid push/pull model for news feeds?',
      options: [
        'Pushing celebrity posts to millions of follower timelines causes extreme write amplification, so celebrity posts are merged on read',
        'Push fan-out cannot store timestamps',
        'Pull fan-out requires zero database reads',
      ],
      answer: 0,
      explanation: 'Hybrid fan-out keeps normal feeds instant while protecting writes from high-follower accounts.',
    },
    {
      question: 'Why is keyset (cursor) pagination preferred over large `OFFSET` pagination at scale?',
      options: [
        'Large OFFSET scans and discards thousands of skipped rows, whereas cursor pagination jumps directly via an index',
        'OFFSET is invalid in PostgreSQL',
        'Cursor pagination requires no indexes',
      ],
      answer: 0,
      explanation: 'Cursor pagination keeps deep-page queries O(log N) and avoids skipped/duplicate items when rows are inserted.',
    },
  ],
};
