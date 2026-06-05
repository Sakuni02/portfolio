import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/lib/projects";

export const alt = "Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1A1A18",
            color: "#F5F3EE",
            fontSize: 48,
          }}
        >
          Project Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 60,
          background: "#1A1A18",
          color: "#F5F3EE",
        }}
      >
        <div style={{ fontSize: 24, color: "#8B6F47", marginBottom: 16 }}>
          {project.category} · {project.year}
        </div>
        <div style={{ fontSize: 64, fontWeight: 300 }}>{project.title}</div>
        <div style={{ fontSize: 20, color: "#E8E4DC", marginTop: 16, maxWidth: 800 }}>
          {project.description.slice(0, 120)}...
        </div>
      </div>
    ),
    { ...size }
  );
}
