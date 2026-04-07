import { useCV } from "@/contexts/CVContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface NudgeConfirmModalProps {
  open: boolean;
  onClose: () => void;
  role: string;
  jd: string;
  onDismissNudge: () => void;
}

export function NudgeConfirmModal({ open, onClose, role, jd, onDismissNudge }: NudgeConfirmModalProps) {
  const { lockOfficial } = useCV();

  const handleConfirm = () => {
    lockOfficial(role, jd);
    onClose();
    onDismissNudge();
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save and lock job details?</AlertDialogTitle>
          <AlertDialogDescription>
            Once saved, you won't be able to edit these details. To change them, you'll need to create a new application.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 rounded-md border bg-secondary/50 p-3 text-sm">
          <p>
            <span className="font-medium">Role:</span> {role}
          </p>
          {jd && (
            <p>
              <span className="font-medium">JD:</span>{" "}
              <span className="text-muted-foreground">{jd.length > 120 ? jd.slice(0, 120) + "…" : jd}</span>
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-ai-purple text-ai-purple-foreground hover:bg-ai-purple/90">
            Save and lock
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
