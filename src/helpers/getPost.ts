import { cache } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { type Post } from "~/lib/types";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

export const getPost = cache((slug: string): Post | null => {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    tag: data.tag as string,
    description: data.description as string,
    lang: data.lang as string | undefined,
    content,
  } satisfies Post;
});
