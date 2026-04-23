import { cache } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { type Project } from "~/lib/types";

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");

export const getProject = cache((slug: string): Project | null => {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title as string,
    type: data.type as string,
    year: data.year as number,
    description: data.description as string,
    content,
  } satisfies Project;
});
