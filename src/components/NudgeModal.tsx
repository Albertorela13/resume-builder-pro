import { useState } from "react";
import { useCV } from "@/contexts/CVContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NudgeConfirmModal } from "./NudgeConfirmModal";

interface NudgeModalProps {
  open: boolean;
  onClose: () => void;
}

export function NudgeModal({ open, onClose }: NudgeModalProps) {
  const { coachRole } = useCV();
  const [nudgeRole, setNudgeRole] = useState(coachRole);
  const [nudgeJD, setNudgeJD] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  // Sync role when modal opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setNudgeRole(coachRole);
      setNudgeJD("");
      setError("");
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    if (!nudgeRole.trim()) {
      setError("Target role is required");
      return;
    }
    setError("");
    setConfirmOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save as official job details</DialogTitle>
            <DialogDescription>
              Saving unlocks Interview Practice, Cover Letter, and more.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground">Target Role</label>
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
              <label className="text-sm font-medium text-foreground">Job Description (optional)</label>
              <Textarea
                value={nudgeJD}
                onChange={(e) => setNudgeJD(e.target.value)}
                placeholder="Paste the job description here…"
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={onClose}>
                Not now
              </Button>
              <Button onClick={handleSave} className="bg-ai-purple text-ai-purple-foreground hover:bg-ai-purple/90">
                Save as official
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <NudgeConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        role={nudgeRole.trim()}
        jd={nudgeJD.trim()}
        onDismissNudge={onClose}
      />
    </>
  );
}
