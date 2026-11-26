import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const courses = defineCollection({
  loader: glob({ pattern: '*/_course.json', base: './src/content/courses' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    shortTitle: z.string(),
    description: z.string(),
    track: z.enum([
      'HTML',
      'CSS',
      'JavaScript',
      'SQL',
      'PHP',
      'Python',
      'Git',
      'OOP',
      'C',
      'C++',
      'Java',
      'C#',
      'TypeScript',
      'React',
      'Node.js',
      'Linux',
      'Docker',
      'DSA',
      'Go',
      'PostgreSQL',
      'System Design',
      'Web Fundamentals',
    ]),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    estimatedHours: z.number(),
    accentColor: z.string().default('#2563eb'),
    prerequisites: z.array(z.string()).default([]),
    outcomes: z.array(z.string()).default([]),
    featured: z.boolean().default(true),
    order: z.number().default(1),
  }),
});

const lessons = defineCollection({
  loader: glob({ pattern: '*/*.mdx', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    course: z.string(),
    module: z.string(),
    order: z.number(),
    durationMinutes: z.number().default(8),
    objectives: z.array(z.string()).default([]),
    hasPlayground: z.boolean().default(true),
  }),
});

const references = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/references' }),
  schema: z.object({
    title: z.string(),
    category: z.enum([
      'HTML',
      'CSS',
      'JavaScript',
      'SQL',
      'PHP',
      'Python',
      'Git',
      'OOP',
      'C',
      'C++',
      'Java',
      'C#',
      'TypeScript',
      'React',
      'Node.js',
      'Linux',
      'Docker',
      'DSA',
      'Go',
      'PostgreSQL',
      'System Design',
    ]),
    syntax: z.string(),
    summary: z.string(),
    browserSupport: z.string().default('Baseline Widely Available'),
  }),
});

export const collections = { courses, lessons, references };
