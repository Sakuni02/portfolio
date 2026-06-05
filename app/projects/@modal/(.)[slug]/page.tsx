import { ProjectModalPage } from "@/components/project/ProjectModalPage";

interface PageProps {
  params: { slug: string };
}

export default function InterceptedProjectModal({ params }: PageProps) {
  return <ProjectModalPage slug={params.slug} />;
}
