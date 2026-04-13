import { useState } from "react";
import { useCV } from "@/contexts/CVContext";
import { Briefcase, AlertCircle } from "lucide-react";
import { ApplicationModal } from "./ApplicationModal";

export function PersistentChip() {
  const { officialLocked, officialJD } = useCV();
  const [modalOpen, setModalOpen] = useState(false);

  const hasRole = officialJD.role.trim() !== "";
  const hasJD = officialJD.jd.trim() !== "";

  const renderContent = () => {
    if (!hasRole) {
      // State A — no job details yet
      return (
        <>
          <Briefcase className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">Application</span>
          <span className="text-xs text-muted-foreground">· Set job details</span>
        </>
      );
    }

    if (hasRole && !hasJD) {
      // State B — role exists, no JD
      return (
        <>
          <Briefcase className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium text-foreground group-hover:text-ai-purple transition-colors duration-[400ms]">
            {officialJD.role}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3 text-amber-500" />
            Missing
          </span>
        </>
      );
    }

    // State C — role + JD exist (locked)
    return (
      <>
        <Briefcase className="h-4 w-4 shrink-0" />
        <span className="text-sm font-semibold text-foreground group-hover:text-ai-purple transition-colors duration-[400ms]">
          {officialJD.role}
        </span>
      </>
    );
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        title="Edit job details"
        className="group relative flex items-center gap-2 px-3 py-1.5 font-medium text-muted-foreground transition-colors duration-[400ms] hover:text-ai-purple cursor-pointer"
      >
        {renderContent()}
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
