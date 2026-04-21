import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground whitespace-nowrap overflow-x-auto" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 py-4">
        <li>
          <Link href={ROUTES.HOME} className="hover:text-primary transition-colors flex items-center">
            <Home className="h-4 w-4" />
          </Link>
        </li>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              {isLast || !item.href ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
