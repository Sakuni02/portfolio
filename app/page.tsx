import { getAllProjects, getLatestProjects } from "@/lib/projects";
import { HomePageClient } from "@/components/sections/home/HomePageClient";

const LATEST_PROJECTS_COUNT = 5;

export default function HomePage() {
  const allProjects = getAllProjects();
  const latestProjects = getLatestProjects(LATEST_PROJECTS_COUNT);

  if (allProjects.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>No projects found.</p>
      </div>
    );
  }

  const popular = allProjects;

  return (
    <HomePageClient latestProjects={latestProjects} popular={popular} />
  );
}
