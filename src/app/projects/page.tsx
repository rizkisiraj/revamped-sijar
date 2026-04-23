import type { Metadata } from 'next';
import { getProjects } from '~/helpers/getProjects';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = { title: 'Projects — Rizki Siraj' };

export default function ProjectsPage() {
  const projects = getProjects();
  return <ProjectsClient projects={projects} />;
}
