import { useCV } from "@/contexts/CVContext";
import { Lock } from "lucide-react";

export function PersistentChip() {
  const { officialLocked, officialJD } = useCV();

  if (!officialLocked) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-chip-neutral px-3 py-1 text-xs font-medium text-chip-neutral-foreground">
        No application context
      </span>
    );
  }

  const hasJD = officialJD.jd.trim() !== "";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
      <Lock className="h-3 w-3" />
      {officialJD.role} · {hasJD ? "With JD" : "No JD"}
    </span>
  );
}
