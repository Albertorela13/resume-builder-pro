import { useState, useEffect } from "react";
import { useCV } from "@/contexts/CVContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, Sparkles, Target, FileText, Search } from "lucide-react";

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
}

export function ApplicationModal({ open, onClose }: ApplicationModalProps) {
  const { officialJD, officialLocked, lockOfficial, coachRole } = useCV();
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (officialLocked) {
        setRole(officialJD.role);
        setJd(officialJD.jd);
      } else {
        setRole(coachRole || "");
        setJd("");
      }
      setError("");
    }
  }, [open, officialLocked, officialJD, coachRole]);

  const handleSave = () => {
    if (!role.trim()) {
      setError("Target role is required");
      return;
    }
    lockOfficial(role.trim(), jd.trim());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-lg">Tailor your CV to one job</DialogTitle>
            <span className="rounded-full bg-ai-purple/10 px-2.5 py-0.5 text-[11px] font-semibold text-ai-purple">
              Recommended
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {officialLocked && (
            <div className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Lock className="h-3 w-3" />
              Job details are locked for this application
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground">
              Target Role {!officialLocked && <span className="text-destructive">*</span>}
            </label>
            <Input
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setError("");
              }}
              placeholder="e.g. Senior Product Manager"
              className="mt-1"
              readOnly={officialLocked}
            />
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Job Description
              {!officialLocked && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
              )}
            </label>
            <Textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description here…"
              className="mt-1"
              rows={4}
              readOnly={officialLocked}
            />
          </div>

          {/* Why is this recommended */}
          {!officialLocked && (
            <div className="rounded-lg border border-coach-border bg-coach-bg p-3 space-y-2">
              <p className="text-xs font-semibold text-foreground">Why is this recommended?</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-ai-purple shrink-0" />
                  More relevant AI content
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 text-ai-purple shrink-0" />
                  Better ATS keywords
                </li>
                <li className="flex items-center gap-2">
                  <Target className="h-3.5 w-3.5 text-ai-purple shrink-0" />
                  Closer match to the job
                </li>
              </ul>
              <p className="text-[11px] text-muted-foreground/70 pt-1">
                If you want to tailor your CV to a different job, you'll create a new version.
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-1">
            <Button variant="ghost" onClick={onClose}>
              {officialLocked ? "Close" : "Not yet"}
            </Button>
            {!officialLocked && (
              <Button
                onClick={handleSave}
                className="bg-ai-purple text-ai-purple-foreground hover:bg-ai-purple/90 gap-1.5"
              >
                <FileText className="h-4 w-4" />
                Save & tailor my CV
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
