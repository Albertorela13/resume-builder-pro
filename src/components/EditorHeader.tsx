import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { PersistentChip } from "./PersistentChip";

const NAV_ITEMS = [
  { to: "/job-details", label: "Job Details" },
  { to: "/experience", label: "Experience" },
  { to: "/skills", label: "Skills" },
  { to: "/summary", label: "Summary" },
];

const PAGE_TITLES: Record<string, string> = {
  "/job-details": "Job Details",
  "/experience": "Experience",
  "/skills": "Skills",
  "/summary": "Summary",
};

export function EditorHeader() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "Editor";

  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
        <PersistentChip />
      </div>
      <nav className="flex gap-1 px-4 pb-2 lg:px-6">
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="bg-secondary text-foreground"
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
