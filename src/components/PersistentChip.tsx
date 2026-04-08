import { useCV } from "@/contexts/CVContext";
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export function PersistentChip() {
  const { officialLocked, officialJD } = useCV();

  const hasRole = officialLocked && officialJD.role.trim() !== "";
  const hasJD = officialLocked && officialJD.jd.trim() !== "";

  if (!officialLocked) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5">
        <span className="text-xs font-semibold text-muted-foreground">Application 1</span>
        <span className="text-[11px] text-muted-foreground">· Tailor your CV to one job</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5">
      <Lock className="h-3 w-3 text-muted-foreground" />
      <span className="text-xs font-semibold text-foreground">Application 1</span>
      <span className="text-[11px] text-muted-foreground">· {officialJD.role}</span>
      {hasJD ? (
        <span className="flex items-center gap-1 text-[11px] text-success">
          <CheckCircle2 className="h-3 w-3" />
          Job description included
        </span>
      ) : (
        <span className="flex items-center gap-1 text-[11px] text-destructive">
          <AlertCircle className="h-3 w-3" />
          Add job description
        </span>
      )}
    </div>
  );
}
