import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Commission inquiries and studio contact for architectural pencil drawing work.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
