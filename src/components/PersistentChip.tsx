import { useState } from "react";
import { useCV } from "@/contexts/CVContext";
import { Lock, AlertCircle, CheckCircle2, Briefcase } from "lucide-react";
import { ApplicationModal } from "./ApplicationModal";

export function PersistentChip() {
  const { officialLocked, officialJD } = useCV();
  const [modalOpen, setModalOpen] = useState(false);

  const hasRole = officialLocked && officialJD.role.trim() !== "";
  const hasJD = officialLocked && officialJD.jd.trim() !== "";

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 transition-all hover:border-ai-purple/30 hover:bg-muted/70 hover:shadow-sm cursor-pointer"
      >
        {!officialLocked ? (
          <>
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Application 1</span>
            <span className="text-[10px] text-muted-foreground/70">· Set target job</span>
          </>
        ) : (
          <>
            <Lock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">{officialJD.role}</span>
            {hasJD ? (
              <span className="flex items-center gap-0.5 text-[10px] text-success">
                <CheckCircle2 className="h-3 w-3" />
                JD included
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-[10px] text-destructive">
                <AlertCircle className="h-3 w-3" />
                Add JD
              </span>
            )}
          </>
        )}
      </button>

      <ApplicationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
