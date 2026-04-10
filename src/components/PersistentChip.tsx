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
        className="group relative flex items-center gap-2 px-3 py-1.5 font-medium text-muted-foreground transition-colors duration-[400ms] hover:text-ai-purple cursor-pointer"
      >
        {!officialLocked ? (
          <>
            <Briefcase className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Application 1</span>
            <span className="text-[10px] opacity-70">· Set target job</span>
          </>
        ) : (
          <>
            <Lock className="h-3 w-3" />
            <span className="text-xs font-medium text-foreground group-hover:text-ai-purple transition-colors duration-[400ms]">{officialJD.role}</span>
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
        {/* TOP */}
        <span className="absolute left-0 top-0 h-[2px] w-0 bg-ai-purple transition-all duration-100 group-hover:w-full" />
        {/* RIGHT */}
        <span className="absolute right-0 top-0 h-0 w-[2px] bg-ai-purple transition-all delay-100 duration-100 group-hover:h-full" />
        {/* BOTTOM */}
        <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-ai-purple transition-all delay-200 duration-100 group-hover:w-full" />
        {/* LEFT */}
        <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-ai-purple transition-all delay-300 duration-100 group-hover:h-full" />
      </button>

      <ApplicationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
