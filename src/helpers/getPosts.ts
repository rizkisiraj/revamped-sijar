import { cache } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { type PostMeta } from "~/lib/types";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

export const getPosts = cache((): PostMeta[] => {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      tag: data.tag as string,
      description: data.description as string,
    } satisfies PostMeta;
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
});
