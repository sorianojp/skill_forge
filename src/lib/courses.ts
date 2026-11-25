import { getCollection, type CollectionEntry } from 'astro:content';

export type CourseEntry = CollectionEntry<'courses'>;
export type LessonEntry = CollectionEntry<'lessons'>;

export function getLessonSlug(lesson: LessonEntry): string {
  // id looks like "html-fundamentals/01-intro"
  const parts = lesson.id.split('/');
  const filename = parts[parts.length - 1] ?? lesson.id;
  return filename.replace(/^\d+-/, '').replace(/\.mdx$/, '');
}

export function getLessonKey(courseSlug: string, lessonSlug: string): string {
  return `${courseSlug}/${lessonSlug}`;
}

export async function getAllCoursesSorted(): Promise<CourseEntry[]> {
  const courses = await getCollection('courses');
  return courses.sort((a, b) => a.data.order - b.data.order);
}

export async function getCourseLessons(courseSlug: string): Promise<LessonEntry[]> {
  const lessons = await getCollection('lessons', (entry) => entry.data.course === courseSlug);
  return lessons.sort((a, b) => a.data.order - b.data.order);
}

export interface ModuleGroup {
  name: string;
  lessons: Array<{
    entry: LessonEntry;
    slug: string;
    key: string;
    href: string;
  }>;
}

export function groupLessonsByModule(courseSlug: string, lessons: LessonEntry[]): ModuleGroup[] {
  const map = new Map<string, ModuleGroup>();
  for (const entry of lessons) {
    const mod = entry.data.module;
    if (!map.has(mod)) {
      map.set(mod, { name: mod, lessons: [] });
    }
    const slug = getLessonSlug(entry);
    map.get(mod)!.lessons.push({
      entry,
      slug,
      key: getLessonKey(courseSlug, slug),
      href: `/courses/${courseSlug}/${slug}`,
    });
  }
  return Array.from(map.values());
}
