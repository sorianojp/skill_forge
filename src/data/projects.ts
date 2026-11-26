export interface GuidedProject {
  id: string;
  title: string;
  tagline: string;
  category: 'Frontend' | 'Backend' | 'Data' | 'DevOps' | 'Systems';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  stack: string[];
  playgroundLang: string;
  recommendedCourses: Array<{ slug: string; label: string }>;
  architectureSummary: string;
  milestones: string[];
  stretchGoals: string[];
  starterSnippet: string;
}

export const GUIDED_PROJECTS: GuidedProject[] = [
  {
    id: 'responsive-dev-portfolio',
    title: 'Responsive Developer Portfolio',
    tagline: 'Design and ship a fast, accessible personal portfolio with dark mode, project cards, and semantic HTML.',
    category: 'Frontend',
    difficulty: 'Beginner',
    estimatedHours: 4,
    stack: ['HTML5', 'CSS Grid', 'Flexbox', 'JavaScript'],
    playgroundLang: 'web',
    recommendedCourses: [
      { slug: 'html-fundamentals', label: 'HTML Fundamentals' },
      { slug: 'css-layout', label: 'CSS Layout' },
    ],
    architectureSummary:
      'Use semantic landmarks (<header>, <main>, <section>, <footer>), CSS custom properties for light/dark theming, and a CSS Grid auto-fit layout so cards adapt cleanly from mobile to desktop without media-query bloat.',
    milestones: [
      'Build semantic hero, about, projects grid, and contact sections',
      'Implement responsive 1/2/3-column CSS Grid for project cards',
      'Add light/dark theme toggle persisted in localStorage',
      'Add keyboard-accessible skip link and visible focus rings',
      'Validate Lighthouse accessibility and performance scores >= 95',
    ],
    stretchGoals: [
      'Filter portfolio projects by technology tag using vanilla JS',
      'Deploy to GitHub Pages, Netlify, or Cloudflare Pages with a custom domain',
    ],
    starterSnippet: `/* Responsive auto-fit portfolio grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

:root {
  --surface: #ffffff;
  --ink: #0f172a;
}`,
  },
  {
    id: 'react-budget-tracker',
    title: 'Interactive Budget & Expense Tracker',
    tagline: 'Build a reactive personal finance dashboard with category filters, monthly totals, and CSV export.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    estimatedHours: 6,
    stack: ['React 19', 'TypeScript', 'Hooks', 'localStorage'],
    playgroundLang: 'react',
    recommendedCourses: [
      { slug: 'react-fundamentals', label: 'React 19' },
      { slug: 'typescript-essentials', label: 'TypeScript 5' },
    ],
    architectureSummary:
      'Model transactions with a strict TypeScript interface, manage state with useReducer, derive category totals via useMemo, and persist entries to localStorage so data survives reloads.',
    milestones: [
      'Define Transaction type (id, title, amount, category, date, type)',
      'Create add/delete transaction form with inline validation',
      'Compute income, expenses, and net balance dynamically',
      'Add category filter pills and search by description',
      'Persist state to localStorage and add one-click CSV export',
    ],
    stretchGoals: [
      'Render a pure-SVG monthly spending bar chart',
      'Add recurring monthly bills and budget threshold alerts',
    ],
    starterSnippet: `interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: 'Food' | 'Housing' | 'Transport' | 'Income' | 'Other';
  date: string;
}

const total = items.reduce((sum, tx) => sum + tx.amount, 0);`,
  },
  {
    id: 'nodejs-task-api',
    title: 'RESTful Task Manager API',
    tagline: 'Create a production-style JSON REST API with CRUD endpoints, validation, and SQLite persistence.',
    category: 'Backend',
    difficulty: 'Intermediate',
    estimatedHours: 6,
    stack: ['Node.js 20', 'HTTP/REST', 'SQL', 'Auth'],
    playgroundLang: 'node',
    recommendedCourses: [
      { slug: 'nodejs-essentials', label: 'Node.js 20' },
      { slug: 'sql-essentials', label: 'SQL Essentials' },
    ],
    architectureSummary:
      'Structure routes cleanly (GET/POST /tasks, PATCH/DELETE /tasks/:id), validate request payloads before hitting the database, use parameterized SQL queries to prevent SQL injection, and return consistent HTTP status codes.',
    milestones: [
      'Design tasks table schema with status, priority, and timestamps',
      'Implement GET /tasks with status and pagination query params',
      'Implement POST /tasks with strict input validation (400 on bad input)',
      'Implement PATCH /tasks/:id and DELETE /tasks/:id with 404 handling',
      'Add token-based authentication middleware and rate limiting',
    ],
    stretchGoals: [
      'Write automated integration tests for every endpoint',
      'Add OpenAPI / Swagger JSON documentation',
    ],
    starterSnippet: `import http from 'node:http';

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true }));
  }
  res.writeHead(404).end();
});
server.listen(3000);`,
  },
  {
    id: 'sql-analytics-warehouse',
    title: 'E-Commerce Analytics SQL Queries',
    tagline: 'Design normalized tables and write window-function reports for revenue, retention, and top cohorts.',
    category: 'Data',
    difficulty: 'Beginner',
    estimatedHours: 5,
    stack: ['SQL', 'PostgreSQL', 'CTEs', 'Window Functions'],
    playgroundLang: 'sql',
    recommendedCourses: [
      { slug: 'sql-essentials', label: 'SQL Essentials' },
      { slug: 'postgresql-design', label: 'PostgreSQL & DB Design' },
    ],
    architectureSummary:
      'Normalize customers, products, orders, and order_items in 3NF with foreign keys and composite indexes, then layer CTEs and window functions (RANK, SUM OVER) for executive dashboards.',
    milestones: [
      'Create normalized schema with primary and foreign key constraints',
      'Seed realistic multi-month sample dataset across 4 tables',
      'Write monthly revenue and average order value (AOV) report',
      'Rank top 5 products per category using DENSE_RANK() OVER',
      'Calculate 30-day repeat-customer retention using CTEs',
    ],
    stretchGoals: [
      'Inspect query plans with EXPLAIN ANALYZE and add covering indexes',
      'Create a materialized view for daily revenue rollups',
    ],
    starterSnippet: `WITH monthly AS (
  SELECT strftime('%Y-%m', created_at) AS month,
         SUM(total_cents) / 100.0 AS revenue
  FROM orders
  WHERE status = 'paid'
  GROUP BY 1
)
SELECT month, revenue,
       SUM(revenue) OVER (ORDER BY month) AS cumulative_revenue
FROM monthly;`,
  },
  {
    id: 'python-log-analyzer',
    title: 'CLI Log Analyzer & Alert Reporter',
    tagline: 'Parse gigabytes of Nginx access logs with Python generators to spot 5xx spikes and top endpoints.',
    category: 'Backend',
    difficulty: 'Beginner',
    estimatedHours: 4,
    stack: ['Python 3', 'Regex', 'CLI', 'Generators'],
    playgroundLang: 'python',
    recommendedCourses: [
      { slug: 'python-fundamentals', label: 'Python 3' },
      { slug: 'linux-cli', label: 'Linux CLI' },
    ],
    architectureSummary:
      'Stream log files line-by-line with a generator so memory usage stays O(1), parse status codes and latencies via compiled regex, and output a clean summary table or JSON report.',
    milestones: [
      'Build a streaming line reader that handles large files safely',
      'Parse IP, HTTP method, path, status code, and response time',
      'Aggregate top 10 URLs, status code distribution, and error rate',
      'Add CLI flags (--min-status, --top, --json) using argparse',
      'Write unit tests covering malformed lines and edge cases',
    ],
    stretchGoals: [
      'Compute p95 and p99 response latency per endpoint',
      'Flag potential brute-force IPs exceeding a configurable threshold',
    ],
    starterSnippet: `from collections import Counter

def summarize_statuses(lines):
    counts = Counter()
    for line in lines:
        parts = line.split()
        if len(parts) >= 9:
            counts[parts[8]] += 1
    return counts.most_common(5)`,
  },
  {
    id: 'dockerized-web-stack',
    title: 'Dockerized Multi-Service Web Stack',
    tagline: 'Containerize a reverse proxy, backend API, and database with multi-stage builds and health checks.',
    category: 'DevOps',
    difficulty: 'Intermediate',
    estimatedHours: 5,
    stack: ['Docker', 'Compose', 'Nginx', 'Linux'],
    playgroundLang: 'bash',
    recommendedCourses: [
      { slug: 'docker-essentials', label: 'Docker & Containers' },
      { slug: 'linux-cli', label: 'Linux CLI' },
    ],
    architectureSummary:
      'Use a multi-stage Dockerfile running as a non-root user, wire Nginx + API + PostgreSQL over a private Compose bridge network, and persist database state in a named volume.',
    milestones: [
      'Write a multi-stage Dockerfile with minimal runtime image',
      'Configure non-root USER and HEALTHCHECK instruction',
      'Create docker-compose.yml with Nginx, API, and DB services',
      'Isolate DB on internal network and mount named persistence volume',
      'Verify zero-data-loss restart with docker compose down && up',
    ],
    stretchGoals: [
      'Add GitHub Actions CI workflow to build and lint the image',
      'Add Prometheus /metrics scrape endpoint and resource memory limits',
    ],
    starterSnippet: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

FROM node:20-alpine
USER node
WORKDIR /app
COPY --from=builder /app .
HEALTHCHECK CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "server.js"]`,
  },
  {
    id: 'url-shortener-system',
    title: 'Scalable URL Shortener Service',
    tagline: 'Architect and implement a Base62 short-link service with collision handling, caching, and analytics.',
    category: 'Systems',
    difficulty: 'Intermediate',
    estimatedHours: 8,
    stack: ['Go', 'System Design', 'SQL', 'Caching'],
    playgroundLang: 'node',
    recommendedCourses: [
      { slug: 'go-fundamentals', label: 'Go Fundamentals' },
      { slug: 'system-design-fundamentals', label: 'System Design' },
    ],
    architectureSummary:
      'Encode auto-incrementing or snowflake IDs into Base62 short codes, serve 301/302 redirects from an in-memory cache layer, and batch click counters asynchronously to keep redirect latency under 5ms.',
    milestones: [
      'Implement Base62 encoder/decoder with unit tests',
      'Build POST /shorten with URL validation and custom alias support',
      'Build GET /:code redirect endpoint with 404 for unknown codes',
      'Add in-memory TTL cache to avoid hitting DB on hot links',
      'Track click counts and referrer stats per short link',
    ],
    stretchGoals: [
      'Add link expiration timestamps and per-IP rate limiting',
      'Benchmark throughput with wrk or hey under 500 concurrent requests',
    ],
    starterSnippet: `const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func encodeBase62(n uint64) string {
    if n == 0 { return "0" }
    out := []byte{}
    for n > 0 {
        out = append([]byte{alphabet[n%62]}, out...)
        n /= 62
    }
    return string(out)
}`,
  },
  {
    id: 'lru-cache-engine',
    title: 'In-Memory LRU Cache Engine',
    tagline: 'Implement an O(1) Least Recently Used cache combining a hash map and doubly linked list.',
    category: 'Systems',
    difficulty: 'Advanced',
    estimatedHours: 8,
    stack: ['C++20', 'DSA', 'Hash Maps', 'Pointers'],
    playgroundLang: 'cpp',
    recommendedCourses: [
      { slug: 'dsa-fundamentals', label: 'DSA Fundamentals' },
      { slug: 'cpp-fundamentals', label: 'Modern C++' },
    ],
    architectureSummary:
      'Combine std::unordered_map<K, list::iterator> with std::list<pair<K, V>> so get() and put() both run in O(1) time without manual raw-pointer leaks, then add thread safety and hit-rate metrics.',
    milestones: [
      'Implement O(1) get(key) moving accessed node to list front',
      'Implement O(1) put(key, value) evicting tail node at capacity',
      'Add hit/miss ratio telemetry and capacity resizing',
      'Write stress test verifying 100,000 mixed operations',
      'Add optional TTL expiration per entry',
    ],
    stretchGoals: [
      'Add mutex locking for safe multi-threaded reads and writes',
      'Compare throughput against a simple FIFO eviction cache',
    ],
    starterSnippet: `#include <list>
#include <unordered_map>

template <typename K, typename V>
class LRUCache {
    size_t cap_;
    std::list<std::pair<K, V>> items_;
    std::unordered_map<K, typename std::list<std::pair<K, V>>::iterator> index_;
public:
    explicit LRUCache(size_t cap) : cap_(cap) {}
};`,
  },
];
