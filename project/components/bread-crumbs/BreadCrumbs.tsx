"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function formatSegment(segment: string) {
  if (/^\d+$/.test(segment)) return "Details";

  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const items = segments.filter((segment) => segment !== "dashboard");

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center md:flex">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href="/dashboard"
            className="font-medium text-blue_munsell-500 hover:text-outer_space-500 dark:text-platinum-500"
          >
            Dashboard
          </Link>
        </li>
        {items.map((segment, index) => {
          const originalIndex = segments.indexOf(segment);
          const href = `/${segments.slice(0, originalIndex + 1).join("/")}`;
          const isCurrent = index === items.length - 1;

          return (
            <li key={href} className="flex items-center gap-2">
              <ChevronRight
                size={16}
                className="text-payne's_gray-500 dark:text-french_gray-400"
                aria-hidden="true"
              />
              {isCurrent ? (
                <span
                  className="font-medium text-payne's_gray-500 dark:text-french_gray-400"
                  aria-current="page"
                >
                  {formatSegment(segment)}
                </span>
              ) : (
                <Link
                  href={href}
                  className="font-medium text-outer_space-500 hover:text-blue_munsell-500 dark:text-platinum-500"
                >
                  {formatSegment(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
