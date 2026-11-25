export interface CareerPath {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
  courseSlugs: string[];
}

export const CAREER_PATHS: CareerPath[] = [
  {
    slug: 'frontend-developer',
    title: 'Frontend Web Developer',
    tagline: 'HTML → CSS → JavaScript',
    description:
      'Go from zero to building accessible, responsive, interactive web interfaces using modern browser standards.',
    accentColor: '#2563eb',
    courseSlugs: ['html-fundamentals', 'css-layout', 'javascript-essentials'],
  },
  {
    slug: 'fullstack-web-developer',
    title: 'Full-Stack Web Developer',
    tagline: 'HTML → CSS → JS → SQL → PHP',
    description:
      'Master both the browser frontend and relational backend architecture with SQL databases and modern PHP 8.',
    accentColor: '#4f46e5',
    courseSlugs: [
      'html-fundamentals',
      'css-layout',
      'javascript-essentials',
      'sql-essentials',
      'php-essentials',
    ],
  },
  {
    slug: 'data-and-backend',
    title: 'Data & Backend Foundations',
    tagline: 'SQL → Python',
    description:
      'Query relational datasets with SQLite analytics and automate data workflows with Python 3 directly in your browser.',
    accentColor: '#059669',
    courseSlugs: ['sql-essentials', 'python-fundamentals'],
  },
  {
    slug: 'systems-programming',
    title: 'Systems Programming Engineer',
    tagline: 'Git → C → C++',
    description:
      'Master version control, low-level memory and pointers in C, and zero-overhead Modern C++ abstractions with RAII and the STL.',
    accentColor: '#1d4ed8',
    courseSlugs: ['git-essentials', 'c-fundamentals', 'cpp-fundamentals'],
  },
  {
    slug: 'enterprise-oop-engineer',
    title: 'Enterprise & OOP Engineer',
    tagline: 'Git → OOP → Java → C#',
    description:
      'Build scalable, testable enterprise architectures using Git workflows, SOLID object-oriented design, Java 21, and C# / .NET.',
    accentColor: '#7e22ce',
    courseSlugs: [
      'git-essentials',
      'oop-fundamentals',
      'java-fundamentals',
      'csharp-fundamentals',
    ],
  },
];
