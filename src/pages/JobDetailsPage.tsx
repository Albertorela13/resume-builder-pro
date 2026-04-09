import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCV } from "@/contexts/CVContext";
import { EditorLayout } from "@/components/EditorLayout";
import { ApplicationModal } from "@/components/ApplicationModal";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function JobDetailsPage() {
  const { officialLocked, roleLocked } = useCV();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!officialLocked) {
      setModalOpen(true);
    }
  }, [officialLocked]);

  return (
    <EditorLayout>
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <Briefcase className="h-10 w-10 text-muted-foreground" />
        {officialLocked ? (
          <>
            <p className="text-sm text-muted-foreground">
              Job details are saved. You can view them by clicking below.
            </p>
            <Button variant="outline" onClick={() => setModalOpen(true)}>
              View job details
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Set your target job to get tailored AI suggestions across all sections.
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-ai-purple text-ai-purple-foreground hover:bg-ai-purple/90"
            >
              Set target job
            </Button>
          </>
        )}
      </div>

      <div />

      <ApplicationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </EditorLayout>
  );
}
