import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `The practice of ${SITE_NAME} — architectural pencil drawing, hand-rendered perspectives, and conceptual studies since 2010.`,
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
