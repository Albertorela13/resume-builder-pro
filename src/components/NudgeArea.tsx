import { useState } from "react";
import { useCV } from "@/contexts/CVContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NudgeConfirmModal } from "./NudgeConfirmModal";

interface NudgeAreaProps {
  visible: boolean;
  onDismiss: () => void;
}

export function NudgeArea({ visible, onDismiss }: NudgeAreaProps) {
  const { coachRole } = useCV();
  const [nudgeRole, setNudgeRole] = useState(coachRole);
  const [nudgeJD, setNudgeJD] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  if (!visible) return null;

  const handleSave = () => {
    if (!nudgeRole.trim()) {
      setError("Target role is required");
      return;
    }
    setError("");
    setModalOpen(true);
  };

  return (
    <>
      <div className="mt-4 rounded-lg border border-coach-border bg-coach-bg p-4">
        <h4 className="font-semibold text-sm text-foreground">Save as official job details</h4>
        <p className="mt-1 text-xs text-muted-foreground">
          Saving unlocks Interview Practice, Cover Letter, and more.
        </p>
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-xs font-medium text-foreground">Target Role</label>
            <Input
              value={nudgeRole}
              onChange={(e) => {
                setNudgeRole(e.target.value);
                setError("");
              }}
              className="mt-1"
            />
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-foreground">Job Description (optional)</label>
            <Textarea
              value={nudgeJD}
              onChange={(e) => setNudgeJD(e.target.value)}
              placeholder="Paste the job description here…"
              className="mt-1"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="bg-ai-purple text-ai-purple-foreground hover:bg-ai-purple/90">
              Save as official
            </Button>
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              Not now
            </Button>
          </div>
        </div>
      </div>

      <NudgeConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        role={nudgeRole.trim()}
        jd={nudgeJD.trim()}
        onDismissNudge={onDismiss}
      />
    </>
  );
}
