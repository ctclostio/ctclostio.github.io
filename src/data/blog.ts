export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  draft: boolean;
  project: string | null;
  tags: string[];
  minutes: number;
  headings: { id: string; text: string }[];
  html: string;
};

export { posts } from 'virtual:blog';

export function postUrl(slug: string) {
  return `/blog/${slug}/`;
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}
