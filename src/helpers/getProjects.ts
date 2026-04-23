import { cache } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { type ProjectMeta } from "~/lib/types";

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");

export const getProjects = cache((): ProjectMeta[] => {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".mdx"));

  const projects = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title as string,
      type: data.type as string,
      year: data.year as number,
      description: data.description as string,
    } satisfies ProjectMeta;
  });

  return projects.sort((a, b) => b.year - a.year);
});
