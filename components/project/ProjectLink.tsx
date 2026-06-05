import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProjectLinkProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> {
  slug: string;
}

export function ProjectLink({
  slug,
  className,
  children,
  ...props
}: ProjectLinkProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      scroll={false}
      className={cn(className)}
      data-cursor="hover"
      {...props}
    >
      {children}
    </Link>
  );
}
